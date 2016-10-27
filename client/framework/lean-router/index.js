"use strict";
import riot from 'riot';
import viewCreator from '../lean-view';

/**
 * riot router version 2.
 * updates:
 *  1. change route rule, delete underline when path is param.
 *  2. routes change data structure from map to array. 
 *  3. order of routes definition will become important.
 */ 
class Hub {
    constructor(emitter){
        this._root = null;
        this._view = null;
        this._busy = false;
        this._routes = [];
        this._defaultRoute = null;
        this._location = null;
        this._prev = null;
        this._title = null;
        this._emitter = emitter;
    }

    startup(){
        this._parseRoute();
        riot.route.base('/');
        riot.route(this.doRoute.bind(this));
        Util.nextTick(() => {
            riot.route.start();
            riot.route.exec();
        });
        return this;
    }

    /**
     * @param routes { Array }
     * @param location { String }
     * @returns cb
     *  query, params, components, history
     */
    matches({ routes, location }, cb){
        let req = this.parse(location);
        this.doRoute(req);
        return this;
    }

    /**
     * route parser
     * @param path (String)
     * @return req | null (Object | null)
     */
    parse(path){
        let req = {};
        let [uri, queryString] = path.split('?');
        let prefix = null;
        if(this.location){
            prefix = Util.compareUrl(this.location, uri);
        }
        let uriParts = uri.split('/');

        req.query = {};
        if(queryString){
            queryString.split('&').map(i => req.query[i.split('=')[0]] = i.split('=')[1]);
        }

        if(this.location){
            //check state changed or not
            if(this.location === '/' + uri){
                //sync state
                this.trigger('sync-state-query', req.query)
                return null;
            }
        }

        req.hints = [];
        if(uriParts.length){
            req.hints = uriParts
                .map((i, index) => {
                    if(index === 0){
                        return i;
                    }
                    return Util.combineUriParts(uriParts, index, i);
                })
                .map(h => Util.completePart(h));
        }
        if(prefix){
            req.hints = req.hints.filter(hint => hint.length > prefix.length);
            if(!req.hints.length){
                return null;
            }
        }        
        return req;
    } 

    _parseRoute(){
        riot.route.parser(this.parse.bind(this));
        return this;     
    }

    /**
     * route to the tag view with current context
     * @param route (Object)
     * @param ctx (Object)
     * @param redirect (Boolean)
     */
    routeTo(route, ctx, hint, redirect = false, cb){
        this.busy = false;
        this.trigger('busy-resolve');
        if(redirect){
            //todo fill path
            return riot.route(route.path);
        }
        if((!route.tag.hasOwnProperty('show') || route.tag.show) 
            && Util.completePart(route.path) === this.location){
            return;
        }
        let $state = route.path;
        let $location = hint;
        this.trigger('state-change', {$state, $location, ctx});
        if(route.redirectTo){
            riot.route(route.redirectTo);
            return true;
        }
        let addons = {
            hints: ctx.req.hints,
            req: ctx.req,
            route,
            tag: route.tag,
            $state,
            $location
        }
        if(route.resolve){
            return route.resolve.apply(route.tag, [(data) => {this.routeToDone(data, ctx, addons, cb)}, ctx]);
        }
        this.routeToDone(null, ctx, addons, cb);
    }

    /**
     * match route rule with current uri
     * @param rule
     * @param uri
     * @return lean req (Request | Boolean)
     */
    match(rule, uri){
        let parts = Util.distinct(rule.split('/').map(r => Util.completePart(r)));
        let fragments = Util.distinct(uri.split('/').map(r => Util.completePart(r)));
        if(
            !rule || 
            !uri || 
            !parts || 
            !parts.length || 
            !fragments || 
            !fragments.length ||
            fragments.length != parts.length
        ){
            return false;
        }
        let params = {};
        let res = parts.map((part, i) => {
            //param placeholder
            if(part.startsWith('/:')){
                return {key: part.slice(1), index: i}
            }
            if(part === fragments[i]){
                return true;
            }
            return null;
        }).filter(p => p);
        if(res.length != parts.length){
            return null;
        }
        return res.filter(r => typeof r === 'object').reduce((acc, curr) => {
            acc[curr.key.slice(1)] = fragments[curr.index].slice(1);
            return acc;
        }, {});
    }

