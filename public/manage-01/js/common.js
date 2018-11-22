// 1. 进度条
    // 1.1 发送ajax请求开启进度条
    $(document).on('ajaxStart', function() {
        NProgress.start();
    })

    // 1.2 请求结束后结束进度条
    $(document).on('ajaxStop', function () {
        NProgress.done();
    })

$(function() {
    // 2.侧边栏的隐藏与显示
    $('.lt_topbar .menu').on('click', function () {
        console.log(11);
        $('.lt_aside').toggleClass('hidemenu');
        $('.lt_topbar').toggleClass('hidemenu');
        $('.lt_main').toggleClass('hidemenu');
    })

    // 3. 退出功能
    $('.logout').on('click', function () {
        $('#logoutModal').modal('show');
    })

    $('#logoutBtn').on('click', function () {
        $.ajax({
            type: "get",
            url: "/employee/employeeLogout",
            dataType: 'json',
            success: function(info) {
                if(info.success) {
                    location.href = "login.html";
                }
            }
        })
    })

    // 4. 二级菜单
    $('.category').on('click', function() {
        $(this).next().stop().slideToggle();
    })
    
})