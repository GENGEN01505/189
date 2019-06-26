import axios from 'axios'

var fs = require('fs');
var path = require('path');
var JSZip = require('jszip');
var config = {
    // 文件根目录
    dir:"C:/objs/ariport/"
}

/**
 * 把mtl文件和obj文件打包成zip压缩包
 * @param  {} fileName 不带文件后缀的文件名
 * @param  {} {delSource = false } = {} 是否删除源文件
 */
export function toZipOfMtlObj (fileName, { delSource = false } = {}) {
    var zip = new JSZip();
    var extArr = ['.mp3'];

    extArr.forEach(ext => {
        let file = fileName + ext;
        let content = getFileContent(fileName + ext);
        zip.file(file, content);
    })

    // 压缩
    zip.generateAsync({
        // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
        type: "nodebuffer",
        // 压缩算法
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    }).then(function (content) {
        let zip = fileName + '.zip';
        // 写入磁盘
        fs.writeFile(getFullFileName(zip), content, function (err) {
            if (!err) {
                // 是否删除源文件
                if (delSource) {
                    extArr.forEach(ext => {
                        delFile(fileName + ext);
                    })
                }
            } else {
                console.log(zip + '压缩失败');
            }
        });
    });
}

/**
 * 获取文件内容
 * @param  {string} fileName 文件名 file.mtl
 */
export function getFileContent (fileName) {
　　 // 指定encoding会返回一个string，否则返回一个Buffer
    let content = fs.readFileSync(getFullFileName(fileName), { encoding: "utf-8" });
    return content;
}

/**
 * 获取完整文件路径
 * @param  {string} fileName 文件名 file.mtl
 */
export function getFullFileName (fileName) {
    return path.join(config.dir, fileName);
}

/**
 * 删除文件
 * @param  {string} fileName 文件名 file.mtl
 */
export function delFile (fileName) {
    fs.unlink(getFullFileName(fileName), function (err) {
        if (!!err) {
            console.log('删除文件失败：' + file);
        }
    });
}


export function downloadMp3(){
   var zip = new JSZip();

   // jszip.file接收两个参数，第一个参数是文件名，第二个参数是内容
    zip.file('Building_North_001.mtl','这里是内容，可以是string，也可以是Buffer');
    zip.file('Building_North_001.obj','这里是内容，可以是string，也可以是Buffer');
   // jszip还可以添加文件夹，这里我就不做说明，可以参考官方文档。
        // 压缩
      zip.generateAsync({
        // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
        type: "nodebuffer",
        // 压缩算法
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
      }).then(function (content) {
        let zip = 'Building_North_001.zip';
        // 写入磁盘
        fs.writeFile('C:/objs/airport/' + zip , content, function (err) {
            if (!err) {
                // 写入磁盘成功
                console.log(zip + '压缩成功');
            } else {
                console.log(zip + '压缩失败');
            }
        });
      });
}
const getFile = url => {
  return new Promise((resolve, reject) => {
      axios({
          method:'get',
          url,
          responseType: 'arraybuffer'
          }).then(data => {
            resolve(data.data)
          }).catch(error => {
            reject(error.toString())
      })
  })
 }
//  export function downZip(array){
//  var array =new Array();
//     var arrayTwo =new Array();
//     var url =url//$(ele).attr("value");//路径
//     var name=$(ele).attr("date");//显示打包名称
//     alert(name);
//     array = url.split(',');
//     for(var i =0;i<array.length;i++){
//       arrayTwo[i] =array[i].substring(array[i].indexOf("&")+1);
//     }
//   handleBatchDownload(array,arrayTwo,name);
// }



export function handleBatchDownload(array,name) {
   const data = array; // 需要下载打包的路径, 可以是本地相对路径, 也可以是跨域的全路径
   const zip = new JSZip();
   const cache = {};
   const promises = [];
   data.forEach(item => {
      const promise = getFile(item).then(data => { // 下载文件, 并存成ArrayBuffer对象
      const arr_name = item.split("/");
    // 			   const arr_name =arr_name.substring(arr_name.indexOf("&")+1);
      var file_name = arr_name[arr_name.length - 1] // 获取文件名
        file_name = file_name.substring(file_name.indexOf("&")+1,file_name.length-1);
      zip.file(file_name, data, { binary: true }) // 逐个添加文件
      cache[file_name] = data
      })
      promises.push(promise)
  })
  Promise.all(promises).then(() => {
      zip.generateAsync({type:"blob"}).then(content => { // 生成二进制流
        saveAs(content, ""+name+".zip") // 利用file-saver保存文件
      })
  })

}
