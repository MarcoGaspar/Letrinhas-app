// Notification module.
// A wrapper to the cordova notification plugin.
// Contains methods to alert, vibrate, beep etc.
define(['blob'], function (blobUtil) {

    'use strict';

    return {

        saveAudioFile: function (data, filename, success, fail) {     // jshint ignore:line

            try{
                var url = blobUtil.createObjectURL(data);
                success(url);
            }
            catch(err){
                fail(err);
            }

        }
    };
});