requirejs.config({
    baseUrl: './js',
    paths: {
        'jquery': 'jquery'
    },
    shim: {
        'jqueryui': {
            deps: ['jquery'],
            exports: 'jqueryui'
        },
        'bootstrap': {
            deps: ['jquery', 'jqueryui'],
            exports: 'bootstrap'
        },

        'flatui-checkbox': {
            deps: ['bootstrap', 'jquery', 'jqueryui' ],
            exports: 'flatuicheckbox'
        },

        'flatui-radio': {
            deps: ['bootstrap', 'jquery', 'jqueryui'],
            exports: 'flatuiradio'
        }
    }
});

// start the app;


require(['app'], function (app) {
    app.start();
});