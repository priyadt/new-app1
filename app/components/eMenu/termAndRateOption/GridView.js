import React, { Component } from 'react';
var axios = require('axios');
import { findDOMNode } from 'react-dom';
import HttpHelper from '../../../utils/httpHelper.js';
import config from '../../../config.js';
import { dealerData, populateDealerData } from '../../../helper/index.js';
import { connect } from 'react-redux';
import { setTermRateOptions, getUserSavedData } from '../../../actions/actions';


class GridView extends React.Component {
  constructor(props) {
    super(props);
    populateDealerData();
    props.dispatch(getUserSavedData());

    this.state = {
      options: this.props.options,
      selectedOption: this.props.selectedOption,
      financialInfo: {},
      isLoading: true,
      rate: '',
      isRateError: false,
      rateMsg: '',
      isTerm2Error: false,
      isTerm3Error: false,
      isTerm4Error: false,
      termMsg: 'Term',
      restarting: false,
      dealjacketid: dealerData.dealjacketid,
      dealid: dealerData.dealid,
      deal_type: dealerData.deal_type,
      dealer_code: dealerData.dealer_code,
      serviceDeal: {},
      isScenarioOpt2Requested: false,
      isScenarioOpt3Requested: false,
      isScenarioOpt4Requested: false,

      isScenarioOpt2Responded: false,
      isScenarioOpt3Responded: false,
      isScenarioOpt4Responded: false

    }
    this.updatePayment = this.updatePayment.bind(this);
    this.updateMonthCount = this.updateMonthCount.bind(this);
    this.setInitialValues = this.setInitialValues.bind(this);
    this.changeRate = this.changeRate.bind(this);
    this.changeTerm = this.changeTerm.bind(this);
    this.changePayment = this.changePayment.bind(this);
    this.changeBalloonPayment = this.changeBalloonPayment.bind(this);
    this.processOptions = this.processOptions.bind(this);
    this.submitHandle = this.submitHandle.bind(this);
    this.getScenarioPayment = this.getScenarioPayment.bind(this);
    this.reRender = this.reRender.bind(this);
  }

  componentWillMount() {
    this.getInitialValues(this.state.selectedOption);
    this.getDealTerms();
  }

  reRender(){
    let currentObj = this;
    this.setState({restarting: true}, function(){
      currentObj.setState({restarting: false})
    });
  }
  getDealTerms() {
    let dealItemsUrl = `${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/deal-term-rate-options/`;
    let currentObj = this;
    HttpHelper(dealItemsUrl, 'get', '').then(function (data) {
      currentObj.setState({ dealTerms: data }, () => {
        this.reRender();
        if (data.termrateoptions && data.termrateoptions.length > 1){
          this.props.openGridView(true);
        }
      });
    }.bind(this));
  }
  getScenarioData(option) {
    if (this.state.financialInfo.finance_method === 'LEAS') {
      return [{
        "scenario_id": "1", "term": option.term, "rate_type": "Apr", "apr": option.apr,
        "money_factor": option.money_factor, "residual_percent": option.residual, "products": []
      }]
    } else if (this.state.financialInfo.finance_method === 'RETL') {
      return [{
        "scenario_id": "1", "term": option.term, "rate_type": "Apr", "apr": option.apr, "products": []
      }]
    } else if (this.state.financialInfo.finance_method === 'BALL') {
      return [{
        "scenario_id": "1", "term": option.term, "rate_type": "Apr", "apr": option.apr, "residual_percent": option.residual, "products": []
      }]
    } else {
      return [{ "scenario_id": "1", "term": option.term, "rate_type": "Apr", "apr": option.apr, "products": [] }]
    }
  }
  getScenarioPayment(option, optionType) {
    let currentObj = this;

    switch (optionType) {
      case 'option2':
        currentObj.setState({
          isScenarioOpt2Requested: true
        })
        break;
      case 'option3':
        currentObj.setState({
          isScenarioOpt3Requested: true
        })
        break;
      case 'option4':
        currentObj.setState({
          isScenarioOpt4Requested: true
        })
        break;
    }


    let dealPaymentUrl = `${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/scenarios/`;

    let reqData = this.getScenarioData(option);

    let paymentamount = '';
    let residualdollar = '';


    HttpHelper(dealPaymentUrl, 'post', reqData).then(function (data) {

      paymentamount = data[0]['payments'][0]['paymentamount']
      residualdollar = data[0]['payments'][0]['residualdollar']

      switch (optionType) {
        case 'option1':
          if (typeof paymentamount === "undefined")
            currentObj.refs.option1Monthly_payment.value = 0;
          else
            currentObj.refs.option1Monthly_payment.value = paymentamount;

          if (typeof residualdollar === "undefined")
            currentObj.refs.option1Balloon_payment.value = 0;
          else
            currentObj.refs.option1Balloon_payment.value = residualdollar;

          break;
        case 'option2':
          if (typeof paymentamount === "undefined")
            currentObj.refs.option2Monthly_payment.value = 0;
          else
            currentObj.refs.option2Monthly_payment.value = paymentamount.toFixed(2);

          if (typeof currentObj.refs.option2Balloon_payment !== "undefined") {
            if (typeof residualdollar === "undefined")
              currentObj.refs.option2Balloon_payment.value = 0;
            else
              currentObj.refs.option2Balloon_payment.value = residualdollar;
          }

          currentObj.setState({
            isScenarioOpt2Responded: true,
            option2ScnPayment: paymentamount,
            option2BlnPayment: residualdollar
          });

          if (currentObj.refs.option3Box.checked == false && currentObj.refs.option4Box.checked == false) {
            currentObj.prepareDealTermsService();
          }
          break;
        case 'option3':

          if (typeof paymentamount === "undefined")
            currentObj.refs.option3Monthly_payment.value = 0;
          else
            currentObj.refs.option3Monthly_payment.value = paymentamount.toFixed(2);

          if (typeof currentObj.refs.option3Balloon_payment !== "undefined") {
            if (typeof residualdollar === "undefined")
              currentObj.refs.option3Balloon_payment.value = 0;
            else
              currentObj.refs.option3Balloon_payment.value = residualdollar;
          }

          currentObj.setState({
            isScenarioOpt3Responded: true,
            option3ScnPayment: paymentamount,
            option3BlnPayment: residualdollar
          })

          if (currentObj.refs.option2Box.checked == false && currentObj.refs.option4Box.checked == false) {
            currentObj.prepareDealTermsService();
          } else if ((currentObj.refs.option2Box.checked && currentObj.refs.option3Box.checked && currentObj.refs.option4Box.checked == false)) {
            currentObj.prepareDealTermsService();
          }
          break;

        case 'option4':
          if (typeof paymentamount === "undefined")
            currentObj.refs.option4Monthly_payment.value = 0;
          else
            currentObj.refs.option4Monthly_payment.value = paymentamount.toFixed(2);

          if (typeof currentObj.refs.option4Balloon_payment !== "undefined") {
            if (typeof residualdollar === "undefined")
              currentObj.refs.option4Balloon_payment.value = 0;
            else
              currentObj.refs.option4Balloon_payment.value = residualdollar;
          }
          currentObj.setState({
            isScenarioOpt4Responded: true,
            option4ScnPayment: paymentamount,
            option4BlnPayment: residualdollar
          });

          if (currentObj.refs.option2Box.checked == false && currentObj.refs.option3Box.checked == false) {
            currentObj.prepareDealTermsService();
          } else if ((currentObj.refs.option2Box.checked && currentObj.refs.option3Box.checked && currentObj.refs.option4Box.checked) ||
            (currentObj.refs.option2Box.checked && currentObj.refs.option4Box.checked) ||
            (currentObj.refs.option3Box.checked && currentObj.refs.option4Box.checked)) {
            currentObj.prepareDealTermsService();
          }
          break;

      }

    });
  }

