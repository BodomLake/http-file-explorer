var express = require('express');
var router = express.Router();
var si = require('systeminformation')
var fs = require("fs");
const {system} = require("../utils/system");
const path = require("path");
const colors = require('colors')
const {readContentSync} = require("../utils/filePath");
const {getAllDiskOneAttr} = require("../utils/getAllDisk");
const {Response, Request} = require("../public/body.js")
const {getDrives, getPersonalFolders} = require("../service/user.js");


router.get('/', function (req, res, next) {
  si.networkConnections().then(r => res.json(r))
  // res.send(__dirname);
});

router.get('/wifiNetworks', function (req, res, next) {
  si.wifiNetworks().then(r => res.json(r))
  // res.send(__dirname);
});

router.get("/getList", async (req, res, next) => {
  await res.json(system)
})

// 默认一层深度
router.get("/getDir", function (req, res, next) {
  let dir = req.query.absPath ? req.query.absPath : path.resolve(__dirname, "../../");
  let depthLimit = req.query.depthLimit ? req.query.depthLimit : 1;
  // console.log("指定目录", dir.green, depthLimit);
  let targetDir = readContentSync(dir, depthLimit);
  // console.log(typeof targetDir)
  res.json(targetDir || {});
});

/**
 * 第三方库实现：获取硬盘信息
 * 获取各个驱动盘
 */
router.get("/getDrives", async (req, res, next) => {
  let drives = await getDrives()
  res.send(drives)
})

/**
 * 获取根目录 / ThisPC 下面的Library和Drives
 *
 */
router.get("/getRootDir", async (req, res, next) => {
  let drives = await getDrives()
  let folders = await getPersonalFolders()
  res.json({
    drives, folders
  })
})

/**
 * 获取用户文件夹下面的桌面，ThisPC
 *
 */
router.get("/getDesktopDir", async (req, res, next) => {
  let users;
  let targetDir;
  await si.users().then(data => {
    users = data;
    // 默认选取第一个用户
    const userPrefix = 'C:\\users\\' + users[0].user + '\\Desktop';
    targetDir = readContentSync(userPrefix, 1);
  })
  res.json(targetDir || {})
})

/**
 * 获取系统所有的用户名
 */
router.get("/getSystemUsers", async (req, res, next) => {
  await si.users().then(data => {
      res.json(data || [])
    }
  )
})

/**
 * 自己实现的 windows-cmd命令行标准输出，获取硬盘信息
 * 获取各个驱动盘
 */
router.get("/getDrivesByAttr", async (req, res, next) => {
  let attr = req.query.attr || '';
  let deviceId = req.query.deviceId || '';
  res.send(await getAllDiskOneAttr(deviceId, attr))
})

/**
 * 判断一个绝对路径知否指向的是一个文件夹，如果是文件则返回 否
 */
router.get("/isDirectory", async (req, res, next) => {
  let absPath = req.query.absPath ? req.query.absPath : path.resolve(__dirname, "../../");
  let stat;
  let response = new Response()
  response.isDirectory = false
  response.status = 200
  response.isDirectory = false
  try {
    stat = fs.statSync(absPath);
    response.isDirectory = stat ? stat.isDirectory() : false;
  } catch (exp) {
    // console.log('无法获取，给出错误', exp, stat);
    response.status = 500
    response.exception = exp
  } finally {
    res.json(response);
  }
})

module.exports = router;