    /**
     * recursive resovle route hints
     * @param context (Object)
     * @param node (Object) riot tag
     * @param recursive level
     */
    recurMatch(ctx, node, level){
        let { req } = ctx;
        let { hints } = req;
        let hint = hints[level];
         if(!node || !hint){
            return;
        }
        let target = null; 
        for(let route of this.routes){
            let matchRes = this.match(route.path, hint);
            if(matchRes){
                //assign object to context
                if(!ctx.req.params){
                    ctx.req.params = {};
                }
                Object.assign(ctx.req.params, matchRes);
                !ctx.req.body && (ctx.req.body = {});
                Object.assign(ctx.req.body, Util.omit(route, "resolve", "redirectTo", "tag", "path", "name") || {});
                target = route;
                break;
            }
        }
        if(!target && level === hints.length){
            if(node.defaultRoute){
                return this.routeTo(node.defaultRoute, ctx, hint, true);
            }
            console.info('404');
            this.busy = false;
            this.trigger('busy-resolve');
            return;
        }
        if(!target){
            return this.recurMatch(ctx, node, level + 1);
        } else {
            this.routeTo(target, ctx, hint, false, () => {
                if(hints[level + 1]){
                    return this.recurMatch(ctx, target, level + 1);
                }
            });
        }
    }

    doRoute(req){
        let me = this;
        if(!req){
            return;
        }
        let addons = {
            isFounded: false,
            isBreak: false
        }
        this.busy = true;
        this.trigger('busy-pending');
        let context = { req };
        this.recurMatch(context, this.root, 0);
    }

    /**
     * route done callback trigger a history-pending event
     * @param data (Any)
     * @param ctx (Object)
     * @param addons (Object)
     * @param cb (Function)
     */
    routeToDone(data, ctx, {hints, req, route, tag, $state, $location}, cb){
        let me = this;
        if(ctx && data){
            !ctx.body && (ctx.body = {});
            Object.assign(ctx.body, data);
        }
        let RAFId = requestAnimationFrame(() => {
            me.trigger('history-pending',
                me.prev,
                $state,
                $location,
                ctx,
                me.executeMiddlewares(
                    tag, 
                    tag.$mws,
                    ctx, 
                    () => {
                        me.routeSuccess(data, ctx, {hints, req, route, tag, $state, $location}, cb);
                    }
                ),
            );
            cancelAnimationFrame(RAFId); 
            RAFId = undefined;
        });
    }

    routeSuccess(data, ctx, {hints, req, route, tag, $state, $location}, cb){
        let me = this;
        let from = me.getMetaDataFromRouteMap(me.location).route;
        let to = route;
        let RAFId = requestAnimationFrame(() => {
            cancelAnimationFrame(RAFId);
            RAFId = undefined;
            me.trigger('history-resolve', 
                me.prev, 
                to, 
                ctx, 
                hints, 
                () => {
                    me.trigger('history-success',
                        from, 
                        to
                    );
                    me.location = $location;
                    me.prev = route;
                    cb();
                }
            )
        })
    }

    /**
     * Exchange control flow to hub from riot router
     * @params url (String)
     * @return this
     */
    go(url, title = null, replace){
        if(!title && this.title){
            title = this.title();
            console.warn(title);
        }
        riot.route(url, title, replace);
        return this; 
    }

    setTitle(fn){
        this.title = fn;
    }

    /**
     * @params routeKey (String)
     */
    getMetaDataFromRouteMap(routeKey){
        routeKey = routeKey && routeKey.startsWith('/') ? routeKey : '/' + routeKey;
        let keys = Object.keys(this.routes);
        for(let i=0, len=keys.length; i<len; i++){
            let k = keys[i];
            let route = this.routes[k];
            if(Util.toPattern(k) === Util.toPattern(routeKey)){
                let paramKeys = (Util.extractParams(k) || []).map(i=>i.slice(2));
                let paramValues = (Util.extractParams(routeKey) || []).map(i=>i.slice(1));
                return {
                    route,
                    $state: k,
                    $location: routeKey,
                    params: Util.composeObject(paramKeys, paramValues)
                };
            }
        }
        return {
            tag: null,
            params: null
        };
    }

    /**
     * recursive execute middlewares defined in tag
     * @params component (Object) tag
     * @params mws (Array)
     * @params ctx (Object)
     * @params done (Function)
     */
    executeMiddlewares(component, mws, ctx, done){
        let me = this;
        return function nextFn(){
            if(!mws || !mws.length){
                return done();
            }
            mws[0].call(component, () => me.executeMiddlewares(component, mws.slice(1), ctx, done)(), ctx);
        }
    }

    search(param, value){
        this.trigger('state-search', {param, value})
        return this;
    }

