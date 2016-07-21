exports.getProvinces = () => [
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

exports.isEqual = (o1, o2) => {
	return o1.id === o2.id;
}

exports.format = (arr, field1, field2) => {
	return arr.map(function(a){
		a[field2] = a[field1];
		delete a[field1];
		return a;
	})
}

exports.distinct = arr => {
	var me = this;
	return arr.reduce((acc, curr)=>{
		if(acc.filter(a => me.isEqual(a, curr)).length <= 0){
			acc.push(curr);
		}
		return acc;
	}, [])
}

exports.getChildren = (items, id) => items.filter(i=>i.parent === id);