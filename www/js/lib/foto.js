'use strict';
app.lib.foto = {
  getPicture: function(cb){
    function success(uri) {
      cb({uri: uri});
    };
    function fail(message) {
      console.log('foto.getPicture failed because of', message);
      cb({err: message});
    } 
    navigator.camera.getPicture(success, fail, {
      quality: 50,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      sourceType : navigator.camera.PictureSourceType.CAMERA,
      allowEdit : false,
      encodingType: navigator.camera.EncodingType.JPEG,
      targetWidth: 400,
      targetHeight: 400,
      correctOrientation: true,
      //popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      cameraDirection: navigator.camera.Direction.BACK
    });
  }
};