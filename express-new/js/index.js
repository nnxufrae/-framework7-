var hiApp = new Framework7({
	fastClicks: false,
	animatePages: true,
	popupCloseByOutside: false,
	animateNavBackIcon: false,
	modalTitle: '提示',
	modalButtonOk: '确认',
	modalButtonCancel: '取消',
	swipeBackPage: false,
	pushState: true,
	precompileTemplates: true,
	preloadPreviousPage: true,
//	preroute: (view, options) => {
//		if(!options) {
//			if(view.url == 'pages/login_resiger.html' || view.url == 'pages/index_active.html' || view.url == 'pages/index_message.html' ||
//				view.url == 'pages/runfriendclub.html' || view.url == 'pages/personcent.html') {
//				console.log('return false');
//				return false;
//			}
//		}
//	}
});

var $$ = Framework7.$;
var Tokenid = '';
var Openid = '';
var coo = '';
window.mainView = hiApp.addView('#mainView');

//加载页面
mainView.router.loadPage('pages/index.html?a=1');

var width = $$(window).width();
if(width > 768) {
	$$(document.body).css({
		"width": "640px",
		"margin": "0 auto"
	});
}

/**
 * tap事件封装
 * @param dom
 * @param callback
 */
function bindTapEvent(page, dom, callback, capture) {

	$$(page).on('click', dom, function(e) {
		callback && callback(this, e);
	}, capture ? false : true);

	//  var touch = {};
	//  $$(document).on('touchstart', dom, function(e) {
	//      touch.x1 = e.touches[0].pageX;
	//      touch.y1 = e.touches[0].pageY;
	//      touch.x2 = e.touches[0].pageX;
	//      touch.y2 = e.touches[0].pageY;
	//  }).on("touchmove", dom, function(e) {
	//      touch.x2 = e.touches[0].pageX;
	//      touch.y2 = e.touches[0].pageY;
	//  }).on('touchend', dom, function(e) {
	//      if ((touch.x2 && Math.abs(touch.x1 - touch.x2) < 30) &&
	//          (touch.y2 && Math.abs(touch.y1 - touch.y2) < 30)) {
	//          callback && callback(this, e);
	//      }
	//  });
}

bindTapEvent(document, ".tab-link", function(_this) {
	var that = this;
	var _href = $$(_this).attr('content-href');
	if(!userObj.getUserId()) {
		mainView.router.loadPage("pages/login.html");
		return;
	} else {
		mainView.router.loadPage(_href);
		return;
	}

});
//bindTapEvent(document, ".toolbar_init", function(_this, e) {
////	var that = this;
////	var _href = $$(_this).attr('content-href');
////	mainView.router.loadPage(_href);
// if($$(_this).hasClass("active")){
//	return;
//  } 
////  $$(".toolbar_init").removeClass("active");
//  $$(_this).addClass("active");
//	return;
//});
bindTapEvent(document, ".link", function(_this, e) {
	var _href = $$(_this).attr('cart-href');
	mainView.router.loadPage(_href);
});
//路由初始化
router.init();

util.bindEvent();

var coCall = {
	//这个接口表明native收到新消息(聊天)到来的提示，
	//通知web页面刷新数据
	newMsgComing: function(id, type) {
		// 0 群聊 1 私聊

		if(typeof cordova != "undefined") {
			//向native端发送请求消息列表的通知
			cordova.exec(function(message) {}, function(message) {}, "RTCPlugin", "chatList", [""]);
		}
	},
	//这个接口表示native端整理消息列表结束，将数据返回给web端
	onChatListInit: function(jsonString) {
		var d = JSON.parse(jsonString);
		//var d = [{
		//	"headImg": "null",
		//	"name": "pig0074",
		//	"lastMsg": "ff",
		//	"isGroup": false,
		//	"isMute": false,
		//	"isNewMsg": true,
		//	"isTop": false,
		//	"time": "17:57",
		//	"ryId": "4955cf3a-d0aa-4902-9eca-8f3bbe2645b0"
		//}, {
		//	"headImg": "null",
		//	"name": "nnxu",
		//	"lastMsg": "阿西吧",
		//	"isGroup": false,
		//	"isMute": false,
		//	"isNewMsg": false,
		//	"isTop": false,
		//	"time": "14:41",
		//	"ryId": "68ccce12-839e-4750-b91c-f42fef79031b"
		//}];
		console.log(d);

		index_messageObj.getmessage(d);

	}
};