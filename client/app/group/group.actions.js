import addrActions from '../address/address.actions';
import Cookies from '../../framework/cookie';

const nextPage = () => dispatch => {
    let state = context.store.getState();
    if(state.groups.busy) return;
    dispatch({type: 'groupsBusy', payload: true});
    let params = state.groups.params;
    Object.assign(params, {limit: state.groups.limit, page: state.groups.page});
    $.get(`/group?${$.util.querystring.stringify(params)}`).then(data=>{
        let count = data[0];
        var items = data[1];
        dispatch({type: 'setGroupsCount', payload: count});
        dispatch({type: 'addGroup', payload: items});
        dispatch({type: 'groupsNextPage'});
        if((context.store.getState().partakers.items.length + items.length) >= count){
            dispatch({type: 'groupsBusy', payload: true});
            return;
        }
        dispatch({type: 'groupsUnBusy', payload: true});
    })
}

const initGroups = json => dispatch => dispatch({type: 'initGroups', payload: json});

const changeJoinGroupProvince = (newVal, tag) => dispatch => {
    dispatch({type: 'selectJoinGroupProvince', payload: newVal});
    let state = context.store.getState();
    dispatch({type: 'setDeliveryPayment', payload: 0})
    if(!newVal){
        return dispatch({type: 'setJoinGroupCities', payload: null});
    };
    let promise = null;
    let addresses = state.joinGroupAddresses;
    if(tag.isLimitPurchase){
        promise = Promise.resolve(addrActions.getChildren(addresses, newVal.id));
    }else{
        promise = $.get('/address/city?province=' + newVal.py);
    }
    promise.then(cities => {
        if(tag.isLimitPurchase){
            dispatch({type: 'setJoinGroupCities', payload: cities});
            cities.forEach(city => {
                dispatch({type: 'setJoinGroupDistricts', payload: {cid: city.id, districts: addrActions.getChildren(addresses, city.id)}})
            })
        }else{
            dispatch({type: 'setJoinGroupCities', payload: cities.city})
        }
        context.store.getState().joinGroupCities.forEach((city,key) => {
            let cityInProfile = context.store.getState().joinGroupAddress.city;
            if(cityInProfile && city.id === cityInProfile.id){
                dispatch({type: 'selectJoinGroupCity', payload: city});
                city.district.forEach((val,key) => {
                    let state = context.store.getState();
                    if(state.joinGroupAddress.district && 
                    val.id === state.joinGroupAddress.district.id){
                        dispatch({type: 'selectJoinGroupDistrict', payload: val});
                    }
                });
            }
        })
        if(tag.isLimitPurchase){
            tag.update();
        }
    });
}

const loadGroupByIdAndInitArea = (id, done) => dispatch => {
    let state = context.store.getState();
    loadGroupById(id, data => {
        dispatch({type: 'setJoinGroupProvinces', payload: addrActions.getProvinces()});
        if(data.commodity.consumeType === '1'
        && data.commodity.logistic
        && data.commodity.logistic.type === '1'
        ){
          var tpl = data.commodity.logistic.template;
          dispatch({type: 'setJoinGroupTemplate', payload: tpl});
          dispatch({type: 'setJoinGroupAddresses', payload: data.addresses});
          dispatch({type: 'setJoinGroupProvinces', payload: addrActions.getChildren(data.addresses, null)});
        }
        dispatch({type: 'setJoinGroupPoiLoaded', payload: false});
        if(data.commodity.status.lbs){
            wx.ready(function(){
                wx.getLocation({
                    success: function (res) {
                        let query = $.util.querystring.stringify({
                            tag: data.commodity.poitag,
                            latitude:res.latitude,
                            longitude:res.longitude
                        });
                        $.get('/wechat/poi?' + query).then(pois => {
                            dispatch({type: 'setGroupPois', payload: pois});
                            dispatch({type: 'setJoinGroupPoiLoaded', payload: true});
                        })
                    },
                    cancel: function (res) {widget.Alert.add('warning','您拒绝授权获取地理位置');},
                    fail: function(res){window.location.reload();}
                });
            });
        }else{
            const url = data.commodity.poitag ? 
                '/wechat/poi?tag=' + data.commodity.poitag :
                '/wechat/poi';
            $.get(url)
            .then(function (pois) {
                dispatch({type: 'setGroupPois', payload: pois});
                dispatch({type: 'setJoinGroupPoiLoaded', payload: true});
            })
        }
        done && done(data);
    })(dispatch)
}

