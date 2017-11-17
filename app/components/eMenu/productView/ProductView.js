import React from 'react';
import {
  getDealerRates,
  updateProductRate,
  updatePlanRate,
  updatePackageSelectionForProvider,
  updatedUserSelectedPackagePlan,
  updateProducts
} from '../../../actions/actions';
import ExpandedProduct from './ExpandedProduct';
import { connect } from 'react-redux';
import CheckBoxRow from '../../common/checkBoxRow';
import { groupBy } from 'lodash';

function getPrice(rateInfo) {
  return rateInfo.length ? getDealerCost(rateInfo[0]) : 0;
}

function getDealerCost(rateInfo) {
  let dealerCost = 0;
  let levelLookUp = rateInfo.Levels[0];
  while (levelLookUp) {
    if (levelLookUp.RateInfo && levelLookUp.RateInfo.Rates[0]) {
      dealerCost = levelLookUp.RateInfo.Rates[0].DealerCost;
      levelLookUp.RateInfo.Rates[0].Options.map(item => {
        if (item.IsSelected) {
          dealerCost += item.NetRate;
        }
      })
    }
    levelLookUp = levelLookUp.Levels[0];
  }
  return dealerCost;
}

function packageTypesState(selectedProductPackage, id) {
  const groupedProvider = groupBy(selectedProductPackage, 'id');
  let result = {
    isPlan1Selected: false,
    isPlan2Selected: false,
    isPlan3Selected: false,
    isPlan4Selected: false,
    plan1: null,
    plan2: null,
    plan3: null,
    plan4: null

  };
  if (groupedProvider[id] && groupedProvider[id].length) {
    groupedProvider[id].map(item => {
      switch (item.planName) {
        case 'plan1':
          result.isPlan1Selected = true;
          result.plan1 = 'plan1';
          break;
        case 'plan2':
          result.isPlan2Selected = true;
          result.plan2 = 'plan2';
          break;
        case 'plan3':
          result.isPlan3Selected = true;
          result.plan3 = 'plan3';
          break;
        case 'plan4':
          result.isPlan4Selected = true;
          result.plan4 = 'plan4';
          break;
      }
    });
  }
  return result;
}
function getProductRateKey(props, state) {
  if(state.productCode !== null)
    return `${state.slectedProductInfo.id}-${state.providerId}-${state.productCode}-${state.providerCode}`;
  else  return `${state.slectedProductInfo.id}-${state.providerId}-NR-${state.providerCode}`;
}

function getSelectedProvider(productId, providerList, userPrefernce) {
  let selectedIndex = 0;
  for (const product in userPrefernce) {
    providerList.map((provider, index) => {
      if (provider.provider_code == product.provider_cd && productId == product.dlr_prod_id) {
        selectedIndex = index;
        return selectedIndex;
      }
    });
  }
  return selectedIndex;
}

class Product extends React.Component {
  constructor(props) {
    super(props);
    let slectedProductInfo = Object.assign({},this.props.optType);
    const selectedProvider = getSelectedProvider(slectedProductInfo.id, slectedProductInfo.providerList, props.userPrefernce);
    let defaultProvider
    if(props.userPrefernce){
      let keys =[ ...props.userPrefernce.keys() ]
    }
    this.state = {
      ...packageTypesState(props.selectedProductPackage, slectedProductInfo.id),
      imageUrl: slectedProductInfo.imageUrl,
      title: slectedProductInfo.title,
      showMore: false,
      platinum: slectedProductInfo.platinum,
      gold: slectedProductInfo.gold,
      silver: slectedProductInfo.silver,
      basic: slectedProductInfo.basic,
      providerName: slectedProductInfo.providerList[selectedProvider].providerName,
      providerId: slectedProductInfo.providerList[selectedProvider].providerId,
      provider_id: slectedProductInfo.providerList[selectedProvider].provider_id,
      productCode: slectedProductInfo.providerList[selectedProvider].product_code,
      cost: slectedProductInfo.providerList[selectedProvider].cost,
      slectedProductInfo,

      providerCode: (slectedProductInfo.providerList[selectedProvider].provider_code !==null ? slectedProductInfo.providerList[selectedProvider].provider_code : 'NR')
    }
    this.onPlanChangeStep2 = this.onPlanChangeStep2.bind(this);
  }
  UpdatedUserSelection = () => {
    const planInfo = [];
    const plan = {
      isSelected: true,
      plan: null,
      key: null
    };
    if (this.state.isPlan1Selected) {
      let key = getProductPackageKey(this.props, this.state, 'plan1');
      planInfo.push({ key });
    }
    if (this.state.isPlan2Selected) {
      let key = getProductPackageKey(this.props, this.state, 'plan2');
      planInfo.push({ key });
    }
    if (this.state.isPlan3Selected) {
      let key = getProductPackageKey(this.props, this.state, 'plan3');
      planInfo.push({ key });
    }
    if (this.state.isPlan4Selected) {
      let key = getProductPackageKey(this.props, this.state, 'plan4');
      planInfo.push({ key });
    }

    return planInfo;
  }

