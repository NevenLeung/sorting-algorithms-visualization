# sorting-algorithms-visualization

使用原生 JS 实现几种排序算法执行过程的可视化。

## Demo

[Demo url](https://nevenleung.github.io/sorting-algorithms-visualization/)

![](https://github.com/NevenLeung/sorting-algorithms-visualization/blob/master/demo/insert-sort.gif)

![](https://github.com/NevenLeung/sorting-algorithms-visualization/blob/master/demo/merge-sort.gif)

![](https://github.com/NevenLeung/sorting-algorithms-visualization/blob/master/demo/quick-sort.gif)

## 功能列表

- [x] 排序算法的动画
  - [x] 冒泡排序
  - [x] 选择排序
  - [x] 插入排序
  - [x] 归并排序
  - [x] 快速排序
- [x] 比较元素、交换与插入元素、遍历范围元素的颜色标记
- [x] 排序过程中，比较次数与交换、插入次数的统计

## 实现过程

> Tips：下方列表选项的前面带三角形，表示有折叠内容

- <details>
    <summary>找到一个可用的排序代码，可将乱序的数组进行排序。</summary>
    <ul>
      <li>可以是伪代码或者其他编程语言写的排序代码，再用 JS 实现一遍</li>
    </ul>
  </details>
- 尽量理解代码的运行方式，它是如何达到排序的效果的。
- 弄懂代码是在哪些地方发生交换或插入操作，这些为排序服务的行为（我的主要任务就是将这些地方变成动画，反映在 DOM 的 item 上）。
- <details>
    <summary>将排序代码改造成相应的的 DOM 动画。</summary>
    <ul>
      <li>交换动画与插入动画的实现分为两个部分：节点移动动画、节点交换(插入)操作</li>
      <li>使用异步编程确保节点交换(插入)操作发生在动画执行完毕之后，这样就可以将节点移动动画和节点交换(插入)操作很好的结合起来</li>
      <li>
        <details>
          <summary><code>swap()</code> 与 <code>insert()</code> 的实现细节</summary>
          <ul>
            <li>关键点一: 使用 transform 的 translateX 实现节点的平移动画（transform 属性不会改变节点在 DOM 中的实际位置，也不会影响其他节点位置）。</li>
            <li>关键点二: 使用<code>animation = el.animate()</code>来执行动画，再把节点交换(插入)操作放在<code>animation.onfinish</code>的回调函数中, 以确保节点交换(插入)操作发生在动画执行完毕之后。</li>
            <li>关键点三：<code>swap()</code>与<code>insert()</code>返回一个 promise，以供在相应排序函数中进行调用。将<code>resolve()</code>写在<code>animation.onfinish</code>中，节点交换(插入)操作之后的地方。</li>
          </ul>
        </details>
      </li>
    </ul>
  </details>
- <details>
    <summary>调试，让排序动画可以成功运行起来，得到排序好并能反映到 DOM 的数组。</summary>
    <ul>
      <li>在归并排序与快速排序中使用了递归，但在递归过程中使用异步编程与其他情况下使用异步编程没有太多的区别</li>
    </ul>
  </details>
- 标记 item，正确反映出比较的 item，交换的 item，将要遍历的区域。
- <details>
    <summary>为动画增加适当的延时暂停，以及统计排序过程中的比较与交换次数信息。</summary>
    <ul>
      <li>尽量在每一次颜色标记取消后、每一次循环结束后、每一个交换（插入）操作之后执行一个短时的暂停，让动画的颜色变化可以正确反映出程序的执行阶段</li>
    </ul>
  </details>

## 项目学习建议

- 看几次[Demo](https://nevenleung.github.io/sorting-algorithms-visualization/)的排序动画，先建立起一个大致的印象。
- 在看过 Demo 的基础上，配合[Sorting.md](https://github.com/NevenLeung/sorting-algorithms-visualization/blob/master/Sorting.md)，理解其中的排序代码（理解其中的注释与算法思想），代码是怎样逐步使数组变得有序的。
- 对比[Sorting.md](https://github.com/NevenLeung/sorting-algorithms-visualization/blob/master/Sorting.md)与[src/scripts/sorting/](https://github.com/NevenLeung/sorting-algorithms-visualization/blob/master/src/scripts/sorting/)中的文件，理解相应的排序代码（在前者中出现的注释大部分不会出现在后者中，太多注释会影响代码的可读性，出于这一点所作的选择）。

## 相关资料

- [项目中用到的排序代码（项目的实现是基于这些代码的，附带个人总结的注释与算法思想）](https://github.com/NevenLeung/sorting-algorithms-visualization/blob/master/Sorting.md)

## 参考资料

- [sorting - VisuAlgo.net](https://visualgo.net/en/sorting)
- [sorting.at](http://sorting.at/)
- [排序算法 - 维基百科](https://zh.wikipedia.org/wiki/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95)
- [排序算法总结 - Cai's blog](http://ccc013.github.io/2016/11/20/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95%E6%80%BB%E7%BB%93/)

## scripts

run dev server

```
npm run dev
```

build project files

```
npm run build
```

