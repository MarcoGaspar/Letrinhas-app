define(['backbone', 'pouch', 'backbonedb', 'dbsync'], function (Backbone, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var TestType = Backbone.Model.extend({

        idAttribute: '_id',

        sync: BackbonePouch.sync({
            db: dbSync.getTestTypes(),
            options: {
                get: {
                    'attachments': true,
                    'binary': true
                }
            }
        }),

        defaults: {
            description: null,
            value: null
        }

    });

    return TestType;
});