    /**
     * getters and setters
     */
    get view(){
        return this._view;
    }

    set view(val){
        this._view = val;
    }

    get root(){
        return this._root;
    }

    set root(v){
        this._root = v;
    }

    get prev(){
        return this._prev;
    }

    set prev(v){
        this._prev = v;
    }

    get busy(){
        return this._busy;
    }

    set busy(val){
        this._busy = val;
    }

    get title(){
        return this._title;
    }

    set title(val){
        this._title = val;
    }

    get routes(){
        return this._routes;
    }

    set routes(val){
        this._routes = val
    }

    get defaultRoute(){
        return this._defaultRoute;
    }

    set defaultRoute(val){
        this._defaultRoute = val;
    }

    get location(){
        return this._location;
    }

    set location(val){
        this._location = val
    }

    trigger(...args){
        return this._emitter.trigger.apply(this._emitter, args);
    }

    on(...args){
        return this._emitter.on.apply(this._emitter, args);
    }

    off(...args){
        return this._emitter.off.apply(this._emitter, args);
    }

    one(...args){
        return this._emitter.one.apply(this._emitter, args);
    }
}

class Util {
    static distinct(arr){
        let res = [];
        for(let o of arr){
            if(res.indexOf(o) < 0){
                res.push(o);
            }
        }
        return res;
    }

    static completePart(uri){
        return uri.startsWith('/') ? uri : ('/' + uri);
    }

    static assert(val, msg){
        if(!val){
            throw new Error(msg);
        }
    }
    
    static omit(o, ...params){
        var res = {};
        for(var p in o){
            if(params.indexOf(p) < 0){
                res[p] = o[p]
            }
        }
        return res;
    }

    static compareUrl(u1, u2){
        var r = [];
        var arr1 = u1.split('/');
        var arr2 = u2.split('/');
        for(var i = 0, len = arr1.length; i<len; i++){
            if(arr1[i] === arr2[i]){
                r.push(arr1[i]);
            }else{
                break;
            }
        }
        return r.join('/')
    }

    static combineUriParts(parts, i, combined){
        if(!parts.length || i<=0){
            return combined;
        }
        let uri = parts[i-1] + '/' + combined;
        return Util.combineUriParts(parts, --i, uri);
    }

    static composeObject(ks, vs){
        var o = {};
        if(!Array.isArray(ks) || !Array.isArray(vs) || ks.length != vs.length){
            return o;
        }
        ks.forEach((k, index)=>{
            o[k] = vs[index]
        });
        return o;
    }

    static extractParams(path){ 
        return path.match(/_[a-zA-Z0-9:]+/g)
    }

    static toPattern(route){
        return route.replace(/_[a-zA-Z0-9:]+/g, "*");   
    }

    static nextTick(fn){
        return setTimeout(fn, 0);
    }

}

var hub = new Hub(riot.observable());

hub.view = viewCreator(hub);

export default { hub: hub, router: (history) => ({
    defaultRoute: null,

    prefixPath: '',

    _registerRoute: function({path, name, resolve, redirectTo, ...rest}, container){
        if(!this.routes){
            this.routes = [];
        }
        let route = {
            path: this.prefixPath + path,
            name,
            resolve,
            redirectTo,
            tag: container.tags[name],
            ...rest
        }
        this.routes.push(route);
        hub.routes.push(route);
        return this;
    },

    prefix: function(prefix){
        this.prefixPath = prefix;
        return this;
    },

    $use: function(fn){
        !this.$mws && (this.$mws = []);
        this.$mws.push(fn);
    },

    $routeConfig: function(rs){
        console.warn(rs)
        //set entry of router hub
        if(!this.parent){
            hub.root = this;
        }
        //compose prefix
        if(!this.prefixPath && this.parent && this.parent.routes){
            this.prefixPath = '/' + (this.parent.prefixPath || '') + getPrefix(this);
        }
        // register routes
        rs.forEach(route => {
            if(route.defaultRoute){
                this.defaultRoute = route;
            }
            this._registerRoute(route, this);
            // init view
            console.warn(this.tags);
            hub.view.init(this.tags[route.name], route.name);
        });
        //helpers
        function getPrefix(tag){
            let returnPath = '';
            Object.keys(tag.parent.routes).forEach(path => {
                let route = tag.parent.routes[path];
                if(route.name === getTagName(tag)){
                    returnPath = route.name
                }
            });
            return returnPath;
        }
        function getTagName(tag){
            return tag.root.localName;
        }
    }
})};