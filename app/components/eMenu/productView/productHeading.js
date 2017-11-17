import React, { Component } from 'react';
import Product from './ProductView';
import PlanOption from './planList';
import PlanMenu from './planMenu';
import { updateProducts, getPaymentScenario, getPaymentScenario_success, setPackageName_success, getProductFinancialData } from '../../../actions/actions';
import { groupBy } from 'lodash';
import { connect } from 'react-redux';
import HttpHelper from '../../../utils/httpHelper';
import config from '../../../config.js';
import { dealerData } from '../../../helper/index.js';
import { cloneDeep } from 'lodash';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import {getFinancialData, getFinancialData_success} from '../../../actions/print.js';

function getProviders(providersName, defaultProviderID) {
  const keys = Object.keys(providersName);
  const ProviderInfo = [];
  for (let i = 0; i < keys.length; i++) {
    const provider = providersName[keys[i]];
    let prodProviderCode = provider[0].provider_code;
    if(prodProviderCode == null) prodProviderCode = 'NR'
    if (provider[0].provider_id == defaultProviderID) {
      ProviderInfo.push({
        providerName: provider[0].provider_name,
        providerId: provider[0].dealer_id,
        product_code: provider[0].category_code,
        provider_code: prodProviderCode,
        product_title: provider[0].name,
        ...provider[0]
      });
      //Remove the inserted provider key from the keys
      keys.splice(i, 1);
      break;
    }
  }
  //Insert the rest of the providers
  for (let i = 0; i < keys.length; i++) {
    const provider = providersName[keys[i]];
    let prodProviderCode = provider[0].provider_code;
    if(prodProviderCode == null) prodProviderCode = 'NR'
    ProviderInfo.push({
      providerName: provider[0].provider_name,
      providerId: provider[0].dealer_id,
      product_code: provider[0].category_code,
      provider_code: prodProviderCode,
      product_title: provider[0].name,
      ...provider[0]
    });
  }
  return ProviderInfo;
}
const readProductsData = (selectedPackage, realPackageName, packageName, rates, products, termRateOptions, setPaymentOptionScenario, position) => {
  let selling_price = 0
  let cost = 0
  products.totalPriceInfoList.map((elem, index) => {
    if (elem.title == realPackageName && index == position - 1) {
      selling_price = elem.price;
      cost = elem.value;
    }
  })
  return {
    "deal_package_id": '',
    "deal_id": dealerData.dealid,
    "deal_jacket_id": dealerData.dealjacketid,
    "dlr_cd": dealerData.dealer_code,
    "cost": cost,
    "price": selling_price,
    "is_package_selected": selectedPackage == packageName,
    "package_name": realPackageName,
    "position": position,
    "products": readProducts(packageName, rates, products, termRateOptions),
    "package_options": setPaymentOptionScenario
  }
}

