import {
  UPDATE_PRODUCTS,
  UPDATE_PACKAGE_PRICE,
  UPDATE_SELECTED_PACKAGE_KEYS,
  UPDATE_PRODUCT_PACKAGE_PRICE,
  UPDATE_USER_SELECTION_PACKAGE,
  UPDATE_TOTAL_PACKAGE_PRICE,
  UPDATE_PACKAGE_SELECTION_FOR_PROVDER,
  UPDATED_PREVIOUS_USER_PACKAGE_PLAN_SELECTION,
  RESET_DATACHANGE,
  SET_DEALER_PRODUCT,
  PROVIDER_SWITCH
} from '../constants';

import {cloneDeep} from 'lodash'

const initialState = {
	list: [], // this is products
  productPackageInfo: new Map(),
  selectedPackageKeys: new Map(),
  disableControl: false,
  dataChanged: false,
  initialLoad: false,
  initialLoadSuccess: 0,
  totalPriceInfoList: [],
  providerSwitch: false,
};

export default function product(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER_SELECTION_PACKAGE:
      return {...state};
    case UPDATED_PREVIOUS_USER_PACKAGE_PLAN_SELECTION:
      const selectedPlan = new Map(state.selectedPackageKeys);
      action.payload.planInfo.map(plan => {
        if (!selectedPlan.has(plan.key)) {
          selectedPlan.set(plan.key, plan.key);
        }
      });
      return {...state, selectedPackageKeys: selectedPlan};
    case UPDATE_PACKAGE_SELECTION_FOR_PROVDER:
      const newSelection = updatePackageSelection(state, action.payload);
      if(newSelection) {
        return {...state, selectedPackageKeys: newSelection};
      }
      return { ...state };
      break;

    case UPDATE_TOTAL_PACKAGE_PRICE:
      return {...state,totalPriceInfoList: action.payload.priceList }

    case UPDATE_PRODUCT_PACKAGE_PRICE:
      const {key, productId} = action.payload;
      const price = parseFloat(action.payload.price);
      let newProductPackage =  new Map(state.productPackageInfo);
      let newPackagePriceInfo = newProductPackage.get(key);
      newPackagePriceInfo.priceUpdateError = validatePriceUpdate( price, productId, state.list, newPackagePriceInfo.cost, action.payload.prodRetailRate);
      newPackagePriceInfo.price = price;
      newProductPackage.set(key, newPackagePriceInfo);
      const disableControl = isControlDisabled(newProductPackage);
      return {...state, productPackageInfo: newProductPackage, disableControl};

    case UPDATE_SELECTED_PACKAGE_KEYS:

      const newKeys = new Map(state.selectedPackageKeys);
      const { payload } = action;
      if (newKeys.has(payload.key)) {
        newKeys.delete(payload.key);
      } else {
        newKeys.set(payload.key, payload.key);
      }
      return {...state, selectedPackageKeys: newKeys, dataChanged: true, initialLoadSuccess: state.initialLoadSuccess+1};

    case UPDATE_PRODUCTS:
      return { ...state,
        list: action.payload.products
      };

    case UPDATE_PACKAGE_PRICE:
      return updatePackageInfo(state, action.payload);
    case RESET_DATACHANGE:
      return {...state,dataChanged:action.state}
    case SET_DEALER_PRODUCT:
      return {...state,dealerProduct:action.dealerProduct}
    case PROVIDER_SWITCH:
      return {...state, providerSwitch: action.providerSwitch}


    default:
      return { ...state
      };
  }
}

function updatePackageSelection(state, {
  id,
  providerId,
  providerCode
  }) {
  const newSelection = new Map(state.selectedPackageKeys);
  const oldKeys = [];
  const newPackageKey = [];
  newSelection.forEach(key => {
    if (key.includes(`${id}-${providerId}`)) {
      oldKeys.push(key);
    }
  });
  if (oldKeys.length) {
    oldKeys.map(key => {
      let providerCde = (providerCode !== null ? providerCode : 'NR')
      const newKeyChunk = key.split('-');
      const newKey = `${id}-${providerId}-${newKeyChunk[2]}-${providerCde}-${newKeyChunk[4]}`;
      newSelection.delete(key);
      newSelection.set(newKey, newKey);
    });
    return newSelection;
  }
  return null;
}

