const {diskinfo} = require("@dropb/diskinfo");
const {getAllDiskOneAttr} = require("../utils/getAllDisk.js");
const si = require("systeminformation");
const fs = require("fs");

async function getDrives() {
  return new Promise((resolve, reject) => {
    diskinfo().then(drives => {
      let drivePromises = []
      drives.forEach((drive) => {
        let deviceId = drive.target
        let p1 = getAllDiskOneAttr(deviceId, 'fileSystem')
        let p2 = getAllDiskOneAttr(deviceId, 'volumeName')
        drivePromises.push(p1, p2)
      })
      // 等待所有请求完成
      Promise.allSettled(drivePromises).then(information => {
        resolve(drives.map((drive) => {
            // 补全硬盘信息
            information.forEach(info => {
              if (drive.target == info.value.id) {
                drive[info.value.attr] = info.value.value
              }
            })
            return drive
          })
        )
      })
    }).catch(err => {
        console.error(err.message)
        reject(err.message)
      }
    )
  })
}

async function getPersonalFolders() {
  const defaultFolderNames = ['3D Objects', 'Desktop', 'Documents', 'Downloads', 'Music', 'Pictures', 'Videos']
  let users;
  let personalFolders = []
  await si.users().then(data => {
    // console.log(data);
    users = data;
    let stat;
    // 默认选取第一个用户
    const userPrefix = 'C:\\users\\' + users[0].user + '\\';
    for (let i = 0; i < defaultFolderNames.length; i++) {
      try {
        stat = fs.statSync(userPrefix + defaultFolderNames[i])
        stat.name = defaultFolderNames[i]
        personalFolders.push(stat)
      } catch (exp) {
        console.log(exp);
      }
    }
  })
  return personalFolders;
}

module.exports = {
  getDrives, getPersonalFolders
}
