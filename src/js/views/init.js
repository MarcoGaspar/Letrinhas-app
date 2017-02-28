define([
    'jquery',
    'underscore',
    'backbone',
    'adapters/notification',
    'dbsync',
    'templates',
    'i18next'
], function ($, _, Backbone, notification, dbSync, templates, i18n) {

    'use strict';

    var Init = Backbone.View.extend({

        // Set the template.
        template: templates.init,

        events: {
            'click .nextScreen': 'secondScreen',
            'change #langSelect': 'changeLang'
        },


        //I18n
        internationalization: function () {
            i18n.init({// jshint ignore:line
                'lng': localStorage.getItem('lang'),
                'fallbackLng': 'pt'
            }, function () {
                //Translate Document
                $(document).i18n();
            });
        },

        changeLang: function (e) {
            e.preventDefault();
            var $lang = $('#langSelect').find('option:selected').val();
            localStorage.setItem('lang', $lang);
            this.internationalization();
        },

        secondScreen: function (e) {
            e.preventDefault();

            //Change Screens
            $('#firstScreen').remove();
            $('#secondScreen').remove();
            $('#fourthScreen').remove();
            $('#thirdScreen').toggleClass('hide');
            localStorage.setItem('first_time', true);


            //Start Sync
            //dbSync.halfSyncSynchronous();

            //dbSync.syncSynchronous();
        },


        //Class Initializer
        initialize: function () {
            localStorage.setItem('lang', 'pt');
            sessionStorage.setItem('sync', 'false' );
            sessionStorage.setItem('user', '' );

        },

        //Class Render
        render: function () {
            // Render the outer container.
            this.$el.html(this.template());

            //Translate Page
            this.internationalization();

            return this;
        }
    });

    return Init;
});
