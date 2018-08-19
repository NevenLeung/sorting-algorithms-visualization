# sorting-algorithms-visualization

使用原生JS实现几种排序算法执行过程的可视化。

## Demo
 
[Demo url](https://nevenleung.github.io/sorting-algorithms-visualization/)

## 相关资料

[项目中用到的排序代码（项目的实现是基于这些代码的，附带个人总结的注释与算法思想）](https://github.com/NevenLeung/sorting-algorithms-visualization/blob/master/Sorting.md)

## 实现过程

- 找到一个可用的排序代码，可将乱序的数组进行排序
  - 可以是伪代码或者其他编程语言写的排序代码，再用JS实现一遍
- 尽量理解代码的运行方式，它是如何达到排序的效果的
- 弄懂代码是在哪些地方发生交换或插入操作，这些为排序服务的行为
  - 我的主要任务是将这些地方变成动画，反映在DOM的item上
- 将排序代码改造成相应的的DOM动画
  - 交换动画与插入动画的实现分为两个部分：节点移动动画、节点交换(插入)操作。使用异步编程确保节点交换(插入)操作发生在动画执行完毕之后，这样就可以将节点移动动画于节点交换(插入)操作很好的结合起来
  - swap()与insert()的实现细节
    - 关键点一: 使用 transform 的 translateX 实现节点的平移动画（transform属性不会改变节点在DOM中的实际位置，也不会影响其他节点位置）
    - 关键点二: 使用 `animation = el.animate() `来执行动画，再把节点交换(插入)操作放在`animation.onfinish`的回调函数中, 以确保节点交换(插入)操作发生在动画执行完毕之后
    - 关键点三：swap()与insert()返回一个promise，以供在相应排序函数中进行调用。将`resolve()`写在`animation.onfinish`中节点交换(插入)操作之后
- 调试，让排序动画可以成功运行起来，得到排序好并能反映到DOM的数组
- 为动画增加适当的延时暂停，以及统计排序过程中的比较与交换次数信息
- 标记item，正确反映出比较的item，交换的item，将要遍历的区域

## 参考资料

- [sorting - VisuAlgo.net](https://visualgo.net/en/sorting)
- [sorting.at](http://sorting.at/)
- [排序算法 - 维基百科](https://zh.wikipedia.org/wiki/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95)
- [排序算法总结 - Cai's blog ](http://ccc013.github.io/2016/11/20/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95%E6%80%BB%E7%BB%93/)
