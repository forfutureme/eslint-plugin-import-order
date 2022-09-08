/**
 * @fileoverview import之前不能有其他声明代码
 * @author weijian.hu
 */
"use strict";

const {getImportIndex, getPrevNodeIsImport, getLastImportIndex} = require("../utils/import") 

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "import顺序不符合规范",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      avoidMethod: 'const不能写在import之前'
    }
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    const codeString = context.getSourceCode().text;
    return {
      // visitor functions for different types of nodes
      'ImportDeclaration': (node) => {
        // console.log('node', node.range)
        const parentBody = node.parent.body
        const currentIndex = getImportIndex(parentBody, node.range)
        if (currentIndex > 0) {
          // 如果不是import
          if(!getPrevNodeIsImport(parentBody, currentIndex)) {
            context.report({
              node: parentBody[currentIndex-1],
              messageId: 'avoidMethod',
              fix: (fixer) => {
                const lastIndex = getLastImportIndex(parentBody)
                const delNode = parentBody[currentIndex-1]
                return [
                  fixer.insertTextAfterRange(parentBody[lastIndex].range, codeString.substring(...delNode.range)),
                  fixer.remove(parentBody[currentIndex-1])
                  ]
              }
            })
          }
        }
      }
    };
  },
};

