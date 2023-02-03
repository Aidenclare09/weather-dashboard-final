var city;
var APIKey = "c360d5cf76f9e7ac3dbfbe0656b8587e";
var input = $('#search-text');
var localWeather = $('#city-weather');
var searchBtn = $('#search-btn');
var recentSearches = $('#searches');
var widgets = $('.widgets');
var formID = $('#city-form');

var loadSearch = function() {

    
    if (!localStorage.getItem("history")) {
        return;
    } else {
        var savedItem = $("<button>").text(localStorage.getItem("history"))
        savedItem.addClass(localStorage.getItem("history")).addClass('m-2 py-2 text-center col-11 border-0 rounded');
        savedItem.on("mousedown touchstart", searchHx);
    
        
        var limit = 7;
        if (recentSearches.children().length >= limit) {
        recentSearches.children().slice(limit - 1).remove();
        }   

        
        recentSearches.prepend(savedItem);
       
    }
}

var initial = function (e) {
    if (input.val() === "") {
        return;
    }
    city = input.val().trim();
    e.preventDefault();
    getAPI();
}


var searchHx = function () {
    var clickedClass = $(this).attr('class');
    city = clickedClass.replace("m-9 py-2 text-center col-12 border-0 rounded","");
    getAPI();
}

var getAPI = function () {
    var todayURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=metric";

    $.ajax({
        url: todayURL,
        type: "GET",
        success: function(data) {
          
          (data.weather[0].main === "Snow") ? localWeather.attr("src", "https://openweathermap.org/img/wn/13d@2x.png") : 
          (data.weather[0].main === "Clouds") ? localWeather.attr("src", "https://openweathermap.org/img/wn/02d@2x.png") :
          (data.weather[0].main === "Rain") ? localWeather.attr("src", "https://openweathermap.org/img/wn/10d@2x.png") :
          (data.weather[0].main === "Thunderstorm") ? localWeather.attr("src", "https://openweathermap.org/img/wn/11d@2x.png") :            
          (data.weather[0].main === "Drizzle") ? localWeather.attr("src", "https://openweathermap.org/img/wn/09d@2x.png") : 
          localWeather.attr("src", "https://openweathermap.org/img/wn/01d@2x.png");
      
          $("#city-name").text(data.name + dayjs().format("(D/M/YYYY)"));
          $("#temp").text("Temp: " + data.main.temp + "°C");
      
          
          $("#wind").text("Wind: " + (data.wind.speed * 3.6).toFixed() + "KMPH");
          $("#humidity").text("Humidity: " + data.main.humidity + "%");
        },
        error: function() {
          
          recentSearches.children().first().remove();
          localStorage.removeItem("history");
        }
      })
      $.ajax({
        url: forecastURL,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          var today = dayjs();
          for (var i = 0; i < 6; i++) {
            let nextDay = today.add(i, 'day');
            $("#date-" + i).text(nextDay.format('DD/MM/YYYY'));
        
        
            (data.list[i].weather[0].main === "Snow") ? $("#forecast-image-" + i).attr("src", "https://openweathermap.org/img/wn/13d@2x.png") : 
            (data.list[i].weather[0].main === "Clouds") ? $("#forecast-image-" + i).attr("src", "https://openweathermap.org/img/wn/02d@2x.png") :
            (data.list[i].weather[0].main === "Rain") ? $("#forecast-image-" + i).attr("src", "https://openweathermap.org/img/wn/10d@2x.png") :
            (data.list[i].weather[0].main === "Thunderstorm") ? $("#forecast-image-" + i).attr("src", "https://openweathermap.org/img/wn/11d@2x.png") :
            (data.list[i].weather[0].main === "Light rain") ? $("#forecast-image-" + i).attr("src", "https://openweathermap.org/img/wn/09d@2x.png") :
            $("#forecast-image-" + i).attr("src", "https://openweathermap.org/img/wn/01d@2x.png");
        
            $("#forecast-temp-" + i).text("Temp: " + data.list[i].main.temp + "°C");
            $("#forecast-wind-" + i).text("Wind: " + (data.list[i].wind.speed * 3.6).toFixed() + "KMPH");
            $("#forecast-humidity-" + i).text("Humidity: " + data.list[i].main.humidity + "%"); 
          }
        
          widgets.addClass('bg-primary text-white border border-secondary');
          $('.current').removeClass('hide');
          $('.5day').removeClass('hide');
        },
        error: function() {
          console.error("ERROR: 404 - Invalid city.");
        }
      });
         
}

var saveHistory = function () {
    if (input.val() === "") {
        return
    }

    city = input.val().charAt(0).toUpperCase() + input.val().slice(1);
    localStorage.setItem("history", city);
    loadSearch();
}

loadSearch();
formID.submit(initial)
formID.submit(saveHistory);
