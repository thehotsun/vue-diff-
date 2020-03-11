;(function() {
  const { insert, remove, createEle, parentNode, nextSibling } = window._api
  const { patchVnode, sameVnode } = window._utils
  window._patch = function patch(oldVnode, vnode) {
    // if (sameVnode(oldVnode, vnode)) {
    if (1) {
      patchVnode(oldVnode, vnode)
    } else {
      const oEl = oldVnode.el // 当前oldVnode对应的真实元素节点
      let parentEle = parentNode(oEl) // 父元素
      createEle(vnode) // 根据Vnode生成新元素
      if (parentEle !== null) {
        insert(parentEle, vnode.el, nextSibling(oEl)) // 将新元素添加进父元素
        remove(parentEle, oldVnode.el) // 移除以前的旧元素节点
        oldVnode = null
      }
    }
  }
})()
