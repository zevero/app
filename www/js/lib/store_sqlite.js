'use strict';
(function(){

var row = {};       //a global row for insert
var id = 0;         //a global id to find in FOTOS
var _id = 0;        //a global _id to save nedb_id
var tx_success=null;//a global success funtion


function tx_error(err) {
  alert('Error processing SQL: '+err.code);
}
  
function tx_init(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS FOTOS (id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
    'params TEXT NOT NULL, ' +
    'img_uri TEXT NOT NULL, ' +
    '_id INTEGER)' //_id from server db. NULL if not saved to server
  ); 
}

function tx_add(tx) {
  tx.executeSql('INSERT INTO FOTOS (params,img_uri) VALUES ("' +
    row.params +'","'+
    row.img_uri+'")'
  );
}
function tx_update(tx) {
  tx.executeSql('UPDATE FOTO SET _id ="' + _id +
     '" WHERE id = '+ id);
}
function tx_unsent(tx) {
  tx.executeSql('SELECT * FROM DEMO where id = '+id, [], tx_success, tx_error);
}

function tx_getAll(tx) {
  tx.executeSql('SELECT * FROM DEMO', [], tx_success, tx_error);
}

function go(transaction, success) { //you may omit success
  var db = window.sqlitePlugin.openDatabase({name: 'foto.db', location: 2});
  db.transaction(transaction, tx_error, success);
}

app.lib.store_sqlite = {
  init: function() {
    go(tx_init);
  },
  add: function(params, img_uri, cb) {
    row = {params: JSON.stringify(params), img_uri: img_uri}; 
    go(tx_add,cb);
  },
  update: function(id_,_id_, cb) {
    id = id_;
    _id = _id_;
    go(tx_update,cb);
  },
  getUnsent: function(cb) {
    tx_success = cb;
    go(tx_unsent, console.log);
  },
  getAll: function(cb) {
    tx_success = cb;
    go(tx_getAll, console.log);
  }
};
})();
