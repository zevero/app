'use strict';
var app = {
  config: {
    //server: 'http://beweisfoto.info'
    //server: 'http://beweisfoto.puschkarski.org:'
    server: 'http://checkbild.info:5000'
  },
  lib: {},
  // Application Constructor
  init: function() {
    console.log('app_initialize');
    document.addEventListener('deviceready', function() {
      console.log('app_onDeviceReady');
      //Origami.fastclick(document.body);
      app.lib.store.init();
      app.list.init();
      app.foto.init();
      app.settings.init();
      document.addEventListener('resume', app.foto.initGeo, false);
      document.addEventListener('online', app.lib.update, false);
      app.lib.update();
      //app.list.init();
      setInterval(app.heartbeat,20000);
    }, false);
  },
  show: function(step){
    var $page = $.mobile.pageContainer.pagecontainer('getActivePage');
    var $steps = $page.find('.step').hide();
    $steps.filter('#step_'+step).show();
  },
  heartbeat: function(){
    $.post(app.config.server+'/phone/time')          //get time
    .done(function(res) {
      console.log('time_success', res);
    })
    .fail(function(res) {
      console.log('time_fail', res);
    });
  }
};
