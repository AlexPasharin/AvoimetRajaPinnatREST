var GOOGLE_MAPS_APP_KEY = 'AIzaSyD75uqZnh7vYqjPlhcAyClqTbavMgB6pVc'
var WEATHER_SERVICE_APP_ID = '114332134ea7ed53cb7a0e88a863eb5d'

var bikeUrl = 'https://api.citybik.es/v2/networks/citybikes-helsinki'
var weatherUrl = function(lat, lon){
  return 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&APPID=' + WEATHER_SERVICE_APP_ID
}

var xmlHttpBikes = new XMLHttpRequest()

xmlHttpBikes.onreadystatechange = function() {
  if (xmlHttpBikes.readyState === 4 && xmlHttpBikes.status === 200) {
    var stations = JSON.parse(xmlHttpBikes.responseText).network.stations
    bikeParser(stations)
  }
}

xmlHttpBikes.open('GET', bikeUrl, true)
xmlHttpBikes.send()

var xmlHttpWeather = new XMLHttpRequest()

xmlHttpWeather.onreadystatechange = function() {
  if (xmlHttpWeather.readyState === 4 && xmlHttpWeather.status === 200) {
    var weather = JSON.parse(xmlHttpWeather.responseText)
    console.log(weather)

    document.getElementById('temperature').innerHTML = weather.main.temp + '&deg;C'
    document.getElementById('wind').innerHTML = weather.wind.speed + 'm/s'

    var rain = weather.rain

    if (rain) document.getElementById('rain').innerHTML = rain['3h']
    else document.getElementById('rain').innerHTML = 0

    var {icon, description} = weather.weather[0]
    showIcon(icon, description)
  }
}

function bikeParser(stations){
  var select = document.getElementById('stations')
  var form = document.getElementById('basic-info')

  stations.forEach((station, idx) =>
    select.innerHTML += '<option value="' + idx + '">' + station.name + '</option>'
  )

  form.onsubmit = function(e){
    e.preventDefault()

    var value = select.value
    var map = document.getElementById('map')
    var emptySlots = document.getElementById('empty-slots')
    var freeBikes = document.getElementById('free-bikes')

    if(value === '-1') {
      map.innerHTML = ''
      emptySlots.innerHTML = ''
      freeBikes.innerHTML = ''
      return
    }

    var {empty_slots, free_bikes, latitude, longitude} = stations[value]
    var url = 'https://www.google.com/maps/embed/v1/directions?key=' + GOOGLE_MAPS_APP_KEY +
        '&origin=' + latitude + ',' + longitude + '&destination=' + parseDestination() + '&mode=bicycling'

    emptySlots.innerHTML = empty_slots
    freeBikes.innerHTML = free_bikes

    map.innerHTML = '<iframe width="600" height="450" frameborder="0" style="border:0" src="' + url + '"></iframe>'

    xmlHttpWeather.open('GET', weatherUrl(latitude, longitude), true)
    xmlHttpWeather.send()
  }

  document.getElementById('wrapper').style.visibility = 'visible'
}

function showIcon(icon, captionTxt){
  var url = 'http://openweathermap.org/img/w/' + icon + '.png'
  var image = '<img src="' + url + '" />'

  var wrapper = document.getElementById('weather-image-wrapper')

  var caption = document.createElement('figcaption')
  caption.innerHTML = captionTxt

  wrapper.innerHTML = image
  wrapper.appendChild(caption)
}

function parseDestination(){
  var destination = document.getElementById('destination').value.trim()
   return destination.split(/\s+/).join('+')
}
