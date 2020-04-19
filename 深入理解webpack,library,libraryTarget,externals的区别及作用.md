<https://juejin.im/post/5b19df3c6fb9a01e643e25d7>

经过前端框架的迅猛发展，大家开始慢慢对模块化习以为常但却不知道通过script引入和require（import）引入的区别。如何引入取决于之前如何导出，在重构一个验证码老项目时，不知如何把项目导出为可通过script引入后使用内部方法？

情景简化为如下：

插件代码

import {util} from 'util'
import styles from 'css'
export function initA(){
 console.log('it is init')
	...
}
复制代码
通过常见webpack打包为bundle.js，在html中引入

<script src="bundle.js"></script>
<script>
//在这里想要调用内部initA方法，报错initA undefined
initA()
</script>
复制代码分析原因
页面报错initA undefined，显然此时调用initA，代表在window对象上面寻找initA方法，因为模块化开发，杜绝一切全局变量，所以在全局找不到该对象，它是局部变量，打包之后代码简化如下：
(function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initA = initA;
function initA() {
    console.log('it is initA');
}
})
复制代码那如何可以导出变量并挂载在全局对象之下，看下常见的jquery是如何操作的
//jQuery 1.2.6(新版已经支持模块化)
var _jQuery = window.jQuery,
        _$ = window.$;
    var jQuery = window.jQuery = window.$ = function( selector, context ) {
        // The jQuery object is actually just the init constructor 'enhanced'
        return new jQuery.fn.init( selector, context );
    };
复制代码经过多番寻找在webpack配置中用output.libraryTarget参数可以配置输出模块规范。
webpack libraryTarget 参数说明
在官网说明中叙述libraryTarget 有如下参数可选：（不指定 output.library 将取消这个 "var" 配置）中文说明

libraryTarget: "var"（default）
output.library 会将值作为变量声明导出（当使用 script 标签时，其执行后在全局作用域可用）。
libraryTarget: "window"
当 library 加载完成，入口起点的返回值将分配给 window 对象。

window["MyLibrary"] = _entry_return_;
// 使用者将会这样调用你的 library：
window.MyLibrary.doSomething();
复制代码
libraryTarget: "assign"
libraryTarget: "this"
libraryTarget: "global"
libraryTarget: "commonjs"
当 library 加载完成，入口起点的返回值将分配给 exports 对象。这个名称也意味着模块用于 CommonJS 环境

exports["MyLibrary"] = _entry_return_;
// 使用者将会这样调用你的 library：
require("MyLibrary").doSomething();
复制代码
libraryTarget: "commonjs2"
libraryTarget: "amd"
libraryTarget: "umd"
这是一种可以将你的 library 能够在所有的模块定义下都可运行的方式（并且导出的完全不是模块）。它将在 CommonJS, AMD 环境下运行，或将模块导出到 global 下的变量
最终输出：

(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports["MyLibrary"] = factory();
  else
    root["MyLibrary"] = factory();
})(this, function() {
  //这个模块会返回你的入口 chunk 所返回的
});
复制代码
libraryTarget: "jsonp"

对比var,window,global,umd区别
由于浏览器环境和node环境的区别，所以产生了window（客服端浏览器）和global（node服务端）的区别。
我理解的var即在script导入时和window一致，是否可以通过import导入，导入之后的使用还待解释。
umd即支持所有情况的自定义。
总的说设置library即在当前环境的全局引入库文件。
externals的简单使用
那externals又是如何使用的？和模块导出有什么区别？
先看定义：externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。也就是说webpack打包时不会把库打入bundle中，所以需要开发者在html中通过script标签引入。
例如，从 CDN 引入 jQuery，而不是把它打包：
index.html
<script src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"></script>
复制代码webpack.config.js
externals: {
  jquery: 'jQuery'
}
复制代码有心的同学可能要想了，我都从script标签引入了那么全局就都可以使用了，为什么还要设置这个配置呐？
为了不改动原来的依赖模块！如下
import $ from 'jquery';

$('.my-element').animate(...);
复制代码具有外部依赖(external dependency)的 bundle 可以在各种模块上下文(module context)中使用，例如 CommonJS, AMD, 全局变量和 ES2015 模块。这里所说的模式就是上文libraryTarget的模式。
外部 library 可能是以下任何一种形式：

root - 外部 library 能够作为全局变量使用。用户可以通过在 script 标签中引入来实现。这是 externals 的默认设置。
commonjs - 用户(consumer)应用程序可能使用 CommonJS 模块系统，因此外部 library 应该使用 CommonJS 模块系统，并且应该是一个 CommonJS 模块。
commonjs2 - 类似上面几行，但导出的是 module.exports.default。
amd - 类似上面几行，但使用 AMD 模块系统。
