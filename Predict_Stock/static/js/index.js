//封装cookie
function setCookie(name, value, iDay) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = name + '=' + value + ';expires=' + oDate;
};

/*获取cookie*/
function getCookie(name) {
    var arr = document.cookie.split('; '); //多个cookie值是以; 分隔的，用split把cookie分割开并赋值给数组
    //历遍数组
    // for (var i = 0; i < arr[i].length; i++)
    // {
    //     //原来割好的数组是：user=simon，再用split('=')分割成：user simon 这样可以通过arr2[0] arr2[1]来分别获取user和simon
    //     console.log(arr[i])
    //     var arr2 = arr[i].split('=');
    //     // console.log(arr2);
    //     if (arr2[0] == name) //如果数组的属性名等于传进来的name
    //     {
    //         return arr2[1]; //就返回属性名对应的值
    //     }
    //     return ''; //没找到就返回空
    // }
    for(var i=0;i<arr.length;i++){
        var cookieName=arr[i].split("=")[0];
        var cookieValue=arr[i].split("=")[1];
        if(cookieName==name){
            return cookieValue;
        }
    }
};

/*删除cookie*/
function removeCookie(name) {
    setCookie(name, 1, -1); //-1就是告诉系统已经过期，系统就会立刻去删除cookie
};

baseUrl = "http://localhost:8000";

// 显示和隐藏登录注册框
$(() =>{
    // 点击注册事件
    $("#reg_but").click(() =>{
        $(".register").show();
        $("div#main").hide();
    });

    // 点击登录事件
    $("#log_but").click(() => {
        $(".login").show();
        $("div#main").hide();
    });

    // 退出登录
    $("#exit_but").click(()=>{
        $.ajax({
            type: "get",
            url: baseUrl + '/user/exit',
            success:function(response){
                if(JSON.parse(response).result==true){
                    console.log("退出登录");
                    removeCookie("user");
                    window.history.go(0)
                }
            },
            error:function(err){
                console.log(err)
            }
        })
    })

    // 点击确定注册
    $(".regist_button").click((e) =>{
        e.preventDefault();
        // 获取注册信息表的内容
        var $registerName = $("#reg_name").val();
        var $registerPwd = $("#reg_pwd").val();
        var $registerRePwd = $("#reg_re_pwd").val();
        var $registerTel = $("#reg_tel").val();
        // 通过ajax将注册信息发送给服务器
        $.ajax({
            type: "post",
            url: baseUrl + '/user/register',
            data: {
                username: $registerName,
                pwd: $registerPwd,
                repwd: $registerRePwd,
                tel: $registerTel,
            },
            success: function(response){
                var data=JSON.parse(response);
                if(data.result==true){
                    $(".register").hide();
                    Ply.dialog("alert", "注册成功! ");
                    $(".login").show()
                }else{
                    Ply.dialog("alert", data.error);
                }
            },
            error: function(error){
                console.log(error)
            }
        })
    })
    // 点击确定登录
    $(".login_button").click((e) =>{
        e.preventDefault();
        var $loginName = $("#log_name").val();
        var $logpwd = $("#log_pwd").val();
        $.ajax({
            type: "post",
            url: baseUrl + '/user/login',
            data: {
                username: $loginName,
                password: $logpwd
            },
            success: function (response){
                var data = JSON.parse(response);
                if(data.result==true){
                    var username = data.data.username;
                    console.log(username);
                    setCookie("user", username, 0.1);
                    $(".login").hide();
                    $(".reg_log").hide();
                    $("#user").text(username);
                    $(".is_login").show();
                    $("#exit_but").show();
                    $("div#main").show();
                }else{
                    Ply.dialog("alert", data.error);
                }
            },
            error: function(error){
                console.log(error)
            }
        })
    })
})