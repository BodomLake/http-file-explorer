var os = require('os')
let system = {
  arch : os.arch(),
  platform : os.platform(),
  type : os.type(),
  release : os.release(),
  version : os.version(),
  hostname : os.hostname(),
  cpus : os.cpus(),
  freeMem : os.freemem(),
  totalMem : os.totalmem(),
  EOL: os.EOL,
  tmpdir : os.tmpdir(),
  networkInterfaces : os.networkInterfaces(),
  userInfo: os.userInfo(),
}
module.exports = {system}
