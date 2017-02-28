define([
    'jquery',
    'underscore',
    'backbone',
    'adapters/notification',
    'models/resolution',
    'templates'
], function ($, _, Backbone, notification, Resolution, templates) {

    'use strict';

    var Debug = Backbone.View.extend({

        // Set the template.
        template: templates.debug,

        //Class Initializer
        initialize: function () {

        },

        //Class Render
        render: function () {
            // Render the outer container.
            console.log(this.collection);
            this.$el.html(this.template());
            return this;
        }
    });

    return Debug;
});