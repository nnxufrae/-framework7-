
var userObj = {
    Id:"",
    loginKey: "hxt_user",
    expires:20,
    getUserId:function(){
        var that = this;
        if(that.Id){
            return that.Id;
        }
        else{
            var obj =  JSON.parse(util.getCookie(that.loginKey));
            if(obj){
                that.setRomUser(obj);
            }

            return that.Id;
        }
    },
    getUser:function(){
        var that = this;
        return JSON.parse(util.getCookie(that.loginKey));
    },
    setRomUser : function(obj){
        var that = this;
        that.Id = obj.Id;
        that.HeadImg = obj.Avatar;
        that.name = obj.MemberName;
//      that.account = obj.MEMBERACCOUNT;
    },
    setUser : function(obj){
        var that = this;
        console.log(obj);

        that.setRomUser(obj);

        util.setCookie(that.loginKey, JSON.stringify(obj),that.expires);
    },
    delUser: function(){
        var that = this;
        util.clearCookie(that.loginKey);
        that.Id = "";
        that.HeadImg = "";
        that.name = "";
//      that.account = "";
    }
}