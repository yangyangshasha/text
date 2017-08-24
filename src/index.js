let colors = require('./color'),
    readline = require('readline'),
    http = require('http');

const API_KEY = '08f7177038cd4182bca758343067827d';

const RESPONSE_TYPE = {
    TEXT: 100000,
    LINK: 200000,
    NEWS: 302000
}

function initchat() {
    let welcome = '快来聊天吧';
    // for(let i = 0; i < welcome.length; i++){
    //     colors.colorLog('----------', welcome[i], '-----------');
    // }
    // 另一种写法
    Array.prototype.forEach.call(welcome, (i) => {
        colors.colorLog('----------', i, '-----------');
    })


    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let name = '';
    rl.question('> 阁下尊姓大名：', (answer) => {
        name = answer;
        console.log('你好' + answer);
        chat();
    });

    function chat() {
        rl.question('> 请输入你的问题：', (query) => {
            if (!query) {
                colors.colorLog('慢走，不谢');
                process.exit(0);
            }
            let req = http.request({
                hostname: 'www.tuling123.com',
                path: '/openapi/api',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    colors.colorLog(handleResponse(data));
                    chat();
                })
            });

            req.write(JSON.stringify({
                key: API_KEY,
                info: query,
                userid: name
            }));

            req.end();
        });
    }
    function handleResponse(data) {
        let res = JSON.parse(data);
        // console.log(res);
        switch (res.code) {
            case RESPONSE_TYPE.TEXT:
                return res.text;
            case RESPONSE_TYPE.LINK:
                return `${res.text} : ${res.url}`;
            case RESPONSE_TYPE.NEWS:
                let listInfo = '';
                (res.list || []).forEach((it) => {
                    listInfo += `\n文章: ${it.article}\n来源: ${it.source}\n链接: ${it.detailurl}`;
                });
                return `${res.text}\n${listInfo}`;
            default:
                return res.text;
        }
    }
}

module.exports = initchat;