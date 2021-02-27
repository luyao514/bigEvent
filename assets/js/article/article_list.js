$(function () {

    var layer = layui.layer;
    var form = layui.form;

    // 定义获取文章的列表数据的参数对象
    var q = {
        pagenum: 1, //默认获取第一页的数据
        pagesize: 2, // 默认每页显示2条数据
        cate_id: '',
        state: ''
    }

    // 定义美化事件的过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date);
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth())
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 监听筛选按钮的点击
    $('#filterForm').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值;
        q.cate_id = $('[name="cate_id"]').val();
        q.state = $('[name="state"').val();
        // console.log(q);
        // 根据最新的筛选数据渲染页面
        initArticleList();
    })

    // 监听删除按钮的点击
    $('tbody').on('click', '#btnDelete', function () {
        // 获取到文章的 id
        var id = $(this).attr('data-id');
        // 获取删除按钮的个数
        var len = $('tbody tr').length;
        console.log( len);
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initArticleList()
                }
            })

            layer.close(index)
        })
    })


    // 动态渲染所有分类下拉列表
    initCategoryList();
    initArticleList();

    //定义补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 获取文章列表数据的方法
    function initArticleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败!')
                }
                layer.msg('获取文章列表数据成功!');
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                console.log(res);
                // 渲染分页结构
                renderPage(res.total);
            }
        })
    }

    // 定义初始化文章分类下拉列表方法
    function initCategoryList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败!')
                }
                // 调用template函数
                var htmlStr = template('tpl-category', res);
                $('select[name="cate_id"]').html(htmlStr);
                // 调用render函数， 重新渲染表单区域。
                form.render();
            }
        })
    }

    // 定义渲染分页结构方法
    function renderPage(total) {
        layui.use('laypage', function () {
            var laypage = layui.laypage;

            //执行一个laypage实例
            laypage.render({
                elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
                count: total, //数据总数，从服务端得到
                limit: q.pagesize, //默认选中几条数据
                curr: q.pagenum, //设置默认被选中的页数,
                // 1.点击切换页码的时候，会触发jump回调， 此时first为undefined
                // 2.每次调用layer.pge方法都会触发jump回调(会导致死循环), 此时first为true
                jump: (obj, first) => { //页码发生切换时出发的回调
                    // 把最新的页面值赋值给q对象pagenum属性
                    q.pagenum = obj.curr;
                    // 把最新的条目数赋值给q对象pagesize属性
                    q.pagesize = obj.limit;
                    // 通过first判断是通过哪种方式触发的jump回调
                    if (!first) {
                        // 根据最新的q对象请求对应的数据列表， 并渲染数据
                        initArticleList();
                    }
                },
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [2, 3, 5, 10]

            });
        });
    }
})