##QuestionMaker

这是一个学习项目。

> http://www.cnblogs.com/lvdabao/p/mean-techstack-angular.html

使用“MEAN”技术栈（即：mongodb、express、angular、nodejs）开发的实验性项目，用于研究基本技术。

####项目概述：
QuestionMaker可以用来编辑试题（选择题、填空题）和试卷，然后把题目添加到试卷中，从而生成一份调查问卷，类似调查派。
![demo](https://github.com/zzl81cn/QuestionMaker/blob/master/resources/project_ui.png)

项目的功能主要是CRUD操作，所以非常适合angular的应用场景，双向绑定对于实现实时预览这样的功能简直是信手拈来。

本着前后端分离的原则，所有页面都由前端渲染（angular的模板），后端只通过express提供数据接口。

####如何运行项目（windows环境为例）
首先确保你机器上安装了nodejs和mongodb，如没有，先去官网下载安装。然后安装如下步骤进行;
> mongoDB 安装
  md "C:\mongodb"
  md "C:\mongodb\log"
  md "C:\mongodb\data"
  echo logpath=C:\mongodb\log\mongo.log > "C:\mongodb\mongod.cfg"
  echo dbpath=C:\mongodb\data >> "C:\mongodb\mongod.cfg"
  "C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --config "C:\mongodb\mongod.cfg" --install

1. 克隆项目代码到你的机器，如目录为E:\QuestionMaker下
2. 运行数据库并导入demo数据
    1. 运行cmd，输入命令启动mongo服务：mongod --dbpath E:\QuestionMakerDB
    2. 导入demo数据：在cmd中运行：<del>mongorestore -d QuestionMaker --drop E:\QuestionMaker\backup\mongodb\QuestionMaker</del> >mongorestore -h 127.0.0.1:27017 -d QuestionMaker D:\Workspaces\JavaScript\MEAN\QuestionMaker\backup\mongodb\QuestionMaker
3. npm安装所需的包，直接在项目根目录下执行：npm install
4. 修改protect/server.js文中_rootDir的值，表示网站根目录，如'/QuestionMaker'，默认端口为3000<b>(已改为3010)</b>， 你也可以修改
5. 启动服务器：进入protect目录，运行nodemon server.js(我本地有安装nondemon，你若没有安装，先自行安装，或者<b>直接node server</b>.js)
6. 打开浏览器，<b>访问127.0.0.1:3010</b>，能看到如下首页，说明部署成功，如果未能成功，查看报错信息解决对应问题
![](https://github.com/zzl81cn/QuestionMaker/blob/master/resources/project_ui_afew.png)

####gulp构建（非必须）
该项目使用了gulp来进行资源的压缩合并，gulpfile已经编写好，只需执行gulp命令即可，编译完成后会生成一个dist目录，里面是压缩好的代码，然后在把server.js中的路径由src改为dist即可访问。


#### 前言
不知何时突然冒出“MEAN技术栈”这个新词，听起来很牛逼的样子，其实就是我们已经熟悉了的近两年在前端比较流行的技术，mongodb、express、angularjs、nodejs，由于这几项技术涵盖了从前端到后端再到数据库，可以用他们完整的开发一个web应用了，所以成了一个非常牛逼的组合，颇有当年LAMP的气势。前端要从切图仔迈向全栈的路上，这几门技术必须得有所涉猎。本系列文章利用自己虚构的一个小项目为例，对“使用MEAN技术栈开发web应用”做一个入门级的介绍。

#### AngularJS的争议
angular，简称ng，是google出品的优秀框架，在2013~2014年大红大紫，但是国内好像慢一拍，我从2015年才看到使用ng的项目大量出现。ng自出现伊始就有人诟病太难上手了，完全不同的开发方式，团队开发更是不知道如何组织代码。不过随着jquery这位老大哥逐渐被抛弃，大家开始慢慢接受mvvm这样的编程思维。然而一个不好的消息是，ng团队打算重构的angular2.0版本要发生重大变革，与1.0不能同日而语，虽然官方有1.0向2.0迁移的方案，但额外的工作总是不太好的，而且使用2.0还要付出更多的学习成本。
再加上今年又有react这个实力派雄起，ng的风头顿时被抢过去了，人们又开始研究react下的编程方式。不过我估计react的真正实用也得等到一两年后。眼下angular1.x也仍然是一个不错的选择。尽管有2.0的变革，但是1.4还是一个稳定版本，我们使用稳定版本肯定是不会有问题的。
所以我的结论是，但用无妨，不会存在白学了这种事情，就算将来angular1.x废弃了，你学到的编程思维还是在的。
本文讨论如何使用AngularJs进行前端的架构，对于ng的基础知识不做讲解，需要了解的同学可以看我之前写过的一个系列<a href="http://www.cnblogs.com/lvdabao/tag/AngularJs/">http://www.cnblogs.com/lvdabao/tag/AngularJs/</a>

#### 练手项目简介
为了系统的学习“MEAN”技术栈，我虚构了一个小项目，先做一个介绍。
QuestionMaker，是一个用于生成调查问卷的系统，用户可以编辑试题（选择题、填空题），并可以实时预览编辑结果。然后还可以编辑一份试卷，为试卷添加试题，然后保存为一分完整的调查问卷。有点类似于调查派。先上一张截图吧：

#### 前端目录结构
用ng来构建一个项目应该如何安排目录结构呢？为了不人工增加复杂度，我这里没有用bower来管理依赖库，也没有其他文章中介绍的那样用yeoman来生成项目，只是单纯的手动来创建目录，这样可以把我们的注意力集中到项目的核心上，目录结构是这样的：

![](https://github.com/zzl81cn/QuestionMaker/blob/master/resources/dir_construction.png)

前端的代码都在src目录下，包括入口文件index.html，这样方便我们后续做合并压缩等编译工作，编译后的文件可以一并放入dist目录下。


前端的代码都在src目录下，包括入口文件index.html，这样方便我们后续做合并压缩等编译工作，编译后的文件可以一并放入dist目录下。

#### 首页index.html
这是项目的入口页面，其实就是一个大容器，在这里加载所有的js和css文件，然后提供一个视图容器就够了，因为从这个页面以后，我们页面就不再会有跳转，全部是通过前端路由来做局部刷新，首页的代码非常精简：

#### 入口文件app.js
有了入口页面，还得有一个js的启动入口，就是这个app.js了，在这里它只做了两件事情：
##### 1.启动angular，代码只有一行：
``` javascript
var app = angular.module('QMaker', ['ui.router']);
```

我们拥有了一个名为app的全局模块。这里把ui.router给注入了，因为我们整个应用都用ui-router来做路由，后面会做详细介绍。
##### 2.把ui-router的$state和$stateParams服务挂到$rootScope上，这样我们在后面所有的模块中，都能够访问到路由参数，不必在每个地方都注入一次了。代码也是相当简单：
``` javascript
app.run(function($rootScope, $state, $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams;
});
```

#### 控制器合集controllers.js
controller.js里面是所有的controller定义，由于这个项目比较小，而且反正最后都要合并，所以就都放在一个文件里了，这样可以使用链式写法app.controller('a', ...).controller('b', ...)， 一口气将所有的controller都定义好。如果项目比较大，controller多，可以把controllers建为一个文件夹，然后在里面放各个controller。
controller里面就是跟业务相关的一些代码了，如试题数据的初始化，添加答案、删除选项等操作。
但是当我们需要发起ajax请求的时候，如保存试题，就不宜在controller里面直接写了，这样会造成逻辑混杂代码混乱。所有需要请求服务端的操作，我们可以抽象为一个个服务，进行“分层”，通过ng提供的service机制来做调用。

#### 服务合集services.js
接上面，所有和试题相关的服务端请求，我们可以封装成一个QuestionService，这个服务提供：提交试题、删除试题、更新试题等服务，这样层次就很清晰了。
所以，在services.js中，我们定义所有和服务相关的东西，在本项目中，我们的服务全都是ajax请求，可以用ng提供的$http服务来很方便的完成。事实上service中并不是必须写ajax请求，凡是可以抽象理解为“公共服务”的东西，都可以定义在这里，可以被其他模块随意调用。

#### 指令合集directives.js
了解过ng的同学应该对指令不会陌生，通过指令我们可以用扩展html标签的方式来很容易的实现一些UI效果，使用方便、可被多个地方公共使用，就像过去我们写jquery插件一样。所有的指令都定义在这个文件中，同样可以使用链式写法，很爽。
在我们的项目中，有一些功能是通用的，例如列表的分页，那么就可以把分页功能做成一个指令。我定义了一个名为pagenav的指令，然后在所有需要用分页的地方就可以调用了，代码如下：
``` html
<pagenav pageobj="pageObject" pagefunc="pageFunction"></pagenav>
```
只需一个标签，然后通过属性指定分页数据和翻页函数即可。

#### 过滤器合集filter.js
我们的项目使用ng提供的动态模板，服务端不渲染页面，只提供数据接口。有些数据我们需要进行格式化后进行输出，这就用到filter了，所有的filter都放在这里。filter的定义和使用的非常简单，此不不多述了。

#### 前端路由定义router.js
本项目使用ui-router来做前端路由，这个目测也是现在最流行的做法。ui-router是一个第三方插件，由于ng内置的ngRouter功能较弱，无法实现嵌套路由和多视图路由，而ui-router引入了“状态”这个概念来控制视图，从而实现这些功能，所以ui-router成了最好的选择。它是angular-ui项目<a href="http://angular-ui.github.io/">（http://angular-ui.github.io/）</a>中的一个模块，该项目还提供了很多基于ng的ui，像日期选择器什么的。ui-router貌似是最受欢迎的一个。
用ui-router可以实现嵌套路由和同一页面多视图，具体使用方法可以参考我博客中转载的几篇文章：<a href="http://www.cnblogs.com/lvdabao/articles/4657235.html">http://www.cnblogs.com/lvdabao/articles/4657235.html</a>
本项目中，由于整站无刷新，所以路径的层级会比较深，嵌套路由就派上了用场。在入口页面index.html中，用一个div来做父容器，加上ui-view属性，就可以在里面加载别的模板了。从试题列表到试题编辑页面的切换，就都在这个父容器中加载。
而在试题编辑页面，又有对应的题型编辑和试题预览视图，通过给ui-view赋予名字，就可以加载各自对应的模板，这里就是多视图的应用。代码片段如下：
``` html
<!--试题编辑视图-->
<div ui-view="editArea"></div>

<!--试题预览视图-->
<div ui-view="previewArea"></div>
```

在试卷预览页面，我们也需要对试题进行展示，只需在页面上在定义一个ui-view，然后在路由中进行配置，就可以加载试题预览模版，很容易的实现了模板的复用。
页面中没有任何逻辑，只需在route.js中配置好路由规则，整站无刷新跳转就这么轻而易举的实现了。

#### tpl目录
利用ui-router做了前端路由后，除了入口页面index.html外，其他所有页面就都变成模板了（被ui-router动态加载）。所有的模板都放在tpl目录下。如果业务的模块较多，可以在此目录下再新建文件夹，本项目比较简单，所以就只有一层。不论有多少层目录，在routers.js中配置好就OK啦。利用ui-router可以注入模板对应的控制器，所以代码中我们也不必在加ng-controller，模板文件中就是很干净的ng模板。

#### lib目录
这里放置的是项目所需的外部库。有angular、ui-router、jquery、bootstrap。你可以看到我只是把代码文件给直接放里面了，没有用当下流行的bower进行管理。是因为我不想再人为的增加复杂度，万一有人的机器上bower安装失败或者git环境有问题，或者github无法访问，都会令人十分沮丧。
反正就这几个稳定版本，不如直接下载过来。如果需要压缩我后期用gulp来搞一下就行了。

#### 总结
这个小项目的前端结构就是这个样子啦。从上面我们可以看出，用ng来做前端的架构还是很有条理的。controller、service、directive这些概念，本质上还是“模块”，所以我们可以以模块开发的方式来很爽快的写代码，文件与文件之间没有任何耦合和依赖。模块所需的依赖，我们通过ng的注入机制来给注入。所以在index.html中引入这些文件的时候，没有顺序要求，任意顺序引入皆可。
顺便说一句，前端代码的后处理，我已经用gulp写好了脚本，用npm安装所需的包后，执行gulp就可以编译生成dist目录。
本文只做angular前端架构入门级别的介绍，关于文中提到的一些具体技术细节，可以查看我写的angular系列文章<a href="http://www.cnblogs.com/lvdabao/tag/AngularJs/">http://www.cnblogs.com/lvdabao/tag/AngularJs/</a>这个示例项目我已开源到github（<a href="https://github.com/Double-Lv/QuestionMaker">https://github.com/Double-Lv/QuestionMaker</a>），目前已经实现了基本功能。后续我会扩展更多的功能，到时候也必然会涉及到更多的技术问题，angular进行前端架构的路才刚刚开始。
