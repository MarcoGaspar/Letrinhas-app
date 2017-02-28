define([
    'underscore',
    'backbone',
    'templates',
    'adapters/notification'
], function (_, Backbone, templates, notification) {

    'use strict';

    // Home view.
    // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
    var Results = Backbone.View.extend({

        // Set the template.
        template: templates.resultlist,

        events: {
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
            notification.alert('Escolha uma pergunta para verificar os resultados.', 'Ajuda:', 'Ok');
        },


        //Class Initializer
        initialize: function () {

            if (!this.collection) {
                throw new Error('collection is required');
            }

            //Set URL
            this.url = Backbone.history.getFragment().split('/');

        },

        //Class Render
        render: function () {

            var self = this;

            var $data = {url: self.url, results: []};

            for (var i in self.collection.models) {
                $data.results.push(self.collection.models[i].toJSON());
            }

            // Render the outer container.
            this.$el.html(this.template($data));
            return this;

        }
    });

    return Results;
});