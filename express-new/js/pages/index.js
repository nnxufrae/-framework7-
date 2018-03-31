var indexObj = {
    page: ".index-page ",
    init: function () {
        var that = this;
        that.bindevet();
    },
    show: function () {
        var that = this;
    },
    bindevet: function () {
        var that = this;
        bindTapEvent(that.page, ".setinfor-btn", function () {
            console.log("ssss");
            let name = $$("#name").val();
            let phone = $$("#phone").val();
            let place = $$("#place").val();
            if(!name || !phone || !place) {
                hiApp.alert("信息输入不完整！请输入完整信息");
				return;
            }
            let thisjson = {
                    name: name,
                    phone: phone,
                    address: place,
                }
                let datain = JSON.stringify(thisjson);
            util.getAjaxData({
//              url: urls.emailinfor,
                 url:"http://www.long-sir.vip:3000/email",
                data:datain,
                error: function (e) {
                    console.log(e);
                },
                success: function (ret) {
                    var data = JSON.parse(ret);
                    console.log(data);
                    if (data.code == 1000) {
                        hiApp.alert("发送成功");
                        $$("input").val("");
                        return;
                    } else {
                        hiApp.alert("发送失败");
                    }
                }
            });
        });
    }
}