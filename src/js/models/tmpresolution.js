define(['underscore', 'backbone', 'pouch', 'backbonedb', 'dbsync'], function (_, Backbone, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var Resolutions = Backbone.Model.extend({

        idAttribute: '_id',

        sync: BackbonePouch.sync({
            db: dbSync.getTmpResolutions(),
            options: {
                get: {
                    'attachments': true,
                    'binary': true
                }
            }
        }),

        defaults: {
            resolutionDate: new Date(),
            studentID: null,
            profID: null,
            note: -1,
            type: null,
            questionID: null,
            testID: null,
            answer: null,
            subject: null
        }

    });

    return Resolutions;
});