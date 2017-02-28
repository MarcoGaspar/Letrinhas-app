define([
    'underscore',
    'jquery',
    'backbone',
    'templates',
    'highcharts',
    'highchartTable'
], function (_, $, Backbone, templates) {

    'use strict';

    // Home view.
    // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
    var Results = Backbone.View.extend({

        // Set the template.
        template: templates.result,

        events: {
            'click .pull-left': 'sync'
        },

        //Resync Database
        sync: function(e){
            e.preventDefault();
            window.location.reload();
        },


        //Class Initializer
        initialize: function () {

            if (!this.model) {
                throw new Error('model is required');
            }

            if (!this.collection) {
                throw new Error('collection is required');
            }

            //Set URL
            this.url = Backbone.history.getFragment().split('/');

        },

        //Class Render
        render: function () {

            var self = this;

            var $data = {url: self.url, results: [], fluidity: 1, accuracy: 1};

            for(var i in self.collection.models){
                var $model = self.collection.models[i].toJSON();
                $model.resolutionDate = new Date($model.resolutionDate).toLocaleDateString() + ' - ' + new Date($model.resolutionDate).toLocaleTimeString();

                $data.results.push($model);
            }

            if(self.collection.models[0].attributes.type === 'multimedia'){
                $data.fluidity = 0;
                $data.accuracy = 0;
            }

            // Render the outer container.
            this.$el.html(this.template($data));

            $('.highchart').highchartTable();
            $('.inner').prepend('' +
                '<div class="panel panel-default" style="margin:20px 35px; text-align:center;"> ' +
                '<div class="panel-body">' +
                    'Estatísticas: '+ self.model.attributes.title +' ' +
                '</div></div>'
            );

            return this;

        }
    });

    return Results;
});