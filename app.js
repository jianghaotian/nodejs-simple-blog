const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const queryString = require('querystring');
let {chapterList, userList} = require('./data');

http.createServer((req, res) => {
    let urlObj = url.parse(req.url);

    switch (urlObj.pathname) {
        // ----- 显示页面 ----- //
        // 列表页
        case '/list':
            var htmlPath = path.join(__dirname, 'src', 'chapterList.html');
            showHtml(htmlPath, res);
            break;
        // 博客详情页
        case '/detail':
            var htmlPath = path.join(__dirname, 'src', 'chapter.html');
            showHtml(htmlPath, res);
            break;
        // 后台登录页面
        case '/login':
            var htmlPath = path.join(__dirname, 'src', 'login.html');
            showHtml(htmlPath, res);
            break;
        // 后台文章列表页面
        case '/listmanager':
            var htmlPath = path.join(__dirname, 'src', 'list.html');
            showHtml(htmlPath, res);
            break;
        // 后台添加文章页面
        case '/addChapter':
            var htmlPath = path.join(__dirname, 'src', 'addChapter.html');
            showHtml(htmlPath, res);
            break;
        // ----- 重定向 ----- //
        case '/list/':
            res.writeHead(302,{'Location': '/list'})
            res.end();
            break;
        case '/detail/':
            res.writeHead(302,{'Location': '/detail'})
            res.end();
            break;
        case '/login/':
            res.writeHead(302,{'Location': '/login'})
            res.end();
            break;
        case '/listmanager/':
            res.writeHead(302,{'Location': '/listmanager'})
            res.end();
            break;
        case '/addChapter/':
            res.writeHead(302,{'Location': '/addChapter'})
            res.end();
            break;
        // ----- 功能实现 ----- //
        // 获取文章列表
        case '/getChapterList':
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(chapterList));
            break;
        // 获取一篇文章
        case '/getDetail':
            var chapterId = queryString.parse(urlObj.query).chapterId;
            var dataList = [];
            chapterList.forEach((data, index) => {
                if (data.chapterId == chapterId) {;
                    dataList.push(data);
                }
            })
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(dataList));
            break;
        // 删除文章
        case '/delChapter':
            var chapterId = queryString.parse(urlObj.query).chapterId;
            for (var i = 0; i < chapterList.length; i++) {
                if (chapterList[i].chapterId == chapterId) {
                    chapterList.splice(i, 1);
                    data = {code: 0};
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(data));
                    return ;
                }
            }
            data = {code: -1};
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(data));
            break;
        // 登录
        case '/getlogin':
            var postData = "";
            req.on("data", function (chunk) {
                postData += chunk;
            });
            req.on("end", function () {
                var params = queryString.parse(postData);
                var username = params.username;
                var password = params.password;
                var i = 0;
                for (i = 0; i < userList.length; i++) {
                    if(userList[i].username == username && userList[i].pwd == password) {
                        data = {code: 0};
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(data));
                        return ;
                    }
                }
                data = {code: -1};
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(data));
            });
            break;
            // 添加文章
            case '/add':
                var postData = "";
                req.on("data", function (chunk) {
                    postData += chunk;
                });
                req.on("end", function () {
                    var params = queryString.parse(postData);
                    var title = params.title;
                    var content = params.content;
                    var date = new Date();
                    var dict = {
                        "chapterId": chapterList[chapterList.length-1].chapterId + 1,
                        "chapterName": title,
                        "imgPath": "",
                        "chapterDes": content,
                        "chapterContent": content,
                        "publishTimer": `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
                        "author": "admin",
                        "views": 0
                    }
                    chapterList.push(dict);
                    data = {code: 0};
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(data));
                });
                break;
        // ----- 静态资源 ----- //
        default:
            var htmlPath = path.join(__dirname, 'src', urlObj.pathname);
            fs.readFile(htmlPath, (err, data) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/plane; charset=utf-8'});
                    res.end("404 NOT FOUND");
                } else {
                    var extName = path.extname(htmlPath).toLowerCase();
                    if (extName === '.js') {
                        res.writeHead(200, {'Content-Type': 'text/javascript'});
                    } else if (extName === '.css') {
                        res.writeHead(200, {'Content-Type': 'text/css'});
                    } else if (extName === '.png') {
                        res.writeHead(200, {'Content-Type': 'image/png'});
                    } else if (extName === '.jpg' || extName === '.jpeg') {
                        res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/plane; charset=utf-8'});
                        // res.end("404 NOT FOUND");
                        console.log(data);
                    }
                    res.end(data);   
                }
            })
            break;
    }
}).listen(8083);
console.log("server listen 8083")

// ----- function ----- //
function showHtml(htmlPath, res) {
    fs.readFile(htmlPath, (err, data) => {
        if (!err) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(data);
        } else {
            console.log(err);
        }
    })
}


