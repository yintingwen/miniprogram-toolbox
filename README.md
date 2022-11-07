# unmp
是一个小程序跨平台工具库，同时也是小程序跨平台工具的开发脚手架，可以开发一份代码打包后适配多端小程序

打包会根据配置同时生成多端的代码，在小程序 install 时，会自动判断所在平台并删除其他多余的代码

## 安装
``` bash
npm i @unmp/package_name
```
注意：所有包都会自动识别所在平台，也可以通过package.json中添加platform字段去手动指定

## 目录划分
```
|-- packages：模板源码放置的地方
|----- dist：打包后的目录，不同小程序会放在对应目录下
|-- scripts: 脚本文件
```

## 单个包的配置
配置写在package.json的buildOption中
``` typescript
interface BuileOptions {
  platforms: ['wx', 'tt', 'my', 'xhs', 'js']
}
```
platforms: 默认js，该包需要打包的平台，打包后的包会默认添加平添后缀（js除外），js不限制小程序平台</br>

## 启动命令
``` bash
pnpm run build [package1, [package2, [...]] --e wx
```
--e example：示例目录下的项目目录名
