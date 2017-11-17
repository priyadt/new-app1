import httpHelper from '../utils/httpHelper';
import config from '../config.js';
import {
  GET_RATES,
  SET_INITIAL_VALUES,
  UPDATE_PRODUCT_RATE,
  UPDATE_PRODUCT_RATE_COST,
  UPDATE_USER_SAVED_DATA,
  UPDATE_RATE,
  UPDATE_PLAN_PRICE,
  UPDATE_PRODUCTS,
  UPDATE_PACKAGE_PRICE,
  SET_TERM_RATE_OPTIONS,
  UPDATE_SELECTED_PACKAGE_KEYS,
  UPDATE_PRODUCT_PACKAGE_PRICE,
  UPDATE_USER_SELECTION_PACKAGE,
  SET_PAYMENT_SCENARIO,
  SET_SELECTEDPACKAGE_INFO,
  UPDATE_TOTAL_PACKAGE_PRICE,
  UPDATE_PACKAGE_SELECTION_FOR_PROVDER,
  UPDATED_PREVIOUS_USER_PACKAGE_PLAN_SELECTION,
  SET_PACKAGE_NAMES,
  RESET_DATACHANGE,
  SET_DEALER_PRODUCT,
  FINANCIAL_DATA
} from '../constants';
import {
  dealerData,
  populateDealerData,
  getUserSelectionKey
} from '../helper';

populateDealerData();
const dealjacketid = dealerData.dealjacketid;
const dealid = dealerData.dealid;

export var setInitialValues = (values) => {
  return {
    type: SET_INITIAL_VALUES,
    payload: values
  };
};

export function updateProductRate(rate, productId) {
  return {
    type: UPDATE_PRODUCT_RATE,
    payload: {
      rate: rate,
      id: productId
    }
  };
}

export function updateProductRateCost(productId, cost) {
  return {
    type: UPDATE_PRODUCT_RATE_COST,
    payload: {
      cost,
      id: productId
    }
  };
}

export function updatePackageSelectionForProvider(id, providerId, providerCode) {
  return {
    type: UPDATE_PACKAGE_SELECTION_FOR_PROVDER,
    payload: {
      id,
      providerId,
      providerCode
    }
  };
}

export function updatedUserSelectedPackagePlan(id, planInfo) {
  return {
    type: UPDATED_PREVIOUS_USER_PACKAGE_PLAN_SELECTION,
    payload: {
      id,
      planInfo
    }
  };
}

export function updatePlanRate(productId, plan, isSelected, key) {
  return {
    type: UPDATE_SELECTED_PACKAGE_KEYS,
    payload: {
      productId,
      plan,
      key
    }
  };
}

export function updatePlanPrice(plan, price) {
  return {
    type: UPDATE_PLAN_PRICE,
    payload: {
      plan,
      price
    }
  };
}

export function getDealerRates(providerId, productCode, providerCode, id) {
  return (dispatch, getState) => {
    const args = {
      providerId,
      productCode,
      providerCode,
      id
    };
      populateDealerData();
      const dealjacketid = dealerData.dealjacketid;
      const dealid = dealerData.dealid;
      const rateUrl = `${config.emenuMobileGatewayAPI}/deal-jackets/${dealjacketid}/deals/${dealid}/required-fields/`;
      httpHelper(rateUrl, 'get').then((data) => {
          let deal_menu_json = JSON.parse(data.deal_menu_json);
          const provider = deal_menu_json.Products.filter(item => (item.ProductTypeCode === productCode && item.ProviderId === providerCode));
          deal_menu_json.Products = provider;
          deal_menu_json.keydata = getRateRequestBody(providerId, dealid);
          const url = `${config.emenuMobileGatewayAPI}/Rating/RatingRESTAPI/json/rates_json/`;
          const providerCde = (providerCode !==null ? providerCode : "NR")

        httpHelper(url, 'post', deal_menu_json).then((data) => {
          dispatch({
            type: GET_RATES,
            payload: {
              data,
              args,
              key: `${id}-${providerId}-${productCode}-${providerCde}`
            }
          });

        })
          .catch((e) => {
            dispatch({
              type:'RATE_FAIL',
              payload: `${id}`
            })
          });
      }).catch(()=>{
          const url = `${config.emenuMobileGatewayAPI}/Rating/RatingRESTAPI/json/rates_json/`;
        httpHelper(url, 'post', {}).then((data) => {
          dispatch({
            type: GET_RATES,
            payload: {
              data,
              args,
              key: `${id}-${providerId}-${productCode}-${providerCde}`
            }
          });

        })
          .catch((e) => {
            dispatch({
              type:'RATE_FAIL',
              payload: `${id}`
            })
          });
      })
    // }

  };
}

