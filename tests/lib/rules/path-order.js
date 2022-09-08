/**
 * @fileoverview import文件的的顺序应保持 绝对路径>alias路径>相对路径
 * @author weijian.hu
 */
 "use strict";

 //------------------------------------------------------------------------------
 // Requirements
 //------------------------------------------------------------------------------
 const {testConfig} = require("../config.js");
 const rule = require("../../../lib/rules/path-order"),
   RuleTester = require("eslint").RuleTester;


 //------------------------------------------------------------------------------
 // Tests
 //------------------------------------------------------------------------------

 const ruleTester = new RuleTester(testConfig);
 ruleTester.run("path-order", rule, {
   valid: [
     // give me some code that won't trigger a warning
     "import a from '@/a';",
     "import b from './b';",
     "import react from 'react'; import a from '@/a'; import b from './b';"
   ],
  invalid: [
     {
       code: "import a from '@/a'; import react from 'react'; import b from './b';",
       errors: [{ messageId: 'avoidMethod', }],
       output: " import react from 'react';import a from '@/a'; import b from './b';"
     },
     {
      code: "import b from './b';import react from 'react';",
      errors: [{ messageId: 'avoidMethod', }],
      output: "import react from 'react';import b from './b';"
    },
    {
      code: "import a from '@/a';import react from 'react';",
      errors: [{ messageId: 'avoidMethod', }],
      output: "import react from 'react';import a from '@/a';"
    },
    {
      code: "import b from './b';import a from '@/a';",
      errors: [{ messageId: 'avoidMethod', }],
      output: "import a from '@/a';import b from './b';"
    },
    {
      code: "import b1 from './b1';import react from 'react';",
      errors: [{ messageId: 'avoidMethod', }],
      output: "import react from 'react';import b1 from './b1';"
    },
    {
      code: "import b1 from './b1';import a from '@/a';",
      errors: [{ messageId: 'avoidMethod', }],
      output: "import a from '@/a';import b1 from './b1';"
    },
    {
      code: "import './ActivityStatistics.less';import moment from 'moment';",
      errors: [{ messageId: 'avoidMethod', }],
      output: "import moment from 'moment';import './ActivityStatistics.less';"
    }
   ],
 });
