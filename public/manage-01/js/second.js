$(function () {
    // 1. 定义变量
    var currentPage = 1;
    var pageSize = 5;

    // 2. 封装渲染函数
    function render () {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template('sectmp', info);
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

    // 4. 添加分类并渲染下拉菜单
    $('#addCategory').on('click', function () {
        $('#addModal').modal('show');

        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (info) {
                var htmlStr = template("dropdowntmp", info);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    })

    // 5. 下拉菜单的选中点击事件
    $('.dropdown-menu').on('click', 'li', function () {
        $('.dropdowntxt').html($(this).children('a').text());
        $('#form').data("bootstrapValidator").updateStatus('categoryId','VALID');
        // 便于提交数据
        $('[name="categoryId"]').val($(this).data('id'));
    })


    // 6. 文件上传
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            var url = data.result.picAddr;
            console.log(url);
            $('#imgbox img').attr("src", url);
            $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
            // 便于上传数据
            $('[name="brandLogo"]').val(url);  
        }
    });

    // 7. 表单验证
    $('#form').bootstrapValidator({
        // 配制排除项
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类名称"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传图片"
                    }
                }
            }
        }
    })

    // 8. 表单验证成功后渲染页面
    $('#form').on('success.form.bv', function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function (info) {
                if(info.success) {
                    $('#addModal').modal('hide');
                    // 重置表单
                    $('#form').data("bootstrapValidator").resetForm(true);
                    $('.dropdowntxt').html("请选择一级分类");
                    $('#imgbox img').attr("src", "images/none.png");
                    currentPage = 1;
                    render();
                }
            }
        })
    })

})