'use strict';
(function () {

function invalid(msg){
  $('#settings_domain_add_popup').shake();
  return $('#settings_domain_add_err').html(msg||'');
}
function addNewDomain(){
  console.log('settings_addNewDomain');

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
  if (!valid) return invalid();
  app.lib.store.domain.addFromForm(form);
  
  app.lib.register.go(function (json) {
    console.log('settings_addNewDomain sent', form, 'got', json);
    if (json.err) {
      app.lib.store.domain.delete(form.domain);
      console.warn('settings_addNewDomain register cb error', json.err);
      return invalid('Server nicht erreichbar.');
    }
    if (!$.isEmptyObject(json.domains_nok)) {
      app.lib.store.domain.delete(form.domain);
      return invalid(form.domain + 'existiert nicht.');
    }
    app.lib.store.domain.set(form.domain);
    app.settings.display();
    setTimeout(function(){$.mobile.navigate('#home');},700);

  });
  console.log('TODO Sent settings');//TODO show ok
  
}
function removeDomain(){
  var domain = app.lib.store.domain.get(); 
  if (!confirm('Wirklich Domain "' + domain + '" mit allen Einstellungen und Daten löschen???')) return;
  app.lib.store.domain.delete(domain);
  app.settings.display();
}

app.settings = {
  display: function () { //display
    $('#settings_domain_add_err').empty();
    $('#name, #domain').val('');
    //$('#settings_domain_add_popup').popup('close');
    var $select = $('#settings_domain_select').empty();
    var domains = app.lib.store.domain.getAll(); 
    var domain = app.lib.store.domain.get();
    Object.keys(domains).forEach(function(dom){
      if (!domain) { //choose first domain, if nothing is selected
        domain = dom;
        app.lib.store.domain.set(domain);
      }
      var $option = $('<option value="'+dom+'">' + dom + ' (' + domains[dom] + ')</option>' );
      if (dom ===domain) $option.prop('selected',true);
      $select.append($option);
    });
    $select.selectmenu('refresh', true);
    $('#settings_domain_remove').html('Domain' + domain + ' löschen!');
    $('#settings_domain_exist').toggle(!!domain);
    $('#settings_domain_exist_').toggle(!domain);
    $('#settings_back').toggle(!!domain);
    if (!domain)  $.mobile.navigate('#settings'); //go to settings page if we dont have a domain

  },
  init: function () {
    console.log('app_settings_init');
    $('#settings_domain_select').selectmenu().change(function(){
      app.lib.store.domain.set($(this).val());
      app.settings.display();
      //setTimeout(function(){$.mobile.navigate('#home');},500);
    });
    $('#domain').keyup(function(){
      this.value = this.value.toLowerCase();
      $('#settings_domain_add_err').empty();
    });//only lowercase allowed
    $('#settings_domain_add').click(addNewDomain);
    $('#settings_domain_remove').click(removeDomain);
    app.settings.display();
  }
};
})();
