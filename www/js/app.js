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
      app.new.init();
      app.settings.init();
      //app.list.init();
    }, false);
  }
};
