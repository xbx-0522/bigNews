//入口函数
$(function () {
    //一:编辑页准备工作:
    //1.图片预览
    $('#inputCover').on('change', function () {
        var fileIcon = this.files[0];
        var url = URL.createObjectURL(fileIcon);
        $(this).prev().attr('src', url);
    });

    //2.获取所有的文章类别
    $.ajax({
        type: "get",
        url: BigNew.category_list,
        success: function (backData) {
            //console.log(backData);
            if (backData.code == 200) {
                //2.获取到所有的文章类别信息后,通过模板引擎渲染到页面上
                var resHtml = template("art_cate_temp", backData);
                $("select.category").html(resHtml);
            }
        }
    });

    //3.编辑页使用日期插件 jeDate
    jeDate("#testico", {
        zIndex: 20999,
        format: "YYYY-MM-DD",
        isTime: false,
        minDate: "2014-09-19 00:00:00"
    })

    //4.编辑页使用富文本编辑器  wangEditor
    var E = window.wangEditor;
    var editor = new E('#editor');
    // 或者 var editor = new E( document.getElementById('editor') )
    editor.create()

    //-----------------------------------------------------
    //一:编辑逻辑第一大步
    //1.获取点击编辑按钮 跟随url传递过来的文章id
    var articleId = window.location.search.split('=')[1];
    //2.根据文章id发送ajax请求获取该文章的详细信息
    setTimeout(function () {
        $.ajax({
            url: BigNew.article_search,
            data: {
                id: articleId
            },
            success: function (backData) {
                //console.log(backData);
                if (backData.code == 200) {
                    //3.把对应的详细信息显示在对应的标签上. 
                    $('#inputTitle').val(backData.data.title); //文章标题   
                    $('.article_cover').attr('src', backData.data.cover); //文章预览图
                    $('select.category').val(backData.data.categoryId); //文章类别
                    $('#testico').val(backData.data.date); //文章发布时间
                    editor.txt.html(backData.data.content); //文章内容
                }
            }
        });
    }, 0);


    //二:编辑逻辑第二大步. 
    //给修改按钮设置点击事件. 
    $('.btn-edit').on('click',function(e){
        e.preventDefault();
        //创建fd对象
        var fd = new FormData($('form')[0]);
        //检查下form表单中要获取值的标签有么有name属性,并且name属性的值是不是和接口参数一致.
        //追加富文本编辑器 里面 修改后的文章内容  到fd对象中
        fd.append('content',editor.txt.html());
        //追加一个state键对应的值已发布到fd对象中
        fd.append('state','已发布');
        // 追加要编辑的文章的id到fd对象中
        fd.append('id',articleId);
        //发送ajax请求
        $.ajax({
            type:'post',
            url:BigNew.article_edit,
            data:fd,
            contentType:false,
            processData:false,
            success:function(backData){
                console.log(backData);
                if(backData.code == 200){
                    alert('修改成功');
                    window.history.back();//回退回去.
                }
            }
        });
    });


    //存草稿
    $('.btn-draft').on('click',function(e){
        e.preventDefault();
        //创建fd对象
        var fd = new FormData($('form')[0]);
        //检查下form表单中要获取值的标签有么有name属性,并且name属性的值是不是和接口参数一致.
        //追加富文本编辑器 里面 修改后的文章内容  到fd对象中
        fd.append('content',editor.txt.html());
        //state参数不写,默认为空,那就是存草稿

        // 追加要编辑的文章的id到fd对象中
        fd.append('id',articleId);
        //发送ajax请求
        $.ajax({
            type:'post',
            url:BigNew.article_edit,
            data:fd,
            contentType:false,
            processData:false,
            success:function(backData){
                console.log(backData);
                if(backData.code == 200){
                    alert('存为草稿成功');
                    window.history.back();//回退回去.
                }
            }
        });
    });


});