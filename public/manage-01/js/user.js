$(function () {
    
    // 1. 定义变量
    var currentPage = 1;   // 当前页
    var pageSize = 5;     // 每页的条数
    var currentId;       // 当前点击的id
    var isDelete;       // 修改的状态

    // 2. 封装渲染函数
    function render () {
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template("usertmp", info);
                $('tbody').html(htmlStr);

                // 分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }
    // 3. 渲染
    render();

    // 4. 按钮操作
    $('tbody').on('click', '.btn', function() {
        $('#userModal').modal('show');
        currentId = $(this).parent().data('id');
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
        // console.log(currentId, isDelete);
    })
    $('#determineBtn').on('click', function () {
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data: {
               id: currentId,
               isDelete: isDelete
            },
            dataType: 'json',
            success: function (info) {
                if(info.success) {
                    $('#userModal').modal('hide');
                    render();
                }
            }
        })
    })

})