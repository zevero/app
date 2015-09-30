'use strict';
(function(){
var ls = window.localStorage;
/*  #domain ........ currently acitive domain
 *  #domains ....... registered domains: {domain1: name1,...}
 *  #outbox ........ stuff that needs to be sent
 *  #time_diff ..... time_diff between server and client time
 *  domain#info .... info used by domain {fields:[],img_size:400,img_quality:50}
 *  domain# ........ number of fotos
 *  domain#afa_123 . foto with device_id and timestamp
 *  
 *  foto ids:
 *  n .... foto number in a domain
 *  id ... domain#n                client id
 *  _id .. device_id _ timestamp   server id
 */
var o = app.lib.store = {
  init: function() {
    if (!ls.has('#outbox')) ls.set('#outbox',{});
  },
  X: { //decode _id
    t: function(_id){var s = _id.split('_');return parseInt(s[1],10);},
    d: function(_id){var s = _id.split('_');return s[0];}
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
    app.list.add({params:params,id:id,n:n}); //need to change from ok to nok
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
    var n=parseInt(ls.get(domain),10);
    var id,list=[];
    for (n;n>0;n--){
      id = domain+'#'+n;
      if (ls.has(id)) list.unshift({params: ls.get(id), n:n, domain:domain, id:id});
      else break;
    }
    return list;
  },
  register: {
    getData: function(){
      return {
        device_id: ls.get('#device_id'),
        domains: ls.get('#domains')
      };
    },
    updateAll: function(res){
      if (res.err) console.warn('store_domainsUpdate error',res);
      ls.set('#device_id', res.device_id);               //set device_id
      ls.set('#time_diff', Date.now()-res.time);         //set time_diff
      Object.keys(res.domains).forEach(function(dom){    //add field info
        ls.set(dom+'#info',res.domains[dom]);
      });
      Object.keys(res.domains_nok).forEach(o.domain.delete); //remove domains_nok
    }
  },
  domain: {
    addFromForm: function(form){ //just set #domains
      var domains = ls.get('#domains')||{};
      domains[form.domain]=form.name;
      ls.set('#domains',domains);
    },
    delete: function(domain){ //delete everything associated with the domain
      console.log('store domain delete',domain);
      var id,n=parseInt(ls.get(domain),10)||0;
      for(n;n>0;n--){
        id = domain+'#'+n;
        if (ls.has(id)) ls.remove(id);
        else break;
      }
      ls.remove(domain+'#info');
      ls.remove(domain+'#');
      var domains = ls.get('#domains');
      delete domains[domain];
      ls.set('#domains',domains);
      if (domain === ls.get('#domain')){
        ls.remove('#domain');
      }
      app.settings.display();
    },
    getAll: function(){
      return ls.get('#domains') || {};
    },
    getInfo: function(){var d = ls.get('#domain'); return d && ls.get(d+'#info');},
    get: function(){return ls.get('#domain');},
    set: function(d){return ls.set('#domain',d);}
  }
};
})();
