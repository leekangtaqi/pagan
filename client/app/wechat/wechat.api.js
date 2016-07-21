let state = context.store.getState();
const Wechat = {
	params: {
		url  : window.location.href,
		title : document.title,
		desc : this.url,
		img : 'http://static.91pintuan.com/logo.png'
	},
	config:function(){
		var absUrl = window.location.href;
		$.get('/wechat/sign/jssdk?type=jsapi&url=' + encodeURIComponent(absUrl).replace('%3A', ':')).then(function(data){
			context.store.dispatch({type: 'signature', payload: data.signature});
			var config = {
				debug:debugWx,
				appId:data.appId,
				timestamp:data.timestamp,
				nonceStr:data.nonceStr,
				signature:data.signature,
				jsApiList:[
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'chooseWXPay',
					'editAddress',
					'startRecord', // gift
					'stopRecord',
					'onVoiceRecordEnd',
					'playVoice',
					'pauseVoice',
					'stopVoice',
					'onVoicePlayEnd',
					'uploadVoice',
					'downloadVoice',
					'scanQRCode',
					'openAddress',
					'getLocation',
					'openLocation'
				]
			};
			wx.config(config);
		});
	},
	ready:function(data){
		data  = data || {};
		var url   = data.url ?  data.url  : this.params.url;
		var title = data.title? data.title: this.params.title;
		var desc  = data.desc?  data.desc : this.params.url;
		var img   = data.img ?  data.img  : this.params.img;

		var options = {
			title: title,
			desc: desc,
			link: url,
			imgUrl:  img,
			success: function(res){/*alert(res.errMsg)*/},
			cancel: function(res){/*Alert.add('warning',res.errMsg);alert(res.errMsg);*/},
			fail: function(res){/*alert(res.errMsg)*/},
			complete: function(res){/*alert(res.errMsg)*/},
			trigger: function(res){/*alert(res.errMsg)*/}
		};
		var optionsTimeline = {
			title: data.timeline,
			link: url,
			imgUrl:  img
		};
		wx.ready(function(){
			wx.onMenuShareTimeline(optionsTimeline);
			wx.onMenuShareAppMessage(options);
			wx.onMenuShareQQ(options);
			wx.onMenuShareWeibo(options);
		});
	}
}

export default Wechat;