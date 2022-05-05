var express = require("express");
var path = require("path");
var router = express.Router();
var colors = require('colors')
var {readContentSync} = require("../../filePath");
var {diskinfo} = require('@dropb/diskinfo');
var {system} = require('../utils/system')
var {getAllDisk, getAllDiskOneAttr} = require('../utils/getAllDisk')

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {title: "Express"});
});

router.get("/getDir", function (req, res, next) {
  let dir = req.query.absPath ? req.query.absPath : path.resolve(__dirname, "../../");
  console.log("指定目录", dir.green);
  let targetDir = readContentSync(dir, 1);
  // console.log(targetDir)
  res.json(targetDir);
});

/**
 * 第三方库实现：获取硬盘信息
 * 获取各个驱动盘
 */
router.get("/getDrives", async (req, res, next) => {
  await diskinfo().then(result => {
    console.log(result)
    // 'VolumeName', 'VolumeSerialNumber', 'FileSystem'
    result.forEach(r => {
      console.log(r.target)
      let target = r.target
      // result.VolumeName = await getAllDiskOneAttr(target, 'VolumeName')
      // result.VolumeSerialNumber = getAllDiskOneAttr(target, 'VolumeSerialNumber')
      // result.FileSystem = getAllDiskOneAttr(target, 'FileSystem')
    })
    res.send(result)
  }).catch(err =>
    console.error(err.message)
  );
})
/**
 * 自己实现的 cmd命令行标准输出，获取硬盘信息
 * 获取各个驱动盘
 */
// router.get("/getDrives", async (req, res, next) => {
//   res.send(await getAllDisk())
// })
router.get("/getDrivesByAttr", async (req, res, next) => {
  let attr = req.query.attr || '';
  let deviceId = req.query.deviceId || '';
  res.send(await getAllDiskOneAttr(deviceId, attr))
})

router.get("/getSystem", async (req, res, next) => {
  await res.json(system)
})


module.exports = router;
