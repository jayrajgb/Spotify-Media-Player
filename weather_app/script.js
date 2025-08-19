// Weather API mail: fireso7883@hisotyr.com -- 30363036

const apiKey = "2e23b0e3e942ed6bf776fc59928c9629";

async function getWeather(city){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    let data = await response.json()
    console.log(data)

    let cityname = document.getElementById("city")
    let temp = document.getElementById("temp")
    let humidity = document.getElementById("humidity")
    let speed = document.getElementById("wind")
    
    cityname.innerHTML = data.name
    temp.innerHTML = Math.round(data.main.temp) + "&deg;C"
    humidity.innerHTML = Math.round(data.main.humidity) + "&percnt;"
    speed.innerHTML = Math.round(data.wind.speed) + "kmph"

    if(data.sys.country == 'IN'){
        let date = new Date(data.dt * 1000);
        let hours = date.getHours();
        if(hours >= 6 && hours <= 18){
            document.querySelector(".card").style = "background-image: linear-gradient(135deg, #84fab0 0%, #397fa2 100%); box-shadow: 0px 0px 7px #84fab0;"
            document.getElementById("time").src = "./assets/sun.png"
        }
        else{
            document.querySelector(".card").style = "background-image: linear-gradient(135deg, #1d2549 0%, #894cac 100%); box-shadow: 0px 0px 7px #894cac;"
            document.getElementById("time").src = "./assets/night.png"
        }
    }

}


let search = document.getElementById("searchcity")
let input = document.getElementById("inputcity")
search.addEventListener("click", ()=>{
    let city = input.value
    if(city == ""){
        alert("Enter the city name.")
    }
    else{
        getWeather(city)
    }
})