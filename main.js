var colors = {};

// Initiates the program
function init() {
    // Get initial colors
    getData()
        .then(data => {
            colors = data;
            getNewColors();
        });
    
    // Add event listener to space button
    document.addEventListener("keyup", (e) => {
        if (e.code === 'Space' || e.key === " ") {
            getNewColors();
        }
    });
}
window.onload = init;

// Fetches data from the color-names api
async function getData(hex = "") {
    const response = await fetch('https://api.color.pizza/v1/' + hex);
    const data = await response.json();

    return data.colors;
}

// Generates new colors and displays them on the page
function getNewColors() {  
    // Get random color from randomized index
    let index = Math.floor(Math.random() * colors.length);
    let color = colors[index];

    document.getElementById("firstColor").style.backgroundColor = color.hex;

    // Get complementary color from hsl
    let compHex = getComplementary(color.hsl.h, color.hsl.s, color.hsl.l);

    let compColor = {};

    getData(compHex)
        .then(data => {
            compColor = data[0];

            document.getElementById("firstColor").style.backgroundColor = color.hex;
            document.getElementById("firstColor").style.color = (color.luminance <= 110) ? "white" : "black";
            document.getElementById("firstColorTitle").innerHTML = color.name;
            document.getElementById("firstColorHex").innerHTML = color.hex;
            document.getElementById("firstColorRGB").innerHTML = "rgb(" + color.rgb.r + ", " + color.rgb.g + ", " + color.rgb.b + ")";

            document.getElementById("secondColor").style.backgroundColor = compColor.hex;
            document.getElementById("secondColor").style.color = (compColor.luminance <= 110) ? "white" : "black";
            document.getElementById("secondColorTitle").innerHTML = compColor.name;
            document.getElementById("secondColorHex").innerHTML = compColor.hex;
            document.getElementById("secondColorRGB").innerHTML = "rgb(" + compColor.rgb.r + ", " + compColor.rgb.g + ", " + compColor.rgb.b + ")";
        });
}

// Calculates complementary color from HSL and converts to HEX
function getComplementary(h, s, l) {
    // Calculations are based on the following tutorials:
    // https://www.had2know.org/technology/hsl-rgb-color-converter.html 
    // and https://css-tricks.com/converting-color-spaces-in-javascript/#aa-rgb-to-hsl

    // Get the opposite hue on the color wheel
    let compHue = (h + 180) % 360;

    // Convert saturation and lightness to fractions of 1 (We'll use a range of 0-100)
    s /= 100;
    l /= 100;

    // Calculate chroma (color intensity)
    let chroma = s * (1 - Math.abs(2 * l - 1));

    // Calculate second largest component
    let x = chroma * (1 - Math.abs((compHue / 60) % 2 - 1));

    // Initialize rgb
    let r = 0, g = 0, b = 0;

    // Find the values of R, G and B according to the angle range of the complementary hue
    if (0 <= compHue && compHue < 60) {
        r = chroma;
        g = x;
        b = 0;
    }
    else if (60 <= compHue && compHue < 120) {
        r = x;
        g = chroma;
        b = 0;
    }
    else if (120 <= compHue && compHue < 180) {
        r = 0;
        g = chroma;
        b = x;
    }
    else if (180 <= compHue && compHue < 240) {
        r = 0;
        g = x;
        b = chroma;
    }
    else if (240 <= compHue && compHue < 300) {
        r = x;
        g = 0;
        b = chroma;
    }
    else if (300 <= compHue && compHue < 360) {
        r = chroma;
        g = 0;
        b = x
    }

    // Calculate amount to add to each channel to match the lightness
    let m = l - chroma / 2;

    // Convert RGB channels to hex
    red = Math.round((r + m) * 255).toString(16);
    green = Math.round((g + m) * 255).toString(16);
    blue = Math.round((b + m) * 255).toString(16);

    // If needed, prepend 0s to hex 
    if (red.length == 1) {
        red = "0" + red;
    } 
    if (green.length == 1) {
        green = "0" + green;
    }   
    if (blue.length == 1) {
        blue = "0" + blue;
    }
        
    return red + green + blue;
}