define(['underscore', 'backbone', 'models/teacher', 'pouch', 'backbonedb', 'dbsync'], function (_, Backbone, Teacher, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var Teachers = Backbone.Collection.extend({
        model: Teacher,
        sync: BackbonePouch.sync({
            db: dbSync.getTeachers(),
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

    return Teachers;
});