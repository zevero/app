'use strict';
(function(){

function $tr(next){
  var params = next.params;
  return $('<tr data-n="'+next.n+'">')
     .append($('<td>').html('<img src="'+params.privat.img+'">'))
     .append($('<td>').text(next.n))
     .append($('<td>').text((new Date(params._id)).toLocaleString()))
     .append($('<td>').text(Math.round(params.acc)))
     .append($('<td>').text(params.text||''))
     .append($('<td><img>'));
}
function eventSendState(e, state){//e.currentTarget === this but JSHint complains
  $(e.currentTarget).find('td:last-child img').attr('src','img/'+state+'.png');
}

function sendState(state,n) {
  console.log('app_list_state');
  $('#list_table tbody tr[data-n="'+n+'"]').trigger('sendState',state);
}

function eventShow(e){
  var n = $(e.currentTarget).data('n');
  app.foto.show(n);
}

app.list = {
  init: function() {
    console.log('app_list_init');
    $('#list_table tbody').on('click','tr', eventShow);
    $('#list_table tbody').on('sendState','tr', eventSendState);
    app.lib.store.getAll().forEach(app.list.add);
    app.lib.store.outbox.all().forEach(function(next){
      sendState(next.params.privat.unsent?'nok':'update',next.n);
    });
  },
  add: function(next) {
    console.log('app_list_add');
    $('#list_table tbody').prepend($tr(next));
    sendState('ok',next.n);
  },
  update: function(next) {
    console.log('app_list_update');
    $('#list_table tbody tr[data-n="'+next.n+'"]').replaceWith($tr(next));
    sendState('update',next.n);
  },
  sendState: sendState
};
})();
