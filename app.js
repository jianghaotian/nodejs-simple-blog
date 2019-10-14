const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');



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
