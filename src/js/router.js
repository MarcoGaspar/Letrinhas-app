define([
    'jquery',
    'underscore',
    'backbone',
    'routefilter',
    'dbsync',
    'adapters/notification',

    //Models
    'models/question',
    'models/resolution',

    //Collections
    'collections/students',
    'collections/tests',
    'collections/questions',
    'collections/resolutions',
    'collections/categories',
    'collections/teachers',
    'collections/tmpresolutions',
    'collections/testtypes',
    'collections/schools',

    //Views
    'views/login',
    'views/home',
    'views/statistics',
    'views/test',
    'views/init',
    'views/testwhitespaces',
    'views/profile'
], function ($,
             _,
             Backbone,
             RouteFilter,
             dbSync,
             notification,
             //Models
             Question,
             Resolution,
             //Collections
             Students,
             Tests,
             Questions,
             Resolutions,
             Categories,
             Teachers,
             TmpResolutions,
             TestTypes,
             Schools,
             //Views
             LoginView,
             HomeView,
             Statistics,
             TestView,
             InitView,
             DebugView,
             ProfileView) {

    'use strict';

    var currentView, // Represents the current view
        auth,    //Auth Credentials
        account;    //Auth Credentials

    var Router = Backbone.Router.extend({

        routes: {
            '': 'login',
            'init': 'init',
            'logout': 'logout',
            'login': 'login',
            'home': 'home',
            'statistics': 'statistics',
            'profile': 'profile',

            //Test Routes
            'solve/:testID': 'solveTest',

            //Debug
            'debug': 'debug',

            //Invalid Route Default
            '*notFound': 'home'
        },

        /**
         * AUTH
         *
         * LOGIN WITH NO PASSWORD       -> Keeps on Login Page
         * LOGIN WITH PASSWORD          -> Goes to Home Page
         * NON LOGIN WITH PASSWORD      -> Keeps at Current Page
         * NON LOGIN WITH NO PASSWORD   -> Goes to Login Page
         *
         * @param route
         */
        before: {
            // Using instance methods
            '*any': 'checkAuthorization'
        },

        checkAuthorization: function (fragment, args, next) {

            //Load Global Loading Animation
            $('body')
                .prepend($('<div>', {
                        class: 'loader'
                    })
                    .append($('<div>', {
                            class: 'placeholder light'
                        })
                        .append($('<div>', {
                            class: 'spinner spinnerConf'
                        }))
                    )
                );

            var self = this;

            /**
             * UNESSESSARY PAGES
             * init; login; ''
             *
             * CHECK IF PROGRAM WAS RUNNED BEFORE
             *  -> DISPLAY INIT SCREEN
             *
             * CHECK IF LOGIN IS DONE
             *  -> GO TO LOGIN
             */

            //Check For Firs-Time-Run
            if (!localStorage.getItem('first_time') && fragment !== 'init') {
                // localStorage.setItem('first_time', true);
                self.goto('init');
            }
            else {
                if (fragment === '' || fragment === 'login' || fragment === 'init') {
                    next();
                }
                else {

                    if (sessionStorage.getItem('keyo')) {
                        auth = atob(sessionStorage.getItem('keyo')).split(':');

                        new Students().fetch({
                            async: false,
                            success: function (collection) {
                                var $account = collection.where({username: auth[0], password: auth[1]})[0];
                                if ($account.length === 0) {
                                    self.goto('login');
                                }
                                else {
                                    account = $account;
                                    next();
                                }
                            },
                            error: function () {
                                self.goto('login');
                            }
                        });
                    }
                    else {
                        self.goto('login');
                    }
                }
            }


        },

        init: function () {
            this.renderView(new InitView());
        },

        logout: function () {
            //dbSync.sycnAllResolved();
            sessionStorage.removeItem('keyo');
            sessionStorage.removeItem('user');
            sessionStorage.setItem('sync', false);
            Backbone.history.navigate('#login', true);
            return false;
        },

        login: function () {

            var self = this;

            //try Fetching Database
            new Students().fetch({
                success: function (collection) {

                    self.renderView(new LoginView({
                        collection: collection
                    }));
                },

                error: function () {
                    self.goto('login');
                }
            });

        },

        home: function () {

            var self = this;
            var $collection = [account];

            //Fetch Tests
            new Categories().fetch({
                success: function (categoryCollection) {

                    //Fetch Tests
                    new Teachers().fetch({
                        success: function (teacherCollection) {

                            //Push Collections
                            $collection.push(teacherCollection);
                            $collection.push(categoryCollection);
                            // $collection.push(new Tests(testCollection.where({
                            //     studentID: account.attributes._id,
                            //     solved: false
                            // })));

                            self.renderView(new HomeView({
                                model: $collection
                            }));

                        },
                        error: function () {
                            self.goto('home');
                        }
                    });

                },
                error: function () {
                    self.goto('home');
                }
            });

        },

        solveTest: function (testID) {

            var self = this;
            var $data = [];

            //Fetch Tests
            new Tests().fetch({
                success: function (testCollection) {

                    //Fetch Questions
                    new Questions().fetch({
                        success: function (questionCollection) {

                            //Fetch Questions
                            new TmpResolutions().fetch({
                                success: function (tmpResolutionsCollection) {

                                    //Push Data
                                    $data.push(questionCollection);
                                    $data.push(tmpResolutionsCollection);
                                    $data.push(testCollection.where({_id: testID})[0]);

                                    //Render View
                                    self.renderView(new TestView({
                                        model: $data
                                    }));

                                },
                                error: function (err) {
                                    console.log(err);
                                }
                            });

                        },
                        error: function (err) {
                            console.log(err);
                            // self.goto('home');
                        }
                    });

                },
                error: function () {
                    notification.alert('Error Route!');
                }
            });

        },

        statistics: function () {

            var self = this;
            var $data = [account];

            //Fetch Categories
            new Categories().fetch({
                success: function (categoriesCollections) {

                    //Fetch Tests
                    new Resolutions().fetch({
                        success: function (resolutionCollections) {

                            $data.push(categoriesCollections);
                            $data.push(resolutionCollections);

                            // Render View
                            self.renderView(new Statistics({
                                collection: $data
                            }));

                        },
                        error: function () {
                            self.goto('home');
                        }
                    });

                },
                error: function () {
                    self.goto('home');
                }
            });

        },

        profile: function () {
            var self = this;
            var $data = [account];

            //Fetch Schools
            new Schools().fetch({
                success: function (schoolsCollections) {

                    new TestTypes().fetch({
                        success: function (testTypeCollections) {

                            new Tests().fetch({
                                success: function (testCollection) {

                                    $data.push(testTypeCollections);
                                    $data.push(schoolsCollections);
                                    $data.push(testCollection.byStudent(account.attributes._id).corrected());

                                    self.renderView(new ProfileView({
                                        model: $data
                                    }));
                                },
                                error: function (err) {
                                    console.log(err);
                                }
                            });

                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });

                },
                error: function (err) {
                    console.log(err);
                }
            });

        },

        goto: function (route) {
            Backbone.history.navigate('#' + route, true);
            return false;
        },


        //Debug
        debug: function(){

            new TmpResolutions().fetch({
                success: function (collection) {

                   console.log(collection);

                },
                error: function (err) {
                    console.log(err);
                }
            });
        },

        // Render View
        renderView: function (view) {

            if (currentView) {
                currentView.ghost();
            }

            currentView = view;
            currentView.setElement($('body'));
            currentView.render();
        }
    });

    return new Router();
});
