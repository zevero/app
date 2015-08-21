'use strict';
(function(){
  
function show(id, msg){
    $('#home .step').hide();
    $('#step_'+id).show();
    $('#step_'+id+' .message').text(msg?JSON.stringify(msg):'');
}
  
app.new = {
  init: function() {
    show('start');
    console.log('app_new_init');
    $("#button_start").prop('disabled', true); 
    app.lib.geo.probe(function(res){
      show('start',res.msg);
      $('.message_').text('start:' + res.msg);
      $("#button_start").prop('disabled', !res.ok);
    });
    $("#button_start").click(function() {
      $('#capture_img').attr('src', '');
      $('#capture_text').val('');
      $("#button_upload").prop('disabled', true);
      app.lib.geo.probe(function(res){
        show('capture',res.msg);
        $('.message_').text('capture:' + res.msg);
        $("#button_upload").prop('disabled', !res.ok); 
      });
      app.lib.foto.getPicture(function(res){
        if (res.err){
          show('start', res.err);
          return;
        }
        $('#capture_img').attr('src', res.uri);
        show('capture','waiting for GPS...');
      });
    });
    $("#button_upload").click(function() {
      var loc = app.lib.geo.get(true); //stop probing
      var params = {
        text: $('#capture_text').val(),
        lat: loc.lat, lng: loc.lng, acc:loc.acc
      };
      app.lib.upload(params, $('#capture_img').attr('src'), function(res){
        if (res.err){
          show('start', res.err);
          return;
        }
        show('start', 'OK');
      });
    });
  }
};
})();
