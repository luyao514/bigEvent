$(function () {
    $('#toReg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#toLogin').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 从layui中获取form对象
    var form = layui.form;
    // 获取layer对象
    var layer = layui.layer;
    // 自定义校验规则
    form.verify({
        repwd: function (value, item) { //value：表单的值、item：表单的DOM对象
            let pwd = $('.reg-box input[name="password"').val();
            console.log(pwd);
            if (pwd !== value) {
                return '两次密码不一致';
            }
        },
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ]
    });

    // 监听注册表单的提交事件
    $('#regForm').on('submit', function (e) {
        e.preventDefault();
        let params = {
            username: $('.reg-box input[name="username"]').val(),
            password: $('.reg-box input[name="password"]').val()
        };
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: params,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功！请登录');
                $('#toLogin').trigger('click');

            }
        })
    })
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登录成功');
                localStorage.setItem('token', res.token)
                location.assign('index.html')
            }
        })
    })
})