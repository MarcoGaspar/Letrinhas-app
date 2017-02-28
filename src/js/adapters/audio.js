// Notification module.
// A wrapper to the cordova notification plugin.
// Contains methods to alert, vibrate, beep etc.
define([], function () {

    'use strict';

    return {

        saveAudioFile: function (data, filename, success, fail) {

            window.requestFileSystem(window.LocalFileSystem.TEMPORARY, data.size || 0, function(){

                window.resolveLocalFileSystemURL('file:///sdcard/', function(dir) {    // jshint ignore:line

                    dir.getFile(filename, {create:true, exclusive: false}, function(file) {

                        file.createWriter(function(fileWriter) {    // jshint ignore:line

                            fileWriter.onwriteend = function() {
                                success('file:///sdcard/'+filename);
                            };

                            fileWriter.onerror = function(err){
                                fail(err);
                            };

                            fileWriter.write(data);

                        }, fail);

                    });
                });

            }, fail);

        },


    delFile: function (filename) {

      window.resolveLocalFileSystemURL('file:///sdcard/', function (dir) {// jshint ignore:line

          dir.getFile(filename, {create: false}, function (fileEntry) {// jshint ignore:line
              fileEntry.remove(function (file) {// jshint ignore:line
                  //alert("fichier supprimer");
              }, function (error) {// jshint ignore:line
                  //alert("erreur suppression " + error.code);
              }, function () {
                  //alert("fichier n'existe pas");
              });
          });


      });

  }



    };
});
