var apiKey = '640ea64248ec5c311fdebf8bdc7e577b';
var button = document.getElementById('search-button');
var locationInput = document.getElementById('location-input');

locationInput.addEventListener('keypress', function (event) {
    if (event.keyCode === 13) { // 13 is the keycode for 'return'
        performSearch();
    }
});

function kelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 9 / 5) + 32;
}

function createWeatherCard(item, index) {
    var container = document.getElementById('weather-card-container');

    var card = document.createElement('div');
    card.className = 'weather-card';

    var title = document.createElement('h3');
    title.textContent = 'Day ' + (index + 1);

    var temp = document.createElement('p');
    var tempFahrenheit = kelvinToFahrenheit(item.main.temp);
    temp.textContent = 'Temperature: ' + tempFahrenheit.toFixed(3) + ' F';

    var humidity = document.createElement('p');
    humidity.textContent = 'Humidity: ' + item.main.humidity + ' %rh';

    card.appendChild(title);
    card.appendChild(temp);
    card.appendChild(humidity);

    container.appendChild(card);

}

var recentSearches = [];

function updateRecentSearches(newSearch) {
    recentSearches.unshift(newSearch);

    if (recentSearches.lenth > 5) {
        recentSearches.pop();
    }

    displayRecentSearches();
}

function displayRecentSearches() {
    var container = document.getElementById('recent-search-container');
    container.innerHTML = '';

    recentSearches.forEach(function (search) {
        var searchItem = document.createElement('button');
        searchItem.textContent = search;
        searchItem.className = 'recent-search-item';
        searchItem.onclick = function () { performSearch(search); };
        container.appendChild(searchItem);
    });
}

button.addEventListener('click', performSearch);

function performSearch(searchInput) {

    if (typeof searchInput === 'string') {
        locationInput.value = searchInput;
    } else {
        searchInput = locationInput.value;
    }

    document.getElementById('weather-card-container').innerHTML = '';

    updateRecentSearches(searchInput);

    // var location = document.getElementById('location-input').value;
    var location = searchInput;
    var apigeoURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=1&appid=' + apiKey;

    fetch(apigeoURL, {
        method: 'GET'
    })

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);



            for (var i = 0; i < data.length; i++) {

                var lat = data[i].lat;
                var lon = data[i].lon;

                console.log('City: ' + data[i].name);
                console.log('Latitude: ' + data[i].lat);
                console.log('Longitude: ' + data[i].lon);


                var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

                fetch(apiURL, {
                    method: 'GET'
                })

                    .then(function (response) {
                        return response.json();
                    })

                    .then(function (weatherData) {
                        if (weatherData && weatherData.list) {

                            weatherData.list.slice(0, 6).forEach(function (item, index) {
                                if (item.main) {
                                    createWeatherCard(item, index);
                                }
                            });

                            for (let i = 0; i < 6; i++) {
                                if (i < weatherData.list.length && weatherData.list[i].main) {
                                    console.log('Item ' + i + ':  Main:', weatherData.list[i].main);
                                }
                            }
                        }
                    });

            }
        });

};



