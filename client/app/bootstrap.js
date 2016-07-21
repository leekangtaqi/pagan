import Cookies from '../framework/cookie';

const bootstrap = async (store) => {
    var debugWx = false;
    var hostname = window.location.hostname.split('.');
    var token = '';

    var req = new XMLHttpRequest();
    req.open('GET', '/config', false);
    req.send(null);
    var response = JSON.parse(req.responseText);
    var api = response.api;
    window.debugWx  = response.debugWx;
    function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    var code = getUrlVars()["code"];
    if(code){
        req.open('GET', api.uri+'/wechat/token?code='+code, false);
        req.setRequestHeader('X-API-From', api.from);
        req.setRequestHeader('X-Component', api.component);
        req.send(null);
        token = JSON.parse(req.responseText).token;
    }
    var fxer = getUrlVars()["fxer"];

    let Wechat = require('./wechat/wechat.api').default;

    Cookies.remove('token');

    Object.assign($, $.ajax.base(api.uri));
    
    $.setErrorInterceptor((e, chain) => {
        const response = e.response;
        if(!response){
            console.error("[action Failed]")
            console.error(e);
            return;
        }
        if(response && response.status === 401) {
            Cookies.remove('token');
            let route = store.getState().route;
            let fullUrl = route.$location.replace('_', '');
            return $.get('/wechat/client?referer=' + fullUrl).then(link => location.href = link.link);
        }
        if(response && response.data && response.data.errmsg){
            widgets.Alert.add('danger',response.data.errmsg);
        }else{
            widgets.Alert.add('danger','系统错误');
        }
    })

    $.addResponseInterceptor(response => {
        if(response.status === 205) {
            Cookies.remove('token');
            location.reload();
            return;
        }
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error
        }
    })

    var headers = {'X-API-From': api.from, 'X-Component': api.component};

    Object.assign($, $.withProps({headers}));

    if(fxer){Cookies.set('fxer', fxer);}

    if(Cookies.get('fxer')) {
      headers['X-FXER'] = Cookies.get('fxer');
    }

    Object.assign($, $.withProps({headers}));

    if(token){Cookies.set('token', token);}

    if(Cookies.get('token')) {
      headers.Authorization = Cookies.get('token');
      Object.assign($, $.withProps({headers}));
      store.dispatch(dispatch => {
        $.get('/wechat/userinfo').then(user => {
          dispatch({type: 'user', payload: user});
        })
      })
    }
    
    /**
     *  mock login
     */
    let res = await $.get(`/wechat/experience?uid=574d615e51d917f6131bc370`);
    Cookies.set('token', res.token);
    headers['Authorization'] = res.token;
    Object.assign($, $.withProps({headers}));

    Wechat.config();
    Wechat.ready();

    wx.error(function(res){
      alert(res.errMsg);
      widgets.Alert.add('warn', res.errMsg);
      Wechat.config();
    });

    store.dispatch( dispatch => {
      $.get('/merchant').then(data => {
        dispatch({type: 'fetchMerchant', payload: data});
        var title = data.pubno.nick_name + '的火爆拼团';
        var desc = '拼团购买更优惠，一起到' + data.pubno.nick_name+'来拼吧';
        Wechat.ready({title:title, desc:desc,timeline:desc});  
      })
      dispatch({type: 'isAndriod', payload: navigator.userAgent.match(/Android/i)})
      setTimeout(() => {
        dispatch({type: 'scrollTop', payload: true});
      }, 500)
    })
}
export default bootstrap;