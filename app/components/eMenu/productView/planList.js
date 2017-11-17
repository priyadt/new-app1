import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dealerData } from '../../../helper/index.js';
import config from '../../../config.js';
import { updateTotalPackagePrice } from '../../../actions/actions';
import HttpHelper from '../../../utils/httpHelper.js';
import { bindActionCreators } from 'redux';
import { getDealerPackageDetails, getNameList, getVehicleData, getFinancialData, getTradeinVehicles } from '../../../actions/print.js';
import { getPaymentScenario_success, set_selected_packageInfo_success, resetDataChange } from '../../../actions/actions.js';


class PlanOption extends Component {
  constructor(props) {
    super(props);
    this.renderPlan = this.renderPlan.bind(this);
    this.state = {
      showProdDetails: '',
      dealjacketid: dealerData.dealjacketid,
      dealid: dealerData.dealid,
      deal_type: dealerData.deal_type,
      dealer_code: dealerData.dealer_code,
      deploy_env: dealerData.deploy_env,
      firstname: dealerData.user_first,
      lastname: dealerData.user_last,
      declinePackage: false,
      selectedTerm: '',
      selectedTermPrice: '',
      printMenu: false,
      printFinalMenu: false,
      selectedIndex: null,
      planList: [],
      initialLoad: true
    };
    this.saveData = this.saveData.bind(this);
    this.saveFinanceData = this.saveFinanceData.bind(this);
    this.handlePaymentOptionRadioSelect = this.handlePaymentOptionRadioSelect.bind(this);
    this.handleDeclinePackage = this.handleDeclinePackage.bind(this);
    this.handlePrintFinalMenu = this.handlePrintFinalMenu.bind(this);
    this.handlePresentationPackage = this.handlePresentationPackage.bind(this);
    this.getPlanList = this.getPlanList.bind(this);
    this.generatePdf = this.generatePdf.bind(this);
    this.onChange = this.onChange.bind(this);
    this.createDataForPdf = this.createDataForPdf.bind(this);
  }
  onChange = (e) => {
    let plan = e.target.value;
    let selectedIndex = e.target.id;
    this.setState({ showProdDetails: plan, selectedIndex });
    this.props.handleRadioSelect(plan, selectedIndex);
    const planList = this.getPlanList(this.props, false);
    this.props.dispatch(updateTotalPackagePrice(planList));
  }
  handlePaymentOptionRadioSelect(item, e) {
    let value = e.target.value;
    value = parseInt(value) - 1;
    this.props.handlePaymentOptionRadioSelect(value);
    this.setState({
      selectedTerm: item.termrateoptions.term,
      selectedTermPrice: item.payment
    })
  }
  termChange(item) {
    this.state.selectedTerm = item.termrateoptions.term;
    this.state.selectedTermPrice = item.payment;
  }
  renderPlanDetails(price, type) {
    if (this.state.selectedIndex) {
      return (<div className="plan-list--price-details">
        {this.props.paymentOptions.map((item, i) => {
          return (

            <p key={i + type + price} className="radio">
              <input type="radio" name="plan-details" id={"pl-TermRateCheckbox"+(i+1)} value={(i + 1)} onClick={this.handlePaymentOptionRadioSelect.bind(null, item)} checked={item.is_option_selected} />
              <span ref="monthlyPayment" className="plans-radio-option">{`${item.termrateoptions.term} months @ ${item.payment}`}</span>

            </p>);
        })}
      </div>
      );
    }

  }

  componentDidMount() {
    if (this.props.position) {
      let preSelectedPackage = this.props.userPackageInfo.find((p) => p.position == this.props.position);
      if (this.props.termRateOptions.options.termrateoptions.length == preSelectedPackage.package_options.length) {
        let check = true;
        let opt = preSelectedPackage.package_options;
        let termOpt = this.props.termRateOptions.options.termrateoptions;

        for (var i = 0; i < opt.length; i++) {
          if (!termOpt.find(t => t.term == opt[i].termrateoptions.term)) check = false;
        }
        if (check) {
          this.props.dispatch(set_selected_packageInfo_success({ selectedIndex: this.props.position, plan: preSelectedPackage.package_name }))
          this.props.dispatch(getPaymentScenario_success(preSelectedPackage.package_options));
          this.setState({
            showProdDetails: preSelectedPackage.package_name,
            selectedIndex: this.props.position,
          });
        } else {
          this.setState({ initialLoad: false });
        }
      }
    }
  }



