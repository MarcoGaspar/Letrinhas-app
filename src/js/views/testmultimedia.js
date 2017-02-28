define([
    'underscore',
    'backbone',
    'handlebars',
    'adapters/notification',
    'adapters/audio',
    'adapters/media',
    'models/resolution',
    'templates',
    'i18next'
], function(_, Backbone, Handlebars, notification, audio, media, Resolution, templates, i18n) {

    'use strict';

    var TestMultimedia = Backbone.View.extend({

        //Set Element Class
        className: 'item',

        //Set Element Attributes
        attributes: {
            'role': 'multimedia'
        },

        // Set the template.
        template: templates.testmultimedia,

        //Events
        events: {
            'click .btn-block': 'selectAnswer'
        },

        //I18n
        internationalization: function() {
            i18n.init({ // jshint ignore:line
                'lng': localStorage.getItem('lang'),
                'fallbackLng': 'pt'
            }, function() {
                //Translate Document
                $(document).i18n();
            });
        },

         shuffle: function(array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        },

        //Select Answer
        selectAnswer: function(e) {

            $(e.target).parent().parent().find('.active').each(function() {
                $(this).removeClass('active');
            });

            $(e.target).toggleClass('active');
        },

        //Class Initializer
        initialize: function() {

            if (!this.model) {
                throw new Error('collection is required');
            }

            //Set Question Number

            this.questionNumber = this.model[0];

            //Set Model
            this.model = this.model[1];

            this.model.attributes.content.answers = this.shuffle(this.model.attributes.content.answers);

            //Register Handlebar Function
            Handlebars.registerHelper('ifCond', function(v1, v2, options) {

                if (v1 === v2) {
                    return options.fn(this);
                }
                return options.inverse(this);
            });

        },

        //Class Render
        render: function() {
            var self = this;





            console.log(  self.model.attributes.content.answers);

            //Render View
            this.$el.html(this.template(this.model.toJSON()));

            //Translate Page
            this.internationalization();

            return this;
        }
    });

    return TestMultimedia;
});
