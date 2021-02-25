$(function () {
    var form = layui.form;
    // 定义自定义验证规则
    form.verify({
        old: value => {

        },
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        rePwd: value => {
            var newPwd = $('input[name="newPwd"]').val();
            if (newPwd !== value) {
                return '两次输入的密码不一致'
            }
        },
         samePwd: value => {
             var oldPwd = $('input[name="oldPwd"]').val();
             if (oldPwd === value) {
                 return '新旧密码不能一致!'
             }
         }
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 发起请求重置密码
        $.ajax({
            method: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('重置密码失败')
                }
                layer.msg('重置密码成功');
                $(this)[0].reset();
            }
        })
    })
})