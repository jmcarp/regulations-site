({
    paths: {
        jquery: './lib/jquery-1.9.1',
        underscore: './lib/underscore',
        backbone: './lib/backbone',
        'definition-view': './views/definition-view',
        'interpretation-view': './views/interpretation-view',
        'regs-fixed-el-view': './views/regs-fixed-el-view',
        'sub-head-view': './views/sub-head-view',
        'regs-view': './views/regs-view',
        'toc-view': './views/toc-view'
    },
    shim: {
        underscore: {
            deps: ['jquery'],
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },
    dir: "./built",
    modules: [ {name: "regulations"} ]
})