##QuestionMaker

这是一个学习项目。

> http://www.cnblogs.com/lvdabao/p/mean-techstack-angular.html

使用“MEAN”技术栈（即：mongodb、express、angular、nodejs）开发的实验性项目，用于研究基本技术。

####项目概述：
QuestionMaker可以用来编辑试题（选择题、填空题）和试卷，然后把题目添加到试卷中，从而生成一份调查问卷，类似调查派。
![demo](http://images.cnblogs.com/cnblogs_com/lvdabao/507840/o_QQ%e5%9b%be%e7%89%8720150907163253.png)

项目的功能主要是CRUD操作，所以非常适合angular的应用场景，双向绑定对于实现实时预览这样的功能简直是信手拈来。

本着前后端分离的原则，所有页面都由前端渲染（angular的模板），后端只通过express提供数据接口。

####如何运行项目（windows环境为例）
首先确保你机器上安装了nodejs和mongodb，如没有，先去官网下载安装。然后安装如下步骤进行;

1. 克隆项目代码到你的机器，如目录为E:\QuestionMaker下
2. 运行数据库并导入demo数据
    1. 运行cmd，输入命令启动mongo服务：mongod --dbpath E:\QuestionMakerDB
    2. 导入demo数据：在cmd中运行：<del>mongorestore -d QuestionMaker --drop E:\QuestionMaker\backup\mongodb\QuestionMaker</del> >mongorestore -h 127.0.0.1:27017 -d QuestionMaker D:\Workspaces\JavaScript\NG\QuestionMaker\backup\mongodb\QuestionMaker
3. npm安装所需的包，直接在项目根目录下执行：npm install
4. 修改protect/server.js文中_rootDir的值，表示网站根目录，如'/QuestionMaker'，默认端口为3000， 你也可以修改
5. 启动服务器：进入protect目录，运行nodemon server.js(我本地有安装nondemon，你若没有安装，先自行安装，或者<b>直接node server.js</b>)
6. 打开浏览器，<b>访问127.0.0.1:3000</b>，能看到如下首页，说明部署成功，如果未能成功，查看报错信息解决对应问题
![](http://images.cnblogs.com/cnblogs_com/lvdabao/507840/o_QQ%e5%9b%be%e7%89%8720150907181135.png)

####gulp构建（非必须）
该项目使用了gulp来进行资源的压缩合并，gulpfile已经编写好，只需执行gulp命令即可，编译完成后会生成一个dist目录，里面是压缩好的代码，然后在把server.js中的路径由src改为dist即可访问。


前端的代码都在src目录下，包括入口文件index.html，这样方便我们后续做合并压缩等编译工作，编译后的文件可以一并放入dist目录下。

## 首页index.html
这是项目的入口页面，其实就是一个大容器，在这里加载所有的js和css文件，然后提供一个视图容器就够了，因为从这个页面以后，我们页面就不再会有跳转，全部是通过前端路由来做局部刷新，首页的代码非常精简：

## 入口文件app.js
有了入口页面，还得有一个js的启动入口，就是这个app.js了，在这里它只做了两件事情：
### 1.启动angular，代码只有一行：
``` javascript
var app = angular.module('QMaker', ['ui.router']);

我们拥有了一个名为app的全局模块。这里把ui.router给注入了，因为我们整个应用都用ui-router来做路由，后面会做详细介绍。
### 2.把ui-router的$state和$stateParams服务挂到$rootScope上，这样我们在后面所有的模块中，都能够访问到路由参数，不必在每个地方都注入一次了。代码也是相当简单：
``` javascript
app.run(function($rootScope, $state, $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams;
});

## 控制器合集controllers.js
controller.js里面是所有的controller定义，由于这个项目比较小，而且反正最后都要合并，所以就都放在一个文件里了，这样可以使用链式写法app.controller('a', ...).controller('b', ...)， 一口气将所有的controller都定义好。如果项目比较大，controller多，可以把controllers建为一个文件夹，然后在里面放各个controller。
controller里面就是跟业务相关的一些代码了，如试题数据的初始化，添加答案、删除选项等操作。
但是当我们需要发起ajax请求的时候，如保存试题，就不宜在controller里面直接写了，这样会造成逻辑混杂代码混乱。所有需要请求服务端的操作，我们可以抽象为一个个服务，进行“分层”，通过ng提供的service机制来做调用。

## 服务合集services.js
接上面，所有和试题相关的服务端请求，我们可以封装成一个QuestionService，这个服务提供：提交试题、删除试题、更新试题等服务，这样层次就很清晰了。
所以，在services.js中，我们定义所有和服务相关的东西，在本项目中，我们的服务全都是ajax请求，可以用ng提供的$http服务来很方便的完成。事实上service中并不是必须写ajax请求，凡是可以抽象理解为“公共服务”的东西，都可以定义在这里，可以被其他模块随意调用。

## 指令合集directives.js
了解过ng的同学应该对指令不会陌生，通过指令我们可以用扩展html标签的方式来很容易的实现一些UI效果，使用方便、可被多个地方公共使用，就像过去我们写jquery插件一样。所有的指令都定义在这个文件中，同样可以使用链式写法，很爽。
在我们的项目中，有一些功能是通用的，例如列表的分页，那么就可以把分页功能做成一个指令。我定义了一个名为pagenav的指令，然后在所有需要用分页的地方就可以调用了，代码如下：


