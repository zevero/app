'use strict';
(function(){
var loc = null;
var watch = null;
var probe_cb = null;


app.lib.geo = {
  get: function(stop){ //stop true will stop looking furter
    if (stop && watch) watch = navigator.geolocation.clearWatch(watch);
    return loc;
  },
  probe:function(cb) { //probe for gps signal and save the best result so far
    probe_cb = cb; //probe_cb immer aktuell
    if (watch) return;
    loc=null;
    var n = 0;
    watch = navigator.geolocation.watchPosition(function(location){
      var c = location.coords;
      var res = {};
      n++;
      if (!loc || loc.acc >= c.accuracy){ //we got a better result!
        console.log(n,location);
        loc = {
          lat: c.latitude,
          lng: c.longitude,
          acc: Math.round(c.accuracy)
        };
      }
      var a = loc.acc;
      res.msg = n+ ' gps: ' + a + ' m';
      if(a<100) res.ok = true;
      if(a<10)  res.msg += ' OK';
      if (n>20) res.msg += ' ...';
      
      console.log('geo', res.msg);
      probe_cb(res);
      if(a<10 || n>20) watch = navigator.geolocation.clearWatch(watch);
      
    },
    function(error){
      console.log(error);
      cb({msg: error.message});
    },{
      enableHighAccuracy: true, 
      maximumAge        : 30000, 
      timeout           : 27000
    });
  }
};
})();