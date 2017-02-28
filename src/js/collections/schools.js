define(['underscore', 'backbone', 'models/school', 'pouch', 'backbonedb', 'dbsync'], function (_, Backbone, School, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var Schools = Backbone.Collection.extend({
        model: School,
        sync: BackbonePouch.sync({
            db: dbSync.getSchools(),
            fetch: 'query',
            options: {
                query: {
                    'include_docs': true,
                    'attachments': true,
                    'binary': true,
                    fun: {
                        map: function(doc) {
                            emit(doc.beginDate);    // jshint ignore:line
                        }
                    }
                }
            }
        }),
        parse: function (result) {
            return _.pluck(result.rows, 'doc');
        }
    });

    return Schools;
});