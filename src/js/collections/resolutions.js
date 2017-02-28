define(['underscore', 'backbone', 'models/resolution', 'pouch', 'backbonedb', 'dbsync'], function (_, Backbone, Resolution, PouchDB, BackbonePouch, dbSync) {

    'use strict';
    
    var Resolutions = Backbone.Collection.extend({
        model: Resolution,
        sync: BackbonePouch.sync({
            db: dbSync.getResolutions(),
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

        bySubjectID:function(id){
            var filtered = this.filter(function (model) {
                return model.get('subject').startsWith(id);
            });
            return new Resolutions(filtered);
        },

        corrected:function(){
            var filtered = this.filter(function (model) {
                return model.get('note') !== -1;
            });
            return new Resolutions(filtered);
        },

        parse: function (result) {
            return _.pluck(result.rows, 'doc');
        }
    });

    return Resolutions;
});