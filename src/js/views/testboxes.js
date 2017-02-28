define([
    'jquery',
    'underscore',
    'backbone',
    'adapters/notification',
    'templates',
    'i18next'
], function ($, _, Backbone, notification, templates, i18n) {

    'use strict';

    // Home view.
    // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
    var TestBoxes = Backbone.View.extend({

        //Set ClassName
        className: 'item',

        //Set Element Attributes
        attributes: {
            'role': 'boxes'
        },

        // Set the template.
        template: templates.testboxes,

        //Events
        events: {
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


        //Class Initializer
        initialize: function () {
            if (!this.model) {
                throw new Error('collection is required');
            }

            //Set Question Number
            this.questionNumber = this.model[0];

            //Set Model
            this.model = this.model[1];
        },

        //Class Render
        render: function () {
            var self = this;

            var $model = this.model.toJSON();

            //Start Templating
            this.$el.html(this.template($model));
            
            //Translate Page
            self.internationalization();


            return this;
        }

    });

    return TestBoxes;
})
;