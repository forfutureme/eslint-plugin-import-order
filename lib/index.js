/**
 * @fileoverview 检查import引入顺序
 * @author weijian.hu
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");
module.exports.configs = {
  recommended: {
    rules: {
      'import-order/const-after-import': 2,
      'import-order/relative-path-not-more-two': 2,
      'import-order/path-order': 2
    }
  }
}



