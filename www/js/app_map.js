'use strict';
(function(){
var map, mapObject;
app.map = {
  init: function() {
    console.log('app_map_init');
    map=$('#map');
    mapObject = google && new google.maps.Map(map[0], {
      zoom : 16,
      center : new google.maps.LatLng(47.055411, 16.322059),
      mapTypeId : google.maps.MapTypeId.HYBRID
    });
    /*
    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center); 
    });
    */
  }
};
})();