function updatePackageInfo(stat, payload) {
  let state = cloneDeep(stat);
    const key = getProductPackageKey(payload);
    let newProductPackageInfo = new Map(state.productPackageInfo);
    let oldPrice = newProductPackageInfo.get(key);
    const levelChangePriceUpdate = payload.levelChangePriceUpdate;
    const productState = payload.productState;
    let packageInfo = {
      providerName: payload.providerName,
      packageType: payload.packageType,
      levelType1: productState.levelType1,
      levelType2: productState.levelType2,
      levelType3: productState.levelType3,
      packageOption: payload.packageOption,
      termMileage: payload.termMileage,
      deductible: payload.deductible,
      programIndex: productState.programIndex || 0,
      coverageIndex: productState.coverageIndex || 0,
      planIndex: productState.planIndex || 0,
      rateIndex : productState.rateIndex || 0,
      termMilageIndex : productState.termMilageIndex || 0,
      priceUpdateError: null,
      isOptionsDirty: payload.isOptionsDirty
    };
    const priceToUpdate = parseFloat(payload.price) + (oldPrice ? oldPrice.price : 0);
    const costToUpdate = parseFloat(payload.cost) + (oldPrice ? oldPrice.cost : 0);
    if (levelChangePriceUpdate) {
      packageInfo = {
        ...packageInfo,
        cost: parseFloat(payload.cost),
        price: parseFloat(payload.price)
      };
    } else {
      packageInfo = {
        ...packageInfo,
        cost: costToUpdate,
        price: priceToUpdate,
        priceUpdateError: validatePriceUpdate(priceToUpdate, payload.productId, state.list, costToUpdate, productState.RetailRate)
      };
    }
    newProductPackageInfo.set(key, packageInfo);
    const disableControl = isControlDisabled(newProductPackageInfo);
    let count = payload.initialLoadSuccess  ? state.initialLoadSuccess + 1 : state.initialLoadSuccess ;
  return {...state, productPackageInfo: newProductPackageInfo, disableControl,dataChanged:true,initialLoadSuccess:count};
}

function isControlDisabled(packageInfo) {
  let isDisabled = false;
  packageInfo.forEach((value, key) => {
      if (value.priceUpdateError) {
        isDisabled = true;
      }
    });
    return isDisabled;
  }
function getProductPackageKey(payload) {
  const {
    productId,
    providerId,
    productCode,
    providerCode,
    packageType
  } = payload;
  if(providerCode !== null) return `${productId}-${providerId}-${productCode}-${providerCode}-${packageType}`;
  else return `${productId}-${providerId}-${productCode}-NR-${packageType}`;
}

function validatePriceUpdate( price, productId, products, cost, prodRetailRate) {
  const product = products.filter(item => item.id === productId)[0];
  if (cost==0 && parseInt(product.cost)!=0 && price==0) { return null; } //prevents error for rare situation with improperly set up products

  const min = product.is_rateable ? parseFloat(prodRetailRate.min) : parseFloat(product.min_price);
  const max = product.is_rateable ? parseFloat(prodRetailRate.max) : parseFloat(product.max_price);
  if (product.is_rateable) {
    if (max <= 0 && (price < min)) {
        return `Price should not be less than cost: $${parseFloat(cost).toFixed(2)}`;
    } else if  (max > 0 && (price > max || price < min)) {
      return `Price should be between $${parseFloat(min).toFixed(2)} and $${parseFloat(max).toFixed(2)}`;
    }
  } else {
    if (max <= min) {
      if(price < cost){
        return `Price should not be less than cost: $${parseFloat(cost).toFixed(2)}`;
      }
      return null;
    } else if (price >= min && price <= max) {
      if(price < cost){
        return `Price should not be less than cost: $${parseFloat(cost).toFixed(2)}`;
      }
      return null;
    } else {
      return `Price should be between $${parseFloat(min).toFixed(2)} and $${parseFloat(max).toFixed(2)}`;
    }
    return null;
  }
}
