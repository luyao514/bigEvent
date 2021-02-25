$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '用户昵称必须是1-6位'
            }
        }
    })

    // 监听重置按钮的点击
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 重置为之前的用户信息并渲染
        initUserInfo();
    })
    // 监听表单的提交事件
    $('#formUserInfo').on('submit', function (e) {
        e.preventDefault();
        // 发起ajax请求更新数据
        $.ajax({
            method: 'post',
            url:'/my/userinfo',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!');
                // 调用父页面中getUserInfo方法，更新用户头像和欢迎语
                // 这里的window指向iframe标签
                window.parent.getUserInfo();
            }
        })
    })

    initUserInfo();

    //  封装初始化用户信息函数
    function initUserInfo(res) {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res.data);
                form.val('formUserInfo', res.data)
            }
        })
    }
})