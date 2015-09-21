'use strict';
(function(){



function update(){
  var next = app.lib.store.outbox.next();
  console.log('update',next);
  if (!next) return;
  
  function update_failed(res){
    console.warn('update_failed', res);
    app.lib.store.outbox.add(next.id, true); //add back
  } 
  
  if (next.params.privat.unsent) return app.lib.upload(next.params, next.domain, function(res){    //initial send
    if (res.err) return update_failed(res);//console.warn('uploade no net: ', res.err);
    if (res.msg) return update_failed(res);//console.warn('uploaded, but error: ', res.msg);
    app.lib.store.uploaded(next.id,next.n);
    return update();
  });

  delete next.params.privat;
  //$.post(app.config.server+'/phone/'+next.domain+'/update', JSON.stringify(next.params))          //updates
  $.ajax({
    url: app.config.server+'/phone/'+next.domain+'/update', 
    type: 'POST', 
    contentType: 'application/json', 
    data: JSON.stringify(next.params)
  })
  .done(function(res) {
    console.log('update_success', res);
    app.lib.store.updated(next.n);
    return update();
  })
  .fail(update_failed);
}
  
app.lib.update = update; //update is called as long there is no app.lib.store.outbox.next
})();