define(['underscore', 'backbone', 'models/testtype', 'pouch', 'backbonedb', 'dbsync'], function (_, Backbone, TestType, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var TestTypes = Backbone.Collection.extend({
        model: TestType,
        sync: BackbonePouch.sync({
            db: dbSync.getTestTypes(),
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

    return TestTypes;
});