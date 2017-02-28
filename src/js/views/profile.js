define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'dbsync',
    'i18next'
], function ($, _, Backbone, templates, dbSync, i18n) {

    'use strict';

    var Profile = Backbone.View.extend({

        // Set the template.
        template: templates.profile,

        events: {
            'click .navbar-brand': 'togglesidebar',
            'click .selectLang': 'selectLang',
            'click .testCounter': 'preventRedirect',
            'click .sync': 'sync'
        },

        //Toggle SideBar
        togglesidebar: function (e) {
            e.preventDefault();
            $('#wrapper').toggleClass('toggled');
        },

        //Prevent Redirect
        preventRedirect: function(e){
          e.preventDefault();
        },

        selectLang: function (e) {
            e.preventDefault();
            var $lang = $(e.currentTarget).attr('role');

            //Change Language Icons
            $('#currentLang').html($('<span>', {
                class: 'flag-icon flag-icon-' + $lang
            }));

            //Change Language
            localStorage.setItem('lang', $lang);
            this.internationalization();
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

        //Resync Database
        sync: function (e) {
            e.preventDefault();
            var self = this;
            console.log(self.model.attributes);
            dbSync.studentSync(self.model.attributes).done(function() {
                $('.loader').remove();  
            });

        },


        //Class Initializer
        initialize: function () {
            if (!this.model) {
                throw new Error('model is required');
            }

            //Get TestTypes
            this.testTypes = this.model[1];

            //Get Schools
            this.schools = this.model[2];

            //Get Tests
            this.tests = this.model[3];

            //Get Account Model
            this.model = this.model[0];

        },

        //Class Render
        render: function () {
            var self = this;
            var $data = {account: this.model.toJSON(), types: [], currentLang: localStorage.getItem('lang')};

            //Set Test Types
            for (var i in self.testTypes.models) {
                var $model = self.testTypes.models[i].toJSON();
                $model.counter = self.tests.where({type: '' + $model.value}).length;
                $data.types.push($model);
            }

            //Change Info ID into Names
            var $schoolInfo = self.schools.where({_id: $data.account.school})[0].toJSON();
            $data.account.school = $schoolInfo.name;
            for(var j in $schoolInfo.classes){
                if($schoolInfo.classes[j]._id === $data.account.class){
                    $data.account.class = {
                        name: $schoolInfo.classes[j].name,
                        year: $schoolInfo.classes[j].year
                    };
                }
            }

            //Render View
            this.$el.html(this.template($data));

            //Translate Page
            self.internationalization();

            return this;
        }
    });

    return Profile;
});
