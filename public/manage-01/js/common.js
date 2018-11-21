$(function() {
    // 1. 进度条
    // 1.1 发送ajax请求开启进度条
    $(document).on('ajaxStart', function() {
        NProgress.start();
    })

    // 1.2 请求结束后结束进度条
    $(document).on('ajaxStop', function () {
        NProgress.done();
    })
})