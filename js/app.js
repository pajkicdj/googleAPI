$(function () {

  function initialize() {

    //Using getElementById bc of GoogleMaps documentation
    var mapDiv = document.getElementById('map-canvas');

    var mapOptions = {
      center: new google.maps.LatLng(43.7, -79.4),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

    google.maps.event.addDomListener(map, 'mouseup', plot500);
    plot500();
  }

  google.maps.event.addDomListener(window, 'load', initialize);

  var markers = [];
  var urlLat = '43.7';
  var urlLong = '-79.4';
  var consumerKey = 'HVjTeXkb06eHPrb9m2AhcDfoV6XBC76Vt5PIyX1r';
  var imageSize = '2';
  var radius = '50km';
  var rpp = '100';
  var url = '';
  
  function Image(latitude, longitude, url, description, name) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.description = description;
    this.url = url;
    this.name = name;
  };

  var clearMarkers = function() {
    for (var i = 0, size = markers.length; i < size; i++) {
      markers[i].setMap(null);
    }
  };

  var plot500 = function() {
    newMapCenter = map.getCenter();
    urlLat = newMapCenter.lat();
    urlLong = newMapCenter.lng();
    console.log(urlLat);
    console.log(urlLong);
    url = 'https://api.500px.com/v1/photos/search?geo=' + urlLat + ',' + urlLong + ',' + radius + '&rpp=' + rpp + '&image_size=' + imageSize + '&consumer_key=' + consumerKey;
    //url = 'https://api.500px.com/v1/photos/search?geo=' + '43.7' + ',' + '-79.4' + ',' + radius + '&rpp=' + rpp + '&image_size=' + imageSize + '&consumer_key=' + consumerKey;
    console.log(url);
    
    $.getJSON(url, 
      function ( data ) {
        var imageCollection = [];

        $( data.photos ).each(function (index, photo) {
          var image = new Image(photo.latitude, photo.longitude, photo.image_url, photo.description, photo.name);
          imageCollection.push(image);      
        });
        console.log(imageCollection);

        if (markers) {
          clearMarkers();
        }

        $(imageCollection).each(function(index, pin) {
          var myLatlng = new google.maps.LatLng(pin.latitude, pin.longitude);

          var contentString = '<div id="content">'+
                      '<div id="siteNotice">'+
                      '</div>'+
                      '<h1 id="firstHeading" class="firstHeading">' + pin.name + '</h1>'+
                      '<div id="bodyContent">'+
                      '<img src=' + pin.url + '>'+
                      '<p>' + pin.description + '</p>' +
                      '</div>'+
                      '</div>';

          var marker = new google.maps.Marker({

            position: myLatlng,
            map: map,
            title: pin.description,
            clickable: true
          });

          marker.info = new google.maps.InfoWindow({
            content: contentString
          });

          google.maps.event.addDomListener(marker, 'click', function() {
            marker.info.open(map,marker);
          });

          markers.push(marker);
        });

      }
    )
  }
  
});