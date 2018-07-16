const request = require('superagent');
const jsonp = require('superagent-jsonp');
const cheerio = require('cheerio');
const JsEncrpt = require('./tool/jsencrpt');
const encrypt = require('./tool/encrypt');
const execl = require('excel-export');
const fs = require('fs');
let uname = process.argv[2];
let pwd = process.argv[3];
//console.log(JsEncrpt);
//console.log(RSA);
var cookie = '';
var detailUrl = [];
request
    .get('https://login.1234567.com.cn/login')
    .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
    .set('Cache-Control', 'max-age=0')
    .end(function (err, res) {
        var $ = cheerio.load(res.text);

        var _parmas = $('script')[3].children[0].data.split(',');
        var m = _parmas[2].split('=')[1].split("'")[1];
        var e = _parmas[3].split('=')[1].split("'")[1];
        console.log(typeof m)
        console.log(typeof e)

        console.log('m->>>', m, '<<<<', m.length);
        console.log('e->>>', e, '<<<<', e.length);
        var newpwd = encrypt(e, m, pwd);
        console.log('newpwd', newpwd);

        var parmas = JsEncrpt.JsEncrpt.encode(
            encodeURIComponent(
                [0, 0, uname, escape(newpwd), '', ''].join(',')
            )
        );
        console.log('csStr', parmas)
        //console.log(m,e,key)
        console.log($('#regexsubmitted').val());
        var fake = encrypt(e, m, $('#regexsubmitted').val())
        console.log(fake);




        // request
        //     .get("https://login.1234567.com.cn/cdn/logindata.html?t" + Math.random())
        //     .set('User-Agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
        //     .use(jsonp({
        //         callbackName: 'cb'
        //     }))
        //     .end(function(err,res){
        //         console.log(res.text,typeof res.text)
        //         if(res.text){
        //             var re = res.text.split(',')[1].split(':')[1].slice(0,-5)
        //             console.log(re);
        //             if (re) {
        //                 $('#logindata').html(parseInt(re))
        //             }
        //         }                
        //     })
        cookie = res.headers['set-cookie'];
        console.log(cookie);
        request
            .post('https://login.1234567.com.cn/LoginController.aspx/LoginNew')
            .set('Accept', 'application/json, text/javascript, */*; q=0.01')
            .set('Accept-Encoding', 'gzip, deflate, br')
            .set('Accept-Language', 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7')
            .set('Connection', 'keep-alive')
            .set('Content-Type', 'application/json; charset=UTF-8')
            .set('Page-Request-Anti-Fake', fake)
            .set('DNT', 1)
            .set('Host', 'login.1234567.com.cn')
            .set('Referer', 'https://login.1234567.com.cn/')
            .set('X-Requested-With', 'XMLHttpRequest')
            .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
            .set('Cookie', cookie)
            .send({
                loginParam: JSON.stringify(parmas)
            })
            .end(function (err, res) {
                cookie = res.headers['set-cookie'];
                request
                    .post('https://query.1234567.com.cn/Query/DelegateList')
                    .set('Cookie', cookie)
                    .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
                    .set('Referer', 'https://query.1234567.com.cn/?spm=l')
                    .send({
                        DataType: 1,
                        StartDate: '2016-8-1',
                        EndDate: '2018-07-16',
                        BusType: 0,
                        Statu: 0,
                        Account: 0,
                        FundType: 0,
                        PageSize: 1000,
                        PageIndex: 1,
                        Container: '',
                        FundCode: '',
                        callback: undefined
                    })
                    .end(function (err, res) {
                        console.log(res.text);
                        var $ = cheerio.load('<table>' + res.text + '<table>');
                        var conf = {};
                        conf.name = "ttjj";
                        conf.cols = [{
                                caption: 'time',
                                type: 'string',

                            },
                            {
                                caption: 'name',
                                type: 'string',

                            },
                            {
                                caption: 'code',
                                type: 'string',

                            },
                            {
                                caption: 'type',
                                type: 'string',

                            },
                            {
                                caption: 'num',
                                type: 'string',

                            },
                            {
                                caption: 'status',
                                type: 'string',

                            },
                            {
                                caption: 'detail',
                                type: 'string',

                            }
                        ];
                        conf.rows = [];
                        //console.log($);
                        console.log($('tr').length);
                        $('tr').each(function (i, obj) {
                            var time = $(this).find('span').eq(0).text() + ' ' + $(this).find('span').eq(1).text();
                            var name = $(this).find('a').eq(0).text();
                            var code = $(this).find('span').eq(2).text();
                            var type = $(this).find('td').eq(2).text();
                            var num = $(this).find('span').eq(3).text();
                            var status = $(this).find('td').eq(6).text();
                            var detail = 'https://query.1234567.com.cn' + $(this).find('a').eq(1).attr('href');
                            conf.rows.push([
                                time, name, code, type, num, status, detail
                            ]);
                            detailUrl.push(detail);

                        })
                        console.log(conf.rows);
                        var result = execl.execute(conf);
                        fs.writeFileSync('single.xlsx', result, 'binary');
                        handleDetailUrl();
                    })
            })
    });

var detailConf = {};
detailConf.name = "ttjj";
detailConf.cols = [{
        caption: '确认日',
        type: 'string',

    },
    {
        caption: '产品名称',
        type: 'string',

    },
    {
        caption: '业务类型',
        type: 'string',

    },
    {
        caption: '状态',
        type: 'string',

    },
    {
        caption: '净值',
        type: 'string',

    },
    {
        caption: '金额',
        type: 'string',

    },
    {
        caption: '份数',
        type: 'string',

    },
    {
        caption: '手续费',
        type: 'string',

    }
];
detailConf.rows = [];
function handleDetailUrl() {
    var url = detailUrl.shift();
    console.log(url);
    if (url) {
        request
            .get(url)
            .set('Cookie', cookie)
            .end(function (err, res) {
                //console.log(res.text);
                if(res&&res.text){
                    var $ = cheerio.load(res.text);
                    var obj = $('#mainDiv').find('.ui-confirm').last().find('tbody').first();
                    console.log(obj);
                    var arr = [
                        $(obj).find('td').eq(0).text(),
                        $(obj).find('td').eq(1).text(),
                        $(obj).find('td').eq(2).text(),
                        $(obj).find('td').eq(3).text(),
                        $(obj).find('td').eq(4).text(),
                        $(obj).find('td').eq(5).text(),
                        $(obj).find('td').eq(6).text(),
                        $(obj).find('td').eq(7).text()
                    ];
                    console.log(arr);
                    detailConf.rows.push(arr);
                }                
                handleDetailUrl();
            })
    }else{
        var result = execl.execute(detailConf);
        fs.writeFileSync('detail.xlsx', result, 'binary');
    }
}