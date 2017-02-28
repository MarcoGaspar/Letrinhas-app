define([
    'jquery',
    'underscore',
    'backbone',
    'adapters/notification',
    'collections/tests',
    'templates',
    'helpers',
    'dbsync'
], function($, _, Backbone, notification, Tests, templates, help, dbSync) { // jshint ignore:line

    'use strict';

    var Chronology = Backbone.View.extend({

        // Set the template.
        template: templates.chronology,

        //Class Initializer
        initialize: function() {

            //Check for Collection
            if (!this.collection) {
                throw new Error('model is required');
            }

            //Set Account
            this.account = this.collection[0];

            //Set Teachers
            this.teachers = this.collection[1];

            //Set Categories
            this.categories = this.collection[2];

            //Set Tests Collection
            this.collection = this.collection[3];
        

        },

        //Class Render
        render: function() {

            var self = this;

            var $data = {
                timeline: []
            };

            var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];



            //TimeLine Indicators
            var $timeIndex = 0;
            var $times = {};



            //Fetch Tests
            for (var i in self.collection.models) {

                var $model = self.collection.models[i].toJSON();


                //Format Variables
                var $beginDate = new Date(parseInt($model.beginDate));
                var $endDate = new Date(parseInt($model.endDate));
                var $teacher = self.teachers.where({
                    _id: $model.profID
                })[0].toJSON();
                var $subject = $model.subject.split(':');

                //Replace Values
                $model.teacher = $teacher.name;
                $model.subject = self.categories.where({
                    _id: $subject[0]
                })[0].toJSON().subject;
                $model.endDate = $endDate.getDate() + ' ' + monthNames[$endDate.getMonth()] + ' ' + $endDate.getFullYear();
                $model.hour = $beginDate.getHours() + ':' + $beginDate.getMinutes();

                //$model.beginDate = beginDate.getDate() + '  ' + monthNames[beginDate.getMonth() - 1] + '  ' + beginDate.getFullYear();

                //Set Timeline Array
                //var $orderTime = "" + $beginDate.getFullYear() + $beginDate.getMonth() + $beginDate.getDate();
                var $orderTime = $beginDate.getDate() + ' ' + monthNames[$beginDate.getMonth()] + ' ' + $beginDate.getFullYear();

                if ($times[$orderTime]) {
                    var $index = $times[$orderTime].index;
                    $data.timeline[$index].tests.push($model);
                } else {
                    $times[$orderTime] = {
                        index: $timeIndex
                    };
                    $data.timeline.push({
                        date: $orderTime,
                        tests: [$model]
                    });
                }
            }

            // Render the outer container.
            this.$el.html(this.template($data));

            return this;

            // //Fetch Tests
            // new Tests().fetch({
            //     success: function (testCollection) {
            //         self.collection = testCollection.byStudent(self.model._id).corrected();
            //
            //         var $data = {timeline: []};
            //
            //         var monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            //
            //         //TimeLine Indicators
            //         var $timeIndex = 0;
            //         var $times = {};
            //
            //         //Fetch Tests
            //         for (var i in self.collection.models) {
            //             var $model = self.collection.models[i].toJSON();
            //
            //             //Format Variables
            //             var $beginDate = new Date(parseInt($model.beginDate));
            //             var $endDate = new Date(parseInt($model.endDate));
            //             var $teacher = this.teachers.where({_id: $model.profID})[0].toJSON();
            //             var $subject = $model.subject.split(':');
            //
            //             //Replace Values
            //             $model.teacher = $teacher.name;
            //             $model.subject = this.categories.where({_id: $subject[0]})[0].toJSON().subject;
            //             $model.endDate = $endDate.getDate() + ' ' + monthNames[$endDate.getMonth()] + ' ' + $endDate.getFullYear();
            //             $model.hour = $beginDate.getHours() + ':' + $beginDate.getMinutes();
            //
            //             //$model.beginDate = beginDate.getDate() + '  ' + monthNames[beginDate.getMonth() - 1] + '  ' + beginDate.getFullYear();
            //
            //             //Set Timeline Array
            //             //var $orderTime = "" + $beginDate.getFullYear() + $beginDate.getMonth() + $beginDate.getDate();
            //             var $orderTime = $beginDate.getDate() + ' ' + monthNames[$beginDate.getMonth()] + ' ' + $beginDate.getFullYear();
            //
            //             if ($times[$orderTime]) {
            //                 var $index = $times[$orderTime].index;
            //                 $data.timeline[$index].tests.push($model);
            //             }
            //             else {
            //                 $times[$orderTime] = {index: $timeIndex};
            //                 $data.timeline.push({
            //                     date: $orderTime,
            //                     tests: [$model]
            //                 });
            //             }
            //         }
            //
            //         // Render the outer container.
            //         this.$el.html(this.template($data));
            //         return this;
            //     }
            // });

        }
    });

    return Chronology;
});