  renderPlan = (planList) => {
    const moreProductOptions = planList;
    let listProducts = moreProductOptions.map((moreProduct, index) => {
      let checked = (this.state.selectedIndex == (index + 1) || (moreProduct.isSelected && this.state.initialLoad)) ? true : false;
      return (<div className="span3" id={"packagePanel"+(index+1)} key={"itmVl" + index}>
        <div className="r-panel1" key={"itmVl1" + index}>
          <p><input type="radio" id={index + 1} name="plans" value={moreProduct.title} checked={checked} onChange={this.onChange} /><span className="plans-radio-option">{moreProduct.title}</span></p>
          <span className="prod-tot">Total Price</span>
          <div className="input-prepend cus-input">
            <span className="add-on" id="sizing-addon2">$</span>
            <input type="text" className="form-control" id={"pl-TotalPrice"} value={moreProduct.price.toFixed(2)} />
          </div>
          <span className="prod-tot">Total Cost</span>
          <div className="input-prepend cus-input default-margin-tp-btm">
            <span className="add-on" id="sizing-addon2">$</span>
            <input type="text" className="form-control" id={"pl-TotalCost"} value={moreProduct.value.toFixed(2)} />
          </div>
          <span className="prod-tot">Total Profit</span>
          <div className="input-prepend cus-input default-margin-tp-btm">
            <span className="add-on" id="sizing-addon2">$</span>
            <input type="text" className="form-control" id={"pl-TotalProfit"} value={(moreProduct.price - moreProduct.value).toFixed(2)} />
          </div>
          {(checked || this.state.showProdDetails === moreProduct.title) ? this.renderPlanDetails(moreProduct.price, moreProduct.title) : null}
        </div>
      </div>)
    });
    return listProducts;
  }

  saveData(is_final_menu) {
    this.setState({ printMenu: !this.state.printMenu });
    let dealid = dealerData.dealid;
    let dealjacketid = dealerData.dealjacketid;
    let dealer_code = dealerData.dealer_code;
    let firstname = dealerData.user_first;
    let lastname = dealerData.user_last;

    let data = {
      "deal_id": dealid,
      "deal_jacket_id": dealjacketid,
      "dlr_cd": dealerData.dealer_code,
      "packages": []
    };
    let url = `${config.baseUrlPath}${config.printPortAPI}${config.fniMenuDealerApp}${config.version}/#/printselection/${this.state.dealid}/${this.state.dealjacketid}/${this.state.dealer_code}/${this.state.firstname}/${this.state.lastname}`;
    let selectedPackage = this.state.showProdDetails;
    this.props.saveData(data, selectedPackage, url).then((url) => {
      this.saveFinanceData(url,is_final_menu)
      this.setState({ printMenu: !this.state.printMenu });
    })
  }


