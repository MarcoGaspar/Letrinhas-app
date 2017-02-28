define([
    'underscore',
    'backbone',
    'adapters/notification',
    'templates',
    'dbsync',
    'i18next',
    'highcharts',
    'highchartTable'
], function (_, Backbone, notification, templates, dbSync, i18n) {

    'use strict';

    // Home view.
    // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
    var Statistics = Backbone.View.extend({

        // Set the template.
        template: templates.statistics,

        events: {
            'click .navbar-brand': 'togglesidebar',
            'click .sync': 'sync'
        },

        //Toggle SideBar
        togglesidebar: function (e) {
            e.preventDefault();
            $('#wrapper').toggleClass('toggled');
        },

        //I18n
        internationalization: function () {
            i18n.init({// jshint ignore:line
                'lng': localStorage.getItem('lang'),
                'fallbackLng': 'pt'
            }, function () {
                //Translate Document
                $(document).i18n();

                //Render Graphics
                $('.highchart').highchartTable();

            });
        },

        //Resync Database
        sync: function (e) {
            e.preventDefault();
            var self = this;

            dbSync.studentSync(self.account).done(function() {
                $('.loader').remove();

            });

        },

        //Class Initializer
        initialize: function () {

            //Check for Collection
            if (!this.collection) {
                throw new Error('model is required');
            }

            //Set Account
            this.account = this.collection[0].toJSON();

            //Set Categories
            this.categories = this.collection[1];

            //Set Collection
            this.collection = this.collection[2];

        },

        //Class Render
        render: function () {

            var self = this;
            var $data = {account: self.account, classGraph: []};

            /**
             * B U I L D   G E N E R A L   S T A T I S T I C S
             * Widgets Containing General Information
             */
                //NOT IMPLEMENTED!

            /**
             * B U I L D   R E A D I N G   G R A P H
             * Graph Containing Reading Info like Accuracy & Fluidity
             */
                //NOT IMPLEMENTED!

            /**
             * B U I L D   S U B J E C T   G R A P H
             * Graph containing all subjects average note
             */
            for (var i in self.categories.models) {

                var $subjectID = self.categories.models[i].attributes._id;
                var $subjectName = self.categories.models[i].attributes.subject;
                var $filteredCollection = self.collection.bySubjectID($subjectID).corrected();

                //Calculate Average
                var $note = 0;

                if ($filteredCollection.length !== 0) {
                    for (var j in $filteredCollection.models) {
                        $note += $filteredCollection.models[j].attributes.note;
                    }
                    $note = $note / $filteredCollection.length;
                }

                if ($note < 0) {
                    $note = 0;
                }

                $data.classGraph.push({
                    subject: $subjectName,
                    note: $note
                });
            }

            // Render the outer container.
            this.$el.html(this.template($data));

            //Translate Page
            self.internationalization();

            return this;
        }
    });

    return Statistics;
});
