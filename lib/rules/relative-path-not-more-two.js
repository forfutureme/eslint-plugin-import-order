/**
 * @fileoverview import相对文件路径不能超过2层
 * @author weijian.hu
 */
"use strict";
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "import相对文件路径不能超过2层",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      avoidMethod: 'import相对文件路径不能超过2层'
    }
  },

  create(context){
    return {
      'ImportDeclaration': (node) => {
        const value = node.source.value
        const twoPointLength = value.match(/\.\./g) ? value.match(/\.\./g).length : 0
        const backslashLength = value.match(/\//g) ? value.match(/\//g).length : 0
        if (twoPointLength > 2 && backslashLength > 2) {
          context.report({
            node,
            messageId: 'avoidMethod'
          })
        }
      }
    }
  }
}