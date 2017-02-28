// Startup module.
define(['jquery', 'pouch', 'adapters/notification', 'modem', 'helpers'], function($, PouchDB, notification, util, help) {

    'use strict';

    //Local Databases
    var localStudents = new PouchDB('localStudents', {
        revs_limit: 1, // jshint ignore:line
        auto_compaction: true // jshint ignore:line
    });
    var localTests = new PouchDB('localTests', {
        revs_limit: 1, // jshint ignore:line
        auto_compaction: true // jshint ignore:line
    });
    var localQuestions = new PouchDB('localQuestions', {
        revs_limit: 1, // jshint ignore:line
        auto_compaction: true // jshint ignore:line
    });
    var localResolutions = new PouchDB('localResolutions', {
        revs_limit: 1, // jshint ignore:line
        auto_compaction: true // jshint ignore:line
    });
    var localCategories = new PouchDB('localCategories', {
        revs_limit: 1, // jshint ignore:line
        auto_compaction: true // jshint ignore:line
    });
    var localTestTypes = new PouchDB('localTestTypes', {
        revs_limit: 1, // jshint ignore:line
        auto_compaction: true // jshint ignore:line
    });
    var localTeachers = new PouchDB('localTeachers', {
        revs_limit: 1, // jshint ignore:line
        auto_compaction: true // jshint ignore:line
    });
    var localSchools = new PouchDB('localSchools', {
        revs_limit: 1, // jshint ignore:line
        auto_compaction: true // jshint ignore:line
    });
    var localTmpResolutions = new PouchDB('localTmpResolutions', {
        revs_limit: 1, // jshint ignore:line
        auto_compactions: true // jshint ignore:line
    });


    //DONE
    function fetchData(method, url) {

        var deferred = $.Deferred();

        util.modem(method, url, function(studentData) {

            deferred.resolve(studentData);

        }, function(xhr, ajaxOptions, thrownError) {

            deferred.reject(xhr);

        }
      );

        return deferred.promise();

    };
    //DONE
    function saveToLocalData(db, data) {

        var deferred = $.Deferred();

        var localDB;
        var word;

        switch (db.toLowerCase()) {

            case 'students':
                localDB = localStudents;
                word = 'Aluno actualizado!';
                break;
            case 'testtypes':
                localDB = localTestTypes;
                word = 'Tipos de teste actualizados!';
                break;
            case 'categories':
                localDB = localCategories;
                word = 'Categorias actualizadas!';
                break;

            case 'tests':
                localDB = localTests;
                word = 'Testes actualizados!';
                break;

            case 'questions':
                localDB = localQuestions;
                word = 'Perguntas actualizadas!';
                break;

            case 'resolutions':
                localDB = localResolutions;
                word = 'Resoluções atualizadas!';
                break;

            case 'teachers':
                localDB = localTeachers;
                word = 'Professores actualizados';
                break;

            case 'schools':
                localDB = localSchools;
                word = 'Escolas actualizadas!';
                break;

            default:
                localDB = localStudents;
                break;
        }

        if ($.isArray(data)) {

            if (data.length !== 0) {

                localDB.bulkDocs(data, function(err, response) {

                    if (err) {
                        deferred.resolve(word);
                    }

                    deferred.resolve(word);

                });
            } else {
                deferred.resolve(word);
            }

        } else {

            localDB.post(data, function(err, response) {

                var json = JSON.parse(err);

                if (err && json.status !== 409) {
                    deferred.resolve(word);
                }

                deferred.resolve(word);
            });

        }
        return deferred.promise();
    };
    //DONE
    function saveOnLocal(studentData) {

        var deferred = $.Deferred();

        saveToLocalData('schools', studentData.data.school)
            .done(function(response) {


                saveToLocalData('students', studentData.data.student)
                    .done(function(response) {


                        saveToLocalData('teachers', studentData.data.teachers)
                            .done(function(response) {


                                saveToLocalData('questions', studentData.data.questions)
                                    .done(function(response) {


                                        saveToLocalData('tests', studentData.data.tests.solved)
                                            .done(function(response) {


                                                saveToLocalData('tests', studentData.data.tests.unsolved)
                                                    .done(function(response) {


                                                        saveToLocalData('categories', studentData.data.categories)
                                                            .done(function(response) {


                                                                saveToLocalData('testtypes', studentData.data.testtypes)
                                                                    .done(function(response) {


                                                                        deferred.resolve();
                                                                    });
                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
            });


        return deferred.promise();
    };
    //DONE
    function getLocalResolutionsByStudent() {
        var deferred = $.Deferred();

        localResolutions.allDocs({
            include_docs: true
        }, function(err, allResolutions) {
            if (err) {
                deferred.reject('Erro a carregar as Resoluções Locais!');
            }

            var res = [];
            for (var i = 0; i < allResolutions.rows.length; i++) {

                if (allResolutions.rows[i].doc.studentID === window.sessionStorage.getItem("id")) {
                    res.push(allResolutions.rows[i].doc);
                }
            }

            deferred.resolve(res);

        });

        return deferred.promise();
    };
    //DONE
    function getLocalTestsByStudent() {
        var deferred = $.Deferred();
        localTests.allDocs({
            include_docs: true
        }, function(err, allTests) {
            if (err) {
              console.log(err);
                deferred.reject('Erro a carregar os Testes locais!');
            }

            var res = [];
            for (var i = 0; i < allTests.rows.length; i++) {

                if (allTests.rows[i].doc.studentID === window.sessionStorage.getItem("id")) {
                    res.push(allTests.rows[i].doc);
                }
            }

            deferred.resolve(res);

        });

        return deferred.promise();
    };
    //DONE
    function postLiveAllTestsAndResolutions(data) {
        var deferred = $.Deferred();

        util.modem('POST', 'student/saveAllTestsAllResolutionsByStudent',
            function(log) {

                deferred.resolve();
            },
            function(xhr, ajaxOptions, thrownError) {

                deferred.reject(xhr);

            },
            JSON.stringify(data)
        );

        return deferred.promise();
    };


    return {

        //done
        sycn: function() {
            var self = this;
            var deferred = $.Deferred();

            var toSend = {};


            getLocalResolutionsByStudent().done(function(resData) {
                toSend.resolutions = resData;

                getLocalTestsByStudent().done(function(testsData) {
                    toSend.tests = testsData;


                    postLiveAllTestsAndResolutions(toSend).done(function() {

                        self.login().done(function(){

                          deferred.resolve('Sincronização completa com sucesso!');

                        }).fail(function(xhr){
                          deferred.reject(xhr);
                        });

                    }).fail(function(xhr){
                      deferred.reject(xhr);
                    });

                }).fail(function(xhr){
                  deferred.reject(xhr);
                });

            }).fail(function(xhr){
              deferred.reject(xhr);
            })

            return deferred.promise();

        },

        //Sycn test with resolutions  DONE
        sycnTestWithResolution: function(data) {
            var deferred = $.Deferred();

            util.modem('POST', 'test',
                function(log) {

                    deferred.resolve();

                },
                function(xhr, ajaxOptions, thrownError) {

                    deferred.reject();

                },
                JSON.stringify(data)
            );

        },

        //login function              DONE
        login: function() {

            var deferred = $.Deferred();
            $('body').prepend(help.throwAlertSuccess('A conectar com o Letrinhas'));

            fetchData('get', 'student').done(function(studentData) {

                window.sessionStorage.setItem("id", studentData.data.student._id);


                saveOnLocal(studentData).done(function() {
                    deferred.resolve('Sincronização completa!');
                });

            }).fail(function(err) {

                deferred.reject(err);

            });

            return deferred.promise();
        },

        //Offline login function     DONE
        loginOffline: function(user, password) {

            var deferred = $.Deferred();

            localStudents.query(function(doc) {
                emit(doc.username, doc); // jshint ignore:line
            }, {
                key: user
            }).then(function(result) {

                if (result.rows[0]) {

                    var student = result.rows[0].value;

                    if (student.username === user && student.password === password) {
                        window.sessionStorage.setItem("id", student._id);
                        deferred.resolve();

                    } else {

                        deferred.reject('Dados errados!');

                    }

                } else {

                    deferred.reject('Aluno inexistente localmente!');

                }

            });

            return deferred.promise();
        },

        //getters                    DONE
        getStudents: function() {
            return localStudents;
        },

        getTests: function() {
            return localTests;
        },

        getQuestions: function() {
            return localQuestions;
        },

        getResolutions: function() {
            return localResolutions;
        },

        getTmpResolutions: function() {
            return localTmpResolutions;
        },

        getCategories: function() {
            return localCategories;
        },

        getTestTypes: function() {
            return localTestTypes;
        },

        getTeachers: function() {
            return localTeachers;
        },

        getSchools: function() {
            return localSchools;
        },

        checkOfflineDatabases: function() {

            localStudents.allDocs({
                include_docs: true, // jshint ignore:line
                attachments: true // jshint ignore:line
            }).then(function(res) {
                //console.log('localStudents');
                //console.log(res);
                localTeachers.allDocs({
                    include_docs: true, // jshint ignore:line
                    attachments: true // jshint ignore:line
                }).then(function(res) {
                    //console.log('localTeachers');
                    //console.log(res);
                    localResolutions.allDocs({
                        include_docs: true, // jshint ignore:line
                        attachments: true // jshint ignore:line
                    }).then(function(res) {
                        //console.log('localResolutions');
                        //console.log(res);
                        localSchools.allDocs({
                            include_docs: true, // jshint ignore:line
                            attachments: true // jshint ignore:line
                        }).then(function(res) {
                            //console.log('localSchools');
                            //console.log(res);
                            localTests.allDocs({
                                include_docs: true, // jshint ignore:line
                                attachments: true // jshint ignore:line
                            }).then(function(res) {
                                //console.log('localTests');
                                //console.log(res);
                                localTestTypes.allDocs({
                                    include_docs: true, // jshint ignore:line
                                    attachments: true // jshint ignore:line
                                }).then(function(res) {
                                    //console.log('localTestTypes');
                                    //console.log(res);
                                    localQuestions.allDocs({
                                        include_docs: true, // jshint ignore:line
                                        attachments: true // jshint ignore:line
                                    }).then(function(res) {
                                        //console.log('localQuestions');
                                        //console.log(res);
                                        localCategories.allDocs({
                                            include_docs: true, // jshint ignore:line
                                            attachments: true // jshint ignore:line
                                        }).then(function(res) {
                                            //console.log('localCategories');
                                            //console.log(res);
                                        }).catch(function(err) {
                                            //console.log(err);
                                        });
                                    }).catch(function(err) {
                                        //console.log(err);
                                    });
                                }).catch(function(err) {
                                    //console.log(err);
                                });
                            }).catch(function(err) {
                                //console.log(err);
                            });
                        }).catch(function(err) {
                            //console.log(err);
                        });
                    }).catch(function(err) {
                        //console.log(err);
                    });
                }).catch(function(err) {
                    //console.log(err);
                });
            }).catch(function(err) {
                //console.log(err);
            });









        },

        deleteTable: function() {
            notification.loading();

            localStudents.destroy().then(function(response) { // jshint ignore:line

                sessionStorage.removeItem('keyo');
                sessionStorage.removeItem('status');
                sessionStorage.removeItem('sync');
                localStorage.removeItem('lang');
                localStorage.removeItem('first_time');

                $('#msgContainer').css('display', 'block');
                $('#syncDBInfo').html('A apagar alunos...');
                localTestTypes.destroy().then(function(response) {
                    localCategories.destroy().then(function(response) {
                        localTmpResolutions.destroy().then(function(response) { // jshint ignore:line
                            localTeachers.destroy().then(function(response) { // jshint ignore:line
                                $('#syncDBInfo').html('A apagar professores...');
                                localSchools.destroy().then(function(response) { // jshint ignore:line
                                    $('#syncDBInfo').html('A apagar escolas...');
                                    localTests.destroy().then(function(response) { // jshint ignore:line
                                        $('#syncDBInfo').html('A apagar testes...');
                                        localQuestions.destroy().then(function(response) { // jshint ignore:line
                                            $('#syncDBInfo').html('A carregar questões...');
                                            localResolutions.destroy().then(function(response) { // jshint ignore:line
                                                $('#syncDBInfo').html('A apagar resoluções...');
                                                $('#syncDBInfo').html('Concluido...');
                                                setTimeout(function() {
                                                    $('#msgContainer').css('display', 'none');
                                                    window.location.reload();
                                                }, 600);
                                            }).catch(function(err) { // jshint ignore:line
                                            });
                                        }).catch(function(err) { // jshint ignore:line
                                        });
                                    }).catch(function(err) { // jshint ignore:line
                                    });
                                }).catch(function(err) { // jshint ignore:line
                                });
                            }).catch(function(err) { // jshint ignore:line
                            });
                        }).catch(function(err) { // jshint ignore:line
                        });
                    }).catch(function(err) { // jshint ignore:line
                    });
                }).catch(function(err) { // jshint ignore:line
                });
            }).catch(function(err) { // jshint ignore:line
            });
        },
    };

});
