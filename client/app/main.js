import {} from '../framework/es6-polyfill';
import {} from '../framework/jQueryLean';
import riot from 'riot';
import Cookies from '../framework/cookie';
import { provide } from '../framework/riot-redux';
import router from '../framework/lean-router';
import {} from 'riot-form';
import bootstrap from './bootstrap';
import Application from './Application';

var app = Application();

app.set('env', process.env.NODE_ENV === 'production' ? 'production' : 'development');

app.set('mode', 'browser');

app.set('context', { store: app.store, hub: router.hub, tags: {} });

app.mixin('form', form);

app.router(router);

app.start(async () => {

    await bootstrap(app.store);

    app.hub.on('history-pending', (from, to, $location, ctx, next) => {
        if(ctx.request.body.authenticate && !Cookies.get('token')) {
            // let query = ctx.request.query;
            // let fxer = Cookies.get('fxer');
            // if(fxer && !query.hasOwnProperty('fxer')){
            //     query['fxer'] = fxer;
            // }
            // return $.get(`/wechat/client?referer=${$location}&${$.util.querystring.stringify(query)}`).then(link => window.location.href = link.link);
        }
        next && next();
    });

    app.hub.on('history-resolve', (from, to, ctx, hints) => {
        if(Cookies.get('fxer') && hints.length === 1){
            router.hub.search('fxer', Cookies.get('fxer'));
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    })

    require('./app.html');
    require('./commons/on-scroll.html')
    require('./commons/modal.html');
    require('./commons/alert.html');
    require('./commons/rlink.html');
    require('./commons/img-lazy-loader.html');
    require('./commons/icobar.html');
    require('./commons/bottom.html');
    require('./commons/raw.html');
    require('./commons/carousel.html');
    require('./commons/progressbar.html');
    require('./commons/radio-group.html');
    require('./commons/radio.html');

    app.registerWidget({
        name: 'alert',
        methods: ['add']
    });

    app.registerWidget({
        name: 'modal',
        methods: ['open']
    });
    
    app.set('entry', riot.mount('app', {store: app.store})[0]);

    provide(app.store)(app.entry);
});

// import {} from '../framework/es6-polyfill';
// import {} from '../framework/jQueryLean';
// import riot from 'riot';
// import Cookies from '../framework/cookie';
// import { provide } from '../framework/riot-redux';
// import router from '../framework/lean-router';
// import {} from 'riot-form';
// import { configureStore } from '../configuration/store';
// import bootstrap from './bootstrap';
// import Application from './Application';

// const HISTORY_MODE = 'browser';

// var store = configureStore({}, HISTORY_MODE);

// riot.mixin('router', router.router(HISTORY_MODE));
// riot.mixin('form', form);

// riotRouterRedux.syncHistoryWithStore(router.hub, store);

// router.hub.on('history-pending', (from, to, $location, ctx, next) => {
//     if(ctx.request.body.authenticate && !Cookies.get('token')) {
//         // let query = ctx.request.query;
//         // let fxer = Cookies.get('fxer');
//         // if(fxer && !query.hasOwnProperty('fxer')){
//         //     query['fxer'] = fxer;
//         // }
//         // return $.get(`/wechat/client?referer=${$location}&${$.util.querystring.stringify(query)}`).then(link => window.location.href = link.link);
//     }
//     next && next();
// });

// router.hub.on('history-resolve', (from, to, ctx, hints) => {
//     if(Cookies.get('fxer') && hints.length === 1){
//         router.hub.search('fxer', Cookies.get('fxer'));
//     }
//     document.body.scrollTop = document.documentElement.scrollTop = 0;
// })

// let context = {
//     store,
//     hub: router.hub,
//     tags: {}
// };

// window.widgets = widgets;
// window.context = context;

// (async function main(){

//     await bootstrap(store);
    
//     require('./app.html');
//     require('./commons/on-scroll.html')
//     require('./commons/modal.html');
//     require('./commons/alert.html');
//     require('./commons/rlink.html');
//     require('./commons/img-lazy-loader.html');
//     require('./commons/icobar.html');
//     require('./commons/bottom.html');
//     require('./commons/raw.html');
//     require('./commons/carousel.html');
//     require('./commons/progressbar.html');
//     require('./commons/radio-group.html');
//     require('./commons/radio.html');

//     context.tags['alert'] = riot.mount('alert')[0];
//     context.tags['modal'] = riot.mount('modal')[0];

//     var entry = riot.mount('app', {store})[0];
//     provide(store)(entry);

//     router.hub.startup();
// })()

