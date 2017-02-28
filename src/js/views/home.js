define([
    'underscore',
    'backbone',
    'adapters/notification',
    'templates',
    'dbsync',
    'i18next',
    'collections/tmpresolutions',
    'collections/tests',
    'models/resolution',
    'views/chronology',
    'adapters/audio',
    'helpers'
], function(_, Backbone, notification, templates, dbSync, i18n, TmpResolutions, Tests, Resolution, ChronologyView, audio, help) { // jshint ignore:line

    'use strict';

    // Home view.
    // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
    var Home = Backbone.View.extend({

        // Set the template.
        template: templates.home,

        events: {
            'click .navbar-brand': 'togglesidebar',
            'click .btn-box-tool': 'slidebox',
            'click .deliverBtn': 'beforeSendTest',
            'click .refreshChronology': 'loadChronology',
            'click .sync': 'sync',
            'click .reloadd': 'reload'
        },

        slidebox: function(e) {

            var $icon = $(e.currentTarget).find('i'); //Get button icon
            var $box = $(e.currentTarget).parent().parent().parent().find('.panel-collapse'); //Get Target Box-Body

            $box.toggleClass('collapse');

            //Decide to Slide Up/Down
            if ($box.css('display').toLowerCase() === 'none') {
                //Toggle Icons
                $icon.removeClass('fa fa-minus');
                $icon.addClass('fa fa-plus');
            } else {
                //Toggle Icons
                $icon.removeClass('fa fa-plus');
                $icon.addClass('fa fa-minus');
            }

        },

        reload: function(e) {
            e.preventDefault();

            // dbSync.sycnAllResolved();

        },

        //Toggle SideBar
        togglesidebar: function(e) {
            e.preventDefault();
            $('#wrapper').toggleClass('toggled');
        },

        //I18n
        internationalization: function() {
            i18n.init({ // jshint ignore:line
                'lng': localStorage.getItem('lang'),
                'fallbackLng': 'pt'
            }, function() {
                //Translate Document
                $(document).i18n();
            });
        },

        //Chronology
        loadChronology: function() {

            var self = this;

            $('.loader').remove();

            //Fetch Tests For Chronology
            new Tests().fetch({
                success: function(testCollection) {

                    //Set Local Test Variable
                    self.tests = testCollection.byStudent(self.model._id).unsolved();

                    //Date to Send
                    var $data = [self.model, self.teachers, self.categories, self.tests];

                    //Load Chronology
                    var chronologyView = new ChronologyView({
                        collection: $data
                    });

                    $('.chronologyInfo').html(chronologyView.render().el);

                    //Translate Page
                    self.internationalization();

                }
            });

        },

        //Resync Database
        sync: function(e) {
            e.preventDefault();
            var self = this;

            notification.loading();
            dbSync.sycn().done(function(msg) {

                $('.loader').remove();
                self.navigateTo('#home', true);
                $('body').prepend(help.throwAlertSuccess(msg));

            }).fail(function(err) {

                if (err.status === 401 ) {

                    $('body').prepend(help.throwAlert(err.responseJSON));

                } else if (err.status === 0) {

                    $('body').prepend(help.throwAlert('Verifique a sua Ligação á Internet!'));

                }

                $('.loader').remove();

            });

        },


        //Send Test
        beforeSendTest: function(e) {
            e.preventDefault();
            var self = this;

            notification.confirm('Tem a certeza que pretende finalizar este teste? Esta acção é inrreversivel!', 'Finalizar Teste', ['Sim', 'Não'])
                .done(function(response) {
                    if (response === 1) {
                        var $el = $(e.currentTarget);
                        var $role = $el.attr('role');
                        notification.loading();
                        //Fetch Tests
                        new TmpResolutions().fetch({
                            success: function(tmpResolutionsCollection) {

                                //Get Temporary Resolutions
                                var $tmpResolutions = tmpResolutionsCollection.where({
                                    testID: $role
                                });

                                var resToUp = [];

                                //Check if Temp Resolutions Exist
                                if ($tmpResolutions.length !== 0) {

                                    //Uploadig Process
                                    for (var i in $tmpResolutions) {
                                        //Upload Resolutions

                                        var $newRes = new Resolution($tmpResolutions[i].attributes)
                                            .set({
                                                studentID: self.model._id,
                                                debug: true
                                            });

                                        $newRes.save();

                                        resToUp.push($newRes.attributes);

                                        //Remove Temporary resolution
                                        $tmpResolutions[i].destroy();
                                    }

                                    //Change Test
                                    var $test = self.tests.where({
                                        _id: $role
                                    })[0];

                                    $test.set({
                                        resolutionDate: new Date().getTime(),
                                        solved: true
                                    }).save();

                                    var toUpload = {};
                                    toUpload.test = $test.attributes;
                                    toUpload.resolutions = resToUp;

                                    //try go Sycn this test
                                    dbSync.sycnTestWithResolution(toUpload).done(function() {

                                        $('.loader').remove();
                                        notification.alert('Teste submetido');
                                        window.location.reload();
                                    }).fail(function() {

                                        $('.loader').remove();
                                        notification.alert('Sem conectividade a Internet');

                                    });

                                } else {
                                    $('.loader').remove();
                                    notification.alert('O teste não se encontra resolvido!');
                                }
                            },
                            error: function() {
                                $('.loader').remove();
                            }
                        });
                    }
                });

        },

        //Class Initializer
        initialize: function() {

            //Check for Model
            if (!this.model) {
                throw new Error('model is required');
            }

            //Set Teachers
            this.teachers = this.model[1];

            //Set Categories
            this.categories = this.model[2];

            //Set Account
            this.model = this.model[0].toJSON();

        },

        //Class Render
        render: function() {

            var self = this;

            var $data = {
                account: self.model
            };

            // Render the outer container.
            this.$el.html(this.template($data));

            //Load Chronology
            self.loadChronology();


            //Translate Page
            self.internationalization();

            return this;

        }
    });

    return Home;
});
