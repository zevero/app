'use strict';
(function(){

app.lib.register = {
  go: function(cb){
    $.ajax(app.config.server+'/phone/register', {
    data : JSON.stringify(app.lib.store.register.getData()),
    contentType : 'application/json',
    type : 'POST'})
    .done(function(res){
      console.log('register_done',res);
      app.lib.store.register.updateAll(res);
      typeof cb ==='function' && cb(res);
    })
    .fail(function(err){
      console.log('register_fail',err);
      typeof cb ==='function' && cb({err:'Not Online'});
    });
  }
};

})();