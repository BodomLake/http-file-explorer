var express = require('express');
var router = express.Router();


/**
 * 用于测试基础 GET 请求的接口
 * @route GET /user/
 * @summary GET 测试
 * @group 测试
 * @returns {object} 200 - 返回 world
 */
router.get('/', function(req, res, next) {
  res.json({ response: 'respond with a resource'});
});
/**
 * This function comment is parsed by doctrine
 * @route GET /api
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/', function(req, res, next) {
  res.json({ response: 'respond with a resource'});
});
module.exports = router;
