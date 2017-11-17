import {
  GET_RATES,
  UPDATE_PRODUCT_RATE,
  UPDATE_PRODUCT_RATE_COST,
  UPDATE_RATE,
  UPDATE_PLAN_PRICE,
  UPDATE_USER_SAVED_DATA,
  RATES_LOADING
} from '../constants';

const initialState = {
	ratesInfo: [],
	providerRate: new Map(),
	productPrice: new Map(),
	productRateCost: new Map(),
  userPrefernce: new Map(),
  savedPriceInfo: [],
  selectedProductPackage: [],
	userPref : null,
  plan1:0,
	plan2:0,
	plan3:0,
	plan4:0,
	price1:0,
	price2:0,
	price3:0,
	price4:0,
	productOptionPrice : new Map(),
	planPrice: new Map(),
  position: null,
	rateFail:[],
  isRatesLoading: false,
};

export default function rates(state = initialState, action) {
  switch (action.type) {
    case  UPDATE_USER_SAVED_DATA:
     const userPrefernceResponse = action.payload.userPrefernceResponse;
     const { newUserPreference, newSelectedProductPackage } = getStructuredUserPrefenceData(userPrefernceResponse);
     const {newSavedPriceInfo, position, userPackageInfo} = getPackagePriceSavedInfo(userPrefernceResponse);
     return { ...state,
			 userPref:action.payload.userPrefernceResponse,
       userPrefernce: newUserPreference,
       selectedProductPackage: newSelectedProductPackage,
       savedPriceInfo: newSavedPriceInfo,
			 userPackageInfo,
       position
     };
		 case 'RATE_FAIL':
		 return { ...state,
        rateFail:state.rateFail.concat(action.payload)
      };
    case GET_RATES:
      const newProviderRate = new Map(state.providerRate);

      newProviderRate.set(action.payload.key,action.payload.data.Products);
      let opBoj =  { ...state,
        isRatesLoading: false,
        providerRate: newProviderRate,
        ratesInfo: action.payload.data.Products
      };
      return opBoj;
		case UPDATE_PRODUCT_RATE_COST:
			const {
				cost,
				id
			} = action.payload;
			let newProductCost = new Map(state.productRateCost);
			newProductCost.set(id, (cost + state.productPrice.get(id)));
			return { ...state, productRateCost: newProductCost };

		case UPDATE_PLAN_PRICE:
			const {
				plan,
				price,
				prodId
			} = action.payload;
			let optionPrice = state.productOptionPrice;
			optionPrice.set(prodId, price.rate);
			if (plan === 'plan1') {
				return { ...state, price1: price.rate + state.price1, productOptionPrice: optionPrice };
			}
			if (plan === 'plan2') {
				return { ...state, price2: price.rate + state.price2, productOptionPrice: optionPrice };
			}
			if (plan === 'plan3') {
				return { ...state, price3: price.rate + state.price3, productOptionPrice: optionPrice };
			}
			if (plan === 'plan4') {
				return { ...state, price4: price.rate + state.price4, productOptionPrice: optionPrice };
			}
			return { ...state };

		case UPDATE_RATE:
			const {
				productId,
				isSelected
			} = action.payload;
			const newPlanRate = state.productRateCost.get(productId) || state.productPrice.get(productId);
			let newPrice = state.planPrice;
			let plancost = 0;
			let prodPrice = state.productOptionPrice.get(productId) || 0;
			let totalPrice = 0;
			if (action.payload.plan === 'plan1') {
				totalPrice = isSelected ? (newPrice.get('price1') || 0) + prodPrice : (newPrice.get('price1') || 0) - prodPrice;
				newPrice = newPrice.set('price1', totalPrice);
				plancost = isSelected ? newPlanRate + state.plan1 : state.plan1 - newPlanRate;
				return { ...state, plan1: plancost, planPrice: newPrice };
			}
			if (action.payload.plan === 'plan2') {
				totalPrice = isSelected ? (newPrice.get('price2') || 0) + prodPrice : (newPrice.get('price2') || 0) - prodPrice;
				newPrice = newPrice.set('price2', totalPrice);
				plancost = isSelected ? newPlanRate + state.plan2 : state.plan2 - newPlanRate;
				return { ...state, plan2: plancost, planPrice: newPrice };
			}
			if (action.payload.plan === 'plan3') {
				totalPrice = isSelected ? (newPrice.get('price3') || 0) + prodPrice : (newPrice.get('price3') || 0) - prodPrice;
				newPrice = newPrice.set('price3', totalPrice);
				plancost = isSelected ? newPlanRate + state.plan3 : state.plan3 - newPlanRate;
				return { ...state, plan3: plancost, planPrice: newPrice };
			}
			if (action.payload.plan === 'plan4') {
				totalPrice = isSelected ? (newPrice.get('price4') || 0) + prodPrice : (newPrice.get('price4') || 0) - prodPrice;
				newPrice = newPrice.set('price4', totalPrice);
				plancost = isSelected ? newPlanRate + state.plan4 : state.plan4 - newPlanRate;
				return { ...state, plan4: plancost, planPrice: newPrice };
			}
			return { ...state };

		case UPDATE_PRODUCT_RATE:
			const {
        rate
      } = action.payload;
			let newProductPrice = state.productPrice;
			newProductPrice.set(action.payload.id, rate);
			return { ...state, productPrice: newProductPrice };
      case RATES_LOADING:
        return {...state,isRatesLoading: true};

		default:
			return { ...state };
	}
}

