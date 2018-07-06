/*此文件为项目公用js*/

/*
 * 全局的ajax请求对应页面的接口清单
 * */
//var baseAjaxUrl = 'http://localhost:8080';
//var baseAjaxUrl = 'http://10.1.1.106:8080';
var baseAjaxUrl = '';
var ajaxList = {
    userReg: {
        userlog: baseAjaxUrl + '/runner/ws/log/addNewUserLog', //记录用户日志
        verifycode: baseAjaxUrl + '/runner/ws/ut/smssend', //发送验证码
        regist: baseAjaxUrl + '/runner/ws/ut/regist', //App注册
        registH5: baseAjaxUrl + '/runner/ws/ut/registH5', //H5渠道App注册
        login: baseAjaxUrl + '/runner/ws/ut/login', //登录
        savetour: baseAjaxUrl + '/runner/ws/userApply/saveTourInfo', //提交旅游报名信息
    }

}

/* 获取地址栏参数 */
function GetQueryString(url, name) {
    //获取地址栏参数正则
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var ls = url.split('?')[1] || '';
    var r = ls.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/*
 * 全局ajax
 * */
function sendAjax(url, type, param, showFlag, succCallBack, errCallBack, complete) {
    //暂时不加加载动画
    function loadingAnime() {

    }
    if (!url) {
        mui.toast('请求地址为空');
        return false;
    }

    if (!type) {
        mui.toast('请求类型为空');
        return false;
    }

    //发送前
    var beforeSend = function (request) {
        //加载动画
        if (showFlag === 0) {
            loadingAnime('show');
        }
    }

    //成功回调
    if (typeof succCallBack != 'function') {
        succCallBack = function () {
            mui.toast('成功回掉函数未定义');
        }
    }
    var doSuccCallBack = function (res) {
        if (!res) {
            mui.toast('返回为空');
            return false;
        } else if (typeof (res) === 'string') {
            res = JSON.parse(res);
        }
        succCallBack(res);
    }

    //完成
    var doComplete = function () {
        if (showFlag === 0) {
            loadingAnime('remove');
        }
    }
    if (typeof complete === "function") {
        doComplete = function () {
            complete(data);
            if (showFlag === 0) {
                loadingAnime('remove');
            }
        }
    }

    //失败
    var doErrCallBack = function (xhr) {
        console.warn(xhr);
        console.warn('xhr状态' + xhr.status);
        console.warn('报错信息' + xhr.response);
    }
    if (typeof errCallBack === 'function') {
        doErrCallBack = function (xhr) {
            console.log(xhr);
            console.log('xhr状态' + xhr.status);
            console.log('报错信息' + xhr.response);
            errCallBack(xhr);
        }
    }

    //本地json文件调试
    if (mui && url.match('.json')) {
        mui.getJSON(url, null, doSuccCallBack);
        return false;
    }

    if (mui) {
        mui.ajax(url, {
            data: param,
            dataType: 'json', //服务器返回json格式数据
            type: type, //HTTP请求类型
            timeout: 15000, //超时时间设置为15秒；
            headers: {
                //			"Access-Control-Allow-Origin": "*",
                //			"Access-Control-Allow-Headers": "X-Requested-With",
                //			"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
                //			"X-Powered-By": ' 3.2.1',
                //			"Access-Control-Max-Age": 0,
                'timestamp': parseInt(new Date().getTime() / 1000),
                'requestsource': "H5",
                'signtype': "HMACMD5",
                'Content-Type': 'application/json;charset=utf-8'
            },
            beforeSend: beforeSend,
            complete: doComplete,
            success: doSuccCallBack,
            error: doErrCallBack
        });
    } else {
        $.ajax(url, {
            data: hex_hmac_md5("1234554321", JSON.stringify(param)),
            dataType: 'json', //服务器返回json格式数据
            type: type, //HTTP请求类型
            timeout: 15000, //超时时间设置为15秒；
            headers: {
                //			"Access-Control-Allow-Origin": "*",
                //			"Access-Control-Allow-Headers": "X-Requested-With",
                //			"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
                //			"X-Powered-By": ' 3.2.1',
                //			"Access-Control-Max-Age": 0,
                'timestamp': parseInt(new Date().getTime() / 1000),
                'requestsource': "H5",
                'signtype': "HMACMD5",
                'Content-Type': 'application/json;charset=utf-8'
            },
            beforeSend: beforeSend,
            complete: doComplete,
            success: doSuccCallBack,
            error: doErrCallBack
        });
    }
}

/* 随机数生成方法（32位） */
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

/*
 * 获取手机信息（手机型号、系统版本）
 * 依赖库jquery
 * 依赖库mobile-detect.js
 * 依赖库device.js
 * */
function getMobileInfo() {

    var info = {};
    //判断数组中是否包含某字符串
    Array.prototype.contains = function (needle) {
        for (i in this) {
            if (this[i].indexOf(needle) > 0)
                return i;
        }
        return -1;
    }

    var device_type = navigator.userAgent; //获取userAgent信息
    var md = new MobileDetect(device_type); //初始化mobile-detect
    var os = md.os(); //获取系统
    info.os = os;
    var model = "";
    if (os == "iOS") { //ios系统的处理
        //os = md.os() + md.version("iPhone");
        info.version = md.version("iPhone");
        //model = md.mobile();
        info.model = MobileDevice.getModels() == 'unknown' ? md.mobile() : MobileDevice.getModels();
    } else if (os == "AndroidOS") { //Android系统的处理
        //os = md.os() + md.version("Android");
        info.version = md.version("Android");
        var sss = device_type.split(";");
        var i = sss.contains("Build/");
        if (i > -1) {
            model = sss[i].substring(0, sss[i].indexOf("Build/"));
            info.model = model;
        }
    }
    //document.write(device_type); //打印到页面
    //alert(JSON.stringify(info)); //打印系统版本和手机型号
    return info;
}

/*
 * 验证手机号
 * 接收参数为手机号字符串
 * 例：'15611740510'
 * 选填参数为提示信息字符串
 * 例：'请输入有效的手机号'
 * */
function checkMobileNumber(phone, message) {
    //手机号验证正则表达式
    var regexp = /^1[34578]\d{9}$/;
    if (!regexp.test(phone)) {
        if (message) {
            mui.toast(message);
            return false;
        } else {
            mui.toast('您输入的手机号码有误，请检查后重新输入');
            return false;
        }
    }
    return true;
}

/*
 * 锁定输入的位数
 * 接收参数1为dom元素的id名称
 * 例：'phoneInput'
 * 接收参数2为锁定输入的位数
 * 例：'11'
 * */
function lockInputNum(domId, num) {
    //绑定输入事件
    document.getElementById(domId).addEventListener('input', function () {
        if (this.value.length > num) {
            this.value = this.value.slice(0, num);
        }
    })
}

/*
 * 锁定只能输入数字
 * 接收参数1为dom元素的id名称
 * 例：'phoneInput'
 * */
function lockOnlyNumber(domId) {
    //绑定keyup事件
    document.getElementById(domId).addEventListener('keyup', function () {
        this.value = this.value.replace(/[^\d]/g, '');
    })
}
/*
 * 收起手机软键盘(待定)
 * */
function switchOffKeyBoard() {
    for (var i = 0; i < document.getElementsByTagName('input').length; i++) {
        document.getElementsByTagName('input')[i].blur();
    }
    for (var i = 0; i < document.getElementsByTagName('textarea').length; i++) {
        document.getElementsByTagName('textarea')[i].blur();
    }
}
/*
 * 禁止重复点击
 * 选填参数1为dom元素的id名称
 * 例：'loginBtn'
 * 选填参数2为dom元素的class名称
 * 例：'mui-btn'
 * */
function banRepeatTap(domId, domClass) {
    if (domId) {
        //禁止点击事件
        document.getElementById(domId).style.pointerEvents = 'none';
        document.getElementById(domId).style.opacity = '0.5';
    } else if (domClass) {
        //禁止点击事件
        for (var i = 0; i < document.getElementsByClassName(domClass).length; i++) {
            document.getElementsByClassName(domClass)[i].style.pointerEvents = 'none';
            document.getElementsByClassName(domClass)[i].style.opacity = '0.5';
        }
    } else {
        console.warn('没有传入有效的参数，请检查。使用本方法请传入目标dom元素的id或者class');
    }
}

/*
 * 解除重复点击
 * 选填参数1为dom元素的id名称
 * 例：'loginBtn'
 * 选填参数2为dom元素的class名称
 * 例：'mui-btn'
 * */
function recoverRepeatTap(domId, domClass) {
    if (domId) {
        //禁止点击事件
        document.getElementById(domId).style.pointerEvents = 'auto';
        document.getElementById(domId).style.opacity = '1';
    } else if (domClass) {
        //禁止点击事件
        for (var i = 0; i < document.getElementsByClassName(domClass).length; i++) {
            document.getElementsByClassName(domClass)[i].style.pointerEvents = 'auto';
            document.getElementsByClassName(domClass)[i].style.opacity = '1';
        }
    } else {
        console.warn('没有传入有效的参数，请检查。使用本方法请传入目标dom元素的id或者class');
    }
}
/*
 * 获取验证码
 * 接收参数为验证码按钮dom元素
 * 例："document.getElementById('getVerifyCodeBtn')"
 * */
function getVerifyCode(ele, execute) {
    //重发验证码时间间隔
    var timeBlock = 59;
    //获取当前点击的验证码按钮
    var verifyBtn = ele;
    //获取验证码按钮的文字
    var originText = ele.innerText;
    //禁止重复点击
    banRepeatTap(ele.id);
    //计时器
    var TimeCounter = setInterval(function () {

        verifyBtn.innerText = timeBlock + 's';
        timeBlock--;
        //回归初始状态
        if (timeBlock < 0) {
            //清除计时器
            clearInterval(TimeCounter);
            //时间重置
            timeBlock = 59;
            //文字重置
            verifyBtn.innerText = originText;
            //解除 点击禁用 状态
            recoverRepeatTap(ele.id);
        }
    }, 1000);
    //执行附加逻辑
    if (execute) {
        execute();
    }
}

/*
 * 翻译返回的错误码对应的信息，如果有附加逻辑处理
 * 必填参数为 返回的错误码
 * 例："0002"
 * 选填参数为 附加逻辑JSON配置
 * 例：[{code:'0002',needAlert:false,execute:function(){//do something...}}]
 * */
function transResultCode(resultcode, executelist) {
    //返回信息中文
    var resultMessage = '';
    switch (resultcode) {
        case "0000":
            resultMessage = '访问成功';
            break;
        case "0001":
            resultMessage = '访问失败';
            break;
        case "0002":
            resultMessage = '无记录';
            break;
        case "0003":
            resultMessage = '缺少必要参数';
            break;
        case "0004":
            resultMessage = '数据错误或异常';
            break;
        case "0005":
            resultMessage = '去程航班座位不足';
            break;
        case "0006":
            resultMessage = '手机号已存在';
            break;
        case "0007":
            resultMessage = '用户不存在';
            break;
        case "0008":
            resultMessage = '手机号密码不匹配';
            break;
        case "0009":
            resultMessage = '校验码错误';
            break;
        case "0010":
            resultMessage = '用户密码错误';
            break;
        case "0011":
            resultMessage = '归属会员不存在';
            break;
        case "0012":
            resultMessage = '数据长度错误';
            break;
        case "0013":
            resultMessage = '手机号为空';
            break;
        case "0014":
            resultMessage = '此订单航段信息不存在';
            break;
        case "0113":
            resultMessage = '动态文章不存在';
            break;
        case "0114":
            resultMessage = '周刊文章不存在';
            break;
        case "0115":
            resultMessage = '订单价格错误';
            break;
        case "0116":
            resultMessage = '返程航班座位不足';
            break;
        case "0117":
            resultMessage = '重复乘客';
            break;
        case "0118":
            resultMessage = '订单金额不能小于和等于0';
            break;
        case "0119":
            resultMessage = '乘机人不能少于1人';
            break;
        case "0120":
            resultMessage = '乘机人信息不完整';
            break;
        case "0121":
            resultMessage = '订单类型不正确';
            break;
        case "0122":
            resultMessage = '联系人信息错误';
            break;
        case "0123":
            resultMessage = '包专机座位不能少于1';
            break;
        case "0124":
            resultMessage = '证件类型不能为空';
            break;
        case "0125":
            resultMessage = '航班日期错误';
            break;
        case "1010":
            resultMessage = '微信公众号文章不存在';
            break;
        case "3001":
            resultMessage = '请求报文头错误';
            break;
        default:
            resultMessage = '列表中无此返回码，请核对返回码列表';
            break;
    }

    //不执行附加逻辑 不弹窗 无此情况
    //执行附加逻辑 不弹窗
    //执行附加逻辑 弹窗
    if (executelist && executelist.length > 0) {
        var isAlert = 0;
        for (var i = 0; i < executelist.length; i++) {
            if (resultcode == executelist[i].code) {
                executelist[i].execute();
                if (executelist[i].needAlert == true) {
                    mui.toast(resultMessage);
                }
            } else {
                isAlert++;
            }
        }
        //此情况为返回码并不在附加逻辑的处理范围，此时为“普通情况”
        if (isAlert == executelist.length) {
            mui.toast(resultMessage);
        }
    } else {
        //不执行附加逻辑 弹窗（普通情况）
        mui.toast(resultMessage);
    }
}
