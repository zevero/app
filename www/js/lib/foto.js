/*global navigator*/
'use strict';
app.lib.foto = {
  getPicture: function(cb){
    function success(uri) {
      cb({uri: uri});
    }
    function fail(message) {
      console.log('foto.getPicture failed because of', message);
      cb({err: message});
    }
    var info = app.lib.store.domain.getInfo();
    navigator.camera.getPicture(success, fail, {
      quality: info.img_quality,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      sourceType : navigator.camera.PictureSourceType.CAMERA,
      allowEdit : false,
      encodingType: navigator.camera.EncodingType.JPEG,
      targetWidth: info.img_size,
      targetHeight: info.img_size,
      correctOrientation: true,
      //popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      cameraDirection: navigator.camera.Direction.BACK
    });
  }
};

