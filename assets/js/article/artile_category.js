$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initArticleCategoryList();

    // 监听添加类别按钮的点击
    $('#addCategory').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialogAdd').html(),
            area: ['500px', '250px']
        });
    })


    var indexAdd = null;
    // 通过代理的方式，来监听添加表单的提交事件
    $('body').on('submit', '#formAdd', function (e) {
        e.preventDefault();
        // 发起新增文章分类的请求
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $('#formAdd').serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败!')
                }
                initArticleCategoryList();
                layer.msg('添加文章分类成功');
                //关闭弹出层
                layer.close(indexAdd);
            }
        })
    })


    var indexEdit = null;
    // 通过代理的方式，来监听编辑按钮的提交事件
    $('tbody').on('click', '#editBtn', function () {
        // 弹出编辑框
        indexEdit = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialogEdit').html(),
            area: ['500px', '250px']
        });
        // 获取当前行的数据并渲染在编辑框的表单中
        var id = $(this).attr('data-id');
        // 发起请求，根据id获取文章分类数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: res => {
                // console.log(res);
                // 拿到当前行的数据渲染在表单中
                form.val('formEdit', res.data);
            }
        })
    })

    // 通过代理的方式，监听编辑分类弹出层表单的提交事件
    $('body').on('submit', '#formEdit', function (e) {
        console.log($(this).serialize());
        e.preventDefault();
        // 发起更新文章分类的请求
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败')
                }
                // 弹出修改成功
                layer.msg('修改分类成功')
                // 关闭编辑分类框
                layer.close(indexEdit);
                // 更新列表
                initArticleCategoryList();
            }
        })
    })

    // 通过代理的方式， 监听删除按钮的点击
    $('tbody').on('click', '#deleteBtn', function () {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 发起删除分类的请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArticleCategoryList();
                }
            })
        });
    })

    // 封装获取文章分类列表数据函数
    function initArticleCategoryList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: res => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表数据失败!')
                }
                var htmlStr = template('tpl-table', res);
                $('.layui-table tbody').html(htmlStr);
            }
        })
    }
})