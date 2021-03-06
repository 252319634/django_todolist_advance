/**
 * Created by Administrator on 2015/10/11 0011.
 */
$(document).ready(function () {
    (function(){

    })();
    //按钮单击事件
    $('body').on('click', 'button', function () {
        var btn_name = $(this).text();//获得按钮的名字,判断是delete还是edit
        var li_ = $(this).parent().parent().parent();//获得要操作的li
        var id_ = li_.attr('id');//获得li的id
        if (btn_name == 'Edit') {
            var span_ = $(this).parent().siblings('span:first');//获取第一个span
            var input_ = $(this).parent().siblings('input');//获取input
            input_.val(span_.text());//span的值传给input
            span_.addClass('hide');//隐藏span
            input_.removeClass('hide');//显示input
            input_.focus();//输入框获得焦点
        }
        //删除日志
        if (btn_name == 'Delete') {
            if (confirm("真的要删除吗?")) {
                //alert('确定');
                //ajax逻辑
                $.get("/delete/?id=" + id_, function (data, status) {
                    if (status == 'success' & data == 'True') {
                        //alert(data+' '+status);
                        //li_.addClass('hide');//先隐藏,其实可以直接删除了,这个是模拟没有后台的情况
                        li_.remove();//删除li元素
                    } else {
                        alert('信息有错误,请刷新页面重试!');
                    }
                });

            } else {
                //alert('取消');
            }
        }
    });
    //失去焦点,修改完成
    $('body').on('blur', 'input.itembox', function () {
        //alert('blur');
        var li_ = $(this).parent().parent();//获得要操作的li
        var id_ = li_.attr('id');//获得li的id
        //alert(id_);
        var span_ = $(this).siblings('span:first');//获得span,给span赋值时用
        var input_text = $(this).val();//取出新值
        if (span_.text() != input_text) {//span的值和input的值不相等,说明改动了,把新的值传给后台
            //这里添加ajax逻辑
            $.get("/edit/?id=" + id_ + "&content=" + input_text, function (data, status) {
                if (status == 'success' & data == 'True') {//判断修改是否成功
                    //alert("数据: " + data + "\n状态: " + status);
                    span_.text(input_text);//把新值赋给span
                } else {
                    alert('信息有错误,请刷新页面重试!');
                }
            });

            //alert('修改了');
        }
        $(this).addClass('hide');//这两句没有放在验证成功里面,因为验证成功与否,都需要把样子改回span
        span_.removeClass('hide');//这两句没有放在验证成功里面,因为验证成功与否,都需要把样子改回span
    });
    //改变日志状态
    $('body').on('click', 'input[type="checkbox"]', function () {
        var checked_ = $(this).is(':checked');//单击了checkbox后是否是选择状态, true选择,flase 不选择.
        //alert(checked_);
        var li_ = $(this).parent().parent();//获得li
        var id_ = li_.attr('id');
        if (checked_) {
            //ajax逻辑,把任务变成完成状态
            $.get("/state/?id=" + id_ + "&state=" + checked_, function (data, status) {
                if (data == 'True') {
                    //alert("数据: " + data + "\n状态: " + status);
                    li_.addClass('completed_item');
                } else {
                    alert('信息有错误,请刷新页面重试!');
                }
            });
        } else {
            //ajax逻辑,把任务变成未完成状态
            $.get("/state/?id=" + id_ + "&state=" + checked_, function (data, status) {
                if (data == 'True') {
                    //alert("数据: " + data + "\n状态: " + status);
                    li_.removeClass('completed_item');
                } else {
                    alert('信息有错误,请刷新页面重试!');
                }
            });
        }
    });
    //添加一条日志
    $('body').on('click', 'input#custom_textbox_btn', function () {
        var input_box = $(this).siblings('#custom_textbox');//获得输入框
        var input_text = input_box.val();//获得输入框中的value
        var page = $('ul.pagination').children('li.active').children('a').text();
        input_box.val('');//清除输入框的内容
        //alert(page);
        //var text_utf8 = escape(input_text);//
        if (input_text) {//如何有值则进行添加动作
            //ajax添加动作
            $.post('/add/',
                {//这里是post的数据,格式:name:"Donald Duck",city:"Duckburg"
                    //content:encodeURI(input_text)
                    content: input_text
                }, function (data, status) {

                    if (status == 'success' & data != 'False') {
                        //服务端返回tdl对象的json序列.
                        if (page == 1) {//如果是第一页就解析json 添加到列表最上面
                            var json = JSON.parse(data);
                            //alert(json['id']);
                            var li_ = $('<li class="list-group-item"></li>').attr('id', json['id']);
                            var li_div1 = $('<div class="text_holder"></div>').appendTo(li_);
                            li_div1.append($('<span></span>').text(json['content']));
                            li_div1.append($('<input type="text" size="50" class="itembox hide" value="">'));
                            li_div1.append($('<span>---刚刚发布</span>'));
                            li_div1.append($('<div class="btn-group pull-right"><button class="delete btn btn-warning" >Delete</button><button class="edit btn btn-success">Edit</button> </div>'));
                            $('<div class="checkbox"><input type="checkbox" class="pull-right"></div>').appendTo(li_);
                            var ol_ = $('ol.list-group').prepend(li_);
                        } else {//如果不是第一页就刷新该页
                            location.reload();
                        }

                    } else {
                        alert('信息有错误,请刷新页面重试!');
                        //没有添加成功,
                    }

                });
        }
    });




});