var util = {
	//手机号码
	checkMobile: function(str) {
		return str.match(/^1[0-9]{10}$/i);
	},
	checkUserName: function(userName) {
		var reg = /^[a-zA-Z0-9_]{3,16}$/;
		return reg.test(userName);
	},
	checkPassword: function(password) {
		if(password.length < 6 || password.length > 16) {
			return false;
		}
		return true;
	},
	trim: function(str) {
		return str.replace(/(^\s+)|(\s+$)/g, "");
	},
	parse2Num: function(str) {
		return parseFloat(str).toFixed(2);
	},
	parseJson: function(data) {
		try {
			return eval('(' + data + ')');
		} catch(e) {
			console.log("json error");
			console.log(e.message);
		}
	},
	sheildMobile: function(mobileStr) {
		return mobileStr.substring(0, 3) + "****" + mobileStr.substring(7, 11);
	},
	getRequest: function(url) {
		if(!url) url = mainView.url; //获取url中"?"符后的字串
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(url.indexOf("?") + 1, url.length);
			str = str.replace(/\?/g, "&");
			var strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
		}
		return theRequest;
	},
	getAjaxData: function(request, times, notry) {
		var that = this;
		if(request) {
			var url = request.url,
				type = request.type || request.method || 'post',
				data = request.data || {},
				error = request.error,
				success = request.success;
			data._version = app_version, data._from = app_type;
		}
		if(!times) times = 1;
		$$.ajax({
			url: url,
			method: type,
			data: data,
			cache: false,
			timeout: 80000,
			error: function(e) {
				if(notry && notry == 'notry') return false;
				if(times >= 3) {
					that.writeAjaxLog(e, type, 'error');
					error && error(e);
				} else {
					times++;
					that.getAjaxData(request, times);
				}
			},
			success: function(json) {
				success && success(json);
			}
		});
	},
	writeAjaxLog: function(errorInfo, method, type, data) {
		var that = this,
			userAccount, log;
		try {
			userAccount = userObj.MEMBERACCOUNT || "";
			var plateFrom = "",
				agentId = "";
			if(util.getCookie('ar')) {
				plateFrom = util.getCookie('ar');
			}
			if(util.getCookie('agentId')) {
				agentId = util.getCookie('agentId');
			}
			if(type == 'error') {
				log = {
					"logFrom": app_type,
					"version": app_version,
					"user": userAccount,
					"UUID": that.getGuid(),
					"url": errorInfo.responseURL.replace(appBaseUrl, ""),
					"method": method,
					"statusCode": errorInfo.status,
					"time": errorInfo.timeout,
					"platFrom": plateFrom,
					"agentId": agentId
				};
			} else if(type == 'statist') {
				log = {
					"logFrom": app_type,
					"version": app_version,
					"user": userObj.ID,
					"UUID": that.getGuid(),
					"url": location.hash.replace('#!', ''),
					"method": "post",
					"current": (new Date()).getTime(),
					"statusCode": "",
					"platFrom": plateFrom,
					"agentId": agentId,
					"data": data
				};
			} else if(type == 'webLog') {
				log = {
					"logFrom": app_type,
					"version": app_version,
					"user": userObj.ID,
					"UUID": that.getGuid(),
					"url": location.hash.replace('#!', ''),
					"current": (new Date()).getTime(),
					"type": "webLog",
					"data": data
				};
			}
			that.getAjaxData({
				url: appConfig.WRONGAJAXLOG_URL,
				type: 'post',
				data: {
					log: JSON.stringify(log)
				},
				error: function(e) {
					return false;
				},
				success: function(json) {

				}
			}, 3, 'notry');
		} catch(e) {

		}
	},
	getLocalJson: function(url, callback) {
		$$.getJSON("./package.json", function(json) {
			callback && callback(json);
		})
	},
	preLoadImage: function(url, imgDom) {
		if(imgDom && imgDom.length > 1) {
			imgDom = $$(imgDom[0]);
		}
		var img = new Image();
		img.onload = function() {
			img.style.width = "100%";
			if(imgDom.attr("bg_src")) img.setAttribute("bg_src", imgDom.attr("bg_src"));
			imgDom.parent().css({
				"padding": "0px",
				"marginTop": "0px"
			});
			imgDom.parent().html("").append(img);
		};
		img.onerror = function(e) {
			// console.log(e);
			this.onload = null;
		};
		img.src = url;
	},
	nowdateCompare: function(date1) {
		date1 = date1.replace(/\-/gi, "/");
		//加一天
		var time1 = new Date(date1).getTime() + 86400000;
		var time2 = new Date().getTime();
		if(time1 > time2) {
			return 1;
		} else if(time1 == time2) {
			return 2;
		} else {
			return 3;
		}
	},
	markForm: function(postData, url) {
		var form = document.createElement("form");
		document.body.appendChild(form);
		for(var i = 0; i < postData.length; i++) {
			var input = document.createElement("input");
			input.type = "hidden";
			form.appendChild(input);
			input.name = postData[i].name;
			input.value = postData[i].value;
		}
		form.action = url;
		form.method = 'post';
		form.submit();
	},
	getGuid: function() {

		function S4() {
			return(((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}

		var that = this,
			uuid = "";
		if(that.getCookie('_uuid')) {
			uuid = that.getCookie('_uuid');
		} else {
			uuid = (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
			that.setCookie('_uuid', uuid, 1, null, "/", null);
		}
		return uuid;
	},
	//session过期
	setCookie2: function(name, value, domain, path, secure) {
		var text = name + "=" + escape(value)
		if(domain) {
			text += '; domain=' + domain;
		}
		if(path) {
			text += '; path=' + path;
		}
		if(secure) {
			text += '; secure';
		}
		document.cookie = text;
	},
	deepCopy: function(source) {
		var result = {};
		var strinobj = JSON.stringify(source);
		var result = JSON.parse(strinobj);
		return result;
	},
	setCookie: function(name, value, expires, domain, path, secure) {
		if(null == expires || 0 >= expires) var expires = 300;
		var r = new Date;
		// 24*60*60*1000 = 86400000
		r.setTime(r.getTime() + expires * 86400000);
		var text = name + "=" + escape(value) + ";" + "expires=" + r.toGMTString();
		if(domain) {
			text += '; domain=' + domain;
		}
		if(path) {
			text += '; path=' + path;
		}
		if(secure) {
			text += '; secure';
		}
		document.cookie = text;
	},
	getCookie: function(key, flag) {
		if(key === "agentId" && !flag) {
			return util.getAgentId();
		} else {
			var t = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+?)(;|$)"));
			return t != null ? unescape(t[2]) : null
		}
	},
	clearCookie: function(name) {
		var that = this;
		var cval = util.getCookie(name);
		if(cval != null) {
			that.setCookie(name, "", -1);
			that.setCookie(name, "", -1, null, "/", null);
		}
	},
	upLoadHelper: function(page, flieInputId, formId, obj, callback) {
		var that = this;
		$$(page).off('change').on('change', "#" + flieInputId, function() {
			if(obj.imgNums < obj.maxImgNums) {
				that.uploadFile(formId, function(fileUrlArr) {
					callback && callback(fileUrlArr);
				});
			} else {
				hiApp.alert("您已经达到上传图片数量的限制了呦~");
			}
		});
	},
	uploadFile: function(formId, callBack) {
		var that = this;
		var a = localStorage.getItem("Tokenid");
		var Tid = JSON.parse(a);
		var formData = new FormData($$("#" + formId)[0]);
		hiApp.showIndicator();
		that.getAjaxData({
			url: urls.addPic,
			type: 'POST',
			data: {
				token:Tid,
				uploadFile:formData
			},
			//async: true,
			cache: false,
			contentType: false,
			processData: false,
			success: function(res) {
				hiApp.hideIndicator();
				res = JSON.parse(res);
				if(200 === res.CODE) {
					callBack(res.URL);
				} else {
					hiApp.alert(res.MSG);
					callBack(null);
				}
			},
			error: function(err) {
				hiApp.hideIndicator();
				hiApp.alert("上传失败。");
				callBack(null);
			}
		});
	},
	opoinionuploadFile: function(formId, callBack) {
		var that = this;
		var a = localStorage.getItem("Tokenid");
		var Tid = JSON.parse(a);
		var formData = new FormData($$("#" + formId)[0]);
		hiApp.showIndicator();
		that.getAjaxData({
			url: "192.168.1.100:8080/inf/common/upload/singelUpload",
			type: 'POST',
			data:{
//				token:Tid,
				uploadFile:formData
			},
			cache: false,
			contentType: false,
			processData: false,
			success: function(res) {
				hiApp.hideIndicator();
				res = JSON.parse(res);
				if(200 === res.CODE) {
					console.log(res);
					callBack(res.URL);
				} else {
					hiApp.alert(res.MSG);
					callBack(null);
				}
			},
			error: function(err) {
				hiApp.hideIndicator();
				hiApp.alert("上传失败。");
				callBack(null);
			}
		});
	},
	uploadFileimgs: function(formId, callBack) {
		var that = this;
		var files = $$('#' + formId)[0].files;
		var a = localStorage.getItem("Tokenid");
		var Tid = JSON.parse(a);
		var formData = new FormData();
		if(files.length > 0) {
			for(var i = 0; i < files.length; i++) {　　　　　　　
				formData.append('files', files[i]);
			}
		}
		hiApp.showIndicator();
		that.getAjaxData({
			url: urls.addPic,
			type: 'POST',
			data: {
				token:Tid,
				uploadFile:formData
			},
			//async: true,
			cache: false,
			contentType: false,
			processData: false,
			success: function(res) {
				hiApp.hideIndicator();
				res = JSON.parse(res);
				console.log(res);
				if(200 === res.CODE) {
					callBack(res.file_path);
				} else {
					hiApp.alert(res.MSG);
					callBack(null);
				}
			},
			error: function(err) {
				hiApp.hideIndicator();
				hiApp.alert("上传失败。");
				callBack(null);
			}
		});

	},
	bindEvent: function() {

		var mL = 0;
		var w = 0;
		var uls = 0;
		var w_w = $$(window).width();

		$$(document).on("touchstart", ".mui-scrollspy-iscroll", function(e) {
			var ul = $$($$(this)[0]).find("ul");
			w = ul.width();
			mL = e.changedTouches[0].screenX;
			if(w > w_w) {
				var a = ul.css("transform").split(",");
				uls = a[4] ? parseInt(a[4], 10) : 0;
			}
		}).on("touchmove", ".mui-scrollspy-iscroll", function(e) {

			var a = e.changedTouches[0].screenX - mL + uls;
			var ul = $$($$(this)[0]).find("ul");
			if(w > w_w) {
				ul.css({
					"transform": "matrix(1, 0, 0, 1, " + a + ", 0)",
					"transition-duration": "0ms"
				});
			}

		}).on("touchend", ".mui-scrollspy-iscroll", function(e) {
			var a = e.changedTouches[0].screenX - mL + uls;
			var ul = $$($$(this)[0]).find("ul");
			var w = ul.width();
			if(w > w_w) {
				var ww = w_w - w;

				if(a > 0) {
					a = 0;
				} else if(a < ww) {
					a = ww;
				}

				ul.css({
					"transform": "matrix(1, 0, 0, 1, " + a + ", 0)",
					"transition-duration": "600ms"
				});
			}
		})
	},
	buildUrl: function(paramObj, url) {
		if(!url) url = window.location.href;
		var tempUrl = ''
		if(url.indexOf("?") != -1) {
			tempUrl = url.substr(0, url.indexOf("?"));
		} else {
			tempUrl = url;
		}

		var paramStr = '';
		for(var key in paramObj) {
			paramStr += key + '=' + paramObj[key] + '&';
		}

		var paramLen = paramStr.length;

		if('&' == paramStr.charAt(paramLen - 1)) {
			paramStr = paramStr.substr(0, paramLen - 1);
		}

		return tempUrl + '?' + paramStr;
	},
	inArray: function(ele, arr) {
		var isArr = arr instanceof Array;

		if(!isArr) {
			return false;
		}

		for(var i = 0, len = arr.length; i < len; i++) {
			if(arr[i] == ele) {
				return true;
			}
		}
		return false;
	},
	personcenter_imginit: function(imgArry) {
		var imgall = " ";
		for(var i = 0; i < imgArry.length; i++) {
			var img_init = '<img src="' + imgUrl + imgArry[i] + '" class="goodsimg_mainview"/>';
			imgall += img_init;
		}
		return imgall;
	},
	judgeimg: function(imgurl_init) { //判断返回照片地址前面是否有域名（imgurl_init返回照片地址）；
		var imgsrc = " ";
		var imgurl_first = imgurl_init.substr(0, 4);
		if(imgurl_first == "http") {
			imgsrc = imgurl_init;
		} else {
			imgsrc = imgUrl + imgurl_init;
		}
		return imgsrc;
	},
	changetime: function(timein) {
		var timeinback = " ";
		var timeinback = timein.substr(0, 10);
		return timeinback;
	},
	changetime22: function(timein) {
		var timeinback = " ";
		var timeinback = timein.substr(5, 6);
		return timeinback;
	},
	judgeimgperson: function(imgurl_init) {
		var imgsrc = " ";

		if(imgurl_init == ""){
			return;
		}
		var imgurl_first = imgurl_init.substring(0, 4);
		if(imgurl_first == "http") {
			imgsrc = imgurl_init;
		} else {
			imgsrc = igUrl + imgurl_init;
		}
		return imgsrc;
	},
	changetimein: function(time) {
		var b = time.length;
		var a = time.substr(5, b);
		return a;
	},
	getdayinweek: function(time) {
		var date = time; //此处也可以写成 17/07/2014 一样识别    也可以写成 07-17-2014  但需要正则转换   
		//		var day = new Date(Date.parse(date)); //需要正则转换的则 此处为 ：
		var day = new Date(Date.parse(date.replace(/-/g, '/')));
		var today = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
		var week = today[day.getDay()];
		return week;
	},
	clearinputinit: function(idname) {
		$$("#" + idname).val("");
	},
	showinitput: function(idname) {
		if($$("#" + idname).hasClass("see")) {
			$$("#" + idname).removeClass("see");
			$$("img[imginid='" + idname + "']").attr("src", "img/see.png");
			$$("#" + idname).attr("type", "password");
		} else {
			$$("#" + idname).addClass("see");
			$$("img[imginid='" + idname + "']").attr("src", "img/see1.png");
			$$("#" + idname).attr("type", "text");
		}
	}
};
//var compare = (function() {
//	function compareArray(a, b) {
//		//		console.log("array", a, b);
//		if(a.length !== b.length) {//			return false;
//}
//		const length = a.length;
//		for(let i = 0; i < length; i++) {
//			if(!compare(a[i], b[i])) {
//				return false;
//			}
//		}
//
//		return true;
//	}
//
//	function compareObject(a, b) {
//		//		console.log("object", a, b);
//		const keya = Object.keys(a);
//		const keyb = Object.keys(b);
//
//		if(keya.length !== keyb.length) {
//			return false;
//		}
//
//		return keya.every(key => {
//			if(!compare(a[key], b[key])) {
//				return false;
//			}
//			return true;
//		});
//	}
//
//	function compare(a, b) {
//		if(a === b) {
//			return true;
//		}
//
//		if(typeof a !== typeof b || a === null || b === null) {
//			return false;
//		}
//
//		if(Array.isArray(a)) {
//			if(!Array.isArray(b)) {
//				return false;
//			}
//			return compareArray(a, b);
//		}
//
//		if(typeof a === "object") {
//			return compareObject(a, b);
//		}
//
//		console.log("value", a, b);
//		return false;
//	}
//
//	return compare;
//})();

//util.getAjaxData({
//			url: "",
//			data: {},
//			method: 'post',
//			error: function(e) {
//				console.log(e);
//			},
//			success: function(ret) {
//				var data = JSON.parse(ret);
//				console.log(data);
//			}
//		});