export function getUserSavedData() {
  return (dispatch) => {
    getUserSelectionPackageInfo().then(result => {
      dispatch({
        type: UPDATE_USER_SAVED_DATA,
        payload: {
          userPrefernceResponse: result
        }
      });
    }).catch((e) => {
    });
  };
}

export function updateProducts(products) {
  return {
    type: UPDATE_PRODUCTS,
    payload: {
      products
    }
  };
}

export function updateTotalPackagePrice(priceList) {
  return {
    type: 'UPDATE_TOTAL_PACKAGE_PRICE',

    payload: {
      priceList
    }

  };
}

export function updateProductPackagePrice(key, price, productId, prodRetailRate) {
  return {
    type: UPDATE_PRODUCT_PACKAGE_PRICE,
    payload: {
      key,
      price,
      productId,
      prodRetailRate
    }
  };
}

export function updateProductPackageInfo(termMileage, deductible, packageOption, productState, productId,
  providerId, productCode, providerCode, packageType, cost, price, levelChangePriceUpdate, providerName,
  initialLoad, initialLoadSuccess, isOptionsDirty) {
    let providerCde = (providerCode !==null ? providerCode : 'NR')
  return {
    type: UPDATE_PACKAGE_PRICE,
    payload: {
      cost,
      deductible,
      productCode,
      providerCode: providerCde,
      productId,
      providerId,
      productState,
      packageType,
      packageOption,
      price,
      termMileage,
      levelChangePriceUpdate,
      providerName,
      initialLoad,
      initialLoadSuccess,
      isOptionsDirty
    }
  };
}

export function getUserSelectionPackageInfo() {
  const key = getUserSelectionKey();
  const userSelectionUrl = `${config.emenuMobileGatewayAPI}/deal-jackets/${dealjacketid}/deals/${dealid}/package-products/`;
  return httpHelper(userSelectionUrl, 'get', null, false);
}

export function setTermRateOptions(options) {
  return {
    type: SET_TERM_RATE_OPTIONS,
    payload: {
      options
    }
  };
}

export function getPaymentScenario_success(paymentOptions) {
  return {
    type: SET_PAYMENT_SCENARIO,
    paymentOptions
  };
}
export function resetDataChange(state) {
  return {
    type: RESET_DATACHANGE,
    state
  };
}

export function setPackageName_success(packageNames) {
  return {
    type: SET_PACKAGE_NAMES,
    packageNames,
  };
}
export function set_selected_packageInfo_success(packageInfo) {
  return {
    type: SET_SELECTEDPACKAGE_INFO,
    packageInfo,
  };
}
export function set_dealerProduct(dealerProduct) {
  return {
    type: SET_DEALER_PRODUCT,
    dealerProduct,
  };
}

export function getPaymentScenario(dealjacketid, dealid, dataArr, plan, selectedIndex) {
  return function (dispatch, getState) {
    return httpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${dealjacketid}/deals/${dealid}/scenarios/`, 'post', dataArr)
      .then((resp) => {
        let paymentOptions = [];
        let optionData = getState().termRateOptions.options;
        let termrateFromStore = optionData.termrateoptions;
        let count = 0;
        resp.map((r, i) => {
          if (r.payments[0].paymentamount) {
            let opt = {
              "payment": r.payments[0].paymentamount,
              "deal_package_option_id": '',
              "is_option_selected": (count == 0),
              "termrateoptions": {
                "term": termrateFromStore[i].term
              }
            };
            count++;
            paymentOptions.push(opt);
          }
        });
        dispatch(getPaymentScenario_success(paymentOptions));
        dispatch(set_selected_packageInfo_success({ plan, selectedIndex }));
      });

  };
}

export function getProductFinancialData(dealjacketid, dealid) {
    return function (dispatch, getState) {
        return httpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${dealjacketid}/deals/${dealid}/deal-finance-summary/`, 'get')
            .then((financialInfoData) => {
                //dispatch(getProductFinancialData_success(financialInfoData));
                return financialInfoData;
            });

   };
}

export function getProductFinancialData_success (financialData){
  return {
      type: FINANCIAL_DATA,
      financialData
  };
}

function getRateRequestBody(providerId, dealid) {
  const keyData = {
    "EchoData": dealid,
    "ClientId": "DEM",
    "ClientDealerId": providerId,
    "DTDealerId": providerId,
    "RequestDate": `\/Date(${new Date().getTime()})\/`,
    "ContractDate": `\/Date(${new Date().getTime()})\/`
  };
  return keyData;
}
