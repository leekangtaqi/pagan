'use strict';
const initCommodityList = {
	items: [],
  busy: false,
  page: 1,
  limit: 10,
  params: {}
}
const commodityList = (commodityList = initCommodityList, action) => {
	switch(action.type){
		case 'commodityListSetParams':
			return Object.assign({}, commodityList, {params: action.payload});
		case 'commodityListNextPage':
			return Object.assign({}, commodityList, {page: commodityList.page+1});
		case 'commodityListBusy':
			return Object.assign({}, commodityList, {busy: true});
		case 'commodityListUnBusy':
			return Object.assign({}, commodityList, {busy: false});
		case 'addCommodityList':
			return Object.assign({}, commodityList, {items: [...commodityList.items, ...action.payload]});
		default: 
			return commodityList;
	}
}

const initialProvinces = [
	{id:110000,name:"北京",py:'beijing'},
	{id:310000,name:"上海",py:'shanghai'},
	{id:330000,name:"浙江",py:'zhejiang'},
	{id:320000,name:"江苏",py:'jiangsu'},
	{id:440000,name:"广东",py:'guangdong'},
	{id:210000,name:"辽宁",py:'liaoning'},
	{id:520000,name:"贵州",py:'guizhou'},
	{id:340000,name:"安徽",py:'anhui'},
	{id:500000,name:"重庆",py:'chongqing'},
	{id:350000,name:"福建",py:'fujian'},
	{id:510000,name:"四川",py:'sichuan'},
	{id:120000,name:"天津",py:'tianjin'},
	{id:130000,name:"河北",py:'hebei'},
	{id:430000,name:"湖南",py:'hunan'},
	{id:460000,name:"海南",py:'hainan'},
	{id:370000,name:"山东",py:'shandong'},
	{id:140000,name:"山西",py:'shanxi'},
	{id:610000,name:"陕西",py:'shan3xi'},
	{id:230000,name:"黑龙江",py:'heilongjiang'},
	{id:220000,name:"吉林",py:'jilin'},
	{id:410000,name:"河南",py:'henan'},
	{id:420000,name:"湖北",py:'hubei'},
	{id:360000,name:"江西",py:'jiangxi'},
	{id:150000,name:"内蒙古",py:'neimenggu'},
	{id:640000,name:"宁夏",py:'ningxia'},
	{id:630000,name:"青海",py:'qinghai'},
	{id:650000,name:"新疆",py:'xinjiang'},
	{id:540000,name:"西藏",py:'xizang'},
	{id:530000,name:"云南",py:'yunnan'},
	{id:620000,name:"甘肃",py:'ganshu'},
	{id:450000,name:"广西",py:'guangxi'},
]
const commProvinces = (commProvinces = initialProvinces, action) => {
	if(action.type === 'getCommProvinces'){
		return [...commProvinces];
	}
	return commProvinces;
}

const commCities = (commCities = [], action) => {
	switch(action.type){
		case 'changeCommCities':
			return [...action.payload];
		default:
			return commCities;
	}
}

const commGroupProvince = (commGroupProvince = {}, action) => {
	switch(action.type){
		case 'commGroupProvince':
			return Object.assign({}, commGroupProvince);
		default: 
			return commGroupProvince;
	}
}

const commSelectArea = (commSelectArea = {}, action) => {
	switch(action.type){
		case 'commSelectCity':
			return Object.assign({}, action.payload);
		case 'commSelectDistrict':
			return Object.assign({}, commSelectArea, {district: action.payload});
		default:
			return commSelectArea;
	}
}

const comm = (comm = {}, action) => {
	switch(action.type){
		case 'getComm':
			return Object.assign({}, action.payload);
		default: 
			return comm;
	}
}

const commId = (commId = '', action) => {
	if(action.type === 'changeCommId'){
		return action.payload;
	}
	return commId;
}

const commInfoAlbums = (commInfoAlbums = [], action) => {
	switch(action.type){
		case 'getCommInfoAlbums':
			return [...action.payload];
		default:
			return commInfoAlbums;
	}
}

const commGroupAddress = (commGroupAddress = {}, action) => {
	switch(action.type){
		case 'initCommGroupAddress':
			return Object.assign({}, action.payload);
		case 'updateCommGroupAddress':
			return Object.assign({}, commGroupAddress, {...action.payload})
		default:
			return commGroupAddress;
	}
}

export default {
	commodityList, 
	comm,
	commInfoAlbums, 
	commId, 
	commProvinces, 
	commSelectArea, 
	commGroupAddress,
	commGroupProvince
}