$(function () {
    // 调用函数， 获取用户信息
    getUserInfo();


    // 退出
    $('#logout').on('click', function () {
        layer.confirm('确认退出吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 跳转页面
            location.assign('login.html')
            // 删除token
            localStorage.removeItem('token');

            layer.close(index);
        });
    })
})
//  封装获取用户信息的函数
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // 设置请求头
        /* headers: {
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败，请登录！')
            }
            // 调用渲染用户头像函数
            renderAvatar(res.data);
            // 封装渲染用户头像的函数
            function renderAvatar(userInfo) {
                // 获取用户名称
                var name = userInfo.nickname || userInfo.username;
                // 设置欢迎语
                $('#welcome').html('欢迎&nbsp;&nbsp;' + name).show();
                $('.layui-nav-img').hide();
                // 按需设置用户头像
                if (userInfo.user_pic !== null) {
                    // 渲染图片头像
                    $('.layui-nav-img').attr('src', userInfo.user_pic).show();
                    $('.text-avatar').hide();
                } else {
                    // 渲染文字头像
                    var first = name[0].toUpperCase();
                    $('.text-avatar').html(first).show();
                    $('.layui-nav-img').hide();
                }
            }
        },
        // ajax请求完成时（无论是否请求成功），调用complete函数
        /* complete: res => {
            console.log(res.responseText.message );
            if (res.responseJSON.message === '身份认证失败！'&& res.responseJSON.status === 1) {
                // 强制删除token
                console.log(1);
                localStorage.removeItem('token');
                // 强制跳转
                location.assign('login.html')
            }
        } */
    })
}