$(function () {
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6 ) {
                return '用户昵称必须是1-6位'
            }
        }
    })
})