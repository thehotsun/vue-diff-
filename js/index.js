const { getDom, transfrom } = window._utils
const patch = window._patch
function render(oldDom, newDom) {
  let leftDom 
  let rightDom
  if (Array.isArray(oldDom)) {
     leftDom = document.querySelectorAll(`${oldDom[0]}`)[0]
     rightDom = document.querySelectorAll(`${oldDom[0]}`)[1]
  } else {
     leftDom = getDom(`${oldDom}`)
     rightDom = getDom(`${newDom}`)
  }

  const oldVnode = transfrom(leftDom)
  const newVnode = transfrom(rightDom, undefined, true)
  console.table(oldVnode)
  console.table(newVnode)
  patch(oldVnode, newVnode)
}
