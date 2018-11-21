//  登录校验
 $(function () {
// 1. 表单校验
     $('#form').bootstrapValidator({
        //  校验时图标显示
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }, 
        // 指定校验字段
        fields: {
            // 校验用户名
            username: {
                validators: {
                    // 非空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    // 长度
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度必须是 2-6 位'
                    },
                    callback: {
                        message: '用户名不存在'
                    }
                    
                }
            },
            // 校验密码
            password: {
                validators: {
                    // 非空
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    // 长度
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码长度必须是6-12位'
                    },
                    callback: {
                        message: '密码错误'
                    }
                }
            }
        }
     })

//  2. 注册表单校验成功事件，发送ajax请求
    $('#form').on('success.form.bv', function(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if(info.success) {
                    location.href = "index.html";
                } 
                if(info.error === 1000) {
                    $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID','callback');
                }
                if(info.error === 1001) {
                    $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
                }

            }
        })
    })

 // 3. 重置表单
    $('[type="reset"]').on('click', function () {
        $('#form').data('bootstrapValidator').resetForm();
    })




 })