const participate = () => dispatch => {
    dispatch({type: 'setJoinGroupSubmiting', payload: true});
    setTimeout(()=>{dispatch({type: 'setJoinGroupSubmiting', payload: false})}, 5000);
    let state = context.store.getState();
    let address = state.joinGroupAddress;
    let area = state.selectJoinGroupAddress;
    let group = state.group;
    let addr_stic = state.joinGroupAddrStic
    
    if(area.province){
        dispatch({type: 'updateJoinGroupAddress', payload: {province: $.util.omit(area.province, 'py')}});
    }

    if(area.city){
        dispatch({type: 'updateJoinGroupAddress', payload: {city: $.util.omit(area.city, 'districts')}});
    }

    if(area.district){
        dispatch({type: 'updateJoinGroupAddress', payload: {district: area.district}});
    }

    address.remark && dispatch({type: 'updateJoinGroupAddrStic', payload: {remark: address.remark}});
    
    if (!$.util.deepEqual(address, addr_stic)){
        dispatch({type: 'updateJoinGroupAddress', payload: {id: ''}});
    }

    //添加sku信息
    var key = 'grp_sku_' + group.id;
    var skuCki = Cookies.get(key);
    if(skuCki) dispatch({type: 'updateJoinGroupAddress', payload: {sku: skuCki}});
    $.post('/group/' + group.id + '/join', context.store.getState().joinGroupAddress).then(data=>{
        wx.chooseWXPay({
            timestamp: data.timestamp,
            nonceStr : data.nonceStr,
            package  : data.package,
            signType : data.signType,
            paySign  : data.paySign,
            success  : function(res) {
                Cookies.remove(key);//删除sku信息
                riot.route('group/_' + data.id)
            },
            cancel   : function(res) {
                dispatch({type: 'setJoinGroupSubmiting', payload: false});
                riot.route('group/_' + data.id)
            },
            fail     : function(res) {
                dispatch({type: 'setJoinGroupSubmiting', payload: false});
                riot.route('group/_' + data.id)
            }
        });
    })
}

const loadGroupById = (id, done) => dispatch => {
    let state = context.store.getState();
    $.get('/group/' + id).then(data=>{
        dispatch({type: 'loadGroupById', payload: data})
        done && done(data);
    }).catch(e=>{
        console.warn(e);
    })
}

const initJoinGroupAddress = user => {
    return {
        type: 'initJoinGroupAddress',
        payload: {
            name: user ? user.name : '',
            telephone: user ? user.telephone : '',
            address: user ? user.address : '',
            province: user ? user.province : '',
            city: user ? user.city : '',
            district: user ? user.district : '',
        }
    }
}

const loadJoinGroupAddress = () => dispatch => {
    let provinces = context.store.getState().commProvinces;
    $.get('/address').then(data=>{
        if(data){
            dispatch({type: 'initJoinGroupAddress', payload: data});
            dispatch({type: 'setJoinGroupAddrStic', payload: data});
            dispatch({type: 'setJoinGroupAddrHad', payload: true});
            if(data.province){
                provinces.forEach(p => {
                    if(p.id === data.province.id){
                        dispatch({type: 'setJoinGroupProvince', payload: p});
                    }
                })
            }
        }
    })
} 

const replenishment = id => dispatch => {
    $.post(`/group/${id}/order`).then(data => {
        wx.chooseWXPay({
            timestamp: data.timestamp,
            nonceStr : data.nonceStr,
            package  : data.package,
            signType : data.signType,
            paySign  : data.paySign,
            success  : function(res) {
                // var url = $state.href(data.state, {id:data.id});
                // location.href = url;
                riot.route(`/group/_${id}`);
            },
            cancel   : function(res) {
                riot.route(`/group/_${id}`);
            },
            fail     : function(res) {
                riot.route(`/group/_${id}`);
            }
        }); 
    })
}

const updateJoinGroupAddress = address => ({type: 'updateJoinGroupAddress', payload: address});

export default {
    nextPage,
    initGroups,
    loadGroupById, 
    initJoinGroupAddress, 
    loadJoinGroupAddress, 
    loadGroupByIdAndInitArea,
    changeJoinGroupProvince,
    updateJoinGroupAddress,
    participate,
    replenishment
}