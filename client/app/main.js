import {} from '../framework/es6-polyfill';
import {} from '../framework/jQueryLean';
import riot from 'riot';
import Cookies from '../framework/cookie';
import { provide } from 'riotjs-redux';
import router from '../framework/lean-router';
import {} from 'riot-form';
import bootstrap from './bootstrap';
import Application from '../framework/Pagan';

var app = Application({container: window});

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

    require('./app.tag');
    require('./commons/on-scroll.tag')
    require('./commons/modal.tag');
    require('./commons/alert.tag');
    require('./commons/rlink.tag');
    require('./commons/img-lazy-loader.tag');
    require('./commons/icobar.tag');
    require('./commons/bottom.tag');
    require('./commons/raw.tag');
    require('./commons/carousel.tag');
    require('./commons/progressbar.tag');
    require('./commons/radio-group.tag');
    require('./commons/radio.tag');

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