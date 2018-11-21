// 登录拦截
$.ajax({
   type: "get",
   url: "/employee/checkRootLogin" ,
   dataType: "json",
   success: function (info) {
       console.log(info);
       if(info.success) {
           console.log("登录成功");
       }
       if(info.error === 400){
           location.href = "login.html";
       }
   }
})