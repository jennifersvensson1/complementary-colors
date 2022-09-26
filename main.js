var colors = {};

function init() {
    getData()
        .then(
            console.log("Got the data!")
        );
    
    document.addEventListener("keyup", (e) => {
        if (e.code === 'Space' || e.key === " ") {
            getNewColors();
        }
    });
}
window.onload = init;

async function getData() {
    // Get data from the color-names api
    const response = await fetch('https://api.color.pizza/v1/');
    const data = await response.json();

    colors = data.colors;
    getNewColors();
}

function getNewColors() {  
    // Get random color from randomized index
    let index = Math.floor(Math.random() * colors.length);
    let color = colors[index];

    document.getElementById("firstColor").style.backgroundColor = color.hex;
}