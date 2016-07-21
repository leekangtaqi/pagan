const groupsFilter = (groupsFilter = 'all', action) => {
	switch(action.type){
		case 'setGroupsFilter':
			return action.payload;
		default: 
			return groupsFilter;
	}
}

const initGroups = {
	items: [],
  busy: false,
  page: 1,
  limit: 10,
  params: {},
	count: 0
}
const groups = (groups = initGroups, action) => {
	switch(action.type){
		case 'initGroups': 
			return Object.assign({}, initGroups, action.payload);
		case 'setGroupsParams':
			return Object.assign({}, groups, {params: action.payload});
		case 'groupsNextPage':
			return Object.assign({}, groups, {page: groups.page+1});
		case 'groupsBusy':
			return Object.assign({}, groups, {busy: true});
		case 'groupsUnBusy':
			return Object.assign({}, groups, {busy: false});
		case 'setGroupsCount':
			return Object.assign({}, groups, {count: action.payload});
		case 'addGroup':
			return Object.assign({}, groups, {items: [...groups.items, ...action.payload]});
		default: 
			return groups;
	}
}

const group = (group={}, action) => {
	switch(action.type){
		case 'loadGroupById':
			return Object.assign({}, action.payload)
		default: 
			return group;
	}
}

const deliveryPayment = (deliveryPayment = 0, action) => {
	if(action.type === 'setDeliveryPayment'){
		return action.payload;
	}
	return deliveryPayment;
}

const initJoinGroupViewMeta = {
	submitted: false,
	submiting: false,
	poiLoaded: false,
	addrHad: false
}
const joinGroupViewMeta = (joinGroupViewMeta = initJoinGroupViewMeta, action) => {
	switch(action.type){
		case 'setJoinGroupAddrHad':
			return Object.assign({}, joinGroupViewMeta, {addrHad: action.payload});
		case 'setJoinGroupSubmited':
			return Object.assign({}, joinGroupViewMeta, {submitted: action.payload});
		case 'setJoinGroupSubmiting':
			return Object.assign({}, joinGroupViewMeta, {submiting: action.payload});
		case 'setJoinGroupPoiLoaded':
			return Object.assign({}, joinGroupViewMeta, {poiLoaded: action.payload});
		default: 
			return joinGroupViewMeta;
	}
}

const groupPois = (groupPois = [], action) => {
	switch(action.type){
		case 'loadPoisByLbs':
			return [...action.payload]
		case 'setGroupPois':
			return [...action.payload]
		default: 
			return groupPois;
	}
}

const joinGroupAddrStic = (joinGroupAddrStic = {}, action) => {
	switch(action.type){
		case 'setJoinGroupAddrStic':
			return Object.assign({}, action.payload);
		case 'updateJoinGroupAddrStic':
			return Object.assign({}, joinGroupAddrStic, {...action.payload}); 
			return 
	}
	if(action.type === 'setJoinGroupAddrStic'){
		return action.payload;
	}
	return joinGroupAddrStic;
}

const initAddress = {
	name: '',
	telephone: '',
	address: '',
	province: '',
	city: '',
	district: ''
};
const joinGroupAddress = (joinGroupAddress = initAddress, action) => {
	switch(action.type){
		case 'initJoinGroupAddress':
			return Object.assign({}, action.payload)
		case 'updateJoinGroupAddress':
			return Object.assign({}, joinGroupAddress, {...action.payload})
		default: 
			return joinGroupAddress;
	}
}

const joinGroupTemplate = (joinGroupTemplate = {}, action) => {
	switch(action.type){
		case 'setJoinGroupTemplate':
			return Object.assign({}, action.payload);
		default: 
			return joinGroupTemplate;
	}
}

const joinGroupAddresses = (joinGroupAddresses = [], action) => {
	switch(action.type){
		case 'setJoinGroupAddresses':
			return [...action.payload];
		default: 
			return joinGroupAddresses;
	}
}

const joinGroupCities = (joinGroupCities = [], action) => {
	switch(action.type){
		case 'setJoinGroupCities':
			return [...action.payload];
		case	'setJoinGroupDistricts':
			if(joinGroupCities.length){
				return joinGroupCities.map(city=>{
					if(city.id === action.payload.cid){
						city.districts = [...action.payload.districts];
					}
					return city;
				})
			}
			return joinGroupCities;
		default: 
			return joinGroupCities;
	}
}

const initSelectJoinGroupAddress = {
	province: {},
	city: {},
	district: {}
}
const selectJoinGroupAddress = (selectJoinGroupAddress = initSelectJoinGroupAddress, action) => {
	switch(action.type){
		case 'selectJoinGroupProvince':
			return Object.assign({}, selectJoinGroupAddress, {province: action.payload})
		case 'selectJoinGroupCity':
			return Object.assign({}, selectJoinGroupAddress, {city: action.payload})
		case 'selectJoinGroupDistrict':
			return Object.assign({}, selectJoinGroupAddress, {district: action.payload})
		default:
			return selectJoinGroupAddress;
	}
}

const joinGroupProvinces = (joinGroupProvinces = [], action) => {
	switch(action.type){
		case 'setJoinGroupProvinces':
			return [...action.payload];
		default: 
			return joinGroupProvinces;
	}
}

const initGroupMoney = {
	price: 0,
	maxs: 0
};
const groupMoney = (groupMoney = initGroupMoney, action) => {
	switch(action.type){
		case 'setGroupMoney':
			return Object.assign({}, groupMoney, action.payload)
		default:
			return groupMoney;
	}
}

export default {
	groupsFilter,
	groups,
	group, 
	joinGroupViewMeta,
	groupPois,
	joinGroupAddress, 
	joinGroupAddrStic,
	joinGroupProvinces,
	deliveryPayment,
	joinGroupCities,
	joinGroupAddresses,
	selectJoinGroupAddress,
	joinGroupTemplate,
	groupMoney
}