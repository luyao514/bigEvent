$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initArticleCategory();

    // 初始化富文本编辑器
    initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 监听选择封面按钮的点击事件
    $('#chooseImageBtn').on('click', function () {
        $('#file').click();
    })
    // 监听文件选择框的change事件
    $('#file').on('change', function () {
        var files = $(this)[0].files;
        // 判断用户是否选择了文件
        if (files.length < 0) {
            return layer.msg('请选择图片文件!')
        }
        // 根据选择的文件， 创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var state = '已发布';
    //监听发布按钮的点击， 修改文章的发布状态
    $('#btnSave1').on('click', function () {
        state = '已发布';
    })
    // 监听存为草稿按钮的点击，修改文章的发布状态
    $('#btnSave2').on('click', function () {
        state = '草稿';

    })

    // 为表单绑定提交事件
    $('#pubForm').on('submit', function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        // 2.快速将表单数据添加到FormData对象中
        var fd = new FormData(this);
        // 3.将state追加到fd中
        fd.append('state', state);
        // 4.将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象追打到FormData对象中
                fd.append('cover_img', blob);
                // 6.发起ajax请求
                publishArticle(fd);

            })
    })

    // 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0 ) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功!')
                location.href = './article_list.html'
            }
        })
    }


    // 定义获取文章分类的方法
    function initArticleCategory() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败!')
                }
                // 调用模板引擎， 渲染分类的下拉菜单
                var htmlStr = template('tpl-select', res)
                $('select[name="cate_id"]').html(htmlStr);
                // 表单元素是动态插入的,必须调用form.render方法
                form.render();
            }
        })
    }
})