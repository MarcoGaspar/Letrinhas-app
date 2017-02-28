define(['backbone', 'pouch', 'backbonedb', 'dbsync'], function (Backbone, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var Question = Backbone.Model.extend({

        idAttribute: '_id',

        sync: BackbonePouch.sync({
            db: dbSync.getQuestions(),
            options: {
                get: {
                    'attachments': true,
                    'binary': true
                }
            }
        }),

        defaults: {
            content: [],
            creationDate: new Date(),
            description: null,
            profID: atob(sessionStorage.getItem('keyo')).split(':')[0],
            question: null,
            state: true,
            subject: null,
            title: null,
            type: null,
            // schoolYear: null,
            tmp: null

        }

    });

    return Question;
});
