;(function() {
  const { createEle, remove, setTextContent, updateEle, insert } = window._api
  window._utils = {
    sameVnode,
    getDom,
    transfrom,
    patchVnode
  }
  function sameVnode(oldV, newV) {
    return (
      oldV.key === newV.key &&
      oldV.tag === newV.tag &&
      oldV.data.class === newV.data.class
    )
  }
  function createKeyToOldIdx(arr, start, end) {
    return arr.slice(start, end + 1).map(v => v.data.key)
  }
  function getDom(className) {
    return document.querySelector(`${className}`)
  }
  function transfrom(dom, parentVnode, isNew) {
    const vnode = {}
    vnode.tag = dom.tagName
    vnode.el = isNew ? '' : dom
    vnode.parent = parentVnode
    vnode.text = dom.children.length ? '' : dom.innerText // text属性表示z只有文本节点
    vnode.data = getVnodeData(dom)
    let children = Array.from(dom.children)
    vnode.children = children.map(v => {
      return transfrom(v, vnode, isNew)
    })
    return vnode
  }
  function getVnodeData(dom) {
    const data = {}
    data.key = dom.getAttribute('key')
    data.class = dom.className
    data.tag = dom.tagName
    data.attributes = dom.attributes
    return data
  }
  function patchVnode(oldVnode, vnode) {
    const el = (vnode.el = oldVnode.el)
    // 更新当前元素的属性值
    updateEle(el, vnode)
    let oldCh = oldVnode.children,
      ch = vnode.children
    if (oldVnode === vnode) return
    if (
      oldVnode.text !== null &&
      vnode.text !== null &&
      oldVnode.text !== vnode.text
    ) {
      setTextContent(el, vnode.text)
    } else {
      if (oldCh && ch && oldCh !== ch) {
        updateChildren(el, oldCh, ch)
      } else if (ch) {
        createEle(vnode, true)
      } else if (oldCh) {
        remove(el)
      }
    }
  }
  function updateChildren(parentElm, oldCh, newCh) {
    let oldStartIdx = 0,
      newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx
    let elmToMove
    let before
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (sameVnode(oldStartVnode, newStartVnode)) {
        debugger
        patchVnode(oldStartVnode, newStartVnode)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        debugger
        patchVnode(oldEndVnode, newEndVnode)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        debugger
        patchVnode(oldStartVnode, newEndVnode)
        insert(parentElm, oldStartVnode.el, nextSibling(oldEndVnode.el))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        debugger
        patchVnode(oldEndVnode, newStartVnode)
        insert(parentElm, oldEndVnode.el, oldStartVnode.el)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        // 使用key时的比较
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
        }
        idxInOld = oldKeyToIdx.indexOf(newStartVnode.data.key)
        if (idxInOld === -1) {
          // 代表没有可复用的，直接创建并插入
          insert(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
          newStartVnode = newCh[++newStartIdx]
        } else {
          // 在未被复用的旧节点中寻找，所以需要加上oldStartIdx
          elmToMove = oldCh[idxInOld + oldStartIdx]
          if (!sameVnode(elmToMove, newStartVnode)) {
            insert(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
          } else {
            patchVnode(elmToMove, newStartVnode)
            oldCh[idxInOld + oldStartIdx] = null
            insert(parentElm, elmToMove.el, oldStartVnode.el)
          }
          newStartVnode = newCh[++newStartIdx]
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
      insert(
        parentElm,
        newCh.slice(newStartIdx, newEndIdx + 1).map(v => v.el),
        before
      )
    } else if (newStartIdx > newEndIdx) {
      remove(
        parentElm,
        oldCh.slice(oldStartIdx, oldEndIdx + 1).map(v => v && v.el)
      )
    }
  }
})()
