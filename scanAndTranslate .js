const fs = require("fs");
const translate = require("./translate");
const config = require("./config.json");
const translateFile = async filePath => {
  try {
    let content = fs.readFileSync(filePath, "utf-8");

    // 匹配中文字符的正则表达式
    const chineseRegex = /[\u4e00-\u9fa5]+/g;

    const chineseMatches = content.match(chineseRegex);
    if (chineseMatches) {
      for (const chineseText of chineseMatches) {
        const translation = await translate(chineseText, config.target);
        content = content.replace(chineseText, translation);
      }
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(chineseMatches);
      console.log(`File ${filePath} 翻译完成`);
    } else {
      console.log(`File ${filePath} 没有找到中文`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
};

const scanAndTranslate = path => {
  try {
    // 检查当前目录是否在排除列表中
    if (config.excludePath.find(exclude => path.startsWith(exclude))) {
      console.log(`File ${path} 排除的路径`);
      return;
    }
    const stats = fs.statSync(path);

    if (stats.isFile()) {
      // 如果是文件，调用翻译函数
      if (config.fileExt.find(ext => path.endsWith(ext))) {
        translateFile(path);
      } else {
        console.log(`File ${path} 不是目标文件`);
      }
    } else if (stats.isDirectory()) {
      // 如果是目录，读取目录下的文件列表，递归调用 scanAndTranslate 函数
      const files = fs.readdirSync(path);
      files.forEach(file => {
        const filePath = `${path}/${file}`;
        scanAndTranslate(filePath);
      });
    } else {
      console.log(`Invalid path: ${path} is neither a file nor a directory.`);
    }
  } catch (error) {
    // 捕获可能发生的错误
    console.error(`Error processing path ${path}:`, error.message);
  }
};

// 传入要扫描的文件夹路径
scanAndTranslate(config.path);
