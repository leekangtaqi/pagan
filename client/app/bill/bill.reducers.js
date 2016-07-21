const initBills = {
	items: [],
  busy: false,
  page: 1,
  limit: 10,
  params: {}
}
const bills = (bills = initBills, action) => {
	switch(action.type){
		case 'initBills': 
			return Object.assign({}, initBills, action.payload);
		case 'setBillsParams':
			return Object.assign({}, bills, {params: action.payload});
		case 'billsNextPage':
			return Object.assign({}, bills, {page: bills.page+1});
		case 'billsBusy':
			return Object.assign({}, bills, {busy: true});
		case 'billsUnBusy':
			return Object.assign({}, bills, {busy: false});
		case 'addBills':
			return Object.assign({}, bills, {items: [...bills.items, ...action.payload]});
		default: 
			return bills;
	}
}

export default {
	bills
}

