/* global FileTransfer, FormData, FileUploadOptions */
'use strict';
app.lib.upload = function(params, domain, cb) {
  var formData = new FormData();
  var imageURI = params.privat.img;
  formData.append('file', imageURI);


  var options = new FileUploadOptions();
  options.fileKey='file';
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType='image/jpeg';
  options.chunkedMode = true;
  options.headers = {Connection: 'close'};
  
  delete(params.privat); //don't send private stuff
  options.params = params;
  options.chunkedMode = false;

  function ok(r){
    console.log('Code = ' + r.responseCode);
    console.log('Response = ' + r.response);
    console.log('Sent = ' + r.bytesSent);
    if (r.response) cb({msg: r.response});
    else cb({});
  }

  function fail(err){
    console.log('upload err',err);
    cb({err:err});
  } //err.code
  var ft = new FileTransfer();
  ft.upload(imageURI, encodeURI(app.config.server + '/phone/' + domain +'/upload'), ok, fail, options);
};
