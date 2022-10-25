# 小程序工具库

多端小程序工具库开发框架，可以开发一份代码同时打包多端小程序

## 目录划分
```
|-- packages：模板源码放置的地方
|-- libs：打包后代码放置的地方
|-- config.js 脚手架打包配置
```

## 单个包的配置
配置写在package.json的buildOption中
``` typescript
interface BuileOptions {
  platforms: ['wx', 'tt', 'my', 'xhs', 'js'],
  name: "string"
}
```
platforms: 默认js，该包需要打包的平台，打包后的包会默认添加平添后缀（js除外），js不限制小程序平台</br>
name: 指定模板打包后生成的报名，默认采用的目录名

## config.js
``` typescript
interface GlobalConfigOptions {
  organization: string
}
```
organization：组织名，填入后打包的name都会自动添加组织前缀


## 启动命令
``` bash
pnpm run build [package1, [package2, [...]] --e wx
```
--e example：示例目录下的项目目录名