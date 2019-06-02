var map;
var markersOnMap = [];
var markersArray = [];


function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13
    });
    var input = document.getElementById('searchInput');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    var circle = new google.maps.Circle({
      map: map,
      radius: 16093,    // 10 miles in metres
      fillColor: '#AA0000'
});

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
        marker.setIcon(({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);

        //Location details
        for (var i = 0; i < place.address_components.length; i++) {
            if(place.address_components[i].types[0] == 'postal_code'){
                document.getElementById('postal_code').innerHTML = place.address_components[i].long_name;
            }
            if(place.address_components[i].types[0] == 'country'){
                document.getElementById('country').innerHTML = place.address_components[i].long_name;
            }
        }
        document.getElementById('location').innerHTML = place.formatted_address;
        document.getElementById('lat').innerHTML = place.geometry.location.lat();
        document.getElementById('lon').innerHTML = place.geometry.location.lng();
    });
    function addInfoWindow(marker, message) {

            var infoWindow = new google.maps.InfoWindow({
                content: message
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
            });

            google.maps.event.addListener(marker, 'mouseover', function() {
              infoWindow.open(map, marker);
            });

            google.maps.event.addListener(marker, 'mouseout', function() {
            	infoWindow.close();
            });


        }

    function grabLocationPoints() {
      $.ajax({
          dataType: 'json',
          url: 'http://ec2-54-166-170-251.compute-1.amazonaws.com:8080/api/all',
          type: "GET",
          success: function (data) {
            $.each(data, function(key, value){
              var bounds = new google.maps.LatLngBounds();
              markersArray = data.events;
              infoWindowTwo = new google.maps.InfoWindow();
              for(var i = 0; i < (data.events.length); i++){
                  latCord = (JSON.stringify(data.events[i].location.lat));
                  lngCord = (JSON.stringify(data.events[i].location.lon));
                  name = (JSON.stringify(data.events[i].name));
                  desc = (JSON.stringify(data.events[i].description));
                  severityLevel = (JSON.stringify(data.events[i].severityLevel));
                  console.log(severityLevel);
                  var sideBar = '<div class="card">';
                  imageLink = data.events[i].images[0];
                  if (typeof(imageLink) != "undefined"){
                    sideBar += '<img src="' + imageLink + '" class="card-img-top" alt="Card image" />';
                  }
                  sideBar += '<div class="card-block"><h4 class="card-title">'+name+'</h4>' +
                      '<p class="card-text"> ' + desc + ' </p></div></div>'
                  $("#geoData").append(sideBar);
                  console.log(imageLink);
                  var myLatLng = {lat: parseFloat(latCord), lng: parseFloat(lngCord)}
                  console.log(latCord, lngCord, name, desc, severityLevel);
                  console.log(latCord);
                  var icon;
                  if (severityLevel == 0){
                    icon = "http://miteshmalaviya.com/Google%20Maps%20Markers/blue_MarkerA.png";
                  } else if (severityLevel == 1){
                    icon = "http://miteshmalaviya.com/Google%20Maps%20Markers/yellow_MarkerB.png"
                  } else if (severityLevel == 2){
                    icon = "http://miteshmalaviya.com/Google%20Maps%20Markers/red_MarkerC.png";
                  }
                  var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(parseFloat(latCord), parseFloat(lngCord)),
                    map: map,
                    icon: icon,
                  });

                  if (severityLevel == 0) {
                    var circle = new google.maps.Circle({
                      map: map,
                      radius: 16093,
                      strokeColor: "#ADD8E6",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: "#ADD8E6",
                      fillOpacity: 0.35
                    });
                    circle.bindTo('center', marker, 'position')
                  } else if (severityLevel == 1) {
                    var circle = new google.maps.Circle({
                      map: map,
                      radius: 16093,
                      strokeColor: "#FFF380",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: "#FFF380",
                      fillOpacity: 0.35
                    });
                    circle.bindTo('center', marker, 'position')
                  } else if (severityLevel == 2){
                    var circle = new google.maps.Circle({
                      map: map,
                      radius: (16093),
                      strokeColor: "#E42217",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: "#E42217",
                      fillOpacity: 0.35
                    });
                    circle.bindTo('center', marker, 'position')
                  }

                  addInfoWindow(marker, data.events[i].description)

                  var geocoder = new google.maps.Geocoder;
                  var cityLocation;

                  var finalLocation;
                  var locationArray = [];
                 function getUserCurrentLocation() {
                   $(document).ready(function(){
                     navigator.geolocation.getCurrentPosition(function(location) {
                       latitude = location.coords.latitude;
                       longitude = location.coords.longitude;
                     if (locationArray.length == 2){
                         locationArray = [];
                     } else {
                       locationArray.push(latitude, longitude);
                       console.log(locationArray);
                       finalLocation = {lat: locationArray[0], lng: locationArray[1]}
                     }
                     geocodeLatLng(geocoder, map);
                     });
                   });
                   setTimeout(getUserCurrentLocation, 5000);
                   return finalLocation;
                 }

                 var address;
                 function geocodeLatLng(geocoder, map) {
                  var latlng = getUserCurrentLocation();
                  geocoder.geocode({'location': latlng}, function(results, status) {
                    if (status === 'OK') {
                      if (results[1]) {
                       address = (results[1].formatted_address);
                      }
                    }
                  });
                  setTimeout(geocodeLatLng, 35000);
                  console.log(address.split(", ")[1]);
                  return address;
                }
                function updateUserLocationCity(){
                  var parsedAddress = geocodeLatLng()
                  console.log(parsedAddress.split(', ')[1]);
                }
                var newBound = new google.maps.LatLng(myLatLng.lat, myLatLng.lng);
                bounds.extend(newBound);
            }
            window.onresize = function() {
                map.fitBounds(bounds);
            };
            map.fitBounds(bounds);
            });
          },
          error: function () {
              alert("code not found");
          }
      });
    }

    grabLocationPoints()

    // Customize UI
    setTimeout(function () {
      $('#searchInput').css('top', '30px');
    }, 1200);
}

/// SIDE NAV
function openNav() {
    document.getElementById("mySidenav").style.width = "400px";
    document.getElementById("main").style.marginLeft = "400px";
    document.body.style.backgroundColor = "#1976D2";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "#2196F3";
}
