// Serializes javascript object to string and vice-versa.
define([
    'jquery',
    'underscore',
    'adapters/crypto'
], function ($,
             _,
             crypto) {

    'use strict';

    var key = 'SOME_KEY_THAT_WILL_BE_READ_FROM_SESSION_IN_FUTURE';

    return {
        serialize: function (item) {
            var result = JSON.stringify(item);
            return crypto.encrypt(key, result);
        },

        deserialize: function (data) {
            var d = $.Deferred();
            crypto.decrypt(key, data)
                .done(function (result) {
                    d.resolve(JSON.parse(result));
                })
                .fail(d.reject);
            return d.promise();
        }
    };
});