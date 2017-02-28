define(['underscore', 'backbone', 'models/student', 'pouch', 'backbonedb', 'dbsync'], function (_, Backbone, Student, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var Students = Backbone.Collection.extend({
        model: Student,
        sync: BackbonePouch.sync({
            db: dbSync.getStudents(),
            fetch: 'query',
            options: {
                query: {
                    'include_docs': true,
                    'attachments': true,
                    'binary': true,
                    fun: {
                        map: function(doc) {
                            emit(doc._id);  // jshint ignore:line
                        }
                    }
                }
            }
        }),
        parse: function (result) {
            return _.pluck(result.rows, 'doc');
        }
    });

    return Students;
});