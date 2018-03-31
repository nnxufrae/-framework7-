var domainUrl = "http://139.199.177.37:88";

// var userUrl = domainUrl+"/LyjsUserAction";

var  pgaeUrl = domainUrl+"/v1";


var app_version = "1.0";
var app_type = "mobile-web";

var consumeType = {
    // 现金
    CASH: 0,
    POINTS: 1,
    ALL: 99
}

//地址
var urls = {
     // getProjett:painUrl+"/getLyjsRouteSortData",
    emailinfor:pgaeUrl+"/email_send"

}

//提示语
var tips = {
    noInput: "请把信息填写完整~",
    loginFail: "登录失败，请重新登录~",
    error2LoginPass: "两次输入的登录密码不一致哦~",
    error2NewPass: "两次输入的新密码不一致哦~",
    error2PayPass: "两次输入的支付密码不一致哦~",
    noMobile: "您的手机号怎么感觉怪怪的~",
    regSuccess: "注册成功，快去登录吧~",
    regError: "注册失败，请稍候重试~",
    passLengthWrong: "密码长度在6到16位之间",
    payPassLengthWrong: "支付密码长度在6到16位之间",
    nameError: "用户名必须是3到16位的字母或数字下划线组合",
    agreeReg: "请先同意一块跑在线服务协议",
    forgetSuccess: "修改密码成功~快去登录吧~",
    addressAddSuccess: "地址保存成功~",
    addressDelSuccess: "地址删除成功~",
    ready4Del: "确定要删除吗~",
    confirmGetGoods: "请在收到货物以后再确认收货~",
    realCancel: "真的要取消这一单吗？",
    commentsSuccess: "评价成功~感谢您的支持和参与~",
    refundSuccess: "退换货申请提交成功~",
    purchaseAdd: "提交成功请耐心等待~",
    submitSuccess: "提交成功~",
    pointsNotActive: "转赠点数须大于0",
    loginSuc: "登录成功"
}

var defaultInfo = {
    reSendVCodeTime: 180,
    headImg: ""
};