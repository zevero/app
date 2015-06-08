'use strict';
(function () {

  app.settings = {
    display: function () { //display
      var ls = window.localStorage;
      if (ls.getItem("device_id")) { //display data
        $('#name').val(ls.getItem('name')).prop('disabled', true);
        $('#domain').val(ls.getItem('domain')).prop('disabled', true);
        $('#device_id').text(ls.getItem('device_id'));
        $('#settings_btn').text('Clear');
      } else { //or clear
        $('#name').prop('disabled', false).val('');
        $('#domain').prop('disabled', false).val('');
        $('#device_id').text('');
        $('#settings_btn').text('Save');
        $.mobile.navigate('#settings');
      }
    },
    init: function () {
      console.log('app_settings_init');

      var ls = window.localStorage;
      app.settings.display();
      $('#settings_btn').click(function () {
        console.log('settings_btn');
        if (ls.getItem('device_id')) {
          ls.removeItem('device_id');
          app.settings.display();
          return;
        }
        var valid = true;
        var form = {
          name: $('#name').val(),
          domain: $('#domain').val()
        };


        if (form.name.length < 3) {
          console.log('TODO name is too short');//TODO show unvalid
          valid = false;
        }
        if (form.domain.length < 3) {
          console.log('TODO domain is too short');//TODO show unvalid
          valid = false;
        }
        if (valid) {
          $.post(app.config.server + '/phone/settings', form, function (json) {
            console.log('sent settings', form, 'got', json);
            if (!json.err){
              ls.setItem('name', json.device.name);
              ls.setItem('domain', json.device.domain);
              ls.setItem('device_id', json.device._id);
              app.settings.display();
            }
            else console.log('TODO Sent settings JSON Error', json.err);//TODO show ok
       
            
          });
          console.log('TODO Sent settings');//TODO show ok
        }
      });
    }
  };
})();
