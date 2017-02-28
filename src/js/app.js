// Startup module.
define(['backbone', 'extensions'], function(Backbone) {

    'use strict';

    // Starts the backbone routing.
    function startHistory() {
        Backbone.history.start();
    }

    return {
        // Add extension methods and start app on device ready.
        start: function(isDevice) {
            // If the app is running in device, run the startup code in the 'deviceready' event else on document ready.

            if (isDevice) {

                document.addEventListener('deviceready', function () {
                      startHistory();

                }, false);

            } else {

                $(startHistory);
            }

        }
    };
});
