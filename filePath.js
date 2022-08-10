/**
 * 遍历当前 文件夹(__dirname) 生产index.html 作为目录
 */
var fs = require("fs");
var path = require("path");
const {cwd} = require("process");
// 目前仅仅支持 windows 系统
var iconExtractor = require('icon-extractor');

async function getIcon(path, name) {
  let base64;
  await new Promise((resolve, reject) => {
    iconExtractor.emitter.on('icon', function (data) {
      // {'Context', 'Path', 'Base64ImageData'}
      resolve(data.Base64ImageData)
    })
    iconExtractor.getIcon(name, path)
  }).then((res)=>{
    base64 = res
  })
  return base64;
}

// 是否在控制台打印出 树状结构
var printTreeInConsole = false;
// 忽略掉的选项
var ignoreItem = [
  // "node_modules",
  // "filePath.js",
  // ".git",
  // ".gitignore",
  // ".vscode",
  // ".idea",
  // 目前发现，以下两者在超级管理员的权限之下也无法查看，暂时不做忽略
  "System Volume Information",
  "Config.Msi"
];
var ignoreSuffix = [
  'sys', 'tmp'
]

class File {
  constructor(name, absPath, relPath, type, size, comment, tag, icon) {
    this.name = name || "";
    this.absPath = absPath || "";
    this.relPath = relPath || "";
    this.comment = comment || "";
    this.tag = tag || "";
    this.size = size || 0;
    this.type = type || "";
    // 图标的icon Base64编码
    this.icon = icon || "";
  }
}

class Directory {
  constructor(name, absPath, relPath, comment, tag) {
    this.files = [];
    this.directories = [];
    this.name = name || "";
    this.absPath = absPath || "";
    this.relPath = relPath || "";
    this.comment = comment || "";
    this.tag = tag || "";
  }

  addFile(f) {
    this.files.push(f);
    return this;
  }

  addDirectory(d) {
    this.directories.push(d);
    return this;
  }
}

// console.log("__dirname".blue, __dirname);
// console.log("__filename:".blue, __filename);
// var platform = process.platform;
// console.log("The opreation system:".red, platform);

var targetDirectory;

//  根据深度显示标志
function depthSymbol(depth, isDir) {
  var symbol = "";
  if (depth == 1) {
    return "* ";
  }
  do {
    symbol += "  ";
    depth--;
  } while (depth > 0);
  return isDir ? symbol + "* " : symbol + "|-";
}

// readContentSync第一次指定的路径
var distPath = "";

/**
 * 同步读取文件夹内容
 * @param {文件夹路径} dirPath
 * @param {深度限制，默认为无限大} depthLimit
 * @param {当前文件夹深度默认为} depth
 */
function readContentSync(
  dirPath = __dirname,
  depthLimit = Infinity,
  depth = 0,
  itemName
) {
  // 初始化 指定为当前所在文件夹
  let directory;
  // 第一次运行，初始化指定的文件夹
  if (depth == 0) {
    distPath = dirPath;
    directory = new Directory(path.basename(dirPath), dirPath, '.\\');
    // console.log("初始化所在文件夹:", directory.name);
  } else {
    // console.log(__dirname, dirPath, itemName);
    directory = new Directory(
      itemName,
      dirPath,
      // 相对路径
      path.relative(dirPath, dirPath)
    );
    // console.log("所在文件夹:", directory.name);
  }
  // 读取该文件夹
  console.log(dirPath)
  var dir = fs.readdirSync(dirPath);
  // 文件夹深度加大 默认首次会变成1; 也可以认为是 递归深度
  depth++;
  // console.log('dirs:',dir)
  for (let i = 0; i < dir.length; i++) {
    let itemName = dir[i];
    // 找到该文件夹下的文件
    let absPath = path.resolve(dirPath, itemName);
    // console.log(depth, depthLimit,'===》目录下的文件/文件夹', absPath.red)
    if (depth > depthLimit) {
      break;
    }
    // windows 系统敏感文件，不去读取
    if (itemName.endsWith('.sys') || itemName.endsWith('.tmp')) {
      continue;
    }
    // 是否是被忽略的item?只处理不被忽略的选项
    if (!ignoreItem.includes(itemName)) {
      let stat;
      try {
        stat = fs.statSync(absPath);
      } catch (e) {
        console.log('无法获取，给出错误', e);
        // 报错的话，就不要进行下去了
        continue;
      }
      // 是文件夹
      if (stat.isDirectory()) {
        // 输出相对路径子项的路径
        // let relativePath = path.relative(dirPath, absPath);
        // console.log(depthSymbol(depth, false) + relativePath);
        // 输出文件名字
        if (printTreeInConsole) {
          console.log(depthSymbol(depth, true) + itemName.yellow);
        }
        // 深度小于限制值，才能继续递归
        if (depth < depthLimit) {
          // 递归向内查找,并且返回该文件夹的内容
          directory.addDirectory(
            readContentSync(absPath, depthLimit, depth, itemName)
          );
        } else {
          // console.log(itemName)
          directory.addDirectory(new Directory(itemName, absPath, path.relative(dirPath, absPath)));
        }
      } // 是文件
      else if (stat.isFile()) {
        // 输出相对路径  'File:',
        let relativePath = path.relative(dirPath, absPath);
        // console.log(depthSymbol(depth, false) , path.relative(dirPath, absPath))
        // 输出名字
        if (printTreeInConsole) {
          let fileName = itemName.green;
          console.log(depthSymbol(depth, false) + fileName);
        }
        let file = new File(itemName, absPath, relativePath);
        file.size = stat.size;
        // 如果名字可以用点分开，就去最后一部分作为文件类型
        file.type = absPath.split(".").length > 1 ? absPath.split(".").slice(-1)[0] : "";
        file.icon = getIcon(absPath, itemName).then(()=>{

        })
          directory.addFile(file);
      }
    }
  }
  // console.log('directory:',directory)
  return directory;
}

// readContentSync(__dirname, 10);
// targetDirectory = readContentSync('d://', 1);
// targetDirectory = readContentSync(__dirname, 10);
console.log(targetDirectory)
module.exports = {
  readContentSync,
};
