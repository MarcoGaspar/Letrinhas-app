define([
    'underscore',
    'backbone',
    'adapters/notification',
    'adapters/audio',
    'models/resolution',
    'templates',
    'i18next'
], function (_, Backbone, notification, audio, Resolution, templates, i18n) {

    'use strict';

    var TestInterpretation = Backbone.View.extend({

        //Set ClassName
        className: 'item',

        //Set Element Attributes
        attributes: {
            'role': 'interpretation'
        },

        // Set the template.
        template: templates.testinterpretation,

        //Events
        events: {
            'click #demoBtn': 'clickDemoButton',
            'click #stopBtn': 'clickStopButton',
            'click .selectable': 'selectWord'
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

        //Demo Button Click Event
        clickDemoButton: function () {
            var self = this;

            //Hide Buttons
            $('#demoBtn[role="'+self.questionNumber+'"]').parent().hide();

            //Show Stop Button
            $('#stopBtn[role="'+self.questionNumber+'"]').parent().show();

            //Display/Start Player
            $('#audioPlayer[role="'+self.questionNumber+'"]')
                .attr('src', self.demourl)
                .show()
                [0].play();

        },

        //Demo Stop Button Click Event
        clickStopButton: function () {
            var self = this;

            //Pause Audio
            $('#audioPlayer[role="'+self.questionNumber+'"]')
                .hide()
                [0].pause();

            //Show Buttons
            $('#demoBtn[role="'+self.questionNumber+'"]').parent().show();

            //Hide Stop Button
            $('#stopBtn[role="'+self.questionNumber+'"]').parent().hide();

        },

        //Toggle Selected Word
        selectWord: function (e) {
            $(e.target).toggleClass('badge test-select');
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

            //Set Demo File
            var demo = this.model.attributes._attachments['voice.mp3'].data;

            //Prepare Text For Marking
            var $words = self.model.attributes.content.text;
            // $words = $words.replace(/(\r\n|\n|\r)/gm, '<br>').replace(/\s+/g, ' ').split(' ');
            $words = $words.replace(/\s+/g, ' ').split(' ');

            //Replace String With Selectable Span
            var $result = [];

            for (var i in $words) {

                if ($words[i] === '<br>') {

                    $result.push('<br>');
                }
                else {

                    $result.push('<span id=\'sid' + i + '\' class=\'selectable\'>' + $words[i] + '</span>');
                }
            }


            var $data = this.model.toJSON();
            $data.content.text = $result.join(' ');
            $data.questionNumber = self.questionNumber;

            //Start Templating
            this.$el.html(this.template($data));

            //Get Audio Path
            audio.saveAudioFile(demo, 'voice' + self.questionNumber, function (url) {
                self.demourl = url;
            }, function (err) {
                notification.alert('Something Went Rong: ' + err, 'Error', 'Ok');
            });

            //Translate Page
            self.internationalization();

            return this;
        }
    });

    return TestInterpretation;
});
