define(['underscore', 'backbone', 'models/question', 'pouch', 'backbonedb', 'dbsync'], function (_, Backbone, Question, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var Questions = Backbone.Collection.extend({
        model: Question,
        sync: BackbonePouch.sync({
            db: dbSync.getQuestions(),
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

    return Questions;
});