  saveFinanceData(url,is_final_menu) {
    if (this.state.showProdDetails != "") {
      var request = JSON.stringify(this.CreateDealFinanceRequest());
      var requestGeneric = "{}";
      let callPromiseArr = [];
      callPromiseArr.push(
        HttpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/deal-finance-summary/`, 'post', request)
      )
      callPromiseArr.push(
        HttpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/generic-payment/`, 'post', requestGeneric)
      )
      Promise.all(callPromiseArr).then(response => {
        this.generatePdf(is_final_menu);
        // window.open(url);
      });
    } else {
      this.generatePdf(is_final_menu);
      // window.open(url);
    }
  }


  CreateDealFinanceRequest() {

    var residual_percentage = null;
    var annual_miles = null;
    var apr = null;
    var money_factor = null;
    var term = this.state.selectedTerm != '' ? this.state.selectedTerm.replace(" months", "").trim() : '';

    if ((term == "") || (term == null)) {
      term = this.props.termRateOptions.options.termrateoptions[0].term;
    }
    for (let i = 0; i < this.props.termRateOptions.options.termrateoptions.length; i++) {
      var termRateOption = this.props.termRateOptions.options.termrateoptions[i];
      if (termRateOption.term == term) {
        residual_percentage = (termRateOption.residual != null) ? termRateOption.residual : null;
        apr = (termRateOption.apr != null) ? termRateOption.apr : null;
        money_factor = (termRateOption.money_factor != null) ? termRateOption.money_factor : null;

      }
    };

    let request = {
      "term": parseFloat(term),
      "residual_percentage": parseFloat(residual_percentage),
      "apr": parseFloat(apr),
      "money_factor": parseFloat(money_factor)
    };
    return request;
  }

  getPlanList(props, isMouting) {
    let plan1Cost = 0,
      plan2Cost = 0,
      plan4Cost = 0,
      plan3Cost = 0;
    let price1Price = 0,
      price2Price = 0,
      price3Price = 0,
      price4Price = 0;
    let { packagesNames } = props;
    const packages = props.productPackageInfo;
    props.selectedPackageKeys.forEach((key, value) => {
      let plan = packages.get(value);
      if (!!plan) {
        switch (plan.packageType) {
          case 'plan1':
            plan1Cost += plan.cost;
            price1Price += plan.price
            break;
          case 'plan2':
            plan2Cost += plan.cost;
            price2Price += plan.price
            break;
          case 'plan3':
            plan3Cost += plan.cost;
            price3Price += plan.price
            break;
          case 'plan4':
            plan4Cost += plan.cost;
            price4Price += plan.price
            break;
        }
      }
    });
    if (isMouting) {
      return [{
        title: packagesNames.package1,
        value: plan1Cost,
        price: price1Price,
        isSelected: this.props.position == 1
      }, {
        title: packagesNames.package2,
        value: plan2Cost,
        price: price2Price,
        isSelected: this.props.position == 2
      }, {
        title: packagesNames.package3,
        value: plan3Cost,
        price: price3Price,
        isSelected: this.props.position == 3
      }, {
        title: packagesNames.package4,
        value: plan4Cost,
        price: price4Price,
        isSelected: this.props.position == 4
      }];
    }
    return [{
      title: packagesNames.package1,
      value: plan1Cost,
      price: price1Price
    }, {
      title: packagesNames.package2,
      value: plan2Cost,
      price: price2Price
    }, {
      title: packagesNames.package3,
      value: plan3Cost,
      price: price3Price
    }, {
      title: packagesNames.package4,
      value: plan4Cost,
      price: price4Price
    }];
  }
  componentWillMount() {
    const planList = this.getPlanList(this.props, true);
    this.setState({ planList });
  }
  componentWillReceiveProps(newProps) {

    if ((JSON.stringify(this.props) != JSON.stringify(newProps)) || (this.props.productPackageInfo != newProps.productPackageInfo)) {
      const planList = this.getPlanList(newProps, false);
      this.setState({ planList });
      this.props.dispatch(updateTotalPackagePrice(planList));
      let count = 0
      for (let key of newProps.userPrefCount.keys()) {
        count++;
      }
      if (newProps.initialLoadSuccess > count && newProps.dataChanged) {
        this.props.dispatch(set_selected_packageInfo_success({}))
        this.props.dispatch(getPaymentScenario_success([]));
        this.setState({ selectedIndex: null, showProdDetails: '' },
          () => {
            this.props.dispatch(resetDataChange(false))
          });
      }
    }
  }

  generatePdf(is_final_menu) {
    let loadData = [];
    loadData.push(this.props.getNameList(dealerData.dealjacketid, dealerData.dealid));
    loadData.push(this.props.getVehicleData(dealerData.dealjacketid, dealerData.dealid));
    loadData.push(this.props.getDealerPackageDetails(dealerData.dealjacketid, dealerData.dealid));
    loadData.push(this.props.getFinancialData(dealerData.dealjacketid, dealerData.dealid));
    loadData.push(this.props.getTradeinVehicles(dealerData.dealjacketid, dealerData.dealid));
    Promise.all(loadData).then(() => {
      this.createDataForPdf(dealerData.dealid, dealerData.dealjacketid, is_final_menu);
    });
  }

    createDataForPdf(dealId, dealjacketId,is_final_menu) {
    // let urlArr = window.location.href.split('/');

    let vehicleInfo = this.props.vehicleData.results[0];
    vehicleInfo['allowance'] = this.props.tradeinData.allowance;
    vehicleInfo['payoff'] = this.props.tradeinData.payoff;
    let data = {
      deal_id: dealId,
      deal_jacket_id: dealjacketId,
      dlr_cd:this.state.dealer_code,
      is_final_menu: is_final_menu,
      user_firstname: this.state.firstname,
      user_lastname: this.state.lastname,
      Customer_information: this.props.printNames.results[0],
      Vehicle_information: vehicleInfo,
      Deal_finance_summary: this.props.financialInfo,
      packages: this.props.dealerPackage
    };

    let mainUrl = `${config.emenuMobileGatewayAPI}/deal-jackets/${dealjacketId}/deals/${dealId}/menu_pdf/`;
    let axiosConfig = {
      headers: { 'Content-Type': 'text/JSON', 'Dealer-Code': (window.dealerData) ? window.dealerData.dealer_code : '1111132' }
    };
    HttpHelper(mainUrl, 'post', data).then((response) => {
      if (window.navigator.msSaveOrOpenBlob) {
        let mSeconds = new Date().getTime() / 1000;
        let filename = 'download' + mSeconds + '.pdf';
        let blobObject = new Blob([response]);
        window.navigator.msSaveOrOpenBlob(blobObject, filename);
        this.setState({ loader: false });
      } else {
        let blob = new Blob([response], { type: 'application/pdf' });
        let blobURL = window.URL.createObjectURL(blob);
        if(is_final_menu){
          window.location.reload();
        }
        window.open(blobURL);
      }
    }).catch((error) => {
    });
  }

  handlePrintFinalMenu(is_final_menu) {
    this.setState({ printFinalMenu: !this.state.printFinalMenu });
    let dealid = dealerData.dealid;
    let dealjacketid = dealerData.dealjacketid;
    let dealer_code = dealerData.dealer_code;
    let firstname = dealerData.user_first;
    let lastname = dealerData.user_last;
    let data = {
      "deal_id": dealid,
      "deal_jacket_id": dealjacketid,
      "dlr_cd": dealerData.dealer_code,
      "packages": []
    };
    let url = `${config.baseUrlPath}${config.printPortAPI}${config.fniMenuDealerApp}${config.version}/#/printFinalMenu/${dealid}/${dealjacketid}/${dealer_code}/${firstname}/${lastname}`;
    let selectedPackage = this.state.showProdDetails;
    this.props.saveData(data, selectedPackage, url).then((url) => {
      this.saveFinanceData(url,is_final_menu);
      this.setState({ printFinalMenu: !this.state.printFinalMenu });
    })
  }

  handleDeclinePackage(is_final_menu) {
    this.setState({ selectedIndex: null });
    let dealid = dealerData.dealid;
    let dealjacketid = dealerData.dealjacketid;
    let dealer_code = dealerData.dealer_code;
    let firstname = dealerData.user_first;
    let lastname = dealerData.user_last;
    let data = {
      "deal_id": dealid,
      "deal_jacket_id": dealjacketid,
      "dlr_cd": dealerData.dealer_code,
      "packages": []
    };
    let url = `${config.baseUrlPath}${config.printPortAPI}${config.fniMenuDealerApp}${config.version}/#/printFinalMenu/${dealid}/${dealjacketid}/${dealer_code}/${firstname}/${lastname}`;
    this.props.saveData(data, 'decline', url).then((url) => {
      // window.open(url, '_blank');
      this.generatePdf(is_final_menu)
    })
  }
  handlePresentationPackage() {
    let dealid = dealerData.dealid;
    let dealjacketid = dealerData.dealjacketid;
    let firstname = dealerData.user_first;
    let lastname = dealerData.user_last;
    let dealer_code = dealerData.dealer_code;
    let data = {
      "deal_id": dealid,
      "deal_jacket_id": dealjacketid,
      "dlr_cd": dealerData.dealer_code,
      "packages": []
    };

    let url = `${config.baseUrlPath}${config.presentationPortAPI}${config.fniMenuCustApp}${config.version}/index.html?dealjacketid=${this.state.dealjacketid}&dealid=${this.state.dealid}&dealer_code=${this.state.dealer_code}&deploy_env=${this.state.deploy_env}`;
    let selectedPackage = this.state.showProdDetails;
    this.props.saveData(data, selectedPackage, url).then((url) => {
      window.name = "Desking_" + dealjacketid + "_" + dealid;
      window.open(url, '_blank');
    })
  }
  render() {
    let dealid = dealerData.dealid;
    let dealjacketid = dealerData.dealjacketid;
    let firstname = dealerData.user_first;
    let lastname = dealerData.user_last;
    let buttonAttr = {
      disabled: this.props.disableControl
    };
    let selectedPackagePrice = 0;
    if ((this.state.showProdDetails != undefined) && (this.state.showProdDetails != "") && this.props.position) {
      selectedPackagePrice = 999;
    }
    else if ((this.state.showProdDetails != undefined) && (this.state.showProdDetails != "")) {
      selectedPackagePrice = this.props.totalPriceInfoList.filter(list => list.title == this.state.showProdDetails)[0].price;
    }
    const planList = this.state.planList;
    return (
      <div>
        <input type="hidden" id="totalPrice" value={selectedPackagePrice} />
        <div className="planList-tabs">
          {this.renderPlan(planList)}
        </div>
        <hr />
        <div className="span12">
          {this.props.disableControl ? <div className="alert alert-danger fade in">
            Please fix product pricing error(s) above in order to proceed!
            </div> : null}
          <button {...buttonAttr} className="btn btn-primary pull-right p-btn" id="PresentationButton" onClick={this.handlePresentationPackage}>Presentation</button>
          <button {...buttonAttr} className="btn btn-default pull-right p-btn" id="PrintMenuButton" onClick={this.saveData.bind(this,false)}>{this.state.printMenu ? 'Opening PDF...' : 'Print Menu'}</button>
          <button {...buttonAttr} className="btn btn-default pull-left p-btn" id="DeclinePackagesButton" onClick={this.handleDeclinePackage.bind(this,true)}>Decline Packages</button>
          <button {...buttonAttr} className="btn btn-default pull-left p-btn" id="PrintFinalMenuButton" onClick={() => { this.handlePrintFinalMenu(true) }} target="_blank">{this.state.printFinalMenu ? 'Opening PDF...' : 'Print Final Menu'}</button>
        </div>
      </div>
    )
  }
}

