

$("#search").click(getData);

let searchHist = JSON.parse(localStorage.getItem('wdashboardhistory')) || [];

function updateSearchHist() {

    let searchList = '';

    searchHist.forEach((search) => {
        searchList += `<li><button type="button" onclick="histGetData('${search}')">${search}</button></li>`;
    })

    document.getElementById('search-history').innerHTML = searchList;

}

function histGetData(search) {
    $('#city-search').val(search);
    getData();
    searchHist.shift()
}

updateSearchHist();


function getData() {

    let city = $('#city-search').val();

    searchHist.unshift(city);

    localStorage.setItem('wdashboardhistory', JSON.stringify(searchHist));

    updateSearchHist();

    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=5ff5cac73a1063fefa1a4b5e6eb8806c`).then(function (response) {
        return response.json();
    })
        .then(function (data) {

            let lat = data[0].lat;

            let lon = data[0].lon;


            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=5ff5cac73a1063fefa1a4b5e6eb8806c`)

                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {

                    let currentweather = data.current;

                    let day1Weather = data.daily[1];

                    let day2Weather = data.daily[2];

                    let day3Weather = data.daily[3];

                    let day4Weather = data.daily[4];

                    let day5Weather = data.daily[5];

                    const today = new Date();

                    let day1 = new Date();
                    day1.setDate(today.getDate() + 1);

                    let day2 = new Date();
                    day2.setDate(today.getDate() + 2);

                    let day3 = new Date();
                    day3.setDate(today.getDate() + 3);

                    let day4 = new Date();
                    day4.setDate(today.getDate() + 4);

                    let day5 = new Date();
                    day5.setDate(today.getDate() + 5);

                    function createForecast(weather, date) {

                        function uviColor(uvi) {

                            if (uvi < 3) {
                                return '#a1c2a1';
                            } else if (uvi < 7) {
                                return '#c2c1a1';
                            } else {
                                return '#e09ba4';
                            }
                        }

                        return `<div>
                        on ${date.toJSON().slice(0, 10).replace(/-/g, '/')}, the weather conditions are
                        ${weather.weather[0].description} <img src="https://openweathermap.org/img/w/${weather.weather[0].icon}.png" alt="${currentweather.description}">
                        </div>
                        <br>
                        <div>
                        The temperature is ${Math.round(((weather.temp.day || weather.temp) - 273.15) * (9 / 5) + 32)} F
                        </div>
                        <div>
                        The humidity is ${weather.humidity}, and the windspeed is ${weather.wind_speed}.
                        <div style="background: ${uviColor(weather.uvi)}; width: 25%">
                        The UV index is ${weather.uvi}
                        </div>
                        </div>`;
                    }

                    document.getElementById('info-container').innerHTML = `<div>
                    <div>
                    The weather in ${city}
                    </div>

                    <div>

                    Today,
                    
                    ${createForecast(currentweather, today)}

                    </div>

                    <br><br>

                    <div>

                    For the next 5 days,

                    ${createForecast(day1Weather, day1)}

                    ${createForecast(day2Weather, day2)}

                    ${createForecast(day3Weather, day3)}

                    ${createForecast(day4Weather, day4)}

                    ${createForecast(day5Weather, day5)}

                    </div>
                    

                    </div>`;

                });

        });


}