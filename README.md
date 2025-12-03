## 流程引擎-移动端

## 项目文档
* [功能迭代-语雀](https://jyaiot.yuque.com/kiomgp/ttap9g/gscth580qtomgxla)

## 技术栈
#### vue3 + vite + pinia + vue-router + vant + axios + typescript

## 开发之前

开发前，请确保你已经学习过 [vant组件库](https://vant-contrib.gitee.io/vant/#/zh-CN/home)以及[前端规范](https://jyaiot.yuque.com/zfugpu/abiaa7/sg507p)。

## 开发

### git仓库
> https://git.joyoung.com/frontend/jy-process-engine-h5

```bash
# 安装依赖
npm ci
# 开发启动
npm run dev
```

### 开发环境
```bash
# 1. 能成功开启80端口的情况下配置host: scm-test.joyoung.com
http://scm-test.joyoung.com/flow-h5

# 2. 不能开启80端口的情况
* 修改vite.config.js文件 port改成8080端口
* 打开charles，设置tools->Map Remote -> add -> Map from（scm-test.joyoung.com）,Map to （host：10.170.31.* ，Port:8080）
* 开发者工具->设置->代理设置-> 127.0.0.1 : 8888
```

### 测试环境
```bash
# 链接
http://scm-test.joyoung.com/flow-h5

```
### 线上环境
```bash
# 链接
https://nvwa.joyoung.com/flow-h5

```

### 代码提交
```bash
# 命令1
npm run cz
# 命令2
git push
```
### 发布
```bash
# Jenkins
http://172.31.11.41:8080/job/jy-process-engine-h5/
```

### 账号密码权限相关（所有）
联系人：朱红波

## 相关链接
* [意见反馈](https://git.joyoung.com/frontend/jy-process-engine-h5/-/issues)
