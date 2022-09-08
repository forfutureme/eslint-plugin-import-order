/**
 * @fileoverview import文件的的顺序应保持 绝对路径>alias路径>相对路径
 * @author weijian.hu
 */
"use strict";
const {
  getPathType,
  getImportIndex,
  getLastPositionPathIndex,
  getLastAliasPathIndex,
  getLastRelativePathIndex,
  getFirstAliasPathIndex,
  getFirstRelativePathIndex
} = require("../utils/import");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "import文件的的顺序应保持 绝对路径>alias路径>相对路径",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      avoidMethod: "import文件的的顺序应保持 绝对路径>alias路径>相对路径",
    },
  },

  create(context) {
    const codeString = context.getSourceCode().text;
    return {
      ImportDeclaration: (node) => {
        const parentBody = node.parent.body;
        const pathType = getPathType(node);
        const currentIndex = getImportIndex(parentBody, node.range);
        if (currentIndex === 0) return
        const prevIndex = currentIndex - 1;
        const prevNodeType = getPathType(parentBody[prevIndex]);
        const nextIndex = currentIndex + 1
        const nextNodeType = getPathType(parentBody[nextIndex])
        // 如果当前import类型是position，
        // import只用检查其前面的即可
        if (pathType === "position") {
          const delNode = parentBody[prevIndex];
          // 检查其上一个import是否为非position
          if (prevNodeType !== "position") {
            context.report({
              node:delNode,
              messageId: "avoidMethod",
              fix: (fixer) => {
                const lastPositionNodeIndex =
                  getLastPositionPathIndex(parentBody);
                const lastAliasPathIndex = getLastAliasPathIndex(parentBody);
                const lastRelativePathIndex =
                  getLastRelativePathIndex(parentBody);
                let referIndex = lastPositionNodeIndex;
                //如果存在短路径引入，且该引入不是要移动的这个，将其设为插入目标点
                if (typeof lastAliasPathIndex === "number") {
                  if (
                    delNode.range.join() !==
                    parentBody[lastAliasPathIndex].range.join()
                  ) {
                    referIndex = lastAliasPathIndex;
                  }
                }
                // 如果待移动的是相对路径引入，并且查找到的最后一条相对引入不是要移动的引入，重置插入参照点
                if (prevNodeType === "relative") {
                  if (typeof lastRelativePathIndex === "number" &&  delNode.range.join() !==
                  parentBody[lastRelativePathIndex].range.join()) {
                    referIndex = lastRelativePathIndex;
                  }
                }
                return [
                  fixer.insertTextAfterRange(
                    parentBody[referIndex].range,
                    codeString.substring(...delNode.range)
                  ),
                  fixer.remove(delNode),
                ];
              },
            });
          }
        }
        // 如果当前import路径是短路径
        if (pathType === "alias") {
          // 如果上一个import是相对路径，需要插入到最后一个短路径/相对就路径下
           if (prevNodeType === 'relative') {
            const delNode = parentBody[prevIndex]
            context.report({
              node: delNode,
              messageId: "avoidMethod",
              fix: (fixer) => {
                const lastAliasPathIndex = getLastAliasPathIndex(parentBody)
                const lastRelativePathIndex = getLastRelativePathIndex(parentBody)
                let referIndex = lastAliasPathIndex
                if (delNode.range.join() !== parentBody[lastRelativePathIndex].range.join()) {
                  referIndex = lastRelativePathIndex
                }
                return [
                  fixer.insertTextAfterRange(parentBody[referIndex].range, codeString.substring(...delNode.range)),
                  fixer.remove(delNode)
                ]
              }
            })
           }
           if(nextNodeType === 'position') {
            const delNode = parentBody[nextIndex]
            context.report({
              node: delNode,
              messageId: "avoidMethod",
              fix: (fixer) => {
                const delStr = codeString.substring(...delNode.range)
                const lastPositionNodeIndex = getLastPositionPathIndex(parentBody)
                const firstAliasNodeIndex = getFirstAliasPathIndex(parentBody)
                return [
                  typeof lastPositionNodeIndex === 'number' 
                  ? fixer.insertTextAfterRange(parentBody[lastPositionNodeIndex].range, delStr)
                  : fixer.insertTextBeforeRange(parentBody[firstAliasNodeIndex], delStr),
                  fixer.remove(delNode)
                ]
              }
            })
           }
        }
        // 如果当前import路径是相对路径,只用关心其后是否存在 非相对路径
        if (pathType === "relative" && nextIndex < parentBody.length) {
          const delNode = parentBody[nextIndex]
          const delStr = codeString.substring(...delNode.range)
          // 如果是绝对路径
          if (nextNodeType === 'position') {
            context.report({
              node: delNode,
              messageId: "avoidMethod",
              fix: (fixer) => {
                const lastPositionNodeIndex = getLastPositionPathIndex(parentBody)
                const firstAliasNodeIndex = getFirstAliasPathIndex(parentBody)
                return [
                  typeof lastPositionNodeIndex === 'number'
                  ? fixer.insertTextAfterRange(parentBody[lastPositionNodeIndex].range, delStr)
                  : fixer.insertTextBeforeRange(parentBody[firstAliasNodeIndex].range, delStr),
                  fixer.remove(delNode)
                ]
              }
            })
            // code
          }
          // 如果是短路径
          if (nextNodeType === 'alias'){
            context.report({
              node: delNode,
              messageId: "avoidMethod",
              fix: (fixer) => {
                const lastAliasPathIndex = getLastAliasPathIndex(parentBody)
                const firstRelativeNodeIndex = getFirstRelativePathIndex(parentBody)
                return [
                  typeof lastAliasPathIndex === 'number'
                  ? fixer.insertTextAfterRange(parentBody[lastAliasPathIndex].range, delStr)
                  : fixer.insertTextBeforeRange(parentBody[firstRelativeNodeIndex].range, delStr),
                  fixer.remove(delNode)
                ]
              }
            })
          }
        }
      },
    };
  },
};
