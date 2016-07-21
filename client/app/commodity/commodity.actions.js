const nextPage = commodityList => dispatch => {
	if (commodityList.busy) return;
	dispatch({type: 'commodityListBusy'});
	var query = {page: commodityList.page, limit:commodityList.limit};
	if(commodityList.params && commodityList.params.tips){
		query.tips = true;
	}
	$.get('/commodity?' + $.util.querystring.stringify(query)).then(data=>{
		if(!data.length){
			return dispatch({type: 'commodityListUnBusy'});
		}
		dispatch({type: 'addCommodityList', payload: data});
		if(data.length < commodityList.limit){
			dispatch({type: 'commodityListBusy'});
			return;
		}
		dispatch({type: 'commodityListNextPage'});
		dispatch({type: 'commodityListUnBusy'});
	});
};

const changeCommId = commId => ({type: 'changeCommId', payload: commId});

const getComm = (id, done) => dispatch => $.get('/commodity/' + id).then(data => {
	dispatch({type: 'getComm', payload: data})
	setTimeout(done, 0);
});

const getCommInfoAlbums = (id, done) => dispatch => {
	$.get('/album/commodity/' + id).then(data=>{
		dispatch({type: 'getCommInfoAlbums', payload: data})
		done && setTimeout(done, 0);
	})
}

const getCommCities = province => dispatch => {
	let py = province.py;
	dispatch({type: 'commGroupProvince', payload: province});
	$.get('/address/city?province=' + py).then(data=>{
		dispatch({type: 'changeCommCities', payload: data.city});
		let state = context.store.getState();
		let address = state.commGroupAddress;
		let city =  state.commSelectArea;
		data.city && data.city.forEach((val, key)=>{
			if(val.id === address.city.id){
				dispatch({type: 'commSelectCity', payload: val});
				city.district && city.district.forEach((val,key) => {
					if(val.id === address.district.id){
						dispatch({type: 'commSelectDistrict', payload: val});
					}
				});
			}
		})
	})
}

const fetchCommGroupAddress = callback => dispatch => {
	$.get('/address').then(data=>{
		dispatch({type: 'initCommGroupAddress', payload: data})
		if(data.province){
			context.store.getState().commProvinces.forEach((val, key)=>{
				if(val.id === data.province.id){
					dispatch(getCommCities(val));
				}
			})
		}
		callback(data);
	})
}

const updateCommGroupAddress = meta => {
	return {
		type: 'updateCommGroupAddress',
		payload: meta
	}
}

const getCommProvinces = () => ({type: 'getCommProvinces', payload: ''});

export default {
	nextPage, 
	getComm, 
	getCommInfoAlbums,
	changeCommId, 
	getCommProvinces, 
	getCommCities,
	updateCommGroupAddress,
	fetchCommGroupAddress
};