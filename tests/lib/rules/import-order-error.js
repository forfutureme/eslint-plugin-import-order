/**
 * @fileoverview import顺序不符合规范
 * @author weijian.hu
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const {testConfig} = require("../config.js");
const rule = require("../../../lib/rules/const-after-import"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(testConfig);
ruleTester.run("import-order-error", rule, {
  valid: [
    // give me some code that won't trigger a warning
    "import b from '@/b'; import React, {useState} from 'react';"
  ],

  invalid: [
    {
      code: "import b from '@/b'; const cb = () => {}; import React, {useState} from 'react';",
      errors: [{ messageId: 'avoidMethod', }],
      output: "import b from '@/b';  import React, {useState} from 'react';const cb = () => {};"
    },
  ],
});
