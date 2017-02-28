define(['backbone', 'pouch', 'backbonedb', 'dbsync'], function (Backbone, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var School = Backbone.Model.extend({

        idAttribute: '_id',

        sync: BackbonePouch.sync({
            db: dbSync.getSchools(),
            options: {
                get: {
                    'attachments': true,
                    'binary': true
                }
            }
        }),

        defaults: {
            name: null,
            classes: null,
            address: null,
            b64: null
        }

    });

    return School;
});