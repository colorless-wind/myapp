var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

/* GET home page. */
router.post('/readJson', function (req, res, next) {
    fs.readFile('./data/data.json', 'utf-8', function (err, data) {
        // 读取文件失败/错误
        if (err) {
            throw err;
        }
        // 读取文件成功
        res.send(data.toString());
    });
});

/* GET home page. */
router.post('/writeJson', function (req, res, next) {
    // 写入文件内容（如果文件不存在会创建一个文件）
    // 写入时会先清空文件
    fs.writeFile('./data/data.json', JSON.stringify(req.body.content), function (err) {
        if (err) {
            throw err;
        }

        console.log('Saved.');

        // 写入成功后读取测试
        fs.readFile('./data/data.json', 'utf-8', function (err, data) {
            if (err) {
                throw err;
            }
            res.send(data.toString());
        });
    });
});

module.exports = router;
