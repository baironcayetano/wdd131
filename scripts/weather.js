const temperature = 40;
const windVelocity = 11;
const windChillResult = (windVelocity > 4.8 && temperature <= 10) ? `${calculateWindChill()} °C` : "N/A"

function calculateWindChill(){
    let windChill = 13.12 + (0.6215*temperature) - (11.37*Math.pow(windVelocity,0.16)) + (0.3965*temperature*Math.pow(windVelocity,0.16));
    return windChill
}

const temperatureElement = document.getElementById("temperatureElement");
const windElement = document.getElementById("windElement");
const windChillElement = document.getElementById("windChillElement");

temperatureElement.textContent = `<strong>Temperature:</strong> ${temperature} °C`;
windElement.textContent = `<strong>Wind:</strong> ${windVelocity} km/h`;
windChillElement.textContent = `<strong>Wind Chill:</strong> ${windChillResult}`;