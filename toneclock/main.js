requirejs.config({
    baseUrl: '.',
    paths: {
        'jquery': 'Scripts/jquery-2.1.1',
        'jqueryui': 'Scripts/jquery-ui-1.11.1',
        'bootstrap': 'Scripts/bootstrap',
        'easel': 'Scripts/easeljs',
        'touchpunch': 'Scripts/touchpunch'
    },
    shim: {
        'easel': {
            exports: 'createjs'
        },
        'jqueryui': {
            deps: ['jquery'],
            exports: 'jqueryui'
        },
        'bootstrap': {
            deps: ['jquery', 'jqueryui'],
            exports: 'bootstrap'
        },
        'touchpunch': {
            deps: ['jquery', 'jqueryui'],
            exports: 'touchpunch'
        }
    }
});

// start the app;


require(['app'], function (app) {
    app.start();
});