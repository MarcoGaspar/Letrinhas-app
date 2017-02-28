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
    var TestWhiteSpaces = Backbone.View.extend({

        //Set ClassName
        className: 'item',

        //Set Element Attributes
        attributes: {
            'role': 'whitespaces'
        },

        // Set the template.
        template: templates.testwhitespaces,

        //Events
        events: {
            'click .blackSpaceSelectable': 'selectSolutionWord'
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

        //Select Solution Word
        selectSolutionWord: function(e){
            e.preventDefault();
            var $el = $(e.currentTarget);

            //Change Word
            $el.parent().parent().find('button').html($el.find('a').html() + '&nbsp;&nbsp;<span class="caret"></span>');

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

            //Model
            var $model = this.model.toJSON();

            //Set model solutions
            $model.solutions = [];
            $model.questionNumber = self.questionNumber;

            //Replace Text
            var $wordsList = ($model.content.text)
                // .replace(/(\r\n|\n|\r)/gm, '<br>')
                .replace(/\,/gi, ' ,')
                .replace(/\-/gi, '- ')
                .replace(/\:/gi, ' :')
                .replace(/\./gi, ' .')
                .replace(/\!/gi, ' !')
                .replace(/\?/gi, ' ?')
                .replace(/\./gi, ' .')
                .split(' ');


            //Put Tests on Div's
            for(var i in $wordsList){
                $wordsList[i] = '<div class="whiteSpaceWord" role="'+i+'">'+$wordsList[i]+'</div>';
            }

            // Replace Ids to span boxes
            for(i in $model.content.sid){
                //Add Word to Model
                $model.solutions.push($model.content.sid[i].text);

                for(var j in $model.content.sid[i].sids){
                    // $wordsList[$model.content.sid[i].sids[j]] = '<span class=\'test\' style=\'border:2px solid #000; color: #fff; padding: 0 13px\'>#</span>';
                    $wordsList[$model.content.sid[i].sids[j]] = '<div style="float:left; margin:0 3px;" class="btn-group blankSpace" role="'+$model.content.sid[i].sids[j]+'"></div>';
                }
            }

            //Replace Model Text
            $model.content.text = $wordsList.join(' ');

            //Start Templating
            this.$el.html(this.template($model));

            //Translate Page
            self.internationalization();

            return this;
        }

    });

    return TestWhiteSpaces;
})
;