define([
    'underscore',
    'backbone',
    'templates',
    'adapters/notification'
], function (_, Backbone, templates, notification) {

    'use strict';

    // Home view.
    // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
    var Resolutions = Backbone.View.extend({

        // Set the template.
        template: templates.resolutions,

        events:{
            'click #btnHelp': 'helpModal',
            'click .pull-left': 'sync'
        },

        //Resync Database
        sync: function(e){
            e.preventDefault();
            window.location.reload();
        },

        //Displays Help
        helpModal: function(e){
            e.preventDefault();
            notification.alert('Escolha uma resolução para corrigir.', 'Ajuda:', 'Ok');
        },


        //Class Initializer
        initialize: function () {

            if(!this.collection) {
                throw new Error('collection is required');
            }

            //Revamp Collections
            this.students = this.collection[1];     //Set Students Collection
            this.questions = this.collection[2];    //Set Questions Collection
            this.collection = this.collection[0];   //Set Original Resolution Collection

            //Set URL
            this.url = Backbone.history.getFragment().split('/');

        },

        //Class Render
        render: function () {

            var self = this;

            var $data = {url: this.url, resolutions: []};

            //Parse Resolution Data
            for(var i in this.collection.models){
                var $model = this.collection.models[i].toJSON();

                //Search Student Info
                var $student = self.students.where({_id: $model.studentID})[0].toJSON();
                $model.student = {name: $student.name, b64: $student.b64};

                //Search Question Info
                var $question = self.questions.where({_id: $model.questionID})[0].toJSON();
                $model.question = {title: $question.title};

                //Add Model To Data
                $data.resolutions.push($model);
            }

            // Render the outer container.
            this.$el.html(this.template($data));
            return this;

        }
    });

    return Resolutions;
});