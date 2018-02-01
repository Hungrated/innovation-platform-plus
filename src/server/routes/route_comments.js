const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Comment = db.Comment;

/**
 *
 * 发表评论
 *
 * @api {post} /api/comment/submit comment.submit
 * @apiName commentSubmit
 * @apiGroup Comment
 * @apiVersion 2.2.0
 * @apiPermission user
 *
 * @apiDescription 用户评论文章。
 *
 * @apiParam {Number} student_id 用户编号
 * @apiParam {String} blog_id 文章编号
 * @apiParam {String} content 评论内容
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "student_id": 14051531,
 *     "blog_id": "blg782148",
 *     "content": "content0"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 3200,
 *     "msg": "评论成功"
 * }
 */
router.post('/submit', function (req, res) {
  const {
    student_id,
    blog_id,
    content
  } = req.body;
  Comment.create({
    content,
    student_id,
    blog_id
  })
    .then(function () {
      res.json(statusLib.COMMENT_SUCCESSFUL);
      console.log('comment successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.COMMENT_FAILED);
      console.log('publish failed');
    });
});

module.exports = router;
