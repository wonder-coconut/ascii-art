const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const inputSlider = document.getElementById('resolution');
const sliderLabel = document.getElementById('resolutionLabel');
const imageUpload = document.getElementById('imageUpload');
const uploadLabel = document.getElementById('uploadLabel');

const image = new Image();

imageUpload.addEventListener('change', (event) => 
{
    const fileList = event.target.files;
    const reader = new FileReader();
    reader.addEventListener('load', () =>
    {
        image.src = reader.result;
    });
    reader.readAsDataURL(fileList[0]);
});

inputSlider.oninput = sliderHandler;

function sliderHandler()
{
    sliderLabel.innerHTML = 'Resolution: ' + inputSlider.value + ' px';
    ctx.font = parseInt(inputSlider.value) * 1.5 + 'px verdana';
    asciiObj.drawAscii(parseInt(inputSlider.value));
}

class Cell
{
    constructor(x, y, symbol, colour)
    {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.colour = colour;
    }
    
    drawCell(ctx)
    {
        ctx.fillStyle = this.colour;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

class AsciiArt
{
    #ctx;
    #width;
    #height;
    #symbols = [];
    #pixels = [];
    #imageCellArray = [];
    
    constructor(ctx, width, height)
    {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#symbols = ['@','#','&','$','%','?','+','*','=','<','-','.',' '];
        this.#pixels = ctx.getImageData(0, 0, width, height);
    }

    #colourToSymbol(colAvg)
    {
        return this.#symbols[this.#symbols.length - (Math.round(colAvg/255 * (this.#symbols.length - 1))) - 1]
    }

    #formatImage(cellSize)
    {
        this.#imageCellArray = [];

        let pixel,red,green,blue,colour,colAvg,symbol;

        for(let y = 0 ; y < this.#pixels.height; y += cellSize)
        {
            for(let x = 0 ; x < this.#pixels.width; x += cellSize)
            {
                pixel = (y * 4) * this.#pixels.width + (x * 4);

                if(this.#pixels.data[pixel + 3] > 128)
                {
                    red = this.#pixels.data[pixel];
                    green = this.#pixels.data[pixel + 1];
                    blue = this.#pixels.data[pixel + 2];

                    colour = 'rgb('+red+','+green+','+blue+')';
                    colAvg = (red + green + blue)/3;

                    symbol = this.#colourToSymbol(colAvg);
                }
                else symbol = ' ';

                this.#imageCellArray.push(new Cell(x , y, symbol, colour));
            }
        }
    }

    drawAscii(cellSize)
    {
        this.#formatImage(cellSize);
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        for(let i = 0; i < this.#imageCellArray.length; i++)
            this.#imageCellArray[i].drawCell(this.#ctx);
    }
}

let asciiObj;

image.onload = initialize;

function initialize()
{
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    asciiObj = new AsciiArt(ctx, image.width, image.height);
    sliderHandler();
}