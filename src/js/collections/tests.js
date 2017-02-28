define(['underscore', 'backbone', 'models/test', 'pouch', 'backbonedb', 'dbsync'], function (_, Backbone, Test, PouchDB, BackbonePouch, dbSync) {

    'use strict';

    var Tests = Backbone.Collection.extend({
        model: Test,
        sync: BackbonePouch.sync({
            db: dbSync.getTests(),
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

        byStudent:function(studentID){
            var filtered = this.filter(function (model) {
                return model.get('studentID') === studentID;
            });
            return new Tests(filtered);
        },

        corrected:function(){
            var filtered = this.filter(function (model) {
                return model.get('solved') === true;
            });
            return new Tests(filtered);
        },

        unsolved:function(){
            var filtered = this.filter(function (model) {
                return model.get('solved') === false;
            });
            return new Tests(filtered);
        },

        parse: function (result) {
            return _.pluck(result.rows, 'doc');
        }
    });

    return Tests;
});