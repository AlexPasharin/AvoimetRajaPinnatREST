var APP_KEY = 'AIzaSyD75uqZnh7vYqjPlhcAyClqTbavMgB6pVc'
var bikeUrl = 'https://api.citybik.es/v2/networks/citybikes-helsinki'

var xmlhttpBikes = new XMLHttpRequest()

xmlhttpBikes.onreadystatechange = function() {
  if (xmlhttpBikes.readyState === 4 && xmlhttpBikes.status === 200) {
    var stations = JSON.parse(xmlhttpBikes.responseText).network.stations
    bikeParser(stations)
  }
}

xmlhttpBikes.open('GET', bikeUrl, true)
xmlhttpBikes.send()

var bikeParser = function(stations){
  var select = document.getElementById('stations')

  stations.forEach((station, idx) =>
    select.innerHTML += '<option value="' + idx + '">' + station.name + '</option>'
  )

  select.onchange = function(){
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

    map.innerHTML = 'loading Map...'

    var {empty_slots, free_bikes, latitude, longitude} = stations[value]
    var url = 'https://www.google.com/maps/embed/v1/place?key=' + APP_KEY + '&q=' + latitude + ',' + longitude +'&zoom=18'

    emptySlots.innerHTML = empty_slots
    freeBikes.innerHTML = free_bikes

    map.innerHTML = '<iframe frameborder="0" style="border:0" src="' + url + '"></iframe>'
  }
}
