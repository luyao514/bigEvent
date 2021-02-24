// 请求拦截
// 每次发起ajax请求之前都会调用ajaxPrefilter这个函数
// 预过滤器
$.ajaxPrefilter(function (options) {
    // console.log(options);
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    console.log(options.url);
})