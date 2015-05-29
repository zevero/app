'use strict';
app.lib.upload = function(params, imageURI, cb) {
  var formData = new FormData();
  formData.append('file', imageURI);


  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType="image/jpeg";
  options.chunkedMode = true;
  options.headers = {Connection: "close"};

  options.params = params;
  options.chunkedMode = false;

  function ok(r){
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    if (r.response === 'ok') cb({});
  }

  function fail(err){
    console.log('upload err',err);
    cb({err:err});
  }; //err.code
  var ft = new FileTransfer();
  ft.upload(imageURI, encodeURI(app.config.server + '/phone/upload'), ok, fail, options);
};
