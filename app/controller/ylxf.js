const CryptoJS = require('crypto-js');
const Controller = require('egg').Controller;


var list = [
    {
        "TaskTitle": "登录签到",
        "TaskDescribe": "首日1先锋值，连续2天2先锋值，连续3天及以上3先锋值",
        "TaskTypeCode": "task_001"
    },
    {
        "TaskTitle": "发表评论",
        "TaskDescribe": "每发表一次评论",
        "TaskTypeCode": "task_002"
    },
    {
        "TaskTitle": "分享内容",
        "TaskDescribe": "每分享一次内容",
        "TaskTypeCode": "task_003",
    },
    {
        "TaskTitle": "点赞",
        "TaskDescribe": "每进行一次点赞",
        "TaskTypeCode": "task_004"
    },
    {
        "TaskTitle": "三会一课签到",
        "TaskDescribe": "",
        "TaskTypeCode": "task_005",
        disable: true
    },
    {
        "TaskTitle": "线上缴纳当月党费",
        "TaskDescribe": "",
        "TaskTypeCode": "task_006",
        disable: true
    },


    {
        "TaskTitle": "主题党日签到",
        "TaskDescribe": "",
        "TaskTypeCode": "task_009",
        disable: true
    },
    {
        "TaskTitle": "支部活动报名",
        "TaskDescribe": "",
        "TaskTypeCode": "task_010",
        disable: true
    },
    {
        "TaskTitle": "微党课学习",
        "TaskDescribe": "有效阅读文章累计2分钟",
        "TaskTypeCode": "task_011"
    },
    {
        "TaskTitle": "微视频观看",
        "TaskDescribe": "有效观看视频累计3分钟",
        "TaskTypeCode": "task_012"
    },
    {
        "TaskTitle": "知识竞赛",
        "TaskDescribe": "参与一次正式答题并答对5题以上",
        "TaskTypeCode": "task_013"
    },
    {
        "TaskTitle": "发布三会一课会议纪要",
        "TaskDescribe": "",
        "TaskTypeCode": "task_014",
        disable: true
    },
    {
        "TaskTitle": "发布主题党日纪要",
        "TaskDescribe": "",
        "TaskTypeCode": "task_015",
        disable: true
    },
    {
        "TaskTitle": "发布支部活动精彩回顾",
        "TaskDescribe": "",
        "TaskTypeCode": "task_016",
        disable: true
    },
    {
        "TaskTitle": "近期重点学习",
        "TaskDescribe": "有效阅读学习累计2分钟",
        "TaskTypeCode": "task_017"
    },
    {
        "TaskTitle": "党员随身听",
        "TaskDescribe": "有效收听音频累计2分钟",
        "TaskTypeCode": "task_018"
    },
    {
        "TaskTitle": "培训班签到",
        "TaskDescribe": "",
        "TaskTypeCode": "task_019",
        disable: true
    },
    {
        "TaskTitle": "培训班课程评价",
        "TaskDescribe": "",
        "TaskTypeCode": "task_020",
        disable: true
    },
    {
        "TaskTitle": "上传培训班心得体会",
        "TaskDescribe": "",
        "TaskTypeCode": "task_021",
        disable: true
    },
    {
        "TaskTitle": "扫码登记缴纳当月党费",
        "TaskDescribe": "",
        "TaskTypeCode": "task_022",
        disable: true
    },
    {
        "TaskTitle": "积分自评",
        "TaskDescribe": "",
        "TaskTypeCode": "task_023",
        disable: true
    },
    {
        "TaskTitle": "积分初评一个党员",
        "TaskDescribe": "",
        "TaskTypeCode": "task_024",
        disable: true
    },
    {
        "TaskTitle": "积分终评一个党员",
        "TaskDescribe": "",
        "TaskTypeCode": "task_025",
        disable: true
    },
    {
        "TaskTitle": "阅读系统通知",
        "TaskDescribe": "",
        "TaskTypeCode": "task_026"
    }
]
function encrypt(word) {
    var key = CryptoJS.enc.Utf8.parse("ylxf6oci7tuzqn0u");
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}



function isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

    if (reg.test(card) === false) {
        return false;
    }
    return true;
}


function decrypt(word) {
    if (word && word != '') {
        if (isCardNo(word)) {
            return word;
        } else {
            var key = CryptoJS.enc.Utf8.parse("ylxf6oci7tuzqn0u");
            var decrypt = CryptoJS.AES.decrypt(word, key, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return CryptoJS.enc.Utf8.stringify(decrypt).toString();
        }
    } else {
        return word;
    }
}


class YlxfController extends Controller {

    async index() {
        const { ctx } = this;
        await ctx.render('ylxf.html', { name: 'egg' });
    }

    async login() {
        const { ctx } = this;
        const { username, password } = ctx.request.body;
        var loginParameters = { "Token": "api_public_v1.0", "LoginName": username + "", "PassWord": password + "", "ValidateCode": "", "LoginType": 0, "LoginedToken": "" }
        const LoginData = {
            'Token': encrypt(JSON.stringify(loginParameters) + '')
        }

        const result = await ctx.curl("https://apiylxfuc.1237125.cn/ylxf/v2/put/user/login?format=json", {
            method: "POST",
            dataType: "json",
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
            data: LoginData
        });

        if (result.data.StateCode == 200) {
            ctx.body = {
                code: 0,
                msg: "",
                data: {
                    token: result.data.Token,
                    list: list
                }
            }
        } else {
            ctx.body = {
                code: -1,
                msg: result.data.StateInfo,
                data: ""
            }
        }


    }

    async learn() {
        const { ctx } = this;
        const { token, code } = ctx.request.body;
        var learnData = { "Token": token, "SignInTime": "", "TaskCode": code }
        const result = await ctx.curl("https://apiynccppsns.1237125.cn/ylxf/v1/get/avant/garde/party/member/earn/integral?format=json", {
            method: "POST",
            dataType: "json",
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
            data: learnData
        });

        ctx.body = {
            code: 0,
            msg: "",
            data: result.data.StateInfo
        }
    }


}


module.exports = YlxfController;
