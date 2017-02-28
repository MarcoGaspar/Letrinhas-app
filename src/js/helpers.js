// Startup module.
define(['jquery', 'pouch', 'adapters/notification', 'dbsync'], function($, PouchDB, notification, dbSync ) { // jshint ignore:line

    'use strict';



    return {


       throwAlertSuccess: function(text) {

          window.setTimeout(function() {


              $('.alert').fadeTo(1000, 0).slideUp(500, function() {
                  $(this).remove();
              });

          }, 2500);

          return '<div style="position:absolute; width:100%; z-index:9999;  " class="alert alert-success" role="alert"> <strong>Sincronização: </strong>' + text + '</div>';
      },

       throwAlert: function(text) {

          window.setTimeout(function() {

              $('.alert').fadeTo(1000, 0).slideUp(500, function() {
                  $(this).remove();
              });
          }, 2500);

          return '<div style="position:absolute; width:100%; z-index:9999;background-color:#D50D0D !important " class="alert alert-success" role="alert"> <strong>Sincronização: </strong>' + text + '</div>';
      },



        removeSession: function() {
            notification.loading();
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('keyo');
            sessionStorage.removeItem('sync');
            setTimeout(function() {

                window.location.reload();
            }, 200);
        },

    };

});