  componentWillMount() {
    const planInfo = this.UpdatedUserSelection();
    if (planInfo.length) {
      this.props.dispatch(updatedUserSelectedPackagePlan(this.state.slectedProductInfo.id, planInfo));
    }
    this.props.dispatch(updateProductRate(getPrice(this.props.rateInfo), this.state.slectedProductInfo.id));
    if (this.state.slectedProductInfo.is_rateable) {
      let provider = this.state.slectedProductInfo.providerList[0];
      this.props.dispatch(getDealerRates(provider.providerId, provider.product_code, provider.provider_code, this.state.slectedProductInfo.id));
    }
  }

  updateShowMore(event) {
    this.setState({ showMore: !this.state.showMore });
  }
  getProductInfo(groupedProductList, index) {
    const keys = Object.keys(groupedProductList);
    const productList = [];
    for (let i = 0; i < keys.length; i++) {
      let items = groupedProductList[keys[i]];
      const defaultIndex = this.getDefaultProduct(groupedProductList[keys[i]])
      let providersName = groupBy(items, 'provider_name');
      let item = items[defaultIndex];
      //let item_proverCde  = (item.provider_code !==null ? item.provider_code : 'NR')
      item['id'] = item.product_id;
      item['title'] = item.name;
      item['providerList'] = getProviders(providersName, item.provider_id);
      item['catCode'] = item.category_code;
      item['price'] = item.cost;
      item['isRateable'] = item.is_rateable;
      item['imageUrl'] = item.image_url;
      productList.push(item);

    }
    return productList;
  }
  getRates(event) {
    const selectedProvider = this.props.optType.providerList[event.target.selectedIndex];

    let updatedSelectedProductInfo = {
      ...this.state.slectedProductInfo,
       category_code : selectedProvider.category_code,
       category_id : selectedProvider.category_id,
        cost : selectedProvider.cost,
        created_by_user_code : selectedProvider. created_by_user_code,
        created_timestamp :selectedProvider. created_timestamp, 
       dealer_code : selectedProvider.dealer_code,
        dealer_id : selectedProvider. dealer_id,
       default_price : selectedProvider.default_price,
        extension_data :  selectedProvider.extension_data,
       image_url :selectedProvider.image_url,
       is_rateable : selectedProvider.is_rateable,
        is_taxable : selectedProvider.is_taxable ,
       is_balloon : selectedProvider.is_balloon,
        is_cash : selectedProvider.is_cash ,
       is_contract : selectedProvider .is_contract,
       is_default : selectedProvider .is_default,
       is_deleted : selectedProvider .is_deleted,
       is_finance : selectedProvider.is_finance,
       is_frontend : selectedProvider.is_frontend,
       is_lease : selectedProvider.is_lease,
        is_markup : selectedProvider. is_markup,

       is_vehicle_certified : selectedProvider .is_vehicle_certified,
       is_vehicle_new : selectedProvider.is_vehicle_new,
       is_vehicle_used : selectedProvider.is_vehicle_used,
       long_description : selectedProvider.long_description,
        markup_value : selectedProvider.markup_value,
        max_price : selectedProvider.max_price,
       min_price : selectedProvider.min_price,
        name : selectedProvider. name,
        product_code : selectedProvider.product_code,
        product_id : selectedProvider. product_id,
       product_title : selectedProvider.product_title,
       providerId : selectedProvider.providerId,
        providerName : selectedProvider. providerName ,
        provider_code : selectedProvider. provider_code,
       provider_id : selectedProvider.provider_id,
        provider_name : selectedProvider. provider_name,
        short_description : selectedProvider. short_description,
        updated_by_user_code : selectedProvider.updated_by_user_code ,
        updated_timestamp : selectedProvider. updated_timestamp,
        video_url : selectedProvider .video_url

    }
    // const groupedList = groupBy(this.props.productItems.results, 'category_code');
    // let result = this.getProductInfo(groupedList, event.target.selectedIndex);
    const existingProductsList = Object.assign({},this.props.products);

    let updatesProductsList = Object.keys(existingProductsList).map((i)=> {
      if(existingProductsList[i].category_code === selectedProvider.category_code){
        let ob = Object.assign({},existingProductsList[i]);
        ob.category_code =selectedProvider.category_code;
        ob.category_id = selectedProvider.category_id,
        ob. cost = selectedProvider.cost,
        ob. created_by_user_code = selectedProvider. created_by_user_code,
         ob.created_timestamp =selectedProvider. created_timestamp, 
        ob.dealer_code =selectedProvider.dealer_code,
         ob.dealer_id = selectedProvider. dealer_id,
        ob.default_price = selectedProvider.default_price,
         ob.extension_data = selectedProvider.extension_data,
        ob.image_url =selectedProvider.image_url,
        ob.is_rateable =selectedProvider.is_rateable,
        ob. is_taxable = selectedProvider.is_taxable ,
        ob.is_balloon = selectedProvider.is_balloon,
        ob. is_cash = selectedProvider.is_cash ,
        ob.is_contract = selectedProvider .is_contract,
        ob.is_default =selectedProvider .is_default,
        ob.is_deleted =selectedProvider .is_deleted,
        ob.is_finance = selectedProvider.is_finance,
        ob.is_frontend = selectedProvider.is_frontend,
        ob.is_lease = selectedProvider.is_lease,
        ob. is_markup =selectedProvider. is_markup,

        ob.is_vehicle_certified = selectedProvider .is_vehicle_certified,
        ob.is_vehicle_new =selectedProvider.is_vehicle_new,
        ob.is_vehicle_used = selectedProvider.is_vehicle_used,
        ob.long_description = selectedProvider.long_description,
        ob. markup_value =selectedProvider.markup_value,
        ob. max_price = selectedProvider.max_price,
        ob.min_price = selectedProvider.min_price,
         ob.name = selectedProvider. name,
         ob.product_code = selectedProvider.product_code,
        ob. product_id =selectedProvider. product_id,
        ob.product_title = selectedProvider.product_title,
        ob.providerId = selectedProvider.providerId,
         ob.providerName = selectedProvider. providerName ,
         ob.provider_code = selectedProvider. provider_code,
        ob.provider_id =selectedProvider.provider_id,
         ob.provider_name = selectedProvider. provider_name,
         ob.short_description = selectedProvider. short_description,
         ob.updated_by_user_code =selectedProvider.updated_by_user_code ,
         ob.updated_timestamp =selectedProvider. updated_timestamp,
        ob. video_url =selectedProvider .video_url,
        ob.title=selectedProvider.short_description,
        ob.isRateable=selectedProvider.is_rateable
        return ob;
      }
      else return existingProductsList[i];
    })
    this.props.dispatch(updateProducts(updatesProductsList));
    this.props.dispatch({type:'PROVIDER_SWITCH', providerSwitch: true});

    this.setState({
      productCode: selectedProvider.product_code,
      providerCode: (selectedProvider.provider_code !==null ? selectedProvider.provider_code : 'NR'),
      providerId: selectedProvider.providerId,
      provider_id : selectedProvider.provider_id,
      product_id : selectedProvider. product_id,
      providerName: selectedProvider.providerName,
      title: selectedProvider.product_title,
      cost: selectedProvider.cost,
      slectedProductInfo: updatedSelectedProductInfo,
      showMore: false
    }, () => {
      const key = getProductRateKey(this.props, this.state);
      if (!this.props.providerRate.has(key)) {
        let providerCde = (selectedProvider.provider_code !== null ? selectedProvider.provider_code : 'NR')
        this.props.dispatch({type:'RATES_LOADING', payload: true})
        this.props.dispatch(getDealerRates(selectedProvider.providerId, selectedProvider.product_code, providerCde , this.state.slectedProductInfo.id));
      }
      this.props.dispatch(updatePackageSelectionForProvider(this.state.slectedProductInfo.id, this.state.providerId, (this.state.providerCode !==null ? this.state.providerCode : 'NR')));
    });
  }
  onPlanChangeStep2 = (plan, isSelected) => {
    const selectedKey = getProductPackageKey(this.props, this.state, plan);
    this.props.dispatch(updatePlanRate(this.state.slectedProductInfo.id, plan, isSelected, selectedKey));
  }
  getNonRateableProductCount() {
    let count = 0;
    this.props.products.map((item) => {
      if (item.isRateable) {
        count++;
      }
    });
    return count;
  }
  render() {
    const id = this.state.slectedProductInfo.id;

    const rateCheckProductPackageKey = getProductPackageKey(this.props,this.state,'plan1');
    const productPackageInfo = this.props.productPackageInfo.get(rateCheckProductPackageKey);
    const rateProductKey = getProductPackageKey(this.props,this.state,'').slice(0, -1);
    const productRateInfo =  this.props.providerRate.get(rateProductKey)
    const productCount = this.getNonRateableProductCount();
    const ind = this.props.rateFail.indexOf(id);

    return (
      <div className="">
        <div className="row-fluid product" id={"productListing"+this.props.idNum}>
          <div className="span3">
            <p className="r-no-bottom-margin" id={"productLabel"}><b>{this.state.title}</b></p>
            <p className="r-small-top-margin" id={"productShowMoreArea"} style={{marginTop:'10px', marginBottom: '0px'}}>
              {((productRateInfo) || (!this.props.optType.isRateable)) ?

                (productPackageInfo ?
                  ((productPackageInfo.cost) ?
                    <a className="anchor-pointer" id={"productShowMoreLink"} onClick={this.updateShowMore.bind(this)}>
                    {this.state.showMore == false ? 'Show More' : 'Show Less'}</a> :
                    (this.props.providerRate.get(this.state.slectedProductInfo.id+"-"+this.state.slectedProductInfo.dealer_id+"-"+this.state.slectedProductInfo.category_code+"-"+this.state.slectedProductInfo.provider_code)&&
                    this.props.providerRate.get(this.state.slectedProductInfo.id+"-"+this.state.slectedProductInfo.dealer_id+"-"+this.state.slectedProductInfo.category_code+"-"+this.state.slectedProductInfo.provider_code)[0] &&
                      this.props.providerRate.get(this.state.slectedProductInfo.id+"-"+this.state.slectedProductInfo.dealer_id+"-"+this.state.slectedProductInfo.category_code+"-"+this.state.slectedProductInfo.provider_code)[0].Errors.length > 0 ?
                    this.props.providerRate.get(this.state.slectedProductInfo.id+"-"+this.state.slectedProductInfo.dealer_id+"-"+this.state.slectedProductInfo.category_code+"-"+this.state.slectedProductInfo.provider_code)[0].Errors[0].ErrorDescription :
                    'Sorry! No rates were received. Please try again later....!')
                  )
                   : 'No rates were returned from provider.')
                 : 'Retrieving Rates...'}
            </p>
          </div>
          <div className="span3"><div className="prov-list">
              <p className="r-no-bottom-margin r-gray r-medium-text">Provider</p>
              <select className="control-group prod-form" id={"productProviderDropdown"} onChange={(event) => this.getRates(event)}>
                {this.props.optType.providerList.map((provider, i) => <option key={provider.providerName + provider.providerId + i + provider.provider_code + provider.product_code}>{provider.providerName}</option>)})}
              </select>
          </div></div>
          <div id="pkgSelectBox" className="row span6 r-checkbox-margin-top">
            <CheckBoxRow onPlanChangeStep2={this.onPlanChangeStep2}
              isPlan1Selected={this.state.isPlan1Selected}
              isPlan2Selected={this.state.isPlan2Selected}
              isPlan3Selected={this.state.isPlan3Selected}
              isPlan4Selected={this.state.isPlan4Selected}
            />
          </div>
        </div>
        {((productRateInfo && productRateInfo.length > 0) || (!this.props.optType.isRateable)) && <ExpandedProduct
          key={"Expanded" + this.props.prodKey + this.state.providerId  + this.state.provider_id + (this.state.providerCode !==null ? this.state.providerCode : 'NR' ) + this.state.productCode}
          product={this.state.slectedProductInfo}
          providerId={this.state.providerId}
          providerCode={(this.state.providerCode !==null ? this.state.providerCode : 'NR')}
          productCode={this.state.productCode}
          providerName={this.state.providerName}
          showMore={this.state.showMore}
          userPrefernce={this.props.userPrefernce}
          idNum={this.props.idNum}

        />}
        <hr className="hr-small-margin" style={{marginTop: '2px', marginBottom: '2px'}}/>
      </div>

    )
  }
}

function getProductPackageKey(props, state, plan) {
  const productId = state.slectedProductInfo.id;
  const providerId = state.providerId;
  const productCode = state.productCode;
  const providerCode = state.providerCode;
  const packageType = plan;
  if(providerCode !== null) return `${productId}-${providerId}-${productCode}-${providerCode}-${packageType}`;
  else return `${productId}-${providerId}-${productCode}-NR-${packageType}`;
}
const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToprops = state =>
{
  return  ({
  rateInfo: state.rates.ratesInfo,
  price: state.rates.productPrice,
  products: state.product.list,
  userPrefernce: state.rates.userPrefernce,
  providerRate: state.rates.providerRate,
  selectedProductPackage: state.rates.selectedProductPackage,
  rateFail: state.rates.rateFail,
  productPackageInfo: state.product.productPackageInfo,
  isRatesLoading: state.rates.isRatesLoading,
});
}

export default connect(mapStateToprops, mapDispatchToProps)(Product);
