define([
    'underscore',
    'backbone',
    'adapters/notification',
    'dbsync',
    'i18next',
    'sparkMD5',
    'templates',
    'helpers'
], function(_, Backbone, notification, dbSync, i18n, SparkMD5, templates, help) {

    'use strict';


    // Home view.
    // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
    var Login = Backbone.View.extend({

        // Set the template.
        template: templates.login,

        //Events
        events: {
            'submit .login': 'beforeSend',
            'click #debugBtn': 'openHelp',
            'click #closeBtn': 'closeHelp',
            'click #clearLocalDbBtn': 'clearDb',
            'click #showInfoBtn': 'viewDb',
            'click #delSessionBtn': 'deleteSession',
            'click #showSycnModeBtn': 'showSycnMode',

        },



        showSycnMode: function() {


            //dbSync.sync();
        },

        //I18n
        internationalization: function() {
            i18n.init({ // jshint ignore:line
                'lng': localStorage.getItem('lang'),
                'fallbackLng': 'pt'
            }, function(t) { // jshint ignore:li
                //Translate Document
                $(document).i18n();
                //Translate Attributes
                $('#username').attr('placeholder', i18n.t('login.user'));
                $('#password').attr('placeholder', i18n.t('login.password'));
                $('#sendBtn').attr('value', i18n.t('login.signin'));
                //$('#registerBtn').attr('value', i18n.t('login.register'));
                //$('#debugBtn').attr('value', 'debug');
            });
        },

        openHelp: function(e) {
            e.preventDefault();

            $('#firstScreen').css('display', 'block');
        },

        closeHelp: function(e) {
            e.preventDefault();

            setTimeout(function() {
                $('#firstScreen').css('display', 'none');
            }, 100);
        },

        deleteSession: function(e) {
            e.preventDefault();


            help.removeSession();
        },

        clearDb: function(e) {
            e.preventDefault();

            dbSync.deleteTable();
        },

        viewDb: function(e) {
            e.preventDefault();


            dbSync.checkOfflineDatabases();

        },

        beforeSend: function(e) {

            e.preventDefault();
            var self = this;

            var cre = ($('#username').val()).toLowerCase() + ':' + SparkMD5.hash($('#password').val());
            var creb = btoa(cre);

            window.sessionStorage.setItem("keyo", creb);
            window.sessionStorage.setItem("user", ($('#username').val()).toLowerCase());
            notification.loading();

            dbSync.login().done(function(msg) {

                $('body').prepend(help.throwAlertSuccess(msg));

                window.setTimeout(function() {
                  $('.loader').remove();
                  console.log('once');
                self.navigateTo('#home', true);

              }, 1400);

            }).fail(function(xhr) {

                if (xhr.status === 401 || xhr.status !== 0) {

                    $('.loader').remove();
                    $('body').prepend(help.throwAlert(xhr.responseJSON.result));

                } else if (xhr.status === 0) {

                    notification.confirm('Deseja entrar em modo Offline?', 'Sem connectividade', ['Sim', 'Não'])
                        .done(function(response) {
                            if (response === 1) {

                                dbSync.loginOffline(($('#username').val()).toLowerCase(), SparkMD5.hash($('#password').val())).done(function() {

                                    $('.loader').remove();
                                    self.navigateTo('#home', true);

                                }).fail(function(err) {

                                    $('body').prepend(help.throwAlert(err));
                                    $('.loader').remove();

                                });
                            }else if(response===0){
                                $('.loader').remove();
                            }
                        });

                }
            });
        },

        //Class Initializer
        initialize: function() {

            // Throw error if photos collection not passed.
            if (!this.collection) {
                throw new Error('collection is required');
            }

            document.addEventListener('backbutton', function(e) {
                e.preventDefault();
            });

        },

        //Class Render
        render: function() {

            // Render the outer container.
            this.$el.html(this.template());

            this.internationalization();

            this.$userF = this.$('#username');
            this.$passwordF = this.$('#password');

            return this;
        }
    });

    return Login;
});