  checkTerm(target){ //returns true if term length is valid and false if not, and prepares appropriate error message
    if (!(this.refs[target])){
      return false;
    }
    else if (this.state.financialInfo.finance_method === 'RETL'){
      this.setState({termMsg: 'Term'+'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+'Cannot exceed 104'});
      return ((this.refs[target].value < 105) && (this.refs[target].value >= 0));
    }
    else{
      this.setState({termMsg: 'Term'+'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+'Cannot exceed 83'});
      return ((this.refs[target].value < 84) && (this.refs[target].value > 0));
    }
  }

  checkForErrors() {
    let isErrored = 'yes';
    let isChecked = 'no';

    if (this.refs.option2Box.checked === true) {
      isChecked = 'yes';
      if (this.refs.option2Term.value !== '' && this.checkTerm('option2Term')) {
        this.refs.option2Term.className = "form-control borderd-hfit ";
        isErrored = 'yes';
      }
      else {
        this.refs.option2Term.className = "form-control borderd-hfit err";
        isErrored = 'no';
        return isErrored;
      }

      if (this.refs.option2CashApr.value !== '') {
        this.refs.option2CashApr.className = "form-control borderd-hfit ";
        isErrored = 'yes';
      } else {
        this.refs.option2CashApr.className = "form-control borderd-hfit err";
        isErrored = 'no';
        return isErrored;
      }

      if (this.refs.option2Residual_percentage && this.refs.option2Residual_percentage.value !== '') {
        this.refs.option2Residual_percentage.className = "form-control borderd-hfit ";
        isErrored = 'yes';
      } else {
        if (this.refs.option2Residual_percentage) {
          this.refs.option2Residual_percentage.className = "form-control borderd-hfit err";
          isErrored = 'no';
          return isErrored;
        } else isErrored = 'yes';
      }



    } else {
      if (this.refs.option2Term) this.refs.option2Term.className = "form-control borderd-hfit ";
      if (this.refs.option2Residual_percentage) this.refs.option2Residual_percentage.className = "form-control borderd-hfit ";
      if (this.refs.option2CashApr) this.refs.option2CashApr.className = "form-control borderd-hfit ";
    }

    if (this.refs.option3Box.checked === true) {
      isChecked = 'yes';
      if (this.refs.option3Term.value !== '' && this.checkTerm('option3Term')) {
        this.refs.option3Term.className = "form-control borderd-hfit ";
        isErrored = 'yes';
      } else {
        this.refs.option3Term.className = "form-control borderd-hfit err";
        isErrored = 'no';
        return isErrored;
      }

      if (this.refs.option3CashApr.value !== '') {
        this.refs.option3CashApr.className = "form-control borderd-hfit ";
        isErrored = 'yes';
      } else {
        this.refs.option3CashApr.className = "form-control borderd-hfit err";
        isErrored = 'no';
        return isErrored;
      }

      if (this.refs.option3Residual_percentage && this.refs.option3Residual_percentage.value !== '') {
        this.refs.option3Residual_percentage.className = "form-control borderd-hfit ";
        isErrored = 'yes';
      } else {
        if (this.refs.option3Residual_percentage) {
          this.refs.option3Residual_percentage.className = "form-control borderd-hfit err";
          isErrored = 'no';
          return isErrored;
        } else isErrored = 'yes';
      }

    } else {
      if (this.refs.option3Term) this.refs.option3Term.className = "form-control borderd-hfit ";
      if (this.refs.option3Residual_percentage) this.refs.option3Residual_percentage.className = "form-control borderd-hfit ";
      if (this.refs.option3CashApr) this.refs.option3CashApr.className = "form-control borderd-hfit ";
    }

    if (this.refs.option4Box.checked === true) {
      isChecked = 'yes';
      if (this.refs.option4Term.value !== '' && this.checkTerm('option4Term')) {
        this.refs.option4Term.className = "form-control borderd-hfit ";
        isErrored = 'yes';
      } else {
        this.refs.option4Term.className = "form-control borderd-hfit err";
        isErrored = 'no';
        return isErrored;
      }

      if (this.refs.option4CashApr.value !== '') {
        this.refs.option4CashApr.className = "form-control borderd-hfit ";
        isErrored = 'yes';
      } else {
        this.refs.option4CashApr.className = "form-control borderd-hfit err";
        isErrored = 'no';
        return isErrored;

      }

      if (this.refs.option4Residual_percentage && this.refs.option4Residual_percentage.value !== '') {
        this.refs.option4Residual_percentage.className = "form-control borderd-hfit ";
        isErrored = 'yes';
      } else {
        if (this.refs.option4Residual_percentage) {
          this.refs.option4Residual_percentage.className = "form-control borderd-hfit err";
          isErrored = 'no';
          return isErrored;
        } else isErrored = 'yes';
      }
    } else {
      if (this.refs.option4Term) this.refs.option4Term.className = "form-control borderd-hfit ";
      if (this.refs.option4Residual_percentage) this.refs.option4Residual_percentage.className = "form-control borderd-hfit ";
      if (this.refs.option4CashApr) this.refs.option4CashApr.className = "form-control borderd-hfit ";
    }


    if (isChecked === 'no') return 'yes';
    else
      return isErrored;
  }

  submitHandle() {
    let dealTerms = this.state.dealTerms;

    let formData = [];

    let option1 = {};

    var termTooHigh = false;

    option1.term = this.refs.option1Term.value;
    if (this.refs.option1Monthly_payment) {
      option1.payment = this.refs.option1Monthly_payment.value;
    }
    if (this.refs.option1Balloon_payment) {
      option1.ballon_payment = this.refs.option1Balloon_payment.value;
    }

    if (this.refs.option1Money_factor) option1.money_factor = this.refs.option1Money_factor.value;
    if (this.refs.option1Residual_percentage) option1.residual = this.refs.option1Residual_percentage.value;
    if (this.refs.option1CashApr) option1.apr = this.refs.option1CashApr.value;
    option1.position = '1';
    option1.deal_id = this.state.dealid;
    option1.deal_jacket_id = this.state.dealjacketid;
    option1.dlr_cd = this.state.dealer_code;

    let option2 = {};
    if (this.refs.option2Box.checked === true) {

      if (this.refs.option2Term.value !== '' && this.checkTerm('option2Term')) {
        option2.term = this.refs.option2Term.value;
        this.refs.option2Term.className = "form-control borderd-hfit ";
      }
      else {
        this.refs.option2Term.className = "form-control borderd-hfit err";
        this.checkForErrors();
        if (!isNaN(this.refs.option2Term.value)) this.setState({isTerm2Error: true});
        termTooHigh = true;
      }

      if (this.refs.option2Monthly_payment.value !== '') {
        option2.monthly_payment = this.refs.option2Monthly_payment.value;

      }
      if (this.refs.option2Balloon_payment) {
        option2.ballon_payment = this.refs.option2Balloon_payment.value;
      }

      if (this.refs.option2Money_factor) {
        option2.money_factor = this.refs.option2Money_factor.value;
      }
      if (this.refs.option2Residual_percentage && this.refs.option2Residual_percentage.value !== '') {
        option2.residual = this.refs.option2Residual_percentage.value;
        this.refs.option2Residual_percentage.className = "form-control borderd-hfit ";
      } else {
        if (this.refs.option2Residual_percentage) {
          this.refs.option2Residual_percentage.className = "form-control borderd-hfit err";
          this.checkForErrors();
        }
      }

      if (this.refs.option2CashApr.value !== '') {
        option2.apr = this.refs.option2CashApr.value;
        this.refs.option2CashApr.className = "form-control borderd-hfit ";
      } else { this.refs.option2CashApr.className = "form-control borderd-hfit err"; this.checkForErrors(); }


      option2.position = '2';
      option2.deal_id = this.state.dealid;
      option2.deal_jacket_id = this.state.dealjacketid;
      option2.dlr_cd = this.state.dealer_code;

      if (this.refs.option2CashApr.value !== '' && !termTooHigh) {
        var scenarioPayment = this.getScenarioPayment(option2, 'option2');
        option2.payment = scenarioPayment;
        option2.ballon_payment = scenarioPayment;
      }

    }

    let option3 = {};
    if (this.refs.option3Box.checked == true) {
      if (this.refs.option3Term.value !== ''  && this.checkTerm('option3Term')) {
        option3.term = this.refs.option3Term.value;
        this.refs.option3Term.className = "form-control borderd-hfit ";
      } else { this.refs.option3Term.className = "form-control borderd-hfit err"; this.checkForErrors(); if (!isNaN(this.refs.option3Term.value)) this.setState({isTerm3Error: true}); termTooHigh = true; }

      if (this.refs.option3Monthly_payment.value !== '') {
        option3.monthly_payment = this.refs.option3Monthly_payment.value;
      }

      if (this.refs.option3Balloon_payment) {
        option3.ballon_payment = this.refs.option3Balloon_payment.value;
      }

      if (this.refs.option3Money_factor) {
        option3.money_factor = this.refs.option3Money_factor.value;
      }
      if (this.refs.option3Residual_percentage && this.refs.option3Residual_percentage.value !== '') {
        option3.residual = this.refs.option3Residual_percentage.value;
        this.refs.option3Residual_percentage.className = "form-control borderd-hfit "
      } else {
        if (this.refs.option3Residual_percentage) {
          this.refs.option3Residual_percentage.className = "form-control borderd-hfit err";
          this.checkForErrors();
        }
      }

      if (this.refs.option3CashApr.value !== '') {
        option3.apr = this.refs.option3CashApr.value;
        this.refs.option3CashApr.className = "form-control borderd-hfit "
      } else { this.refs.option3CashApr.className = "form-control borderd-hfit err"; this.checkForErrors(); }


      option3.position = '3';
      option3.deal_id = this.state.dealid;
      option3.deal_jacket_id = this.state.dealjacketid;
      option3.dlr_cd = this.state.dealer_code;

      if (this.refs.option3CashApr.value !== '' && !termTooHigh) {
        var scenarioPayment = this.getScenarioPayment(option3, 'option3');
        option3.payment = scenarioPayment;
        option3.ballon_payment = scenarioPayment;

      }
    }

    let option4 = {};
    if (this.refs.option4Box.checked == true) {

      if (this.refs.option4Term.value !== ''  && this.checkTerm('option4Term')) {
        option4.term = this.refs.option4Term.value;
        this.refs.option4Term.className = "form-control borderd-hfit ";
      } else { this.refs.option4Term.className = "form-control borderd-hfit err"; this.checkForErrors(); if (!isNaN(this.refs.option4Term.value)) this.setState({isTerm4Error: true}); termTooHigh = true; }

      if (this.refs.option4Monthly_payment.value !== '') {
        option4.monthly_payment = this.refs.option4Monthly_payment.value;
      }

      if (this.refs.option4Balloon_payment) {
        option4.ballon_payment = this.refs.option4Balloon_payment.value;
      }

      if (this.refs.option4Money_factor) {
        option4.money_factor = this.refs.option4Money_factor.value;
      }

      if (this.refs.option4Residual_percentage && this.refs.option4Residual_percentage.value !== '') {
        option4.residual = this.refs.option4Residual_percentage.value;
        this.refs.option4Residual_percentage.className = "form-control borderd-hfit ";
      } else {
        if (this.refs.option4Residual_percentage) {
          this.refs.option4Residual_percentage.className = "form-control borderd-hfit err";
          this.checkForErrors();

        }
      }

      if (this.refs.option4CashApr.value !== '') {
        option4.apr = this.refs.option4CashApr.value;
        this.refs.option4CashApr.className = "form-control borderd-hfit ";
      } else { this.refs.option4CashApr.className = "form-control borderd-hfit err"; this.checkForErrors(); }


      option4.position = '4';
      option4.deal_id = this.state.dealid;
      option4.deal_jacket_id = this.state.dealjacketid;
      option4.dlr_cd = this.state.dealer_code;

      if (this.refs.option4CashApr.value !== '' && !termTooHigh) {
        var scenarioPayment = this.getScenarioPayment(option4, 'option4');
        option4.payment = scenarioPayment;
        option4.ballon_payment = scenarioPayment;

      }

    }

    if (termTooHigh){ return; }
    formData.push(option1);
    if (this.refs.option2Box.checked === true) formData.push(option2);
    if (this.refs.option3Box.checked === true) formData.push(option3);
    if (this.refs.option4Box.checked === true) formData.push(option4);
    let deal = {};
    deal.dlr_cd = this.state.dealer_code;
    deal.deal_jacket_id = this.state.dealjacketid;
    deal.deal_id = this.state.dealid;
    deal.prod_dlr_id = '';
    deal.termrateoptions = formData;
    this.props.dispatch(setTermRateOptions(deal));
    this.setState({
      serviceDeal: deal
    })

    if (!this.refs.option2Box.checked && !this.refs.option3Box.checked && !this.refs.option4Box.checked) {
      this.processDealTermsService(deal)
    }


  }
  prepareDealTermsService() {
    let currentObj = this;
    let deal = this.state.serviceDeal;
    setTimeout(function () {
      if (currentObj.refs.option2Box.checked && currentObj.refs.option3Box.checked && currentObj.refs.option4Box.checked) {
        if (currentObj.state.isScenarioOpt2Responded && currentObj.state.isScenarioOpt3Responded && currentObj.state.isScenarioOpt4Responded)
          currentObj.processDealTermsService(deal);
      } else if (currentObj.refs.option2Box.checked && currentObj.refs.option3Box.checked) {
        if (currentObj.state.isScenarioOpt2Responded && currentObj.state.isScenarioOpt3Responded)
          currentObj.processDealTermsService(deal);

      } else if (currentObj.refs.option4Box.checked) {
        if (currentObj.state.isScenarioOpt4Responded)
          currentObj.processDealTermsService(deal);
      } else if (currentObj.refs.option3Box.checked) {
        if (currentObj.state.isScenarioOpt3Responded)
          currentObj.processDealTermsService(deal);
      } else if (currentObj.refs.option2Box.checked) {
        if (currentObj.state.isScenarioOpt2Responded)
          currentObj.processDealTermsService(deal);
      }

    }, 2000);
    return true;
  }

  processDealTermsService(deal) {
    if (this.state.option2ScnPayment && this.refs.option2Box.checked === true) {
      let scn2 = this.state.option2ScnPayment;
      let bln2 = this.state.option2BlnPayment;
      let opts = this.state.serviceDeal;
      if (opts.termrateoptions[1].hasOwnProperty("payment")) {
        opts.termrateoptions[1].payment = scn2;
      }
      if (opts.termrateoptions[1].hasOwnProperty("ballon_payment")) {
        opts.termrateoptions[1].ballon_payment = bln2;
      }
      this.setState({
        serviceDeal: opts
      });

    }


    if (this.state.option3ScnPayment !== '' && this.refs.option3Box.checked === true) {
      let scn3 = this.state.option3ScnPayment;
      let bln3 = this.state.option3BlnPayment;
      let opts = this.state.serviceDeal;
      if (this.refs.option2Box.checked === true) {
        if (opts.termrateoptions[2].hasOwnProperty("payment")) {
          opts.termrateoptions[2].payment = scn3;

        }
      } else {
        if (opts.termrateoptions[1].hasOwnProperty("payment")) {
          opts.termrateoptions[1].payment = scn3;

        }
      }

      if (this.refs.option2Box.checked === true) {
        if (opts.termrateoptions[2].hasOwnProperty("ballon_payment")) {
          opts.termrateoptions[2].ballon_payment = bln3;

        }
      } else {
        if (opts.termrateoptions[1].hasOwnProperty("ballon_payment")) {
          opts.termrateoptions[1].ballon_payment = bln3;

        }
      }
      this.setState({
        serviceDeal: opts
      });
    }

    if (this.state.option4ScnPayment !== '' && this.refs.option4Box.checked === true) {
      let scn4 = this.state.option4ScnPayment;
      let bln4 = this.state.option4BlnPayment;
      let opts = this.state.serviceDeal;

      if (this.refs.option2Box.checked && this.refs.option3Box.checked) {
        if (opts.termrateoptions[3].hasOwnProperty("payment")) {
          opts.termrateoptions[3].payment = scn4;
        }
        if (opts.termrateoptions[3].hasOwnProperty("ballon_payment")) {
          opts.termrateoptions[3].ballon_payment = bln4;
        }
      } else if (this.refs.option3Box.checked || this.refs.option2Box.checked) {
        if (opts.termrateoptions[2].hasOwnProperty("payment")) {
          opts.termrateoptions[2].payment = scn4;
        }
        if (opts.termrateoptions[2].hasOwnProperty("ballon_payment")) {
          opts.termrateoptions[2].ballon_payment = bln4;
        }

      } else {
        if (opts.termrateoptions[1].hasOwnProperty("payment")) {
          opts.termrateoptions[1].payment = scn4;
        }
        if (opts.termrateoptions[1].hasOwnProperty("ballon_payment")) {
          opts.termrateoptions[1].ballon_payment = bln4;
        }
      }

      this.setState({
        serviceDeal: opts
      });
    }




    let dealPostUrl = `${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/deal-term-rate-options/`;

    let currentObj = this;
    let processDeal;
    if (this.checkForErrors() === 'yes') {

      if (!this.refs.option2Box.checked && !this.refs.option3Box.checked && !this.refs.option4Box.checked)
        processDeal = deal
      else processDeal = currentObj.state.serviceDeal;


      this.props.dispatch(setTermRateOptions(processDeal));
      HttpHelper(dealPostUrl, 'post', processDeal).then(function (data) {
        currentObj.props.promot().then(() => {
          this.props.hasRenderedPackagePmt(false);
          if (!this.refs.option2Box.checked && !this.refs.option3Box.checked && !this.refs.option4Box.checked){
            this.props.openGridView(false);
          }
        });
      }.bind(this));
    }
  }

  updateMonthCount(event) {

    let updatedPayment = parseInt(this.state.rate) * parseInt(event.target.value);
    this.setState({ monthCount: event.target.value, totalPayment: updatedPayment })
  }

  updatePayment(event) {
    let updatedPayment = parseInt(this.state.monthCount) * parseInt(event.target.value);
    this.setState({ rate: event.target.value, totalPayment: updatedPayment });
  }

  getInitialValues = (selectedOption) => {
    let currentObj = this;
    let apiUrl = `${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/deal-finance-summary/`;

      HttpHelper(apiUrl, 'get', '').then(function (data) {
        currentObj.setInitialValues(data);
      }.bind(this));

  }
  setInitialValues(financialData) {
    const type = (financialData.finance_method === 'RETL' && (financialData.term === 0 || financialData.term === 1)) ? 'CASH' : financialData.finance_method;
    financialData.finance_method = type;
    this.setState({
      financialInfo: financialData,
      isLoading: false
    });
  }
  handleKeyPress(event, target, integerDigits, floatDigits){
    //this event handler takes the event, the ref of the field, and the number of allowed digits before and after the decimal point
    //it prevents keypresses from going through if the user tries to type a non-numeric character or makes the number too big
    let invalidInput = false;
    let cursorStart = this.refs[target].selectionStart;
    let cursorEnd = this.refs[target].selectionEnd;
    let fieldValue = this.refs[target].value;
    let isFloat = fieldValue.indexOf(".") >= 0;

    if ((/[^\d.]/.test(event.key))){ //only allow digits and a decimal point
      invalidInput = true;
    }
    else if (cursorStart != cursorEnd){ //if the user has selected some text in the field and is trying to type over it
      if ((isFloat || (floatDigits <= 0)) && (event.key == ".") && (!((cursorStart <= fieldValue.indexOf(".")) && (cursorEnd > fieldValue.indexOf("."))))){
        //allow the user to type over the selected text unless they're trying to add an invalid decimal point
        invalidInput = true;
      }
    }
    else if ((event.key == ".")  && (isFloat || (floatDigits <= 0))){ //don't allow the user to enter more than 1 decimal point; don't allow decimal point for integer-only fields
      invalidInput = true;
    }
    else { //the key pressed is a number or valid decimal point, and the user is not trying to type over something
      if (isFloat){ //if the number in the field is a decimal
        let splitField = fieldValue.split(".", 2);
        if ((cursorStart <= fieldValue.indexOf(".")) && (splitField[0].length >= integerDigits)){ //stop the user entering an integer that's too long
          invalidInput = true;
        }
        else if (splitField[1].length >= floatDigits){ //stop the user entering a decimal that's too long
          invalidInput = true;
        }
      }
      else { //if the number in the field is an integer
        if ((fieldValue.length >= integerDigits) && (event.key != ".")){ //don't let the integer get too long, but allow a decimal point at the end
          invalidInput = true;
        }
      }
    }

    if (invalidInput){
      event.preventDefault();
      event.stopPropagation();
    }
  }
  formatInput(target, integerDigits, floatDigits){
    //this function takes a ref to a field, and the number of allowed digits before and after the decimal point
    //it removes invalid characters and trims the number into the correct format
    //it should be called in onChange handlers to prevent the user from pasting invalid input into the field
    let fieldValue = this.refs[target].value;
    let cursorLocation = this.refs[target].selectionStart;
    let formattedInput = fieldValue.replace(/[^\d.]/g, ''); //only allow numeric characters and the decimal point
    if (formattedInput.indexOf(".") >= 0){  //if the number is a decimal
      formattedInput = formattedInput.split(".", 2); //take it apart
      formattedInput = formattedInput[0].substring(formattedInput[0].length-integerDigits) + "." + formattedInput[1].substring(0,floatDigits); //put it back together and remove excess numbers
    }
    else { //if the number is an integer
      formattedInput = formattedInput.substring(0,integerDigits); //remove excess numbers
    }

    this.refs[target].value = formattedInput;
    this.refs[target].selectionStart = cursorLocation; //prevents the cursor from jumping around when the field needs to be adjusted
    this.refs[target].selectionEnd = cursorLocation; //same as above line
  }

  changeApr(target, factorRef, event) {
    this.refs[target.substring(0, 7) + "Monthly_payment"].value = '';
    if (this.refs[target.substring(0, 7) + "Balloon_payment"] && this.refs[target.substring(0, 7) + "Balloon_payment"].value) this.refs[target.substring(0, 7) + "Balloon_payment"].value = '';

    this.formatInput(target, 2, 5);

    let cVal = event.target.value;
    if (isNaN(this.refs[target].value)) {
      this.refs[target].className = "form-control borderd-hfit err";
    } else if (parseFloat(this.refs[target].value) > 99.99) {
      this.refs[target].className = "form-control borderd-hfit err";
    } else {
      this.refs[target].className = "form-control borderd-hfit";
      this.refs[target].className = "form-control borderd-hfit";
      if (factorRef !== '') this.refs[factorRef].value = parseFloat((this.refs[target].value / 2400).toFixed(5));
      this.props.hasChangedTermOptionsData(true);
    }
  }
  changeRate(target, event) {
    this.refs[target.substring(0, 7) + "Monthly_payment"].value = '';
    if (this.refs[target.substring(0, 7) + "Balloon_payment"] && this.refs[target.substring(0, 7) + "Balloon_payment"].value) this.refs[target.substring(0, 7) + "Balloon_payment"].value = '';

    this.formatInput(target, 2, 2);

    let cVal = event.target.value;
    if (isNaN(this.refs[target].value)) {
      this.refs[target].className = "form-control borderd-hfit err";
    } else if (parseFloat(this.refs[target].value) > 99.99) {
      this.refs[target].className = "form-control borderd-hfit err";
    } else {
      this.refs[target].className = "form-control borderd-hfit";
    }


    if (isNaN(event.target.value)) {
      this.setState({
        rate: cVal,
        isRateError: true,
        rateMsg: 'Please Enter Numeric Values'
      });
    } else if (parseFloat(cVal) > 99.9999) {

      this.setState({
        rate: cVal,
        isRateError: true,
        rateMsg: 'Value Should not Exceed 99.9999'
      });
    } else {
      this.setState({
        rate: cVal,
        isRateError: false,
        rateMsg: ''
      });
      this.props.hasChangedTermOptionsData(true);
    }
  }

  processOptions(target, status) {
    switch (target) {
      case 'option2Term':
        this.refs.option2Box.checked = status;
        break;
      case 'option3Term':
        this.refs.option3Box.checked = status;
        break;
      case 'option4Term':
        this.refs.option4Box.checked = status;
        break;
    }
  }

  changeTerm(target, event) {
    let termNum = target.substring(6,7);
    this.refs["option"+termNum+"Monthly_payment"].value = '';
    if (this.refs["option"+termNum+"Balloon_payment"] && this.refs["option"+termNum+"Balloon_payment"].value) this.refs[target.substring(0,7)+"Balloon_payment"].value = '';

    this.formatInput(target, 3, 0);

    if (this.refs[target].value == '') {
      this.processOptions(target, false);
    }
    else if (isNaN(this.refs[target].value)) {
      this.refs[target].className = "form-control borderd-hfit err";
      this.processOptions(target, true);
    } else if (this.refs[target].value !== '' && !this.checkTerm(target)) {
      this.refs[target].className = "form-control borderd-hfit err";
      this.processOptions(target, true);
      this.setState({['isTerm'+termNum+'Error']: true});
    } else {
      this.refs[target].className = "form-control borderd-hfit";
      this.setState({['isTerm'+termNum+'Error']: false});
      this.processOptions(target, true);
      this.props.hasChangedTermOptionsData(true);

    }

  }
  changePayment(target, event) {
    if (isNaN(this.refs[target].value)) {
      this.refs[target].className = "form-control borderd-hfit err";
    } else if (parseInt(this.refs[target].value) > 999) {
      this.refs[target].className = "form-control borderd-hfit err";
    } else {
      this.refs[target].className = "form-control borderd-hfit";
    }

  }
  changeBalloonPayment(target, event) {
    if (isNaN(this.refs[target].value)) {
      this.refs[target].className = "form-control borderd-hfit err";
    } else if (parseInt(this.refs[target].value) > 999) {
      this.refs[target].className = "form-control borderd-hfit err";
    } else {
      this.refs[target].className = "form-control borderd-hfit";
    }

  }

  render() {
    if (this.state.restarting){
      return null;
    }

    let dtls = this.state;
    let options = this.state.options;

    if (dtls.dealTerms){
      if (dtls.dealTerms.termrateoptions){
        let sortedTermRateOptions =  dtls.dealTerms.termrateoptions.sort((a, b) => a.position > b.position);
        dtls.dealTerms.termrateoptions = sortedTermRateOptions;
      }
    }
    const { financialInfo } = this.state;
    return (
      <div style={this.props.showGridView ? {} : {display: 'none'}}>
        {
          [...options].map((option, i) =>
            <div id={option.title} key={i} className="span3">
              {
                !dtls.isLoading ?
                  <div className="r-panel">
                    <p>{option.name !== 'option 1' ?
                      <input type="checkbox" id="tr-option" name={option.name} ref={option.title + 'Box'}
                        defaultChecked={(dtls.dealTerms ?
                          (dtls.dealTerms.termrateoptions[option.pointer] ? true : false) : false)} />
                      :
                      null} {option.name} </p>
                    <div className="lessPad">
                      {financialInfo.finance_method === 'CASH' &&
                        <div className="cashDtlsForm">
                          <label className="opt-label">Term</label>
                          <div className="input-prepend input-append default-margin-tp-btm cus-input lessPad">
                            <input type="text" className={"form-control borderd-hfit "} style={{width:'170px'}}
                              defaultValue={option.position === 1 ? dtls.financialInfo.term : 0}
                              ref={option.title + "Term"}
                              id={"tr-TermField"}
                              disabled={option.position === 1 ? 'disabled' : true}
                              onKeyPress={(event) => this.handleKeyPress(event, option.title + "Term", 3, 0)}
                              onChange={(event) => this.changeTerm(option.title + "Term", event)} />
                          </div>

                          <label className="opt-label">Rate</label>
                          <div className="input-append default-margin-tp-btm cus-input lessPad">
                            <input type="text" className="form-control borderd hfit"
                              ref={option.title + "CashApr"}
                              id={"tr-AprField"}
                              defaultValue={option.position === 1 ? dtls.financialInfo.apr : 0}
                              onKeyPress={(event) => this.handleKeyPress(event, option.title + "CashApr", 2, 5)}
                              onChange={(event) => this.changeApr(option.title + "CashApr", '', event)}
                              disabled={option.position === 1 ? 'disabled' : true} />
                            <span className="add-on" id="sizing-addon2">%</span>
                          </div>

                          <label className="opt-label">Payment</label>
                          <div className="input-prepend default-margin-tp-btm cus-input cus-payment lessPad">
                            <span className="add-on cus-addon" id="sizing-addon2">$</span>
                            <input type="text" className="form-control"
                              ref={option.title + "Monthly_payment"}
                              id={"tr-PaymentField"}
                              defaultValue={option.position === 1 ? dtls.financialInfo.monthly_payment : ''}
                              onChange={(event) => this.changePayment(option.title + "Monthly_payment", event)}
                              disabled={option.position ? 'disabled' : false} />
                          </div>
                        </div>
                      }

                      {financialInfo.finance_method === 'RETL' &&
                        <div className="retlDtlsForm">
                          <label className="opt-label" style={this.state["isTerm"+option.position+"Error"] ? {color: 'red'} : {}}>{this.state["isTerm"+option.position+"Error"] ? this.state.termMsg : 'Term'}</label>
                          <div className="input-append default-margin-tp-btm cus-input lessPad">

                            {dtls.dealTerms ?
                              <input type="text" className={"form-control borderd-hfit "} style={{width:'170px'}}
                                defaultValue={option.position === 1 ? dtls.financialInfo.term :
                                  (dtls.dealTerms ? (dtls.dealTerms.termrateoptions[option.pointer] ? dtls.dealTerms.termrateoptions[option.pointer].term : '') : '')}
                                ref={option.title + "Term"}
                                id={"tr-TermField"}
                                disabled={option.position === 1 ? 'disabled' : false}
                                onKeyPress={(event) => this.handleKeyPress(event, option.title + "Term", 3, 0)}
                                onChange={(event) => this.changeTerm(option.title + "Term", event)} />
                              :
                              <input type="text" className={"form-control borderd-hfit "} style={{width:'170px'}}
                                defaultValue={option.position === 1 ? dtls.financialInfo.term : (dtls.financialInfo.term + (12 * (parseInt(option.position) - 1)))}
                                ref={option.title + "Term"}
                                id={"tr-TermField"}
                                disabled={option.position === 1 ? 'disabled' : false}
                                onKeyPress={(event) => this.handleKeyPress(event, option.title + "Term", 3, 0)}
                                onChange={(event) => this.changeTerm(option.title + "Term", event)} />
                            }
                          </div>

                          <label className="opt-label">APR</label>
                          <div className="input-append default-margin-tp-btm cus-input lessPad">
                            <input type="text" className="form-control borderd hfit"
                              ref={option.title + "CashApr"}
                              id={"tr-AprField"}
                              defaultValue={option.position === 1 ? parseFloat(dtls.financialInfo.apr.toFixed(5)) :
                                (dtls.dealTerms ?
                                  (dtls.dealTerms.termrateoptions[option.pointer] ? dtls.dealTerms.termrateoptions[option.pointer].apr : '') : '')}
                              onKeyPress={(event) => this.handleKeyPress(event, option.title + "CashApr", 2, 5)}
                              onChange={(event) => this.changeApr(option.title + "CashApr", '', event)}
                              disabled={option.position === 1 ? 'disabled' : false} />
                            <span className="add-on" id="sizing-addon2">%</span>
                          </div>

                          <label className="opt-label">Payment</label>
                          <div className="input-prepend default-margin-tp-btm cus-input cus-payment lessPad">
                            <span className="add-on cus-addon" id="sizing-addon2">$</span>
                            <input type="text" className="form-control"
                              ref={option.title + "Monthly_payment"}
                              id={"tr-PaymentField"}
                              defaultValue={option.position === 1 ? dtls.financialInfo.monthly_payment :
                                (dtls.dealTerms ?
                                  (dtls.dealTerms.termrateoptions[option.pointer] ?
                                    dtls.dealTerms.termrateoptions[option.pointer].payment : '') : '')
                              }
                              onChange={(event) => this.changePayment(option.title + "Monthly_payment", event)}
                              disabled={option.position ? 'disabled' : false} />
                          </div>
                        </div>
                      }

                      {financialInfo.finance_method === 'LEAS' &&
                        <div className="leasDtlsForm">
                          <label className="opt-label" style={this.state["isTerm"+option.position+"Error"] ? {color: 'red'} : {}}>{this.state["isTerm"+option.position+"Error"] ? this.state.termMsg : 'Term'}</label>
                          <div className="input-append default-margin-tp-btm cus-input lessPad">

                            {dtls.dealTerms ?
                              <input type="text" className={"form-control borderd-hfit "} style={{width:'170px'}}
                                defaultValue={option.position === 1 ? dtls.financialInfo.term :
                                  (dtls.dealTerms ? (dtls.dealTerms.termrateoptions[option.pointer] ? dtls.dealTerms.termrateoptions[option.pointer].term : '') : '')}
                                ref={option.title + "Term"}
                                id={"tr-TermField"}
                                disabled={option.position === 1 ? 'disabled' : false}
                                onKeyPress={(event) => this.handleKeyPress(event, option.title + "Term", 3, 0)}
                                onChange={(event) => this.changeTerm(option.title + "Term", event)} />
                              :
                              <input type="text" className={"form-control borderd-hfit "} style={{width:'170px'}}
                                defaultValue={option.position === 1 ? dtls.financialInfo.term : (dtls.financialInfo.term + (12 * (parseInt(option.position) - 1)))}
                                ref={option.title + "Term"}
                                id={"tr-TermField"}
                                disabled={option.position === 1 ? 'disabled' : false}
                                onKeyPress={(event) => this.handleKeyPress(event, option.title + "Term", 3, 0)}
                                onChange={(event) => this.changeTerm(option.title + "Term", event)} />
                            }
                          </div>
                          <label className="opt-label">APR</label>
                          <div className="input-append default-margin-tp-btm cus-input lessPad">
                            <input type="text" className="form-control borderd hfit"
                              ref={option.title + "CashApr"}
                              id={"tr-AprField"}
                              defaultValue={option.position === 1 ? parseFloat(dtls.financialInfo.apr.toFixed(5)) :
                                (dtls.dealTerms ?
                                  (dtls.dealTerms.termrateoptions[option.pointer] ? dtls.dealTerms.termrateoptions[option.pointer].apr : '') : '')}
                              onKeyPress={(event) => this.handleKeyPress(event, option.title + "CashApr", 2, 5)}
                              onChange={(event) => this.changeApr(option.title + "CashApr", option.title + "Money_factor", event)}
                              disabled={option.position === 1 ? 'disabled' : false} />
                            <span className="add-on" id="sizing-addon2">%</span>
                          </div>

                          <label className="opt-label">Money Factor</label>
                          <div className="input-append default-margin-tp-btm cus-input lessPad">
                            <input type="text" className="form-control borderd-hfit"
                              style={{width:'170px'}}
                              ref={option.title + "Money_factor"}
                              id={"tr-MoneyFactorField"}
                              defaultValue={option.position === 1 ? parseFloat((financialInfo.apr / 2400).toFixed(5)) :
                                (dtls.dealTerms ?
                                  (dtls.dealTerms.termrateoptions[option.pointer] ?
                                    dtls.dealTerms.termrateoptions[option.pointer].money_factor : '') : '')}
                              disabled={option.position === 1 ? 'disabled' : true} />
                          </div>

                          <label className="opt-label">Residual</label>
                          <div className="input-append default-margin-tp-btm cus-input lessPad">
                            <input type="text" className="form-control borderd hfit"
                              ref={option.title + "Residual_percentage"}
                              id={"tr-ResidualField"}
                              onKeyPress={(event) => this.handleKeyPress(event, option.title + "Residual_percentage", 2, 2)}
                              onChange={(event) => this.changeRate(option.title + "Residual_percentage", event)}
                              defaultValue={option.position === 1 ? parseFloat(financialInfo.residual_percentage) :
                                (dtls.dealTerms ?
                                  (dtls.dealTerms.termrateoptions[option.pointer] ? dtls.dealTerms.termrateoptions[option.pointer].residual : '') : '')}
                              disabled={option.position === 1 ? 'disabled' : false} />
                            <span className="add-on" id="sizing-addon2">%</span>
                          </div>

                          <label className="opt-label">Payment</label>
                          <div className="input-prepend default-margin-tp-btm cus-input cus-payment lessPad">
                            <span className="add-on cus-addon" id="sizing-addon2">$</span>
                            <input type="text" className="form-control"
                              ref={option.title + "Monthly_payment"}
                              id={"tr-PaymentField"}
                              defaultValue={option.position === 1 ? dtls.financialInfo.monthly_payment :
                                (dtls.dealTerms ?
                                  (dtls.dealTerms.termrateoptions[option.pointer] ?
                                    dtls.dealTerms.termrateoptions[option.pointer].payment : '') : '')
                              }
                              onChange={(event) => this.changePayment(option.title + "Monthly_payment", event)}
                              disabled={option.position ? 'disabled' : false} />
                          </div>
                        </div>
                      }

                      {financialInfo.finance_method === 'BALL' &&
                        <div className="leasDtlsForm">
                          <label className="opt-label" style={this.state["isTerm"+option.position+"Error"] ? {color: 'red'} : {}}>{this.state["isTerm"+option.position+"Error"] ? this.state.termMsg : 'Term'}</label>
                          <div className="input-append default-margin-tp-btm cus-input lessPad">
                            {dtls.dealTerms ?
                              <input type="text" className={"form-control borderd-hfit "} style={{width:'170px'}}
                                defaultValue={option.position === 1 ? dtls.financialInfo.term :
                                  (dtls.dealTerms ? (dtls.dealTerms.termrateoptions[option.pointer] ? dtls.dealTerms.termrateoptions[option.pointer].term : '') : '')}
                                ref={option.title + "Term"}
                                id={"tr-TermField"}
                                disabled={option.position === 1 ? 'disabled' : false}
                                onKeyPress={(event) => this.handleKeyPress(event, option.title + "Term", 3, 0)}
                                onChange={(event) => this.changeTerm(option.title + "Term", event)} />
                              :
                              <input type="text" className={"form-control borderd-hfit "} style={{width:'170px'}}
                                defaultValue={option.position === 1 ? dtls.financialInfo.term : (dtls.financialInfo.term + (12 * (parseInt(option.position) - 1)))}
                                ref={option.title + "Term"}
                                id={"tr-TermField"}
                                disabled={option.position === 1 ? 'disabled' : false}
                                onKeyPress={(event) => this.handleKeyPress(event, option.title + "Term", 3, 0)}
                                onChange={(event) => this.changeTerm(option.title + "Term", event)} />
                            }
                          </div>

                          <label className="opt-label">APR</label>
                          <div className="input-append default-margin-tp-btm cus-input lessPad">
                            <input type="text" className="form-control borderd hfit"
                              ref={option.title + "CashApr"}
                              id={"tr-AprField"}
                              defaultValue={option.position === 1 ? parseFloat(dtls.financialInfo.apr.toFixed(5)) :
                                (dtls.dealTerms ?
                                  (dtls.dealTerms.termrateoptions[option.pointer] ? dtls.dealTerms.termrateoptions[option.pointer].apr : '') : '')}
                              onKeyPress={(event) => this.handleKeyPress(event, option.title + "CashApr", 2, 5)}
                              onChange={(event) => this.changeApr(option.title + "CashApr", '', event)}
                              disabled={option.position === 1 ? 'disabled' : false} />
                            <span className="add-on" id="sizing-addon2">%</span>
                          </div>

                          <label className="opt-label">Residual</label>
                          <div className="input-append default-margin-tp-btm cus-input lessPad">
                            <input type="text" className="form-control borderd hfit"
                              ref={option.title + "Residual_percentage"}
                              id={"tr-ResidualField"}
                              onKeyPress={(event) => this.handleKeyPress(event, option.title + "Residual_percentage", 2, 2)}
                              onChange={(event) => this.changeRate(option.title + "Residual_percentage", event)}
                              defaultValue={option.position === 1 ? parseFloat(financialInfo.residual_percentage) :
                                (dtls.dealTerms ?
                                  (dtls.dealTerms.termrateoptions[option.pointer] ? dtls.dealTerms.termrateoptions[option.pointer].residual : '') : '')}
                              disabled={option.position === 1 ? 'disabled' : false} />
                            <span className="add-on" id="sizing-addon2">%</span>
                          </div>

                          <label className="opt-label">Balloon Payment</label>
                          <div className="input-prepend default-margin-tp-btm cus-input cus-payment lessPad">
                            <span className="add-on cus-addon" id="sizing-addon2">$</span>
                            <input type="text" className="form-control"
                              ref={option.title + "Balloon_payment"}
                              id={"tr-BalloonPaymentField"}
                              defaultValue={option.position === 1 ? dtls.financialInfo.residual_dollar :
                                (dtls.dealTerms ?
                                  (dtls.dealTerms.termrateoptions[option.pointer] ?
                                    dtls.dealTerms.termrateoptions[option.pointer].ballon_payment : '') : '')
                              }
                              onChange={(event) => this.changeBalloonPayment(option.title + "Balloon_payment", event)}
                              disabled={option.position ? 'disabled' : false} />
                          </div>

                          <label className="opt-label">Payment</label>
                          <div className="input-prepend default-margin-tp-btm cus-input cus-payment lessPad">
                            <span className="add-on cus-addon" id="sizing-addon2">$</span>
                            <input type="text" className="form-control"
                              ref={option.title + "Monthly_payment"}
                              id={"tr-PaymentField"}
                              defaultValue={option.position === 1 ? dtls.financialInfo.monthly_payment :
                                (dtls.dealTerms ?
                                  (dtls.dealTerms.termrateoptions[option.pointer] ?
                                    dtls.dealTerms.termrateoptions[option.pointer].payment : '') : '')
                              }
                              onChange={(event) => this.changePayment(option.title + "Monthly_payment", event)}
                              disabled={option.position ? 'disabled' : false} />
                          </div>
                        </div>
                      }

                    </div>

                  </div>
                  : <h3> Loading Info...</h3>
              }
            </div>
          )}
      </div>
    )

  }

}

const mapStateToprops = state => ({
  termRateOptions: state.termRateOptions
});
const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToprops, mapDispatchToProps, null, { withRef: true })(GridView);
