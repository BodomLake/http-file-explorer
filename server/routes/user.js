var express = require('express');
var router = express.Router();
var fs = require('fs')
var si = require('systeminformation');

/**
 * This function comment is parsed by doctrine
 * @route GET /api
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/', function (req, res, next) {
  res.json({response: 'respond with a resource'});
});
/**
 * 留给ThisPC.vue 组件来请求
 * 检查当前用户的私人文件夹
 * 3D Obejcts, Desktop , Documents, Downloads, Music, Pictures, Videos
 */
router.get('/getPersonalFolder', function (req, res, next) {
  const defaultFolderNames = ['3D Objects', 'Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos']
  let users;
  let arr = []
  si.users().then(data => {
    // console.log(data);
    users = data;
    let stat;
    const userPrefix = 'C:\\users\\' + users[0].user + '\\';
    for (let i = 0; i < defaultFolderNames.length; i++) {
      try {
        stat = fs.statSync(userPrefix + defaultFolderNames[i])
        stat.name = defaultFolderNames[i]
        arr.push(stat)
      } catch (exp) {
        console.log(exp);
      }
    }
  }).finally(()=>{
    res.json(arr || []);
  });

});
module.exports = router;