const mapStateToprops = state => ({
  plan1: state.rates.plan1,
  plan2: state.rates.plan2,
  plan3: state.rates.plan3,
  plan4: state.rates.plan4,
  price1: state.rates.planPrice.get('price1'),
  price2: state.rates.planPrice.get('price2'),
  price3: state.rates.planPrice.get('price3'),
  price4: state.rates.planPrice.get('price4'),
  selectedPackageKeys: state.product.selectedPackageKeys,
  productPackageInfo: state.product.productPackageInfo,
  disableControl: state.product.disableControl,
  packagesNames: state.packagesNames,
  termRateOptions: state.termRateOptions,
  totalPriceInfoList: state.product.totalPriceInfoList,
  savedPriceInfo: state.rates.savedPriceInfo,
  position: state.rates.position,
  printNames: state.printNames,
  vehicleData: state.vehicleData,
  financialInfo: state.financialInfo,
  dealerPackage: state.dealerPackage,
  tradeinData: state.tradeinData,
  userPackageInfo: state.rates.userPackageInfo,
  dataChanged: state.product.dataChanged,
  initialLoad: state.product.initialLoad,
  initialLoadSuccess: state.product.initialLoadSuccess,
  userPrefCount: state.rates.userPrefernce,
});

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({
      getFinancialData, getNameList, getVehicleData, getDealerPackageDetails, getTradeinVehicles
    }, dispatch), dispatch
  }
}


export default connect(mapStateToprops, mapDispatchToProps)(PlanOption);