const readProducts = (packageName, rates, products, termRateOptions) => {
  let returnProduct = []

  products.selectedPackageKeys.forEach((sp) => {
    let inforArr = sp.split('-');
    let productId = inforArr[0];
    let providerId = inforArr[1];
    let productCode = inforArr[2];
    let providerCode = (inforArr[3] !==null) ?  inforArr[3] : 'NR';
    let plan = inforArr[4];
    let localPkg = ''

    if (plan == "plan1") localPkg = 'PLATINUM';
    else if (plan == "plan2") localPkg = 'GOLD';
    else if (plan == "plan3") localPkg = 'SILVER';
    else if (plan == "plan4") localPkg = 'BASIC';

    let selectedPackageInfo = products.productPackageInfo.get(sp);
    if (localPkg == packageName && selectedPackageInfo) {
      let sortNum = (products.list.findIndex(p => p.id == productId))+1;
      let prod = products.list.find(p => p.id == productId)
      let payment_options = cloneDeep(termRateOptions.options);
      let new_payment_options = []
      for (var i = 0; i < payment_options.termrateoptions.length; i++) {
        let obj = {};
        obj['deal_prod_payment_options_id'] = '';
        obj['payment_monthly'] = Math.round((selectedPackageInfo.price / payment_options.termrateoptions[i].term) * 100) / 100;
        obj['payment_weekly'] = 0;
        obj['payment_daily'] = 0;
        obj["termrateoptions"] = {};
        obj["termrateoptions"]["term"] = payment_options.termrateoptions[i].term;
        new_payment_options.push(obj);
      }

      let options = [];
      if(!selectedPackageInfo.isOptionsDirty){
        if (prod.is_rateable) {
          if(rates.userPrefernce && rates.userPrefernce.size > 0){
            let prefKey = sp.substring(0,sp.indexOf("-")) + "-" +  prod.provider_code +"-" +  prod.provider_code+"-" + prod.category_code + "-" + plan
            if (rates.userPrefernce.get(prefKey) && rates.userPrefernce.get(prefKey).options){
              rates.userPrefernce.get(prefKey).options.map(p=> {
                options.push({
                  "option_id": p.option_id,
                  "option_cd": p.option_cd,
                  "option_desc": p.option_desc,
                  "option_price": p.option_price,
                  "is_surcharge": p.is_surcharge,
                  "is_selected": p.is_selected
                })
              })
            } 
            else {
              if (selectedPackageInfo.packageOption) {
                selectedPackageInfo.packageOption.map(p => {
                  options.push({
                    "option_id": p.OptionId,
                    "option_cd": p.OptionName,
                    "option_desc": p.OptionDesc,
                    "option_price": p.RetailRate,
                    "is_surcharge": p.IsSurcharge,
                    "is_selected": p.IsSelected
                  })
                })
              }
            }
          }
        }
      }
      else {
        if (prod.is_rateable && selectedPackageInfo.packageOption) {
          selectedPackageInfo.packageOption.map(p => {
            options.push({
              "option_id": p.OptionId,
              "option_cd": p.OptionName,
              "option_desc": p.OptionDesc,
              "option_price": p.RetailRate,
              "is_surcharge": p.IsSurcharge,
              "is_selected": p.IsSelected
            })
          })
        }
      }
      let localProduct = {
        "deal_id": dealerData.dealid,
        "deal_jacket_id": dealerData.dealjacketid,
        "dlr_cd": dealerData.dealer_code,
        "deal_prod_id": '',
        "dlr_prod_id": prod.product_id,
        "sort_order": sortNum,
        "name": prod.name,
        "price": selectedPackageInfo.price,
        "cost": selectedPackageInfo.cost,
        "max_price": prod.max_price,
        "min_price": prod.max_price,
        "is_rateable": prod.is_rateable,
        "is_contractable": prod.is_contract,
        "is_taxable": prod.is_taxable,
        "category_cd": prod.category_code,
        "provider_cd": prod.provider_code,
        "provider_name": selectedPackageInfo.providerName,
        "program": prod.is_rateable ? ( selectedPackageInfo.levelType1 && selectedPackageInfo.levelType1.length ? selectedPackageInfo.levelType1[selectedPackageInfo.programIndex].Desc : null) : null,
        "coverage": prod.is_rateable ? (selectedPackageInfo.levelType2 && selectedPackageInfo.levelType2.length ? selectedPackageInfo.levelType2[selectedPackageInfo.coverageIndex].Desc : null) : null,
        "plan": prod.is_rateable ? (selectedPackageInfo.levelType3 && selectedPackageInfo.levelType3.length ? selectedPackageInfo.levelType3[selectedPackageInfo.planIndex].Desc : null) : null,
        "term": (selectedPackageInfo.termMileage && selectedPackageInfo.termMileage.term) ? selectedPackageInfo.termMileage.term : null,
        "miles": (selectedPackageInfo.termMileage && selectedPackageInfo.termMileage.mileage) ? selectedPackageInfo.termMileage.mileage < 0 ? 999999 : selectedPackageInfo.termMileage.mileage : null,
        "deductible": selectedPackageInfo.deductible ? selectedPackageInfo.deductible : null,
        "image_url": prod.image_url,
        "video_url": prod.video_url,
        "prod_long_desc": '',
        "prod_short_desc": prod.short_description,
        "svc_int_tirerotation": null,
        "provider_rate_level": null,
        "rate_level_format": null,
        "req_fields_data": null,
        "req_fields_format": null,
        "options": options,
        "payment_options": new_payment_options,
      }
      returnProduct.push(localProduct);
    }


  })
  return returnProduct

}
class ProductHeading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentOptions: [],
      dealjacketid: dealerData.dealjacketid,
      dealid: dealerData.dealid,
      deal_type: dealerData.deal_type,
      dealer_code: dealerData.dealer_code
    }
    const groupedList = groupBy(props.items.results, 'category_code');
    let result = this.getProductInfo(groupedList);
    this.saveData = this.saveData.bind(this);
    this.fetchDataOnOptionSelection = this.fetchDataOnOptionSelection.bind(this);
    this.handlePaymentOptionRadioSelect = this.handlePaymentOptionRadioSelect.bind(this);
    this.fetchAllDataOptionSelection = this.fetchAllDataOptionSelection.bind(this);
    this.setPackageNames = this.setPackageNames.bind(this);
    props.dispatch(updateProducts(result));
    this.handlePaymentOptionRadioSelect(props.position);
    this.getFinancialData(dealerData.dealjacketid, dealerData.dealid);
  }
  getFinancialData(dealjacketid, dealid){

   HttpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${dealjacketid}/deals/${dealid}/deal-finance-summary/`, 'get')
        .then((financialInfoData) => {
            this.props.dispatch(getFinancialData_success(financialInfoData));
        });
 }
  getDefaultProduct(items) {
    let defaultIndex = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].is_default) {
        defaultIndex = i;
      }
    }
    if(this.props.userPrefernce){
      let keys =[ ...this.props.userPrefernce.keys() ];
      let currArr = [];
      let provName = '';
      for(let x =0; x < keys.length ; x++){
        let provInfo = keys[x].split('-');
        let provCode = provInfo[3];


        if(items){
          if(items[0].category_code === provCode){
              provName = provInfo[1];
            currArr.push(keys[x]);
          }
        }
      }
      if(currArr.length > 0) {
        for(let y = 0; y< items.length ; y++){
          if(items[y].provider_name == provName){
            defaultIndex = y;
          }
        }
      }
    }


    return defaultIndex;
  }

  getProductInfo(groupedProductList) {
    const keys = Object.keys(groupedProductList);
    const productList = [];
    for (let i = 0; i < keys.length; i++) {
      let items = groupedProductList[keys[i]];
      const defaultIndex = this.getDefaultProduct(groupedProductList[keys[i]])
      let providersName = groupBy(items, 'provider_name');
      let item = items[defaultIndex];
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

  fetchDataOnOptionSelection(plan, selectedIndex) {
    this.props.dispatch(getPaymentScenario_success([]));
    let selling_price = 0;
    let cost = 0;
    this.props.totalPriceInfoList.map((elem, index) => {
      if (elem.title == plan && index == selectedIndex - 1) {
        selling_price = elem.price;
        cost = elem.value;
      }
    })
    let dataArr = [];
    let selectedOptions = this.props.termRateOptions.options.termrateoptions;
    selectedOptions.map((o, ind) => {
      let data = {
        "scenario_id": ind + 1,
        "term": o.term,
        "rate_type": "Apr",
        "apr": o.apr ? o.apr : 0,
        "money_factor": o.money_factor ? o.money_factor : 0,
        "residual_percent": o.residual ? o.residual : 0,
        "products": [
          {
            "category_id": 1,
            "selling_price": selling_price,
            "cost": cost,
            "price_capitalized": true,
            "taxable": true,
            "tax_capitalized": true,
            "backend": true,
            "residual_type": "Dollar",
            "residual_value": 0
          }
        ],
        "calculation_rule": "Generic",
      }
      dataArr.push(data);
    })
    let dealJacketId = this.props.termRateOptions.options.deal_jacket_id;
    let dealId = this.props.termRateOptions.options.deal_id
    this.props.getPaymentScenario(dealJacketId, dealId, dataArr, plan, selectedIndex);

  }
  fetchAllDataOptionSelection() {
    return new Promise((resolve, reject) => {
      let promArr = [];
      let count = 1;
      for (var i = 1; i <= 4; i++) {
        let dataArr = [];

        let selling_price = this.props.totalPriceInfoList.length ? this.props.totalPriceInfoList[i - 1].price : 0;
        let cost = this.props.totalPriceInfoList.length ? this.props.totalPriceInfoList[i - 1].value : 0;

        let selectedOptions = this.props.termRateOptions.options.termrateoptions;
        selectedOptions.map(o => {
          let data = {
            "scenario_id": count,
            "term": o.term,
            "rate_type": "Apr",
            "apr": o.apr ? o.apr : 0,
            "money_factor": o.money_factor ? o.money_factor : 0,
            "residual_percent": o.residual ? o.residual : 0,
            "products": [
              {
                "category_id": 1,
                "selling_price": selling_price,
                "cost": cost,
                "price_capitalized": true,
                "taxable": true,
                "tax_capitalized": true,
                "backend": true,
                "residual_type": "Dollar",
                "residual_value": 0
              }
            ],
            "calculation_rule": "Generic",
          }
          count++;
          dataArr.push(data);
        })
        let dealJacketId = this.props.termRateOptions.options.deal_jacket_id;
        let dealId = this.props.termRateOptions.options.deal_id;
        promArr.push(HttpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${dealJacketId}/deals/${dealId}/scenarios/`, 'post', dataArr));
      }
      let resultArr = [];
      Promise.all(promArr).then(result => {
        let termrateFromStore = this.props.termRateOptions.options.termrateoptions;
        for (var j = 0; j < result.length; j++) {
          let paymentOptions = [];
          let count = 0;
          result[j].map((r, i) => {
            if (r.payments[0].paymentamount) {
              let opt = {
                "payment": r.payments[0].paymentamount,
                "deal_package_option_id": '',
                "is_option_selected": false,
                "termrateoptions": {
                  "term": termrateFromStore[i].term
                }
              };
              count++;
              paymentOptions.push(opt);
            }
          })
          resultArr.push(paymentOptions);
        }
        resolve(resultArr);
      }).catch((err) => {
        resolve([])
      });
    })
  }

  saveData(data, selectedPackage, url) {
    return new Promise((resolve, reject) => {
     if (`${config.credentialsFlag}` == 'false'){
         var credentialFlag = false;
     }else{
         var credentialFlag = true;
     }
      this.fetchAllDataOptionSelection().then((packagePaymentOptionArr) => {
        let { rates, products, termRateOptions, setPaymentOptionScenario, packagesNames, totalPriceInfoList, selectedPackageInfo } = this.props;
        if (selectedPackageInfo.selectedIndex) packagePaymentOptionArr[selectedPackageInfo.selectedIndex - 1] = setPaymentOptionScenario
        data.packages.push(readProductsData(selectedPackage, packagesNames.package1, 'PLATINUM', rates, products, termRateOptions, packagePaymentOptionArr[0], 1, totalPriceInfoList));
        data.packages.push(readProductsData(selectedPackage, packagesNames.package2, 'GOLD', rates, products, termRateOptions, packagePaymentOptionArr[1], 2, totalPriceInfoList));
        data.packages.push(readProductsData(selectedPackage, packagesNames.package3, 'SILVER', rates, products, termRateOptions, packagePaymentOptionArr[2], 3, totalPriceInfoList));
        data.packages.push(readProductsData(selectedPackage, packagesNames.package4, 'BASIC', rates, products, termRateOptions, packagePaymentOptionArr[3], 4, totalPriceInfoList));
        let mainUrl = `${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/package-products/`;
        let axiosConfig = {
          headers: { 'Content-Type': 'application/json', 'Dealer-Code': (window.dealerData) ? window.dealerData.dealer_code : '1111132' },
          'withCredentials' : credentialFlag
        };
        axios.post(mainUrl, data, axiosConfig).then((response) => {
          resolve(url)
        }).catch((error) => {
          alert('Error occurred while saving Menu Setup. Please fix the error and try again.');
        });
      }).catch((err) => {
        let { rates, products, termRateOptions, setPaymentOptionScenario, packagesNames, totalPriceInfoList, selectedPackageInfo } = this.props;
        data.packages.push(readProductsData(selectedPackage, packagesNames.package1, 'PLATINUM', rates, products, termRateOptions, setPaymentOptionScenario, 1, totalPriceInfoList));
        data.packages.push(readProductsData(selectedPackage, packagesNames.package2, 'GOLD', rates, products, termRateOptions, setPaymentOptionScenario, 2, totalPriceInfoList));
        data.packages.push(readProductsData(selectedPackage, packagesNames.package3, 'SILVER', rates, products, termRateOptions, setPaymentOptionScenario, 3, totalPriceInfoList));
        data.packages.push(readProductsData(selectedPackage, packagesNames.package4, 'BASIC', rates, products, termRateOptions, setPaymentOptionScenario, 4, totalPriceInfoList));
        let mainUrl = `${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/package-products/`;
        let axiosConfig = {
          headers: { 'Content-Type': 'application/json', 'Dealer-Code': (window.dealerData) ? window.dealerData.dealer_code : '1111132' },
            'withCredentials' : credentialFlag
          };


        axios.post(mainUrl, data, axiosConfig).then((response) => {
          resolve(url)
        }).catch((error) => {
          alert('Error occurred while saving Menu Setup. Please fix the error and try again.');
        })
      });
    })



  }

  handlePaymentOptionRadioSelect(index) {
    let paymentOptionScenerio = cloneDeep(this.props.setPaymentOptionScenario);
    paymentOptionScenerio.map((s, i) => {
      s.is_option_selected = (i == index) ? true : false;
    })
    this.props.dispatch(getPaymentScenario_success(paymentOptionScenerio))
  }

  setPackageNames = (pkg, pkgValue) => {
    let clonePkg = cloneDeep(this.props.packagesNames);
    clonePkg[pkg] = pkgValue;
    this.props.dispatch(setPackageName_success(clonePkg))
  }
  render() {
    let products = this.props.products.list;
    return (
      <div className="container-fluid" >
        <div className="row">
          <PlanMenu showRates={true} packagesNames={this.props.packagesNames} setPackageNames={this.setPackageNames} />
          <div>
            <h3 className="r-bottom" key={"productsHeading" + products.length}></h3>
            <hr className="r-top-no-margin" style={{marginBottom: '2px'}}/>
            {
              products.map((product, i) =>
                <Product key={"product_" + product.id} prodKey={"product_" + product.id} idNum={i+1} optType={product} />
              )
            }
          </div>
          <div>
            <PlanOption saveData={this.saveData}
              declinePackage={true}
              handleRadioSelect={this.fetchDataOnOptionSelection}
              handlePaymentOptionRadioSelect={this.handlePaymentOptionRadioSelect}
              paymentOptions={this.props.setPaymentOptionScenario}
              hasRenderedPackagePmt={this.props.hasRenderedPackagePmt} />
          </div>
        </div>
      </div >
    );
  }
}

const mapStateToprops = state => ({
  products: state.product,
  termRateOptions: state.termRateOptions,
  rates: state.rates,
  position: state.rates.position,
  userPrefernce: state.rates.userPrefernce,
  setPaymentOptionScenario: state.setPaymentOptionScenario,
  packagesNames: state.packagesNames,
  totalPriceInfoList: state.product.totalPriceInfoList,
  selectedPackageInfo: state.selectedPackageInfo
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getPaymentScenario, dispatch
  }, dispatch);
}


export default connect(mapStateToprops, mapDispatchToProps)(ProductHeading);
