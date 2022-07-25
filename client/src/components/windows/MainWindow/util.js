export function convertToTreeData(data) {
  let dirNum = 0;
  let fileNum = 0;
  // 文件夹的数量
  if (data.directories) {
    dirNum = data.directories.length;
  }
  // 文件的数量
  if (data.files) {
    fileNum = data.files.length;
  }
  // 如果 既没有 文件 也没有 文件夹，直接返回
  if (!data.files && !data.directories) {
    return [];
  }
  let len = dirNum + fileNum;
  let fileArray = new Array(len).fill("");

  // 循环每一个文件夹
  Array.from(data.directories).forEach((item, idx, arr) => {
    fileArray[idx] = {
      name: item.name,
      children: [],
      relPath: item.relPath,
      comment: item.comment,
      absPath: item.absPath,
      tag: item.tag,
      isFile: false,
      isLeaf: false,
    };
    // 接着递归
    fileArray[idx].children = convertToTreeData(item);
  });

  // 循环每一个文件
  Array.from(data.files).forEach((item, idx, arr) => {
    fileArray[idx + dirNum] = {
      name: item.name,
      // children: [],
      relPath: item.relPath,
      comment: item.comment,
      absPath: item.absPath,
      size: item.size,
      type: item.type ? item.type.toLowerCase() : item.type,
      isFile: true,
      isLeaf: false,
    };
  });



  // return fileArray.reverse();
  return fileArray
}

/**
 * 处理路径中的反斜杠，转化成正斜杠
 */
function reverseSeparation(path) {
  return path.replaceAll('\\', '/')
}
