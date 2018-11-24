// 商品页
$(function () {
    // 1. 定义变量
    var currentPage = 1;
    var pageSize = 3;
    var picArr = [];

    // 2. 封装渲染函数
    function render () {
        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                var htmlStr = template("protmp", info);
                $("tbody").html(htmlStr);
                // 分页
                $("#paginator").bootstrapPaginator({
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

    // 3. 渲染函数
    render();

    // 4. 点击按钮显示模态框，并渲染下拉菜单
    $('.addBtn').on("click", function () {
        $("#productModal").modal("show");

        // 渲染下拉菜单
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template("dropdowntmp", info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    })

    // 5. 下拉菜单的点击事件
    $('.dropdown-menu').on('click', 'a', function () {
        $('.dropdowntxt').html($(this).text());
        // 便于表单提交
        var id = $(this).data("id");
        $('[name="brandId"]').val(id);
        // 更新表单状态
        $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    })


    // 6. 文件上传
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            var picObj = data.result;
            picArr.unshift(picObj);
            var picUrl = picObj.picAddr;
            $("#imgbox").prepend('<img width="100" style="margin-right:5px" src="' + picUrl + '" alt="">');

            // 判读若超过三张，则进行截取
            if (picArr.length > 3) {
                picArr.pop();
                $('#imgbox img:last-of-type').remove();
            }

            // 更新状态
            if(picArr.length < 3) {
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "INVALID","notEmpty");
            }
            if(picArr.length === 3) {
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
            }
        }
    });

    // 7. 添加商品表单验证
    $("#form").bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: "glyphicon glyphicon-ok",
            invalid: "glyphicon glyphicon-remove",
            validating: "glyphicon glyphicon-refresh"
        },
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '库存格式,必须是非零开头的数字'
                      }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: "尺码格式,必须是xx-xx,xx是两位数字,例如32-44"
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    }
                }
            },
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    })



    // 8. 验证成功后发请求
    $("#form").on("success.form.bv", function (e) {
        e.preventDefault();
        // 拼接表单内容字符串
        var paramStr = $('#form').serialize();
        paramStr += "&picAddr1=" + picArr[0].picAddr + "&picName1" + picArr[0].picName;
        paramStr += "&picAddr2=" + picArr[1].picAddr + "&picName1" + picArr[1].picName;
        paramStr += "&picAddr3=" + picArr[2].picAddr + "&picName1" + picArr[2].picName;
        // console.log(paramStr);

        $.ajax({
            type: "post",
            url: "/product/addProduct",
            data: paramStr,
            dataType: "json",
            success: function (info) {
                if (info.success) {
                    $("#productModal").modal("hide");
                    currentPage = 1;
                    render();
                    // 重置表单
                    $("#form").data("bootstrapValidator").resetForm(true);
                    $('.dropdowntxt').text("请选择二级分类");
                    $("#imgbox").empty();
                    picArr = [];
                }
            }
        })
    }) 

})