import {} from '../framework/es6-polyfill';
import {} from '../framework/jQueryLean';
import riot from 'riot';
import Cookies from '../framework/cookie';
import { provide } from '../framework/riot-redux';
import router from '../framework/lean-router';
import {} from 'riot-form';
import bootstrap from './bootstrap';
import Application from '../framework/Tesla';

var app = Application();

app.set('env', process.env.NODE_ENV === 'production' ? 'production' : 'development');

app.set('mode', 'browser');

app.set('context', { store: app.store, hub: router.hub, tags: {} });

app.mixin('form', form);

app.router(router);

app.start(async () => {

    await bootstrap(app.store);

    app.hub.on('history-pending', (from, to, $location, ctx, next) => {
        //for filter
        next && next();
    });

    app.hub.on('history-resolve', (from, to, ctx, hints) => {
        //todo
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