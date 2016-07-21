const partakersNextPage = (query, done) => dispatch => {
	let state = context.store.getState();
    if(state.partakers.busy) return;
    dispatch({type: 'partakersBusy', payload: true});
    let params = state.partakers.params;
    Object.assign(params, query, {limit: state.partakers.limit, page: state.partakers.page});
    $.get(`/partaker?${$.util.querystring.stringify(params)}`).then(data=>{
			let count = data[0];
			var items = data[1];
			dispatch({type: 'partakersNextPage', payload: {items: items}});
			if((state.partakers.items.length + items.length) >= count){
					dispatch({type: 'partakersBusy', payload: true});
					return;
			}	
			dispatch({type: 'partakersUnBusy', payload: true});
    })
}

const loadPartakerById = (id, done = function noop(){}) => dispatch => {
	$.get('/partaker/' + id).then(data=>{
		dispatch({type: 'setPartaker', payload: data.partaker});
		dispatch({type: 'setPartakerQrcode', payload: data.qrcode});
		done();
	})
}

const findPartakerAndGroupByGroupIdAndUserId = id => dispatch => {
	$.get('/partaker/i?group=' + id).then(ptk => {
		dispatch({type: 'setDeliveryPayment', payload: ptk.freight});
	}).then(() => {
		return $.get('/group/' + id)
	}).then(group => {
		dispatch({type: 'loadGroupById', payload: group});
		var comm = group.commodity;
		if(comm.model === 'ladder'){
			dispatch({type: 'groupMoney', payload: {
				price: comm.price,
				maxs: 0}
			})
			comm.ladder.prices.forEach((price, key) => {
				let money = context.store.getState().groupMoney;
				if(group.num_order >= price.people && money.maxs < price.people){
					dispatch({type: 'groupMoney', payload: {price: price.price, maxs: price.people}})
				}
			});
		}
	})
}

const drawBack = id => dispatch => {
	$.post(`/partaker/${id}/ask/refund`).then(data => {
		widgets.Alert.add('success', data.message);
		// $state.reload();
	});
}

export default {
	partakersNextPage,
	loadPartakerById,
	findPartakerAndGroupByGroupIdAndUserId,
	drawBack
};