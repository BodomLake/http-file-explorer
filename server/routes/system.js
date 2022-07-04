var express = require('express');
var router = express.Router();
var si = require('systeminformation')
const {system} = require("../utils/system");
const path = require("path");
const colors = require('colors')
const {readContentSync} = require("../../filePath");
const {diskinfo} = require("@dropb/diskinfo");
const {getAllDiskOneAttr} = require("../utils/getAllDisk");


router.get('/', function(req, res, next) {
  si.networkConnections().then(r => res.json(r))
  // res.send(__dirname);
});

router.get('/wifiNetworks', function(req, res, next) {
  si.wifiNetworks().then(r => res.json(r))
  // res.send(__dirname);
});

router.get("/getList", async (req, res, next) => {
  await res.json(system)
})

router.get("/getDir", function (req, res, next) {
  let dir = req.query.absPath ? req.query.absPath : path.resolve(__dirname, "../../");
  // console.log("指定目录", dir.green);
  let targetDir = readContentSync(dir, 1);
  // console.log(targetDir, __dirname)
  res.json(targetDir || {});
});

/**
 * 第三方库实现：获取硬盘信息
 * 获取各个驱动盘
 */
router.get("/getDrives", async (req, res, next) => {
  await diskinfo().then(result => {
    // console.log(result)
    res.send(result)
  }).catch(err =>
    console.error(err.message)
  );
})

/**
 * 自己实现的 windows-cmd命令行标准输出，获取硬盘信息
 * 获取各个驱动盘
 */
/*
  router.get("/getDrives", async (req, res, next) => {
    res.send(await getAllDisk())
  })
*/
router.get("/getDrivesByAttr", async (req, res, next) => {
  let attr = req.query.attr || '';
  let deviceId = req.query.deviceId || '';
  res.send(await getAllDiskOneAttr(deviceId, attr))
})

module.exports = router;
