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
    app.foto.initGeo(30000);
    app.lib.foto.getPicture(function(res){
      if (res.err){
        console.error('foto img take error', res.err);
        return;
      }
      var _id = window.localStorage.get('#device_id') + '_' + Date.now();
      var id = app.lib.store.add({_id: _id, privat:{img: res.uri, unsent:true}}); //domain#time
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
        {maxWait:30000, desiredAccuracyCountMin:5, enableLowAccuracy:true}
      );
    });
}

function foto_edit(){                 
  var info = app.lib.store.domain.getInfo();
  var values = {};
  var $fields = $('#foto_fields');
  var complete = true;
  info.fields && Object.keys(info.fields).forEach(function(key){
    var field = info.fields[key];
    var $el = $fields.find('#field_key_'+key);
    var value = $el.val().trim();
    if (field.attr.required && value==='') {
      $el.shake();
      complete = false;
    }
    values[key]=value;
  });
  
  
  var foto_id = $('#foto_img').data('id'); //id stored on foto
  app.lib.store.update({values: values, complete:complete}, foto_id);
  if (complete) return $.mobile.navigate('#home');
}

function clear(){
  $('#foto_img').attr('src', '');
  $('#foto_fields').empty();
  $('#foto_edit').prop('disabled', true);
}

function show(n_or_id){
  clear();
  var id = app.lib.store.toId(n_or_id);
  var params = app.lib.store.get(id);
  $('#foto_img').attr('src', params.privat.img || '').data('id', id); //store id on foto
  var info = app.lib.store.domain.getInfo();
  var $fields = $('#foto_fields').empty();
  info.fields && Object.keys(info.fields).forEach(function(key){
    var value = (params.values && params.values[key]) || null;
    var field = info.fields[key];
    var field_key = 'field_key_'+key;
    var $el = $('<'+field.el+'>', field.attr).attr('id', field_key);
    var $label = $('<label>'+field.label+'</label>',{for: field_key});
    $el.attr({autocomplete:'off', autocorrect:'off', autocapitalize:'off',spellcheck:'false'}); 
    if (field.el === 'select' && typeof field.options ==='object') { //el is select
      Object.keys(field.options).forEach(function(option_key){
        $el.append('<option value="'+option_key+'"'+((option_key===value)?' selected':'')+'>' + field.options[option_key]+'</option>');
      });
    } else { //el is normal
      $el.attr('value', value);
    }
    
    $fields.append($label);
    $fields.append($el);
  });
  $.mobile.navigate('#foto', { transition: 'slide'});
}

function getFieldsInfo(params){
  var info = app.lib.store.domain.getInfo();
  var html ='';
  info.fields && Object.keys(info.fields).forEach(function(key){
    var field = info.fields[key];
    var value = (params.values && params.values[key]) || null;
    if (field.attr.type==='select' && field.options){
      value = field.option[field] || null;
    }
    if (!field.peek && !value) return;
    html += value + '<br>';
  });
  return html;
}

app.foto = {
  initGeo: function(ms_wait){
    if (!ms_wait) ms_wait = 100000;
    show_geo_info();
    navigator.geolocation.getAccurateCurrentPosition(
      function(e){console.log('app.foto.initGeo_ms',ms_wait,'ok',e);},
      function(e){console.log('app.foto.initGeo_ms',ms_wait,'nok',e);},
      show_geo_info,
      {maxWait: ms_wait, enableLowAccuracy:true}
    );
  },
  init: function() {
    console.log('app_foto_init');
    setTimeout(app.foto.initGeo,500); //navigator.geolocation is OVERWRITTEN on startup. So we load and use it with timeout
    //app.map.init();
    $('#button_foto').click(foto_take);
    $('#foto_edit').click(foto_edit);
    $('#foto_fields').on('change keyup',function(){$('#foto_edit').prop('disabled', false);});
  },
  clear: clear,
  show: show,
  getFieldsInfo: getFieldsInfo
};
})();
