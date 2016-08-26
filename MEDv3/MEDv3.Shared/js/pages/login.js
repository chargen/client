﻿(function () {

    "use strict";

    WinJS.UI.Pages.define("/pages/login.html", {

        ready: function (element, options) {
            var form = element.querySelector('form');
            ['login', 'password', 'server'].forEach(function (field) {
                MED.SecureSettings.get(field).then(function (value) {
                    if (value && form.length) {
                        form[field].value = value;
                        form.rememberme.checked = true;
                    }
                });
            });
            var autoSync = MED.Settings.get('autoSync');
            if (autoSync === null) {
                MED.Settings.set('autoSync', true);
            }

            WinJS.Utilities.query('button', element).listen('click', function (e) {
                e.preventDefault();

                var contentHost = document.getElementById('page');
                MED.ProgressBar.show();
                MED.Server.login({
                    login: form.login.value,
                    password: form.password.value,
                    server: form.server.value,
                    rememberme: true 
                }).then(function ok(req) {
                    var loginContent = WinJS.Utilities.query('#contenthost');
                    loginContent.forEach(function (item) {
                        if (item.winControl) {
                            item.winControl.dispose();
                        }
                    });
                                    
                    MED.ProgressBar.hide();
                   
                    contentHost.innerHTML = '';
                    WinJS.UI.Pages.render('/pages/main.html', contentHost, {}).done(function ok() {

                        WinJS.UI.Animation.enterPage(contentHost);
                        WinJS.Navigation.navigate(Application.navigator.home);
                    })
                }, function error() {
                    MED.ProgressBar.hide();
                    var msgBox = new Windows.UI.Popups.MessageDialog('Unable to login');
                    msgBox.showAsync();
                });
            });
        }
    });
})();