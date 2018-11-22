$(function () {
    // 1. 定义变量
    var currentPage = 1;
    var pageSize = 5;
    
    // 2. 封装渲染函数
    function render () {
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                var htmlStr = template("firsttmp", info);
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

    // 3. 渲染页面
    render();

    // 4. 增加分类
    $('#addCategory').on('click', function () {
        $('#firstModal').modal('show');
    })

    // 5. 表单校验
    $('#addForm').bootstrapValidator({
        // 图标显示
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 校验字段
        fields: {
            // 一级分类
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "请输入一级分类名称"
                    }
                }
            }
        }
    })

    // 6. 表单验证成功事件"success.form.bv
    $('#addForm').on('success.form.bv', function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/category/addTopCategory",
            data: $('#addForm').serialize(),
            dataType: "json",
            success: function (info) {
                if(info.success) {
                    $('#firstModal').modal('hide');
                    $('#addForm').data("bootstrapValidator").resetForm(true);
                    currentPage = 1;
                    render();

                }

            }
        })
    })

})