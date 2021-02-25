 $(function () {
     // 1.1 获取裁剪区域的 DOM 元素
     var $image = $('#image')
     // 1.2 配置选项
     const options = {
         // 纵横比
         aspectRatio: 1,
         // 指定预览区域
         preview: '.img-preview'
     }

     // 1.3 创建裁剪区域
     $image.cropper(options)

     var layer = layui.layer;

     //  监听上传按钮的点击事件
     $('#chooseImageBtn').on('click', function () {
         //  手动点击文件上传框
         $('#file').click();
     })
     $('#file').on('change', function () {
         if ($(this)[0].files.length == 0) {
             return layer.msg('请选择图片!')
         }
         //  获取用户选择的文件
         var file = $(this)[0].files[0];
         //  将文件转换为地址
         var imgURL = URL.createObjectURL(file);
         //  重新初始化裁剪区域
         $image
             .cropper('destroy') // 销毁旧的裁剪区域
             .attr('src', imgURL) // 重新设置图片路径
             .cropper(options) // 重新初始化裁剪区域
     })
     //  监听确定按钮的点击
     $('#uploadBtn').on('click', function () {
         // 获取裁剪后的头像
         var dataURL = $image
             .cropper('getCroppedCanvas', {
                 // 创建一个 Canvas 画布 
                 //  将 Canvas 画布上的内容，转化为 base64 格式的字符串
                 width: 100,
                 height: 100
             })
             .toDataURL('image/png')
         //  调用接口，将头像上传到服务器
         $.ajax({
             method: 'post',
             url: '/my/update/avatar',
             data: {
                 avatar:dataURL
             },
             success: res => {
                 if (res.status !== 0) {
                     return layer.msg('更换头像失败!')
                 }
                 layer.msg('更换头像成功!');
                 window.parent.getUserInfo();
             }
         })
     })
 })