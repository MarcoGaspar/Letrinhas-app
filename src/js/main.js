(function () {

    'use strict';

    require.config({

        baseUrl: 'js',

        paths: {
            jquery: '../../bower_components/jquery/dist/jquery',
            jqueryui: '../../bower_components/jquery-ui/jquery-ui',
            modem : 'modem',
            jqueryuitouch: '../../bower_components/jquery-ui-touch-punch-improved/jquery.ui.touch-punch-improved',
            underscore: '../../bower_components/underscore/underscore',
            backbone: '../../bower_components/backbone/backbone',
            validation: '../../bower_components/backbone.validation/dist/backbone-validation-amd',
            stickit: '../../bower_components/backbone.stickit/backbone.stickit',
            touch: '../../bower_components/backbone.touch/backbone.touch',
            handlebars: '../../bower_components/handlebars/handlebars.runtime',
            // routefilter: '../../bower_components/backbone.routefilter/dist/backbone.routefilter',
            routefilter: '../../bower_components/backbone-route-filter/backbone-route-filter',
            pouch : '../../bower_components/pouchdb/dist/pouchdb',


            backbonedb : '../../bower_components/backbone-pouchdb/backbone-pouch',
            blob : '../../bower_components/blob-util/dist/blob-util',
            highcharts : '../../bower_components/highcharts/highcharts',
            highchartTable : '../../bower_components/highchartTable/jquery.highchartTable',
            hammerjs : '../../bower_components/hammerjs/hammer.min',
            hammerjsJquery : '../../bower_components/jquery-hammerjs/jquery.hammer',
            i18next : '../../bower_components/i18next/i18next.min',
            sparkMD5 : '../../bower_components/SparkMD5/spark-md5',
            dbsync : 'sync',
            Helpers: 'helpers'
        },

        shim: {
            jquery: {
                exports: '$'
            },

            underscore: {
                deps: ['jquery'],
                exports: '_'
            },

            backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },





            handlebars: {
                exports: 'Handlebars'
            },

            pouch :{
                exports: 'PouchDB'
            },

            backbonedb :{
                deps : ['backbone', 'pouch'],
                exports : 'BackbonePouch'
            },

            dbsync :{
                exports : 'dbSync'
            },
            helpers :{
                exports : 'helpers'
            },

            i18next :{
                deps: ['jquery'],
                exports : 'i18n'
            },

            blob :{
                exports : 'blobUtil'
            },

            highcharts :{
                exports : 'highCharts'
            },

            highchartTable :{
                exports : 'highChartTable'
            },

            sparkMD5 :{
                exports : 'SparkMD5'
            }

        }
    });


    var isDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/);

    if (!isDevice) {
        require.config({
            paths: {
                adapters: 'fake'
            }
        });
    }

    require(['app'], function (app) {
        app.start(isDevice);
    });
})();
