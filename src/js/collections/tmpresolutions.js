define(['underscore', 'backbone', 'models/tmpresolution', 'pouch', 'backbonedb', 'dbsync'], function (_, Backbone, Resolution, PouchDB, BackbonePouch, dbSync) {

    'use strict';
    
    var Resolutions = Backbone.Collection.extend({
        model: Resolution,
        sync: BackbonePouch.sync({
            db: dbSync.getTmpResolutions(),
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

    return Resolutions;
});