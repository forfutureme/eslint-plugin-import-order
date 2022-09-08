/**
 * @Author: huweijian
 * @Date: 2022-08-25 11:14:43
 * @Desc: import引入相关工具方法
 */

/**
 * 获取当前import在的顺序
 * @param {*} parent 
 * @param {*} currentRange 
 * @returns 
 */
 function getImportIndex(nodes, currentRange) {
  // console.log('parent', parent)
  let currentIndex = -1
  nodes.forEach((node, index) => {
    if (node.range.join() === currentRange.join()){
      currentIndex = index
    }
  })
  return currentIndex
}
/**
 * 获取目标import上一个定义是否是import
 * @param {*} nodes 
 * @param {*} index 
 * @returns 
 */
function getPrevNodeIsImport(nodes, currentIndex){
  return nodes[currentIndex-1].type === 'ImportDeclaration'
}

/**
 * 根据判断条件，获得最后一个节点索引
 * @param {*} nodes 
 * @param {*} conditionFunction 
 * @returns 
 */
function getLastNodeIndex(nodes, conditionFunction){
  let index = null
  nodes.forEach((node, i) => {
    if (node.type === 'ImportDeclaration' && conditionFunction(node)) {
      index = i
    }
  })
  return index
}

/**
 * 获取最后一个import的index
 * @param {*} nodes 
 * @returns 
 */
function getLastImportIndex(nodes) {
  return getLastNodeIndex(nodes, (node) => node.type === 'ImportDeclaration' )
}

/**
 * 获取最后一个import路径index
 * @param {*} nodes 
 * @returns 
 */
function getLastPathIndex(nodes, reg) {
  return getLastNodeIndex(nodes, (node) => reg.test(node.source.value))
}

/**
 * 根据回调判断第一个节点索引
 * @param {*} nodes 
 * @param {*} conditionFunction 
 * @returns 
 */
 function getFirstNodeIndex(nodes, conditionFunction) {
  for (const i in nodes) {
    if (nodes[i].type === 'ImportDeclaration' && conditionFunction(nodes[i])) {
      return i
    }
  }
  return null
}

/**
 * 获取第一个import路径index
 * @param {*} nodes 
 * @param {*} reg 
 * @returns 
 */
function getFirstPathIndex(nodes, reg) {
  return  getFirstNodeIndex(nodes, node => reg.test(node.source.value))
}



/**
 * 获取import路劲
 * @param {*} pathStr 
 * @returns 
 */
 function getPathType(node) {
  if (!node) return null
  if (!node.source) return null
  const value = node.source.value;
  let pathType = "";
  // 如果是绝对路径
  if (/^[a-z]/.test(value)) {
    pathType = "position";
  }
  // 如果是自定义短路径
  if (/^@/.test(value)) {
    pathType = "alias";
  }
  // 如果是相对路径
  if (/^\./.test(value)) {
    pathType = "relative";
  }
  return pathType
}




module.exports = {
  getImportIndex,
  getPrevNodeIsImport,
  getLastImportIndex,
  getPathType,
  getLastPositionPathIndex: (nodes) => getLastPathIndex(nodes, /^[a-z]/),
  getLastAliasPathIndex: (nodes) => getLastPathIndex(nodes, /^@/),
  getLastRelativePathIndex: (nodes) => getLastPathIndex(nodes, /^\./),
  getFirstAliasPathIndex: (nodes) => getFirstPathIndex(nodes, /^@/),
  getFirstRelativePathIndex: (nodes) => getFirstPathIndex(nodes, /^\./)
}