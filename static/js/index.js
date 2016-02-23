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
                        var json = JSON.parse(data);
                        //alert(json['id']);
                        var li_ = $('<li class="list-group-item"></li>').attr('id', json['id']);
                        var li_div1 = $('<div class="text_holder"></div>').appendTo(li_);
                        li_div1.append($('<span></span>').text(json['content']));
                        li_div1.append($('<input type="text" size="50" class="itembox hide" value="">'));
                        li_div1.append($('<span>---刚刚发布</span>'));
                        li_div1.append($('<div class="btn-group pull-right"><button class="delete btn btn-warning" >Delete</button><button class="edit btn btn-success">Edit</button> </div>'));
                        $('<div class="checkbox"><input type="checkbox" class="pull-right"></div>').appendTo(li_);
                        $('ol.list-group').prepend(li_);
                        input_box.val('');//清除输入框的内容
                    } else {
                        alert('信息有错误,请刷新页面重试!');
                        //没有添加成功,
                    }
                });

        }
    });

    //加载更多日志
    $('#more').on('click', '', function () {
        var more_btn = $(this);
        //alert(more_btn.text());
        var id_ = $('ol.list-group').children('li').last().attr('id');
        //alert(id_);
        if(id_==undefined){//当数据库为空的时候,执行这里
            $('#more').text('没有更多了');//设置按钮的内容
        }
        //alert('最后的id是:' + id_);
        //ajax获取日志
        $.get("/more/?id=" + id_, function (data, status) {
            //服务器返回json序列, 包含三条记录
            //[{"fields": {"content": "\u6de1\u6de1\u7684", "state": false, "create_time": "2015-10-12T10:15:10Z"}, "model": "todolist.tdl", "pk": 4}, {"fields": {"content": "\u6de1\u6de1\u7684", "state": false, "create_time": "2015-10-12T09:57:34Z"}, "model": "todolist.tdl", "pk": 2}, {"fields": {"content": "\u6de1\u6de1\u7684", "state": false, "create_time": "2015-10-12T09:57:21Z"}, "model": "todolist.tdl", "pk": 1}]
            if (status == 'success' & data != 'False') {
                var json = JSON.parse(data);
                //alert('元素个数是:' + json.length);
                if (json.length > 0) {
                    $.each(json, function (i, item) {
                        //alert(item['pk']+' '+item['fields']['content']);
                        //json中取id:item['pk'],取内容:item['fields']['content']

                        var li_ = $('<li class="list-group-item"></li>').attr('id', item['pk']);
                        var li_div1 = $('<div class="text_holder"></div>').appendTo(li_);
                        li_div1.append($('<span></span>').text(item['fields']['content']));
                        li_div1.append($('<input type="text" size="50" class="itembox hide" value="">'));
                        li_div1.append($('<span></span>').text('---'+time_to_befor(item['fields']['create_time'])));
                        li_div1.append($('<div class="btn-group pull-right"><button class="delete btn btn-warning" >Delete</button><button class="edit btn btn-success">Edit</button> </div>'));
                        var check_box = $('<div class="checkbox"><input type="checkbox" class="pull-right"></div>').appendTo(li_);
                        if(item['fields']['state']){
                            li_.addClass('completed_item');
                            check_box.children('input').prop('checked',true);
                        }
                        $('ol.list-group').append(li_);
                    });
                } else {
                    //alert('没有更多了');
                    $('#more').text('没有更多了');//设置按钮的内容
                }

            } else {
                alert('信息有错误,请刷新页面重试!');
            }
        });
    });
    function time_to_befor(t){
        //2015-10-12T10:15:10Z
        //Js获取当前日期时间及其它操作
        //
        //var myDate = new Date();
        //myDate.getYear();        //获取当前年份(2位)
        //myDate.getFullYear();    //获取完整的年份(4位,1970-????)
        //myDate.getMonth();       //获取当前月份(0-11,0代表1月)
        //myDate.getDate();        //获取当前日(1-31)
        //myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
        //myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
        //myDate.getHours();       //获取当前小时数(0-23)
        //myDate.getMinutes();     //获取当前分钟数(0-59)
        //myDate.getSeconds();     //获取当前秒数(0-59)
        //myDate.getMilliseconds();    //获取当前毫秒数(0-999)
        //myDate.toLocaleDateString();     //获取当前日期
        //var mytime=myDate.toLocaleTimeString();     //获取当前时间
        //myDate.toLocaleString( );        //获取日期与时间
        var t_year = parseInt(t.substr(0,4));
        var t_month = parseInt(t.substr(5,7));
        var t_day = parseInt(t.substr(8,10));
        var t_hour = parseInt(t.substr(11,13));
        var t_minute = parseInt(t.substr(14,16));
        var now_datetime = new Date();
        var now_year = now_datetime.getFullYear();
        var now_month = now_datetime.getMonth()+1;
        var now_date = now_datetime.getDate();
        var now_hour = now_datetime.getHours();
        var now_minute = now_datetime.getMinutes();
        if(now_year-t_year>0){
            var str = now_year-t_year+'年前发布';
            return str
        }else if(now_month-t_month>0){
            var str = now_month-t_month+'月前发布';
                        //alert(str);
            return str
        }else if((now_date-t_day)>6){
            var str = Math.floor((now_date-t_day) / 7)+'周前发布';
                        //alert(str);
             return str
        }else if(now_date-t_day>0){
            var str = now_date-t_day+'天前发布';
                        //alert(str);
             return str
        }else if(now_hour-t_hour>0){
            var str = now_hour - t_hour + '小时前发布';
                        //alert(str);
             return str
        }else if(now_minute-t_minute>0){
            var str = now_minute - t_minute +'分钟前发布';
                        //alert(str);
             return str
        }else{
             return '刚刚发布'
        }
    }
});