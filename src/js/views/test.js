define([
    'underscore',
    'backbone',
    'adapters/notification',
    'adapters/uploadresolution',
    'templates',
    'i18next',
    'views/testlist',
    'views/testinterpretation',
    'views/testmultimedia',
    'views/testtext',
    'views/testboxes',
    'views/testwhitespaces',
    'hammerjs',
    'hammerjsJquery',
    'jqueryui',
    'jqueryuitouch'
], function(_, Backbone, notification, upload, templates, i18n, TestTypeList, TestTypeInterpretation, TestTypeMultimedia, TestTypeText, TestTypeBoxes, TestTypeWhiteSpaces) {

    'use strict';

    // Home view.
    // Renders the home view that displays the list of all secrets and handles the UI logic associated with it.
    var Test = Backbone.View.extend({

        // Set the template.
        template: templates.test,

        events: {
            'click #endTestBtn': 'beforeSend'
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

        //Before Sending Answers
        beforeSend: function(e) {
            e.preventDefault();
            var self = this;

            // var $resolutions = [];

            notification.confirm('Tem a certeza que pretende finalizar a resolução do teste?', 'Finalizar Resolução', ['Sim', 'Não'])
                .done(function(response) {
                    if (response === 1) {

                        //Load Animation
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

                        //Search All Questions
                        var $elements = [];
                        $('.item').each(function() {
                            $elements.push($(this));
                        });


                        /**
                         * DEFINE ELEMENT
                         * 0 -> Element
                         * 1 -> Index
                         * 2 -> Number of Items
                         * 3 -> Current Test Model
                         * 4 -> Resolutions Array
                         * 5 -> Temporary Resolutions
                         *
                         * @type {*|jQuery|HTMLElement}
                         */

                        upload.startUpload($elements, $('.item').length, self.model, self.tmpresolutions);
                    }
                })
                .fail(function() {
                    notification.alert('Erro!');
                });

        },

        //Class Initializer
        initialize: function() {

            //Check for Collection
            if (!this.model) {
                throw new Error('model is required');
            }
            //Get Question
            this.questions = this.model[0];
            //Get Temporary Resolutions
            this.tmpresolutions = this.model[1];
            //Get test Model
            this.model = this.model[2];




        },

        //Class Render
        render: function() {
            var self = this;

            // Render the outer container.
            this.$el.html(this.template(this.model.toJSON()));



            var teste = this.model.toJSON();
            var count = 0;

            for (var i = 0; i < teste.questions.length; i++) { // jshint ignore:line
                var qt = teste.questions[i];

                var questionFound = this.questions.where({
                    _id: qt._id
                })[0];
                if (questionFound) {
                    count++;
                }
            }

            //notification for prevent openning test without all questions
            if (count !== teste.questions.length) {
                notification.confirm('As perguntas de som deste teste estão a ser ainda sincronizadas', 'Teste', ['Compreendi'])
                    .done(function(response) {
                        if (response) {

                            self.navigateTo('#home', true);
                        }
                    });
            } else {

                //Render Questions
                for (var i in this.model.attributes.questions) { // jshint ignore:line


                    //Render Carousel Indicators
                    $('.carousel-indicators')
                        .append($('<li>', {
                            'data-target': '#carousel-example-generic'
                        }));



                    //Render Questions
                    var $question = [i, this.questions.where({
                        _id: this.model.attributes.questions[i]._id
                    })[0]];
                    switch ($question[1].attributes.type) {

                        case 'text':
                            var testTypeText = new TestTypeText({
                                model: $question
                            });
                            $('#questionArea').append(testTypeText.render().el);
                            break;

                        case 'list':
                            var testTypeList = new TestTypeList({
                                model: $question
                            });
                            $('#questionArea').append(testTypeList.render().el);
                            break;

                        case 'interpretation':
                            var testTypeInterpretation = new TestTypeInterpretation({
                                model: $question
                            });
                            $('#questionArea').append(testTypeInterpretation.render().el);
                            break;

                        case 'multimedia':
                            var testTypeMultimedia = new TestTypeMultimedia({
                                model: $question
                            });
                            $('#questionArea').append(testTypeMultimedia.render().el);
                            break;

                        case 'boxes':
                            var testTypeBoxes = new TestTypeBoxes({
                                model: $question
                            });
                            $('#questionArea').append(testTypeBoxes.render().el);
                            break;

                        case 'whitespaces':
                            var testTypeWhiteSpaces = new TestTypeWhiteSpaces({
                                model: $question
                            });
                            $('#questionArea').append(testTypeWhiteSpaces.render().el);

                            //Fill Dropdown Menus
                            $('#testArea' + i).find('.blankSpace').each(function() { // jshint ignore:line
                                $(this).html($('.blankSpaceGroup' + i).html());
                            });

                            break;

                    }

                }

                //Active First Indicator/Question
                $('.carousel-indicators').find('li:first-child').toggleClass('active');
                $('#questionArea').find('div:first-child').toggleClass('active');

                //Convert Connected Lists Into Sortable, If Lists Exist
                $('.connectedSortable').sortable({
                    connectWith: '.connectedSortable',
                    scroll: false,
                    start: function() {
                        $('#isSorting').attr('role', 'true');
                    },
                    update: function() {
                        setTimeout(function() {
                            $('#isSorting').attr('role', 'false');
                        }, 200);
                    }
                }).disableSelection();

                //Recording Flag
                var recordFlag = $('#isRecording');
                var sortingFlag = $('#isSorting');

                //HammerJS Swipe
                $('#carousel-example-generic')
                    .hammer().on('swipeleft', function(e) {
                        e.preventDefault();

                        //Check if is recording
                        if (recordFlag.attr('role') === 'false' && sortingFlag.attr('role') === 'false') {
                            $(this).carousel('next');
                        }

                    })
                    .hammer().on('swiperight', function(e) {
                        e.preventDefault();

                        //Check if is recording
                        if (recordFlag.attr('role') === 'false' && sortingFlag.attr('role') === 'false') {
                            $(this).carousel('prev');
                        }

                    });

                //Translate Page
                self.internationalization();




            }



            return this;
        }
    });

    return Test;
});
