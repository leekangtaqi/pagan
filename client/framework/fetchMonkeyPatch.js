import riot from 'riot';

function post(url, json, opts){
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    opts && opts.headers && Object.assign(headers, opts.headers);
    return fetch(url, {
        method: 'post',
        headers: headers,
        body: JSON.stringify(json)
    })
        .then(res=>checkStatus(res))
        .then(res=>parseJSON(res))
        .then(data=>checkData(data))
}

function get(url, n={}, opts){
    var meta = {method: 'get', headers: {}};
    opts && opts.headers && Object.assign(meta.headers, opts.headers);
    return fetch(url, meta)
        .then(res=>checkStatus(res))
        .then(res=>parseJSON(res))
        .then(data=>checkData(data))
}

function put(url, json, opts){
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    opts && opts.headers && Object.assign(headers, opts.headers);
    return fetch(url, {
        method: 'put',
        headers: headers,
        body: JSON.stringify(json)
    })
        .then(res=>checkStatus(res))
        .then(res=>parseJSON(res))
        .then(data=>checkData(data))
}

function del(url, n={}, opts){
    var meta = {method: 'del', headers: {}};
    opts && opts.headers && Object.assign(meta.headers, opts.headers);
    return fetch(url, meta)
        .then(res=>checkStatus(res))
        .then(res=>parseJSON(res))
        .then(data=>checkData(data))
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error
    }
}

function parseJSON(response) {
    let contentType = response.headers.get('Content-Type'); 
    if(/json/.test(contentType)){
        return response.json();
    }else if(/text/.test(contentType)){
        return response.text();
    }else{
        let error = new Error('unknown data from remote');
        error.response = response;
        throw error;
    }
}

function checkData(data){
    if(typeof data === 'object'){
        if(data.errmsg){
            throw new Error(data.errmsg);
        }
    }
    return data
}

var api = {get, post, put, del};

const invocationCreator = function(path, props){
    let invocation = null;
    if(this && this.hasOwnProperty('path')){
        invocation = this;
        path && (invocation.path = path);
        props && (invocation.props = props);
    }else{
        invocation = {
            path: path,
            props: props,
            withProps: withProps,
            base: base
        };
    }
    ['get', 'post', 'put', 'del'].forEach(method =>{
        invocation[method] = (...args) => {
            var [uri, json, opts] = args;
            var repeatorOpts = opts || {};
            invocation.path && (uri = invocation.path + (uri || ''));
            invocation.props && (Object.assign(repeatorOpts, invocation.props));
            let chain = api[method].call(null, uri, json, repeatorOpts || {})
            chain.catch(e=> {
                errorInterceptor && errorInterceptor(e, chain)
            })
            return chain;
        }
    });
    return invocation;
};

var resEmitter = riot.observable({});

var errorInterceptor = null;

const setErrorInterceptor = fn => {
    errorInterceptor = fn;
}

const addResponseInterceptor = fn => {
    checkStatus = fn;
}

const withProps = function(props){ return invocationCreator.bind(this)(null, props)};

const base = function(path){return invocationCreator.bind(this)(path)};

export default {
    setErrorInterceptor,
    addResponseInterceptor,
    base,
    withProps,
    ...api
};