/**
 * @module General Function Module
 *
 * 通用函数模块
 *
 * @export { createNewElementNode, stringToBoolean, delay }
 */

// -------------------- module start -------------------

/**
 * createNewElementNode()
 *
 * 自定义创建元素节点方法
 *
 * @param tagName 标签名
 * @param className 样式名称
 * @param content 文本内容
 * @param attributeData 设置节点的属性，属性值应为成对出现，前者为属性名称，后者为属性值
 * @returns Element 返回创建的元素节点
 */
function createNewElementNode(tagName, className='', content='', ...attributeData) {
  const newElement = document.createElement(tagName);
  if (content !== '') {
    newElement.textContent = content;
  }
  if (className !== '') {
    newElement.className = className;
  }

  if (attributeData.length !== 0) {
    for (let i = 0; i < attributeData.length; i = i + 2) {
      newElement.setAttribute(attributeData[i], attributeData[i + 1]);
    }
  }

  return newElement;
}

/**
 * stringToBoolean()  用于将作为DOM节点属性时被转换为字符串的true与false值，转换为相应的布尔值
 *
 * @param str 'true' | 'false' boolean like string
 * @return {boolean}
 */
function stringToBoolean(str) {
  if (typeof str === 'string') {
    return str === 'true';
  }
}

/**
 * delay(timeout)
 *
 * 在异步代码中使后续代码延迟执行的函数
 * -------------------------------
 * 用作在排序过程中使代码暂停执行
 * -------------------------------
 * @param {Number} timeout  暂停时长，单位ms
 * @return {Promise<undefined>}  一个延迟resolve的Promise
 */
function delay(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export {
  createNewElementNode,
  stringToBoolean,
  delay
};