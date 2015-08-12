//函数库
var GYPage={
getParam:function(a){var b=location.search.substr(1,location.search.length),c=this.strToObj(decodeURIComponent(b));return a?c[a]:c},
getHash:function(e){var t = e ? e : decodeURIComponent(location.hash), n = [], r = {};return  t.replace(/[\.\?'"><:;,\[\]\{\}]/ig, ""), n = t.split("/"), n.length==1 && (n.unshift('#iwen'), n[1]=n[1].substring(1)), n[1].indexOf('=') < 0 && (n[1] = 'p='+n[1]), n.length > 0 && (r.pageId = n.splice(0,1)[0].substring(1), r.urlParams = n.length > 0 ? this.strToObj(n.join("/"), !0) : {}),r['pageId'] == "iwen" && (r.pageId = r.urlParams['p']), r;},
strToObj:function(a,b){var e,f,g,c=[],d={};for(a=a.replace(/\?/g,"&"),c=a.split("&"),g=c.length,e=0;g>e;e++)c[e].indexOf("=")<0||(f=c[e].split("="),d[f[0]]=b?decodeURIComponent(f[1]):f[1]);return d},
pushHash:function(a){location.hash=this.objToHash(a)},objToHash:function(a){var b=a.pageId,c=this.objToStr(a.urlParams,!0);return c.length>0?b+"/"+c:b},
objToStr:function(a,b){var d,e,c="";for(d in a)"undefined"!=typeof a[d]&&(e=b?encodeURIComponent(a[d]):a[d],c+=d+"="+e+"&");return c.slice(0,c.length-1)},
getHTML:function(id,data){return txTpl(document.getElementById(id).innerHTML,data)},
getFormatNumber:function(n){var b=parseInt(n).toString(),len=b.length;if(len<=3){return b;} var r=len%3;return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{3}/g).join(","):b.slice(r,len).match(/\d{3}/g).join(",");},
getLocalStorage:function(key){return localStorage.getItem(key) || (function(name){var strCookie=document.cookie;var arrCookie=strCookie.split("; ");for(var i=0;i<arrCookie.length;i++){var arr=arrCookie[i].split("=");if(arr[0]==name)return unescape(arr[1]);}return 'undefined';})(key);},
setLocalStorage:function(key, value){localStorage.setItem(key, value);(function(name, value){var cookieString=name+"="+escape(value);var date = new Date();date.setTime(date.getTime()+365*24*3600*1000);cookieString=cookieString+"; domain=gongyi.qq.com; path=/; expire="+date.toGMTString();document.cookie=cookieString;})(key, value);},
getLocalPath:function(){var a=location.href,b=0;return b=a.lastIndexOf("#"),b>0&&(a=a.substring(0,b)),b=a.lastIndexOf("?"),b>0&&(a=a.substring(0,b)),a},
jsonToString:function(a){var c,d,e,f,g,b=this;switch(typeof a){case"string":return'"'+a.replace(/(["\\])/g,"\\$1")+'"';case"array":return"["+a.map(b.jsonToString).join(",")+"]";case"object":if(a instanceof Array){for(c=[],d=a.length,e=0;d>e;e++)c.push(b.jsonToString(a[e]));return"["+c.join(",")+"]"}if(null==a)return"null";f=[];for(g in a)f.push(b.jsonToString(g)+":"+b.jsonToString(a[g]));return"{"+f.join(",")+"}";case"number":return a;case!1:return a}},
stringToJSON:function(obj){return eval("("+obj+")")},
debug:function(data){console.log(data);}
};
Date.prototype.format=function(a){var c,b={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(c in b)new RegExp("("+c+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?b[c]:("00"+b[c]).substr((""+b[c]).length)));return a};
function checkWeixinIOSVer(a){function b(a,b){var c,d,e,f;if(a==b||-1==a)return 0;a=String(a).split("."),b=String(b).split(".");try{for(c=0,d=Math.max(a.length,b.length);d>c;c++){if(e=isFinite(a[c])&&Number(a[c])||0,f=isFinite(b[c])&&Number(b[c])||0,f>e)return-1;if(e>f)return 1}}catch(g){return-1}return 0}var c=/(iphone)|(ipad)|(ipod)/i.test(window.navigator.userAgent),d=window.navigator.userAgent.match(/MicroMessenger\/([\d.]+)/i),e=d&&d.length>1?d[1]:-1;return c&&b(e,a)<0}

GYPage.config = {};
GYPage.config.wxAppid = 'wxc0db45f411664b2e';

/**
@author hunterguo
@desc 腾讯公益微信分享
*/
;(function(gy){
	GYPage.WXSNS = GYPage.WXSNS||{};
	var WXSNS = GYPage.WXSNS||{};

	WXSNS.share = function(oPar){
		var par = {
			"appid":GYPage.config.wxAppid, 
			"img_url":'', 
			"img_width":"120", 
			"img_height":"120", 
			"link":GYPage.getLocalPath(), 
			"desc":'', 
			"title":''
		}
		$.extend(par, oPar);
		//微信分享
		function onBridgeReady() {
			WeixinJSBridge.call("showOptionMenu"); 	
			WeixinJSBridge.on('menu:share:appmessage' , function(argv){
				WeixinJSBridge.invoke('sendAppMessage', par, function(res){
					if(typeof(WXSNS.shareCallback) == 'function') WXSNS.shareCallback(res);
				})
			});
			WeixinJSBridge.on('menu:share:timeline',function(argv) {
				WeixinJSBridge.invoke('shareTimeline', par, function(res){
					if(typeof(WXSNS.shareCallback) == 'function') WXSNS.shareCallback(res);
				});
		    });	
		}
		if(document.addEventListener){document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);} else if(document.attachEvent){document.attachEvent('WeixinJSBridgeReady', onBridgeReady); document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);}

	}
	$.extend(GYPage.WXSNS, WXSNS);
})(GYPage);
/**
@author hunterguo
@desc 腾讯公益微信支付
*/
;(function(gy){

	GYPage.WXPAY = GYPage.WXPAY||{};
	var WXPAY = GYPage.WXPAY||{};
	var wxoid = "",localOidKey="";
	WXPAY.config = {
		appid : GYPage.config.wxAppid, 
		wxoid : '',
		debug : true ,
		oDebug : true ,
	}
	//初始化配置
	WXPAY.init = function(config){
		$.extend(config, WXPAY.config);
		WXPAY.config = config;
		localOidKey='openidwxa'+appid;
		//如果传有code，进行获取openid
		var _code = GYPage.getParam('code');
		if(!!_code) this.getOid(_code);
	}

	//通过code获取opeind
	//callback: 支付成功后的回调函数
	WXPAY.getOid = function(code, callback){
		if(!!code){
            $.getJSON('https://ssl.gongyi.qq.com/cgi-bin/WXGetOIDInfo_eth1?type=getoid&jsoncallback=?&appid='+WXPAY.config.appid+'&code=' + code, function(data){
                if(data.ret != 0){
                    location.href='index2_gzzh.htm';
                    return;
                }
                wxoid = data["oid"];
                GYPage.setLocalStorage(localOidKey, wxoid);
                //执行回调函数
                if(typeof(callback) == 'function') callback;
            });
        } else {
            var locationPath = GYPage.getLocalPath();
            window.location = 'http://open.weixin.qq.com/connect/oauth2/authorize?appid=' + WXPAY.config.appid + '&redirect_uri=' + encodeURIComponent(locationPath)
            +'&response_type=code&scope=snsapi_base#wechat_redirect';
        }
	}

	WXPAY.paySubmit = function(oPar){
		var rData = {};
		rData.ret = 0;
		//调用生成订单接口
		var gg = { //为了支持PC页面活动
			guin:GYPage.getParam('guin')||'', 
			gf:GYPage.getParam('gf')||'wx', 
			gt:GYPage.getParam('gt')||'',
			entry_type:GYPage.getParam('et')||'gzzh'
		};
		if(gg.entry_type == 'bk'){
			var c = /(iphone)|(ipad)|(ipod)/i.test(window.navigator.userAgent);
			gg.entry_type += (c ? 'i' : 'o')
		} else if(gg.entry_type == 'gzzh'){
			var c = /(iphone)|(ipad)|(ipod)/i.test(window.navigator.userAgent);
			gg.entry_type += (c ? 'i' : 'o')
		} else if(gg.entry_type == 'fx'){
			var c = /(iphone)|(ipad)|(ipod)/i.test(window.navigator.userAgent);
			gg.entry_type += (c ? 'i' : 'o')
		}
		var par = {
			appid:WXPAY.config.appid,
			guin:gg.guin, gt:gg.gt, gf:gg.gf, entry_type:gg.entry_type,
			entry_type:'paydemo',
			oid:(!wxoid || wxoid == 'undefined' || wxoid == undefined) ? '' : wxoid,
			money:0,
			bank_type:'8001',
			busi_type:'WXL',
			jsoncallback:'?'
		}
		$.extend(par, oPar);
		var _money = par.money||0;
		var _actid = par.actid||0;
		if(_money<=0){
			WXPAY.config.errMsg = 'money error!';
			if(!!WXPAY.config.debug){
				console.log("money error!");
			}
			rData.info = WXPAY.config.errMsg;
			rData.ret = 2011;
			if(typeof(WXPAY.payCallback) == 'function') WXPAY.payCallback(rData);
			return false;
		}
		if(_actid<=0){
			if(!!WXPAY.config.debug) GYPage.debug("actid error!");
			rData.info = WXPAY.config.errMsg;
			rData.ret = 2011;
			if(typeof(WXPAY.payCallback) == 'function') WXPAY.payCallback(rData);
			return false;
		}
		par.money = _money*100;		

		var _url = "https://ssl.gongyi.qq.com/cgi-bin/WXDonateEntryUnserialize?" + GYPage.objToStr(par);
		if(WXPAY.config.debug == true){
			GYPage.debug('WXDonateEntryUnserialize request|' + GYPage.jsonToString(par));
		}
		var _cbWillPay = function(data){
			if(WXPAY.config.debug == true){
				GYPage.debug('WXDonateEntryUnserialize Result|' + GYPage.jsonToString(data));
			}
			if(data.status != 0){
				WXPAY.config.errMsg = '服务器忙，请稍后重试（'+data.status+'）';
				rData.info = WXPAY.config.errMsg;
				rData.ret = data.status;
				if(typeof(WXPAY.payCallback) == 'function') WXPAY.payCallback(rData);
				return;
			}
			if(!(data.status == 0 && !!data.info)){
				if(data.status == 2){
					WXPAY.config.errMsg = '该项目募款已结束，请关注最新执行进展！';
				} else if(data.status == 3){
					WXPAY.config.errMsg = '该项目募款已结束，请查看结项报告！';
				} else {    
					WXPAY.config.errMsg = '服务器忙，请稍后重试（'+data.status+'）';
				}
				rData.info = WXPAY.config.errMsg;
				rData.ret = data.status;
				if(typeof(WXPAY.payCallback) == 'function') WXPAY.payCallback(rData);
				return;
			}

			var info = data.info,trade_no = info.trade_no;
			GYPage.setLocalStorage('transcode'+WXPAY.config.appid, trade_no);			///<订单号写入本地存储
			WXPAY.trade_no = trade_no;

			//第三方重构接入调试
			if(WXPAY.config.oDebug == true){
				var _oData = {};
				_oData.ret = 1;
				_oData.info = "支付成功";
				WXPAY.toResult(WXPAY.trade_no, _oData);
				return;
			}

			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', 
				{"appId":info.appId, "timeStamp":info.timeStamp, "nonceStr":info.nonceStr,"package":info.package, "signType":info.signType, "paySign":info.paySign}, 
				function(res){
					if(res.err_msg == "get_brand_wcpay_request:ok"){
						WXPAY.gyCheckTradeNo(false);
						interval = setInterval(WXPAY.gyCheckTradeNo, 5000); 
					} 
					//safari wx ios
					else if(res.err_msg == 'get_brand_wcpay_request:jump_to_safari'){
						if(typeof(WXPAY.safariCallback) == 'function'){
							WXPAY.safariCallback();
						}else if(window.comfire("如果支付完成了可以查看订单。")){
							WXPAY.gyCheckTradeNo(true);
						}
					}
				}
			);
		}
		jQuery.getJSON(_url, _cbWillPay);
	}


  //检查订单状态
	WXPAY.gyCheckTradeNo = function(safari){
		trade_no = WXPAY.trade_no || GYPage.getLocalStorage('transcode'+WXPAY.config.appid);
	    var _p = {
	    	transcode:trade_no,
	    	jsoncallback:'?'
	    }
	    if(WXPAY.config.debug == true){
	    	GYPage.debug('WXQueryOrder|' + GYPage.jsonToString(_p));
	    }
	    jQuery.getJSON(
	    	'https://ssl.gongyi.qq.com/cgi-bin/WXQueryOrder?' + GYPage.objToStr(_p), 
	    	function(data){
			    if(WXPAY.config.debug == true){
			    	GYPage.debug('WXQueryOrder Result|' + GYPage.jsonToString(data));
			    }
				if(!!data && data.ret == 1){
					wxoid = data.info.openid;
					GYPage.setLocalStorage(localOidKey, wxoid);

					GYPage.setLocalStorage('third_transcode'+WXPAY.config.appid, data.info.third_transcode);
					clearInterval(interval);

					WXPAY.toResult(WXPAY.trade_no, data);
				}
				//safari wx ios
				else if(safari){
					if(WXPAY.config.debug == true){
						GYPage.debug("ios 支付提示：正在确认捐赠结果，请以捐赠记录为准");
				    	GYPage.debug('WXQueryOrder Result|' + GYPage.jsonToString(data));
				    }
					WXPAY.toResult(WXPAY.trade_no, data, safari);
				}
    		}
    	);
	}

	//成功页跳转
	WXPAY.toResult = function(tradeno, data, safari){
		if(WXPAY.config.debug == true){
			GYPage.debug(tradeno+": 支付成功");
		}
		if(!!safari) data.safari = true;
		if(typeof(WXPAY.payCallback) == 'function') WXPAY.payCallback(data);
	}
	$.extend(GYPage.WXPAY, WXPAY);

})(GYPage);