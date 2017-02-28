define([
    'underscore',
    'backbone',
    'blob',
    'adapters/notification',
    'adapters/audio',
    'adapters/media',
    'templates',
    'i18next'
], function (_, Backbone, blobUtil, notification, audio, media, templates, i18n) {

    'use strict';

    // Home view.
    // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
    var TestList = Backbone.View.extend({

        //Set ClassName
        className: 'item',

        //Set Element Attributes
        attributes: {
            'role': 'list'
        },

        // Set the template.
        template: templates.testlist,

        //Events
        events: {
            'click #demoBtn': 'clickDemoButton',
            'click #stopBtn': 'clickStopButton',
            'click #recordBtn': 'clickRecordButton',
            'click #stopRecordBtn': 'clickStopRecordButton',
            'click #playMyTestBtn': 'clickPlayRecordingButton',
            'click #stopRecordingBtn': 'clickStopRecordingButton'
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
            $('#demoBtn[role="' + self.questionNumber + '"]').parent().hide();
            $('#recordBtn[role="' + self.questionNumber + '"]').parent().hide();

            if (self.record === 0) {
                $('#playMyTestBtn[role="' + self.questionNumber + '"]').parent().hide();
            }

            //Show Stop Button
            $('#stopBtn[role="' + self.questionNumber + '"]').parent().show();

            //Display/Start Player
            $('#audioPlayer[role="' + self.questionNumber + '"]')
                .attr('src', self.demourl)
                .show()
                [0].play();

        },

        //Demo Button Click Event
        clickStopButton: function () {
            var self = this;

            //Pause Audio
            $('#audioPlayer[role="'+self.questionNumber+'"]')
                .hide()
                [0].pause();

            //Show Buttons
            $('#demoBtn[role="' + self.questionNumber + '"]').parent().show();
            $('#recordBtn[role="' + self.questionNumber + '"]').parent().show();

            //Hide Stop Button
            $('#stopBtn[role="' + self.questionNumber + '"]').parent().hide();

        },

        //Start Recording
        clickRecordButton: function (e) {
            e.preventDefault();
            var self = this;

            //Revamp Buttons
            $('#demoBtn[role="' + self.questionNumber + '"]').parent().hide();
            $('#recordBtn[role="' + self.questionNumber + '"]').parent().hide();
            $('#playMyTestBtn[role="' + self.questionNumber + '"]').parent().hide();
            $('#stopRecordBtn[role="' + self.questionNumber + '"]').parent().show();
            console.log();
            //Recording Flag
            $('#isRecording').attr('role', 'true');
            var soundfile = self.audioName+'_'+self.questionNumber+'.m4a';
            if(self.record===1){
                audio.delFile(self.audioName+'_'+self.questionNumber+'.m4a');
            }
            //Start Media Recording
            media.createMedia(soundfile);
            media.startRecord();
        },

        //Stop Recording
        clickStopRecordButton: function (e) {
            e.preventDefault();
            var self = this;

            //Revamp Buttons
            $('#demoBtn[role="' + self.questionNumber + '"]').parent().show();
            $('#recordBtn[role="' + self.questionNumber + '"]').parent().show();
            $('#playMyTestBtn[role="' + self.questionNumber + '"]').parent().show();
            $('#stopRecordBtn[role="' + self.questionNumber + '"]').parent().hide();

            //Recording Flag
            $('#isRecording').attr('role', 'false');
            $('.record' + self.questionNumber).attr('role', 'true');
            self.record = 1;

            //Stop Media Recording
            media.stopRecord();
        },

        //Listen to Recording
        clickPlayRecordingButton: function (e) {
            e.preventDefault();
            var self = this;

            //Revamp Buttons
            $('#demoBtn[role="' + self.questionNumber + '"]').parent().hide();
            $('#recordBtn[role="' + self.questionNumber + '"]').parent().hide();
            $('#playMyTestBtn[role="' + self.questionNumber + '"]').parent().hide();
            $('#stopRecordingBtn[role="' + self.questionNumber + '"]').parent().show();

            //Play Recording

            var soundfile = self.audioName+'_'+self.questionNumber+'.m4a';
            $('#audioPlayer[role="' + self.questionNumber + '"]')
                .attr('src', 'file:///sdcard/'+soundfile)
                .show()
                [0].play();
        },

        //Stop Listen To Recording
        clickStopRecordingButton: function (e) {
            e.preventDefault();
            var self = this;

            //Pause Audio
            $('#audioPlayer[role="' + self.questionNumber + '"]')
                .hide()
                [0].pause();

            //Show Buttons
            $('#demoBtn[role="' + self.questionNumber + '"]').parent().show();
            $('#recordBtn[role="' + self.questionNumber + '"]').parent().show();
            $('#playMyTestBtn[role="' + self.questionNumber + '"]').parent().show();

            //Hide Stop Button
            $('#stopRecordingBtn[role="' + self.questionNumber + '"]').parent().hide();
        },


        //Class Initializer
        initialize: function () {

            if (!this.model) {
                throw new Error('collection is required');
            }

            //Set Question Number
              console.log(this.model);
            this.questionNumber = this.model[0];

            //Set Model
            this.model = this.model[1];





        },

        //Class Render
        render: function () {
            var self = this;

            //Set Demo File
            var demo = this.model.attributes._attachments['voice.mp3'].data;

            //Record Flag
            self.record = 0;

            //Set Template Data
            var $data = this.model.toJSON();
            $data.questionNumber = self.questionNumber;

            this.audioName = sessionStorage.getItem('user')+this.model.attributes._id;

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

    return TestList;
})
;
