'use strict';
(function () {

  app.settings = {
    display: function () { //display
      var ls = window.localStorage;
      if (ls.getItem('#device_id')) { //display data
        $('#name').val(ls.get('#name'));//.textinput('disabled');
        $('#domain').val(ls.get('#domain'));//.textinput('disabled');
        $('#device_id').text(ls.get('#device_id'));
        $('#settings_btn').text('Clear');
        $('#button_start').prop('disabled',false);
      } else { //or clear
        $('#name').val('');
        $('#domain').val('');
        $('#device_id').text('');
        $('#settings_btn').text('Save');
        $('#button_start').prop('disabled',true);
        $.mobile.navigate('#settings'); //go to settings page if we dont have device_id
      }
    },
    init: function () {
      console.log('app_settings_init');

      var ls = window.localStorage;
      app.settings.display();
      $('#domain').keyup(function(){
        this.value = this.value.toLowerCase();
      });//only lowercase allowed
      $('#settings_btn').click(function () {
        console.log('settings_btn');
        if (ls.get('#device_id')) {
          ls.remove('#device_id');
          app.settings.display();
          return;
        }
        var valid = true;
        var form = {
          name: $('#name').val(),
          domain: $('#domain').val()
        };


        if (form.name.length < 3) {
          alert('TODO name is too short');//TODO show unvalid
          valid = false;
        }
        if (form.domain.length < 3) {
          alert('TODO domain is too short');//TODO show unvalid
          valid = false;
        }
        if (valid) {
          $.post(app.config.server + '/phone/settings', form, function (json) {
            console.log('sent settings', form, 'got', json);
            if (!json.err){
              ls.set('#name', json.device.name);
              ls.set('#domain', json.device.domain);
              ls.set('#device_id', json.device._id);
              app.settings.display();
              setTimeout(function(){$.mobile.navigate('#home');},700);
            }
            else console.log('TODO Sent settings JSON Error', json.err);//TODO show ok
       
            
          });
          console.log('TODO Sent settings');//TODO show ok
        }
      });
    }
  };
})();
