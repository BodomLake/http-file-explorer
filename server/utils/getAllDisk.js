const process = require('child_process');
var iconv = require('iconv-lite');
// CP936(近似于gb2312)编码，nodejs以utf8识别是会出问题。
var encoding = 'cp936';
// var encoding = 'utf8';
var binaryEncoding = 'binary';

// cmd命令 查询盘符
const driverOrder = 'wmic logicaldisk get DeviceId'

  const option = ['Caption', 'Description', 'DeviceId', 'DriveType', 'FileSystem', 'FreeSpace', 'Size', 'VolumeName', 'VolumeSerialNumber']
// 查询某个盘符具体的信息
const detailOrder = (deviceId) => (`wmic logicaldisk where deviceId="${deviceId}" get ${option.join(', ')}`)
const order = (deviceId, attr) => (`wmic logicaldisk where deviceId="${deviceId}" get ${attr}`)
String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
}


/**
 * 获取盘符
 * @returns 返回被处理的 盘符id数组
 */
async function getAllDiskSymbol() {
  let diskDeviceIds = []

  let promise = new Promise((resolve, reject) => {
    process.exec(driverOrder, {windowsHide: true}, function (err, stdout, stderr) {
      if (err || stderr) {
        console.log("root path open failed" + err + stderr);
        return;
      }
      let disks = stdout.trim().replaceAll('\r\r', '').split('\n')
      // 移除第一个元素
      disks.shift()
      // console.log(disks, typeof disks, disks.length)
      diskDeviceIds = [];
      disks.forEach(d => {
        diskDeviceIds.push(d.trim())
      })
      console.log(diskDeviceIds)
      resolve(diskDeviceIds)
    })
  })
  return promise;
}

module.exports.getAllDiskSymbol = getAllDiskSymbol;

/**
 * 获取PC中所有盘符及其名称
 * @returns 电脑中所有盘符及其归属信息
 */
async function getAllDisk() {
  // 把异步结果 扔给前端去处理；后端不多做逻辑分析
  let diskDeviceIds = []
  diskDeviceIds = await getAllDiskSymbol();
  console.log('取得diskDeviceIds:', diskDeviceIds)
  let promiseArr = []
  // 汇集每一个盘符的查询结果
  diskDeviceIds.forEach((id, index) => {
    let promise = new Promise((resolve, reject) => {
      // 以二进制流出('binary')
      // console.log(id)
      process.exec(detailOrder(id), {
        windowsHide: true, encoding: binaryEncoding
      }, function (err, stdout, stderr) {
        if (err || stderr) {
          console.log("root path open failed" + err + stderr);
          return;
        }
        // 对流出的二进制码，按照cp936的编码规则输出字符串
        // buffer作为二进制码流的载体，用 iconv-lite反手给他解码出来
        let data = iconv.decode(new Buffer(stdout, binaryEncoding), encoding)
        resolve(data)
      })
    })
    promiseArr.push(promise)
  })
  return Promise.all(promiseArr);
}

module.exports.getAllDisk = getAllDisk

async function getAllDiskOneAttr(id, attr) {
  let promise = new Promise((resolve, reject) => {
    process.exec(order(id, attr), {
      windowsHide: true, encoding: binaryEncoding
    }, function (err, stdout, stderr) {
      if (err || stderr) {
        console.log("root path open failed" + err + stderr);
        return;
      }
      let out = iconv.decode(new Buffer(stdout, binaryEncoding), encoding)
      let value = (out.split('\n')[1]).toString().replaceAll('  ','').trim().replaceAll('\r', '')
      resolve({id: id, value: value, attr: attr})
      // console.log(value)
      // resolve(value)
    })
  })
  return promise
}

module.exports.getAllDiskOneAttr = getAllDiskOneAttr

// getAllDisk();
