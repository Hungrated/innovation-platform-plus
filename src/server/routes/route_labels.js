const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Label = db.Label;

/**
*
* 新增标签
*
* @api {post} /api/label/submit label.submit
* @apiName labelSubmit
* @apiGroup Label
* @apiVersion 3.0.0
* @apiPermission user.teacher
*
* @apiDescription 教师新增类型标签。
*
* @apiParam {String} name 标签名
* @apiParam {String} category 标签类型 可选： blog|file|both
* @apiParam {Number} adder_id 添加者编号
*
* @apiParamExample {json} 请求示例
* {
*     "name": "JavaScript",
*     "category": "blog",
*     "adder_id": 40429
* }
*
* @apiSuccess {Number} status 状态代码
* @apiSuccess {String} msg 反馈信息
* @apiSuccess {Number} label_id 标签编号
* @apiSuccessExample {json} 成功返回示例
* HTTP/1.1 200 OK
* {
*     "status": 8400,
*     "msg": "标签创建成功",
*     "label_id": 12
* }
*/
router.post('/submit', function (req, res) {
  Label.create({
    name: req.body.name,
    category: req.body.category,
    adder_id: req.body.adder_id
  })
    .then(function (label) {
      res.json({
        status: statusLib.LABEL_CREATE_SUCCESSFUL.status,
        msg: statusLib.LABEL_CREATE_SUCCESSFUL.msg,
        label_id: label.label_id
      });
      console.log('label create successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.LABEL_CREATE_FAILED);
      console.log('label create failed');
    });
});

module.exports = router;
