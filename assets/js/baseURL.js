// 请求拦截
// 每次发起ajax请求之前都会调用ajaxPrefilter这个函数
// 预过滤器
$.ajaxPrefilter(function (options) {
    // 在发起ajax请求之前拼接url地址
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

    // 统一为有权限的请求接口设置请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete函数
    // ajax请求完成时（无论是否请求成功），调用complete函数
    options.complete = res => {
        if (res.responseJSON.message === '身份认证失败！' && res.responseJSON.status === 1) {
            // 强制删除token
            console.log(1);
            localStorage.removeItem('token');
            // 强制跳转
            location.assign('login.html')
        }
    }
})