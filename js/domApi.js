;(function() {
  window._api = {
    remove,
    add,
    insert,
    updateEle,
    setTextContent,
    createEle,
    parentNode,
    nextSibling
  }
  function parentNode(el) {
    return el.parentNode
  }
  function nextSibling(el) {
    return el.nextSibling
  }
  function createEle(vnode, add) {
    vnode.el || (vnode.el = document.createElement(`${vnode.tag}`))
    let dom = vnode.el
    updateEle(dom, vnode)
    if (add) vnode.parent.el.appendChild(dom)
    // 如果text有值，默认父元素只有此文本节点
    if (vnode.text) {
      dom.innerText = vnode.text
    } else {
      let ch = vnode.children
      ch.map(v => {
        createEle(v, true)
      })
    }
    return vnode
  }
  function remove(parent, child) {
    if (Array.isArray(child)) {
      child.map(v => {
        v && parent.removeChild(v)
      })
    } else child && parent.removeChild(child)
  }
  function add() {}
  function insert(a, b, c) {
    if (Array.isArray(b)) {
      b.map(v => a.insertBefore(v, c))
    } else a.insertBefore(b, c)
  }
  function changeAttr(add, attr, el) {
    let len = attr.length
    let i = 0
    while (i < len) {
      let val = attr[add ? i : 0]
      if (!add) el.removeAttribute(val.localName)
      else el.setAttribute(val.localName, val.value)
      i++
    }
  }
  function updateEle(el, vnode) {
    changeAttr(false, el.attributes, el)
    changeAttr(true, vnode.data.attributes, el)

    // let len = vnode.data.attributes.length
    // let len = vnode.data.attributes.length

    // let i = 0
    // while (i < len) {
    //   let val = vnode.data.attributes[i]
    //   el.setAttribute(val.localName, val.value)
    //   // el.attributes[val.localName] = val.value
    //   i++
    // }
    // let keys = Object.keys(vnode.data.attributes)
    // keys.map(v => {
    //   el.attributes[v] = vnode.data.attributes[v]
    // })
    // vnode.data.class && (el.className = vnode.data.class)
    // vnode.data.key && (el.attributes.key = vnode.data.key)
    // el.attributes = vnode.data.attributes[v]
    // el.innerText = vnode.text
  }
  function setTextContent(el, text) {
    el.innerText = text
  }
})()