function getStructuredUserPrefenceData(userPrefernce) {

  const { packages } = userPrefernce;
  let plan1, plan2, plan3, plan4;
  packages.map(plan => {
    switch (plan.position) {
      case 1:
        plan1 = plan;
        break;
      case 2:
        plan2 = plan;
        break;
      case 3:
        plan3 = plan;
        break;
      case 4:
        plan4 = plan;
        break;
    }
  });

  let newUserPreference = new Map();
  let newSelectedProductPackage = [];
  let result;
  result = getPrefernceSelection(plan1, 'plan1', newUserPreference, newSelectedProductPackage);
  result = getPrefernceSelection(plan2, 'plan2', result.newUserPreference, result.newSelectedProductPackage);
  result = getPrefernceSelection(plan3, 'plan3', result.newUserPreference, result.newSelectedProductPackage);
  result = getPrefernceSelection(plan4, 'plan4', result.newUserPreference, result.newSelectedProductPackage);
  return result;
}

function getPrefernceSelection(plan, planName, newUserPreference, newSelectedProductPackage) {
  if (plan.products && plan.products.length) {
    for (const product of plan.products) {
      const id = product.dlr_prod_id;
      const providerName = product.provider_name;
      const providerCode = (product.provider_cd !==null ? product.provider_cd : 'NR');
      const productCatId = product.category_cd;
      const key = `${id}-${providerName}-${providerCode}-${productCatId}-${planName}`;
      product.package_name = planName;
      newUserPreference.set(key, product);
      newSelectedProductPackage.push({id,planName});
    }
  }
  return {newUserPreference, newSelectedProductPackage};
}

function getPackagePriceSavedInfo(userPrefernceResponse) {
  let result = [];
  let position = null;
	let userPackageInfo = [];
  const {
    packages
  } = userPrefernceResponse;

  packages.map(priceOption => {
    if (priceOption.is_package_selected) {
      position = priceOption.position;
      result = priceOption.package_options;
    }
		userPackageInfo.push({
			cost: priceOption.cost,
			position: priceOption.position,
			price: priceOption.price,
			package_options: priceOption.package_options,
			package_name: priceOption.package_name
		})

  });
  return {newSavedPriceInfo: result, position, userPackageInfo} ;

}
