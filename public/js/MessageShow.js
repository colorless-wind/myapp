mui.init();

var succCallBack = function (res) {
    if (res.resultcode == '0000') {
        var data = res.resultojbect || [];
        var pbdArr = data.pbd;
        var wlArr = data.wl;
        var otherArr = data.others;
        var tempArr = pbdArr.concat(wlArr);
        var finalArr = tempArr.concat(otherArr);
        for (var i in finalArr) {
            if (i < 10) {
                $('#list').find('ul').append('<li class="origin">' + (i-(-1)) + '、 ' + finalArr[i].value + '</li>');
            } else {
                $('#list').parent().find('.more img').show();
                $('#list').find('ul').append('<li class="rest" style="display:none;">' + (i-(-1)) + '、 ' + finalArr[i].value + '</li>');
            }
        }
        if (finalArr.length == 0) {
            $('#list').find('ul').append('<li style="text-align:center;">暂无公告</li>');
        }
    } else {
        mui.toast('系统错误');
    }
}
//服务端获取菜单配置项
var url = '/readJson';
$.ajax(url, {
    //            data: param,
    dataType: 'json', //服务器返回json格式数据
    type: 'post', //HTTP请求类型
    timeout: 15000, //超时时间设置为15秒；
    //            contentType: 'application/json;charset=utf-8',
    //            beforeSend: beforeSend,
    //            complete: doComplete,
    //            error: doErrCallBack,
    success: succCallBack
    /*function (res) {
            data = res.resultojbect;
            //是否显示输出按钮
            if (data.pbd.length < 2) {
                $('#delPBD').hide();
            }
            if (data.wl.length < 2) {
                $('#delWL').hide();
            }
            if (data.others.length < 2) {
                $('#delOthers').hide();
            }


        }*/
})

$('.more').on('tap', function () {
    if ($(this).attr('data-status') == 'up') {
        $(this).parent().find('.type-list ul .rest').hide();
        $(this).attr('data-status', 'down');
        $(this).css('transform', 'rotate(0deg)');
    } else if ($(this).attr('data-status') == 'down') {
        $(this).parent().find('.type-list ul .rest').show();
        $(this).attr('data-status', 'up');
        $(this).css('transform', 'rotate(180deg)');
    } else {
        console.log($(this).attr('data-status'));
    }
})
