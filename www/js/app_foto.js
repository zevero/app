/* global navigator*/
'use strict';
(function(){
  

//var show_geo_info_t;
function show_geo_info(pos){
  var msg = 'NO GPS';
  if (pos) msg = Math.round(pos.coords.accuracy) + ' m';
  $('#status_gps').text(msg);
}

function foto_take(){
    clear();
    navigator.geolocation.getAccurateCurrentPosition(
      function(e){console.log('geo_start_succes',e);},
      function(e){console.log('geo_start_error',e);},
      show_geo_info,
      {maxWait:30000}
    );

    app.lib.foto.getPicture(function(res){
      if (res.err){
        console.error('foto img take error', res.err);
        return;
      }

      var id = app.lib.store.add({_id: Date.now(),privat:{img: res.uri, unsent:true}});
      show(id);

      navigator.geolocation.getAccurateCurrentPosition(
        function(pos){
          console.log('geo_foto_success',pos);
          var c = pos && pos.coords;
          if (c) {
            
            app.lib.store.update({lat: c.latitude, lng: c.longitude, acc:Math.round(c.accuracy)}, id);
          }
        },
        function(e){console.log('geo_foto_error',e);},
        show_geo_info,
        {maxWait:30000, desiredAccuracyCountMin:5, enableLowAccuracyOnTimeout:true}
      );
      

    });
}

function clear(){
  $('#foto_img').attr('src', '');
  $('#foto_text').val('');
  $('#foto_edit').prop('disabled', true);
}

function show(n_or_id){
  clear();
  var id = app.lib.store.toId(n_or_id);
  var params = app.lib.store.get(id);
  $('#foto_img').attr('src', params.privat.img || '').data('id', id); //store id on foto
  $('#foto_text').val(params.text || '');
  app.show('foto');
}

app.foto = {
  init: function() {
    console.log('app_foto_init');
    app.show('list');
    navigator.geolocation.getAccurateCurrentPosition(
      function(e){console.log('geo_init_succes',e);},
      function(e){console.log('geo_init_error',e);},
      show_geo_info,
      {maxWait:100000}
    );
    $('#button_foto').click(foto_take);
    $('#foto_back').click(function(){app.show('list');});
    $('#foto_edit').click(function(){
      var id = $('#foto_img').data('id');                            //id stored on foto
      app.lib.store.update({text: $('#foto_text').val().trim()}, id);
      app.show('list');
    });
    $('#step_foto input').keyup(function(){$('#foto_edit').prop('disabled', false);});
  },
  clear: clear,
  show: show
};
})();
