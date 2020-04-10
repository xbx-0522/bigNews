//入口函数
$(function () {
    //一:一进到页面就要获取所有的文章类别. 渲染到id为selCategory的下拉菜单中. 
    $.ajax({
        type: "get",
        url: BigNew.category_list,
        success: function (backData) {
            //console.log(backData);
            if (backData.code == 200) {
                //2.获取到所有的文章类别信息后,通过模板引擎渲染到页面上
                var resHtml = template("art_cate_temp", backData);
                $("#selCategory").html(resHtml);
            }
        }
    });


    //------------------------------------------------------------------
    //声明一个变量mypage,表示当前点击的分页页签数字.
    var mypage = 1;
    //发送ajax请求封装成一个函数.
    function getData(mypage, callback) {
        $.ajax({
            url: BigNew.article_query,
            data: {
                type: $('#selCategory').val().trim(), //获取文章类别
                state: $('#selStatus').val().trim(), //获取文章状态(草稿/已发布)
                page: mypage, //当前的页数
                perpage: 6 //一页显示多少条
            },
            success: function (backData) {
                if (backData.code == 200) {
                    //调用模板引擎核心方法
                    var resHtml = template('arti_list', backData);
                    $('tbody').html(resHtml);

                    //这里会有一些操作,
                    //比如页面一进来这里有分页插件的设置; 点击筛选按钮这里有重新渲染分页插件结构的代码
                    if (backData.data.data.length != 0 && callback != null) {
                        //有数据了就应该把分页插件结构给显示
                        $('#pagination-demo').show();
                        $('#pagination-demo').next().hide();
            
                        callback(backData); //调用回调函数,把返回来的数据backData作为实参传递.
                    
                    }else if (backData.data.totalPage == mypage-1 && backData.data.data.length == 0){
                        mypage -= 1;
                        //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
                        $('#pagination-demo').twbsPagination('changeTotalPages',
                                backData.data.totalPage, mypage);
                    }else if (backData.data.data.length == 0){
                        //分页插件结构给隐藏
                        $('#pagination-demo').hide();
                        $('#pagination-demo').next().show(); //提示没有数据
                    }
                }
            }
        });
    }

    //二:一进到页面就要获取默认条件下的文章们并显示. 
    getData(1, function (backData) {
        //分页插件
        $('#pagination-demo').twbsPagination({
            totalPages: backData.data.totalPage, //总页数
            visiblePages: 7,
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '尾页',
            onPageClick: function (event, page) {
                //console.log(page); //当前点击的页数.
                mypage = page; //把当前点击的这一个页码给mypage赋值. 
                getData(page, null);
            }

        });
    });

    //三:给筛选按钮设置点击事件,获取满足条件的文章们
    $('#btnSearch').on('click', function (e) {
        e.preventDefault();
        //发送ajax请求.
        getData(1, function (backData) {
            //改变了筛选条件,那总页数就有可能发生了改变
            //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
            $('#pagination-demo').twbsPagination('changeTotalPages',
                backData.data.totalPage, 1);
        });
    });


    //四: 删除文章
    $('tbody').on('click', '.delete', function () {
        if (confirm('你确定要删除吗?')) {
            //获取当前要删除的这一行的文章id
            var id = $(this).attr('data-id');
            //发送ajax请求,完成删除
            $.ajax({
                type: 'post',
                url: BigNew.article_delete,
                data: {
                    id: id
                },
                success: function (backData) {
                    //console.log(backData);
                    if (backData.code == 204) {
                        //重新刷新页面
                        //window.location.reload();

                        //重新发送ajax请求,就获取当前页数据. 
                        getData(mypage, function (backData) {
                            //删除了部分数据,那总页数就有可能发生了改变
                            //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
                            $('#pagination-demo').twbsPagination('changeTotalPages',
                                backData.data.totalPage, mypage);
                        });
                    }
                }
            });
        }
    })



    //-------------------------------------------------------------------
    // //二:一进到页面就要获取默认条件下的文章们并显示. 
    // $.ajax({
    //     url: BigNew.article_query,
    //     data: {
    //         type: $('#selCategory').val().trim(),
    //         state: $('#selStatus').val().trim(),
    //         page: 1,
    //         perpage: 8
    //     },
    //     success: function (backData) {
    //         console.log(backData);
    //         if (backData.code == 200) {
    //             //调用模板引擎核心方法
    //             var resHtml = template('arti_list', backData);
    //             $('tbody').html(resHtml);

    //             //分页插件
    //             $('#pagination-demo').twbsPagination({
    //                 totalPages: backData.data.totalPage, //总页数
    //                 visiblePages: 7,
    //                 first: '首页',
    //                 prev: '上一页',
    //                 next: '下一页',
    //                 last: '尾页',
    //                 onPageClick: function (event, page) {
    //                     //console.log(page); //当前点击的页数.
    //                     $.ajax({
    //                         url: BigNew.article_query,
    //                         data: {
    //                             type: $('#selCategory').val().trim(),
    //                             state: $('#selStatus').val().trim(),
    //                             page: page,
    //                             perpage: 8
    //                         },
    //                         success: function (backData) {
    //                             console.log(backData);
    //                             if (backData.code == 200) {
    //                                 //调用模板引擎核心方法
    //                                 var resHtml = template(
    //                                     'arti_list', backData);
    //                                 $('tbody').html(resHtml);
    //                             }
    //                         }
    //                     });

    //                 }
    //             });
    //         }
    //     }
    // });


    // //三:给筛选按钮设置点击事件,获取满足条件的文章们
    // $('#btnSearch').on('click', function (e) {
    //     e.preventDefault();
    //     //发送ajax请求.
    //     $.ajax({
    //         url: BigNew.article_query,
    //         data: {
    //             type: $('#selCategory').val().trim(),
    //             state: $('#selStatus').val().trim(),
    //             page: 1,
    //             perpage: 8
    //         },
    //         success: function (backData) {
    //             if (backData.code == 200) {
    //                 //调用模板引擎核心方法
    //                 var resHtml = template('arti_list', backData);
    //                 $('tbody').html(resHtml);

    //                 //改变了筛选条件,那总页数就有可能发生了改变
    //                 //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
    //                 $('#pagination-demo').twbsPagination('changeTotalPages',
    //                     backData.data.totalPage, 1);
    //             }
    //         }
    //     });
    // });

    //----------------------------------------------------------------------------




});