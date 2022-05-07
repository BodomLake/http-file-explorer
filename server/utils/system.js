var os = require('os')
let system = {
  Arch : os.arch(),
  Platform : os.platform(),
  Type : os.type(),
  Release : os.release(),
  Version : os.version(),
  HostName : os.hostname(),
  CPUs : os.cpus(),
  FreeMem : os.freemem(),
  TotalMem : os.totalmem(),
  EOL: os.EOL,
  TmpDir : os.tmpdir(),
  NetworkInterfaces : os.networkInterfaces(),
  UserInfo: os.userInfo(),
}
module.exports = {system}
