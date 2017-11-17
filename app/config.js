populateDealerData();
import { dealerData, populateDealerData } from './helper/index.js';
const ENV = process.env.NODE_ENV;
let config = {};
const appConfigLocal = require('../../config/local.js');
const appConfigTs = require('../../config/ts.js');
const appConfigProduction = require('../../config/production.js');
const appConfigQA = require('../../config/qa.js');
const appConfigDevTest = require('../../config/devTest.js');
const appConfigDevInt = require('../../config/devInt.js');

  window.configs = {};

  if( dealerData.deploy_env !== null ){

      if (dealerData.deploy_env === 'dev_local') {
        config =  appConfigTs;
      }
      if (dealerData.deploy_env === 'local') {
        config =  appConfigLocal;
      }

      if (dealerData.deploy_env === 'prod') {
        config =  appConfigProduction;
      }
      if (dealerData.deploy_env === 'qa') {
        config =   appConfigQA;
      }
      if (dealerData.deploy_env === 'dev_test') {
        config = appConfigDevTest;
      }
      if (dealerData.deploy_env === 'dev_int') {
        config = appConfigDevInt;
      }
  }

console.log('InConfigs',config);
export default config;
