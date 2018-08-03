/**
 * @module domOperationModule  将常用的DOM操作进行封装
 *
 * @return {object} {appendMultiChild, query, queryAll, findClosestAncestor, findSibling, findSiblings}
 *
 ---------------------------------------------------------------------------------------
 * @method appendMultiChild(parentNode, ...childrenNodes)  将多个节点按顺序添加到parentNode，作为其子节点
 *
 * @param parentNode  父节点
 * @param childrenNodes  一个或多个待添加的子节点，多个节点用','隔开
 *
 ---------------------------------------------------------------------------------------
 * @method query($el, selector)  基于$el去查找第一个符合selector的元素
 *
 * @param $el  基准元素
 * @param selector {string} 合法的css选择器字符串
 *
 ---------------------------------------------------------------------------------------
 * @method queryAll($el, selector)  基于$el去查找符合selector的元素集合
 *
 * @param $el  基准元素
 * @param selector {string} 合法的css选择器字符串
 *
 ---------------------------------------------------------------------------------------
 * @method findClosestAncestor($el, selector)  寻找第一个符合selector的祖先节点
 *
 * @param $el  开始寻找的基准元素
 * @param selector {string} 合法的css选择器字符串
 *
 ---------------------------------------------------------------------------------------
 * @method findSibling($el, selector, option = 'backward')  寻找第一个符合selector的兄弟元素
 *
 * @param $el  开始寻找的基准元素
 * @param selector {string} 合法的css选择器字符串
 * @param option {string}  查找选项 forward(default)|backward
 *
 ---------------------------------------------------------------------------------------
 * @method findSiblings($el, selector, option = 'all')  寻找符合selector的兄弟元素集合(排除$el本身)
 *
 * @param $el  开始寻找的基准元素
 * @param selector {string} 合法的css选择器字符串
 * @param option {string}  查找选项 all(default)|forward|backward
 */

const domWrapper = function () {
  // 将多个节点按顺序添加到parentNode，作为其子节点
  function appendMultiChild(parentNode, ...childrenNodes) {
    try {
      if (parentNode instanceof Node && childrenNodes.length !== 0) {
        childrenNodes.forEach((childNode) => {
          if (childNode instanceof Node) {
            parentNode.appendChild(childNode);
          } else {
            throw new Error(`${childNode} is not of type 'Node'`);
          }
        })
      } else {
        console.log('ParentNode or childrenNodes is not defined.');
      }
    }
    catch (ex) {
      console.error(ex);
    }
  }

  // 基于$el去查找第一个符合selector的元素
  // 将document.querySelector与element.querySelector区分开，对后者作了一些改进，基于element向子代元素查找，使得查找的结果符合预期
  function query($el, selector) {
    try {
      if ($el instanceof Node && typeof selector === 'string') {
        if ($el instanceof Document) {
          return $el.querySelector(selector);
        } else {
          const originID = $el.getAttribute('id');
          const newID = originID || 'temp';

          $el.setAttribute('id', newID);
          selector = `#${newID} ${selector}`;

          const result = $el.querySelector(selector);

          // 移除临时的id属性
          if (!originID) {
            $el.removeAttribute('id');
          }

          return result;
        }
      }
    }
    catch (ex) {
      console.error(ex);
    }
  }

  // 基于$el去查找符合selector的元素集合
  // 将document.querySelectorAll与element.querySelectorAll区分开，对后者作了一些改进，基于element向子代元素查找，使得查找的结果符合预期
  function queryAll($el, selector) {
    try {
      if ($el instanceof Node && typeof selector === 'string') {
        if ($el instanceof Document) {
          return $el.querySelectorAll(selector);
        } else {
          const originID = $el.getAttribute('id');
          const newID = originID || 'temp';

          $el.setAttribute('id', newID);
          selector = `#${newID} ${selector}`;

          const result = $el.querySelectorAll(selector);

          // 移除临时的id属性
          if (!originID) {
            $el.removeAttribute('id');
          }

          return result;
        }
      }
    }
    catch (ex) {
      console.error(ex);
    }
  }

  // 寻找第一个符合selector的祖先节点
  // $el.closest()会返回自身，这并不符合实际的使用需求，以下代码对这一点作了特殊处理
  function findClosestAncestor($el, selector) {
    try {
      if ($el instanceof Element && typeof selector === 'string') {
        if ($el.closest(selector) === $el) {
          if ($el.parentElement instanceof Element) {
            return $el.parentElement.closest(selector);
          } else {
            return null;
          }
        } else {
          return $el.closest(selector);
        }
      } else {
        return null;
      }
    }
    catch (ex) {
      console.error(ex);
    }

  }

  // 向前寻找第一个符合selector的兄弟元素
  function findSiblingForward($el, selector) {
    if ($el instanceof Element && typeof selector === 'string' && $el.previousElementSibling) {
      if ($el.previousElementSibling.matches(selector)) {
        return $el.previousElementSibling;
      } else {
        return findSiblingForward($el.previousElementSibling, selector);
      }
    } else {
      return null;
    }
  }

  // 向后寻找第一个符合selector的兄弟元素
  function findSiblingBackward($el, selector) {
    if ($el instanceof Element && typeof selector === 'string' && $el.nextElementSibling) {
      if ($el.nextElementSibling.matches(selector)) {
        return $el.nextElementSibling;
      } else {
        return findSiblingBackward($el.nextElementSibling, selector);
      }
    } else {
      return null;
    }
  }

  // 寻找第一个符合selector的兄弟元素
  function findSibling($el, selector, option = 'backward') {
    try {
      if (option === 'backward') {
        return findSiblingBackward($el, selector);
      } else if (option === 'forward') {
        return findSiblingForward($el, selector)
      } else {
        return null;
      }
    }
    catch (ex) {
      console.error(ex);
    }
  }

  // 寻找符合selector的兄弟元素集合(排除$el本身)
  function findSiblings($el, selector, option = 'all') {
    try {
      if ($el instanceof Element && typeof selector === 'string' && $el.parentElement instanceof Element) {
        let result = [];
        if (option === 'all') {
          let index;
          result.push(...$el.parentElement.children);
          index = result.indexOf($el);
          // 移除$el本身
          result.splice(index, 1);

          result = result.filter((el) => {
            return el.matches(selector);
          });

          return result;
        } else if (option === 'backward') {
          let index;
          result.push(...$el.parentElement.children);
          index = result.indexOf($el);
          // 从头开始移除sibling，直到把$el也一起移除
          result.splice(0, index + 1);

          result = result.filter((el) => {
            return el.matches(selector);
          });

          return result;
        } else if (option === 'forward') {
          let index;
          result.push(...$el.parentElement.children);
          index = result.indexOf($el);
          // 从$el开始移除，直到把$el后面的所有sibling全部移除
          result.splice(index, result.length - index);

          result = result.filter((el) => {
            return el.matches(selector);
          });

          return result;
        } else {
          return null;
        }
      }

    }
    catch (ex) {
      console.error(ex);
    }
  }

  return {
    appendMultiChild,
    query,
    queryAll,
    findClosestAncestor,
    findSibling,
    findSiblings
  }
};

export default domWrapper;