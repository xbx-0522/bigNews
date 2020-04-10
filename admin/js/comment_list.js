//入口函数
$(function () {
    var myPage = 1;
    //一:获取所有的评论数据
    getComData(myPage);

    //封装的函数
    function getComData(page, callback) {
      $.ajax({
        url: BigNew.comment_list,
        data: {
          page: page,
          perpage: 4
        },
        success: function (backData) {
          console.log(backData);
          if (backData.code == 200) {
            var resHtml = template('com_list_temp', backData);
            $('tbody').html(resHtml);

            //如果回调函数不是null
            if (backData.data.data.length != 0 && callback != null) {
              callback(backData);
            } else if (backData.data.totalPage == myPage - 1 && backData.data.data.length == 0) {
              myPage -= 1;
              getComData(myPage, function () {
                //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
                $('#pagination').twbsPagination('changeTotalPages',
                  backData.data.totalPage, myPage);
              });
            }


            //分页插件
            $('#pagination').twbsPagination({
              totalPages: backData.data.totalPage, //总页数
              visiblePages: 7,
              first: '首页',
              prev: '上一页',
              next: '下一页',
              last: '尾页',
              onPageClick: function (event, page) {
                //给myPage赋值,值就是当前点击的整个页码
                myPage = page;
                //把当前点击的页码传进去. 调用方法.
                getComData(page, null);
              }
            });

          }
        }
      });
    }


    //二:批准
    $('tbody').on('click', '.btn-pizhun', function () {
      //获取当前点击的按钮的自定义属性data-id的值. 
      var id = $(this).attr('data-id'); //该评论id
      $.ajax({
        type: 'post',
        url: BigNew.comment_pass,
        data: {
          id: id
        },
        success: function (backData) {
          //console.log(backData);
          if (backData.code == 200) {
            alert('审核通过!');
            getComData(myPage, null);
          }
        }
      });
    })

    //三:拒绝
    $('tbody').on('click', '.btn-jujue', function () {
      //获取当前点击的按钮的自定义属性data-id的值. 
      var id = $(this).attr('data-id'); //该评论id
      $.ajax({
        type: 'post',
        url: BigNew.comment_reject,
        data: {
          id: id
        },
        success: function (backData) {
          //console.log(backData);
          if (backData.code == 200) {
            alert('拒绝成功!');
            getComData(myPage, null);
          }
        }
      });
    })

    //四:删除
    $('tbody').on('click', '.btn-delete', function () {
      //获取当前点击的按钮的自定义属性data-id的值. 
      var id = $(this).attr('data-id'); //该评论id
      $.ajax({
        type: 'post',
        url: BigNew.comment_delete,
        data: {
          id: id
        },
        success: function (backData) {
          //console.log(backData);
          if (backData.code == 200) {
            alert('删除成功!');
            getComData(myPage, function (sbData) {
              //重新渲染页面条
              //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
              $('#pagination').twbsPagination('changeTotalPages',
                sbData.data.totalPage, myPage);


            });
          }
        }
      });
    })

  });