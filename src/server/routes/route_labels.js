const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Label = db.Label;

/**
 *
 * 提交标签
 *
 * @api {post} /api/label/query label.query
 * @apiName labelQuery
 * @apiGroup Label
 * @apiVersion 3.0.0
 * @apiPermission user
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/query', function (req, res) {
  Label.findAll({
    where: {
      $or: [
        {
          category: 'both'
        },
        {
          category: req.body.type
        }
      ]
    }
  })
    .then(function (labels) {
      res.json(labels);
      console.log('label query successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
      console.log('label query failed');
    });
});

/**
*
* 提交标签
*
* @api {post} /api/label/query label.query
* @apiName labelQuery
* @apiGroup Label
* @apiVersion 2.5.0
* @apiPermission user.teacher
*
* @apiSuccess {JSON} data Response data.
*
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
