define(['backbone', 'pouch', 'backbonedb', 'dbsync'], function (Backbone, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var Teacher = Backbone.Model.extend({

        idAttribute: '_id',

        sync: BackbonePouch.sync({
            db: dbSync.getTeachers(),
            options: {
                get: {
                    'attachments': true,
                    'binary': true
                }
            }
        }),

        defaults: {
            state: true,
            name: null,
            password: null,
            pin: null,
            phoneNumber: null,
            permissionLevel: null,
            b64: null,
            sex: null
        }

    });

    return Teacher;
});