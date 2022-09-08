/**
 * @fileoverview import顺序不符合规范
 * @author weijian.hu
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const {testConfig} = require("../config.js");
const rule = require("../../../lib/rules/relative-path-not-more-two"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(testConfig);
ruleTester.run("relative-path-not-more-two", rule, {
  valid: [
    // give me some code that won't trigger a warning
    "import b from './b'; import a from '../a'; import c from '../../c';"
  ],

  invalid: [
    {
      code: "import b from './b'; import a from '../a'; import c from '../../c';  import d from '../../../d';",
      errors: [{ messageId: 'avoidMethod', }],
    },
  ],
});
