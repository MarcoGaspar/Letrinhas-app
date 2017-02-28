define(['backbone', 'pouch', 'backbonedb', 'dbsync'], function (Backbone, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var Test = Backbone.Model.extend({

        idAttribute: '_id',

        sync: BackbonePouch.sync({
            db: dbSync.getTests(),
            options: {
                get: {
                    'attachments': true,
                    'binary': true
                }
            }
        }),

        defaults: {
            beginDate: null,
            endDate: null,
            description: null,
            generic: null,
            genericID: null,
            profID: null,
            questions: null,
            schoolYear: null,
            studentID: null,
            subject: null,
            title: null,
            type: null
        }

    });

    return Test;
});