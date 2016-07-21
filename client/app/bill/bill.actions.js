const nextPage = () => dispatch => {
    let state = context.store.getState();
    if(state.bills.busy) return;
    dispatch({type: 'billsBusy', payload: true});
    let params = state.bills.params;
    Object.assign(params, {limit: state.bills.limit, page: state.bills.page});
    $.get(`/bill?${$.util.querystring.stringify(params)}`).then(data=>{
        let count = data[0];
        var items = data[1];
        dispatch({type: 'addBills', payload: items});
        dispatch({type: 'billsNextPage'});
        if((context.store.getState().bills.items.length + items.length) >= count){
            dispatch({type: 'billsBusy', payload: true});
            return;
        }
        dispatch({type: 'billsUnBusy', payload: true});
    })
}

export default {
    nextPage
}