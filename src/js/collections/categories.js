define(['underscore', 'backbone', 'models/category', 'pouch', 'backbonedb', 'dbsync'], function (_, Backbone, Category, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var Categories = Backbone.Collection.extend({
        model: Category,
        sync: BackbonePouch.sync({
            db: dbSync.getCategories(),
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

    return Categories;
});