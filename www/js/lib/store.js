'use strict';
(function(){
var ls;



var o = app.lib.store = {
  init: function() {
    ls=window.localStorage;
    if (!ls.has('#outbox')) ls.set('#outbox',{});
  },
  toId: function (n_or_id){
    if (typeof n_or_id === 'string' && n_or_id.indexOf('#')!==-1) return n_or_id; //is id
    return ls.get('#domain') + '#' + n_or_id;
  },
  toN: function (n_or_id){
    if (typeof n_or_id !== 'string') return n_or_id;   //is n
    var p = n_or_id.indexOf('#')+1;
    if (!p) return parseInt(n_or_id,10);            //is n (as string)
    return parseInt(n_or_id.substr(p),10); 
  },
  outbox: {
    next: function(){
      var list = ls.get('#outbox');
      var keys = Object.keys(list);
      var id = keys[0];
      if (keys.length) {
        delete(list[id]);
        ls.set('#outbox',list);
        var split = id.split('#');
        return {id: id, params:ls.get(id), domain: split[0], n:split[1]};
      }
      return null;
    },
    add: function(id, dont_update){
      var outbox = ls.get('#outbox');
      outbox[id]=true;
      ls.set('#outbox', outbox);   
      if (!dont_update) app.lib.update();
    },
    all: function(){
      var list = [];
      var domain = ls.get('#domain');
      var outbox = ls.get('#outbox');
      var keys = Object.keys(outbox);
      keys.forEach(function(id){
        var split = id.split('#');
        if (domain!==split[0]) return;
        list.push({id:id, params: ls.get(id), n:split[1]});
      });
      return list;
    }
     
  },
  add: function(params) {
    var domain = ls.get('#domain');
    var n = parseInt(ls.get(domain),10);
    n = n?n+1:1;
    ls.set(domain,n);
    var id = domain + '#' + n;
    ls.set(id,params);
    app.list.add({params:params,id:id}); //need to change from ok to nok
    app.list.sendState('nok',n);
    o.outbox.add(id);  
    return id;
  },
  uploaded: function(id,n){
    var params = ls.get(id);
    delete params.privat.unsent;
    ls.set(id,params);
    app.list.sendState('ok',n);
  },
  update: function(params_, id) {
    var params = ls.get(id) || {};
    $.extend(params,params_);
    ls.set(id,params);
    app.list.update({params:params,id:id,n:o.toN(id)}); //always state refresh
    o.outbox.add(id);  
  },
  updated: function(n){
    app.list.sendState('ok',n);
  },
  get: function(id){
    return ls.get(id);
  },
  getAll: function() {
    var domain = ls.get('#domain');
    var n,n_length=parseInt(ls.get(domain),10);
    var id,list=[];
    for (n=1;n<=n_length;n++){
      id = domain+'#'+n;
      if (ls.has(id)) list.push({params: ls.get(id), n:n, domain:domain, id:id});
      else break;
    }
    return list;
  }
};
})();
