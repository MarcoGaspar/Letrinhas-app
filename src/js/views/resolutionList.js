define([
    'underscore',
    'backbone',
    'adapters/notification',
    'adapters/audio',
    'templates'
], function (_, Backbone, notification, audio, templates) {

    'use strict';

    // Home view.
    // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
    var ResolutionList = Backbone.View.extend({

        // Set the template.
        template: templates.resolutionlist,

        events:{
            'click .btOpt': 'optionPopUpClick',
            'click #btnConfirm': 'confirmCorrection',
            'click #btnSubmit': 'beforeSend',
            'click .pull-left': 'sync'
        },

        //Resync Database
        sync: function(e){
            e.preventDefault();
            window.location.reload();
        },

        //Hide All PopOvers
        hidePopOver: function(){
            $('#testArea').find('.selectable').each(function () {
                $(this).popover('hide');
            });
        },

        //Popover Option1 Click
        optionPopUpClick: function(e){
            var self = this;
            e.stopPropagation();
            e.preventDefault();

            //Hide All PopOvers
            this.hidePopOver();

            //Gether Info
            var $element = $(e.currentTarget);
            var $role = $element.parent().attr('class');
            var $name = $element.attr('name');
            var $location = $('#divPopOverOp').attr('class');
            var $word = $('#' + $location).html();

            //Hightlight Word
            $('#' + $location).css('color', 'red');

            //Increase Counter
            $('#wrongWords').html(parseInt($('#wrongWords').html())+1);

            //Build Corrections
            self.corrections[$location] = {
                word: $word,
                category: $role,
                error: $name
            };

            console.log(self.corrections);

        },

        //Submit Request
        beforeSend: function(e){
            var self = this;
            e.preventDefault();

            //Modify Model Answer Structure
            var $answer = self.model.attributes.answer;
            $answer.corrections = [];

            //Correction Date
            $answer.correctionDate = new Date();

            //Fill Model Corrections
            for(var i in self.corrections){
                $answer.corrections.push(self.corrections[i]);
            }
            self.model.set({'answer': $answer});

            /**
             * Calculate Notes
             */
            var $tw = $answer.totalWords;
            var $ww = parseInt($('#wrongWords').html());
            var $note = Math.round(($tw-$ww)*100/$tw);
            self.model.set('note', $note);

            //Calculate Fluidity and Accuracy
            var $fluidityErrors = 0;
            var $accuracyErrors = 0;

            for (i in $answer.corrections){
                if($answer.corrections[i].category === 'fluidity'){
                    $fluidityErrors++;
                }
                else{
                    $accuracyErrors++;
                }
            }
            // <-- end of note calculation -->


            //Set Fluidity
            $answer.fluidity = ((($tw - $fluidityErrors) * 100) / $tw).toFixed(2);

            //Set Accuracy
            $answer.accuracy = ((($tw - $accuracyErrors) * 100) / $tw).toFixed(2);


            //Save Model
            self.model.save();

            //Redirect
            Backbone.history.navigate('#', true);

        },

        //Redirect Confirmation
        confirmCorrection: function(e){
            e.preventDefault();
            $('#confirmationModal').modal('show');
        },

        //Class Initializer
        initialize: function () {

            if (!this.model) {
                throw new Error('model is required');
            }

            this.question = this.model[1];
            this.model = this.model[0];

            //Set URL
            this.url = Backbone.history.getFragment().split('/');

        },

        //Class Render
        render: function () {

            var self = this;

            //Build Correction Array
            this.corrections = {};

            // Render the outer container.
            this.$el.html(this.template(this.question.toJSON()));

            //Attach Popover to Words
            $('#testArea').find('.selectable').each(function () {
                var $elem = $(this);
                $elem.popover({
                    container: '#testArea',
                    trigger: 'click',
                    placement: 'top',
                    html: true,
                    content: function() {
                        return $('#divPopOverOp').attr('class', $elem.attr('id')).html();
                    }
                });
            });

            /**
             * BUILD AUDIO
             */
            // Student Audio
            audio.saveAudioFile(self.model.attributes._attachments['record.mp3'].data, 'record.mp3', function (url) {
                //Add src to player
                $('#audioPlayerStudent').attr('src', url);

                //Teacher Audio
                audio.saveAudioFile(self.question.attributes._attachments['voice.mp3'].data, 'voice.mp3', function (url) {
                    //Add src to player
                    $('#audioPlayerTeacher').attr('src', url);

                    //Remove Loading
                    $('.loader2').remove();
                }, function (err) {
                    notification.alert('Something Went Rong: ' + err, 'Error', 'Ok');
                });

            }, function (err) {
                notification.alert('Something Went Rong: ' + err, 'Error', 'Ok');
            });
            

            return this;

        }

    });

    return ResolutionList;
});