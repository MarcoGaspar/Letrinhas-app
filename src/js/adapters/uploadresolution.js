define(['jquery', 'backbone', 'adapters/notification', 'models/tmpresolution'], function ($, Backbone, notification, Resolution) {

    'use strict';

    var $el, $limit, $model, $tmpresolutions, getFileBlob;
    var $index = 0;
    var $resolutions = [];

    return {

        startUpload: function ($el_, $limit_, $model_, $tmpresolutions_) {

            //Define Variables
            $el = $el_;
            $limit = $limit_;
            $model = $model_;
            $tmpresolutions = $tmpresolutions_;

            //Refresh Variables
            $index = 0;
            $resolutions = [];

            //Stat Upload Process
            this.uploadProcess();
        },

        uploadProcess: function () {

            var self = this;

            self.uploadResolution()
                .done(function () {

                    //Increment Index
                    $index++;

                    if ($index === $limit) {
                        if ($resolutions.length === $limit) {
                            //Remove Latest Resolution From Test
                            var $resolutionsToRemove = $tmpresolutions.where({testID: $resolutions[0].attributes.testID});
                            for (var i in $resolutionsToRemove) {
                                $resolutionsToRemove[i].destroy();
                            }

                            //Upload New Local Resolutions
                            for (var j in $resolutions) {
                                $resolutions[j].save();
                            }

                            //Redirect
                            Backbone.history.navigate('#home', true);
                        }
                        else {
                            $('.loader').remove();
                            notification.alert('Existem perguntas que não foram respondidas!');
                        }
                    }
                    else {
                        //Upload Next
                        self.uploadProcess();
                    }
                });

        },

        uploadResolution: function () {

            var deferred = $.Deferred();

            var self = this;

            //Get Question Type
            switch ($el[$index].attr('role')) {
                case 'multimedia':
                    //Answer ID
                    var $role = $el[$index].find('.btn-block.active').attr('role');

                    //Check for Solution
                    if ($role) {
                        //Push Resolution
                        $resolutions.push(
                            new Resolution({
                                _id: 'T' + $model.attributes._id + $model.attributes.questions[$index]._id,
                                profID: $model.attributes.profID,
                                testID: $model.attributes._id,
                                questionID: $model.attributes.questions[$index]._id,
                                subject: $model.attributes.subject,
                                type: 'multimedia',
                                answer: {
                                    solution: $role
                                }
                            })
                        );
                    }

                    //Send Response
                    deferred.resolve();

                    break;

                case 'interpretation':
                    //Solution Index's
                    var $solutionsPos = [];

                    //Get Solution Index's
                    $el[$index].find('#testArea').find('.badge').each(function () {
                        $solutionsPos.push((this.id).substring(3));
                    });

                    //Check if any solution's present
                    if ($solutionsPos.length !== 0) {
                        //Push Resolution
                        $resolutions.push(
                            new Resolution({
                                _id: 'T' + $model.attributes._id + $model.attributes.questions[$index]._id,
                                profID: $model.attributes.profID,
                                testID: $model.attributes._id,
                                questionID: $model.attributes.questions[$index]._id,
                                subject: $model.attributes.subject,
                                type: 'interpretation',
                                answer: {
                                    solution: $solutionsPos
                                }
                            })
                        );

                    }

                    //Send Response
                    deferred.resolve();

                    break;

                case 'boxes':
                    //Check If List Completed
                    if ($el[$index].find('#sortableMain').find('li').length === 0) {

                        var $wordsLeft = {
                            _id: $el[$index].find('#sortableLeftTitle').attr('role'),
                            words: []
                        };

                        var $wordsRight = {
                            _id: $el[$index].find('#sortableRightTitle').attr('role'),
                            words: []
                        };

                        //Words On Left Box
                        $el[$index].find('#sortableLeft').find('li').each(function () {
                            $wordsLeft.words.push($(this).html());
                        });

                        //Words On Left Box
                        $el[$index].find('#sortableRight').find('li').each(function () {
                            $wordsRight.words.push($(this).html());
                        });

                        $resolutions.push(
                            new Resolution({
                                _id: 'T' + $model.attributes._id + $model.attributes.questions[$index]._id,
                                profID: $model.attributes.profID,
                                testID: $model.attributes._id,
                                questionID: $model.attributes.questions[$index]._id,
                                subject: $model.attributes.subject,
                                type: 'boxes',
                                answer: {
                                    boxes:[
                                        {
                                            _id: $wordsLeft._id,
                                            words: $wordsLeft.words
                                        },
                                        {
                                            _id: $wordsRight._id,
                                            words: $wordsRight.words
                                        }
                                    ]
                                }
                            })
                        );
                    }

                    //Send Response
                    deferred.resolve();

                    break;

                case 'whitespaces':
                    //Find BlankSpaces
                    var $solution = [];

                    $el[$index].find('.blankSpace').each(function(){
                        var bs = $(this);
                        var role = bs.attr('role');
                        var answer = bs.find('button').text();
                        if(!answer.startsWith('____')){

                            answer = answer.substring(0, answer.length-2);
                            var flag = false;
                            for(var i in $solution){
                                if($solution[i].text === answer){
                                    $solution[i].sid.push(role);
                                    flag = true;
                                    break;
                                }
                            }

                            if(flag === false){
                                $solution.push({
                                    text: answer,
                                    sid: [role]
                                });
                            }

                        }
                    });

                    $resolutions.push(
                        new Resolution({
                            _id: 'T' + $model.attributes._id + $model.attributes.questions[$index]._id,
                            profID: $model.attributes.profID,
                            testID: $model.attributes._id,
                            questionID: $model.attributes.questions[$index]._id,
                            subject: $model.attributes.subject,
                            type: 'whitespaces',
                            answer: {
                                whitespaces: $solution
                            }
                        })
                    );

                    //Send Response
                    deferred.resolve();

                    break;

                case 'text':

                    //Get File Blob
                    var questid = $model.attributes.questions[$index]._id;

                    getFileBlob = self.getAudioFile($index , questid);    // jshint ignore:line

                    //Once Promise Returns
                    getFileBlob
                        .done(function (data) {
                            if ($('.record' + $index).attr('role') === 'true') {
                                notification.alert(data);
                                //Push Resolution
                                $resolutions.push(
                                    new Resolution({
                                        _id: 'T' + $model.attributes._id + $model.attributes.questions[$index]._id,
                                        profID: $model.attributes.profID,
                                        testID: $model.attributes._id,
                                        questionID: $model.attributes.questions[$index]._id,
                                        subject: $model.attributes.subject,
                                        type: 'text',
                                        studentAudio: data,
                                        answer: {}
                                    })
                                );
                            }

                            //Send Response
                            deferred.resolve();

                        })
                        .fail(function () {
                            //Send Response
                            notification.alert('texto');
                            deferred.resolve();
                        });

                    break;

                case 'list':
                    //Get File Blob
                    var questid = $model.attributes.questions[$index]._id;
                    getFileBlob = self.getAudioFile($index, questid);    // jshint ignore:line

                    //Once Promise Returns
                    getFileBlob
                        .done(function (data) {

                            if ($('.record' + $index).attr('role') === 'true') {
                                //Push Resolution
                                $resolutions.push(
                                    new Resolution({
                                        _id: 'T' + $model.attributes._id + $model.attributes.questions[$index]._id,
                                        profID: $model.attributes.profID,
                                        testID: $model.attributes._id,
                                        questionID: $model.attributes.questions[$index]._id,
                                        subject: $model.attributes.subject,
                                        type: 'list',
                                        answer: {},
                                        studentAudio : data
                                    })
                                );
                            }
                            //Send Response
                            deferred.resolve();
                        })
                        .fail(function () {
                            //Send Response
                              notification.alert('lista');
                            deferred.resolve();
                        });

                    break;
            }

            return deferred.promise();

        },

        getAudioFile: function (index, questionID) {

            var deferred = $.Deferred();
            //console.log(index);
            //console.log('file:///sdcard/'+sessionStorage.getItem('user')+''+ id + index + '.m4a');
            var student = sessionStorage.getItem('user');
            console.log(student);
            window.resolveLocalFileSystemURL('file:///sdcard/'+student+''+questionID +'_'+ index + '.m4a',
                function (fileEntry) {
                    fileEntry.file(
                        function (file) {

                            var reader = new FileReader();

                            reader.onload = function (readerEvt) {
                                var binaryString = readerEvt.target.result;
                                binaryString = btoa(binaryString);

                                //Return Completed Promise

                                deferred.resolve(binaryString);
                            };
                            reader.readAsBinaryString(file);


                        },
                        function (e) {

                            deferred.reject('Error: ' + e);
                        }
                    );
                },
                function (e) {

                    deferred.reject('Error: ' + e);
                }
            );

            return deferred.promise();

        }

    };
});
