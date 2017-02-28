// Notification module.
// A wrapper to the cordova notification plugin.
// Contains methods to alert, vibrate, beep etc.
define(['adapters/notification'], function (notification) {

    'use strict';

    var media;

    var options = {
        SampleRate: 16000,
        NumberOfChannels: 1
    };

    return {

        createMedia: function (src) {

           media = new Media(src,   // jshint ignore:line
               // success callback
               function() {
                   // media.startRecordWithCompression(options);
               },
               // error callback
               function(err) {
                   notification.alert(err, 'Erro!', 'ok');
               }
           );

        },

        startRecord: function(){
            media.startRecordWithCompression(options);
        },

        stopRecord: function(){
            media.stopRecord();     // jshint ignore:line
            media.release();        // jshint ignore:line
        }
    };
});
