import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateProductRate, updateProductRateCost, updatePlanRate, updatePlanPrice, updateProductPackageInfo, updateProductPackagePrice } from '../../../actions/actions';
import { groupBy } from 'lodash';
import RatesOptions from './rateOptions';

function getSaveIndex(levels, userPrefernce, step) {
  let selectedProgram = 0;
  if (!userPrefernce) {
    return selectedProgram;
  }
  levels.map((level, index) => {
    switch (step) {
      case 'program':
        if (level.Desc == userPrefernce.program) {
          selectedProgram = index;
        }
        break;
      case 'coverage':
        if (level.Desc == userPrefernce.coverage) {
          selectedProgram = index;
        }
        break;
      case 'plan':
        if (level.Desc == userPrefernce.plan) {
          selectedProgram = index;
        }
        break;
    }
  });
  return selectedProgram;
}

function getRatesFromUserData(userPrefernce, state) {
  let packageRates = null;
  if (userPrefernce.program && userPrefernce.coverage && userPrefernce.plan) {
    packageRates = state.levelType3[state.planIndex] ? state.levelType3[state.planIndex].RateInfo : null;
  } else if (userPrefernce.program && userPrefernce.coverage) {
    packageRates = state.levelType2[state.coverageIndex] ? state.levelType2[state.coverageIndex].RateInfo : null;
  } else if (userPrefernce.program) {
    packageRates = state.levelType1[state.programIndex] ? state.levelType1[state.programIndex].RateInfo : null;
  }
  return packageRates;
}

function getUserSelectionTermMileage(userPrefernce, state) {
  let termMilageIndex = 0;
  const packageRates = getRatesFromUserData(userPrefernce, state);
  if (packageRates) {
    packageRates.Rates.map((rate, index) => {
      if (rate.TermMileage.Term == userPrefernce.term && rate.TermMileage.Mileage == userPrefernce.miles) {
        termMilageIndex = index;
      }
    });
  }
  return termMilageIndex;
}

function getLevels(Levels, userPrefernce) {
  const levelType1 = Levels;
  const levelType2 = (levelType1 && levelType1.length) ? levelType1[0].Levels : [];
  const levelType3 = (levelType2 && levelType2.length) ? levelType2[0].Levels : [];
  return {
    levelType1,
    levelType2,
    levelType3
  };
}

function getUpdatedLevels(Levels, userPrefernce) {
  const levelTyp1 = Levels;
  const levelTyp2 = (levelTyp1 && levelTyp1.length) ? levelTyp1[0].Levels : [];
  const levelTyp3 = (levelTyp2 && levelTyp2.length) ? levelTyp2[0].Levels : [];
  return {
    levelTyp1,
    levelTyp2,
    levelTyp3
  };
}

function getProductPackageKey(props) {
  const productId = props.product.id;
  const providerId = props.providerId;
  const productCode = props.productCode;
  const providerCode = props.providerCode;
  const packageType = props.plan;
  if(providerCode !== null)
  return `${productId}-${providerId}-${productCode}-${providerCode}-${packageType}`;
  else  return `${productId}-${providerId}-${productCode}-NR-${packageType}`;

}
function getProductRateKey(props) {
  let providerCode = (props.providerCode !==null) ? props.providerCode : 'NR'
  return `${props.product.id}-${props.providerId}-${props.productCode}-${providerCode}`;
}
function getUserPrefernceData(props) {
  let providerCode = (props.providerCode !==null) ? props.providerCode : 'NR';
  return `${props.product.id}-${props.providerName}-${providerCode}-${props.productCode}-${props.plan}`;
}
function getDeductibleAndTermMilageInfo(programs, userPlanPreference) {
  const {
    RateInfo
  } = programs;
  let indexInfo = {
    deductibleIndex: 0,
    termMilageIndex: 0,
    userPreferncedeductibleIndex: false
  };
  if (RateInfo && RateInfo.Rates) {
    RateInfo.Rates.map((rate, index) => {
      if (rate.Deductible.DeductAmt == userPlanPreference.deductible) {
        indexInfo.deductibleIndex = index;
      }
      if (rate.TermMileage.Term == userPlanPreference.Term) {
        indexInfo.termMilageIndex = index;
      }
    });
  }
  return indexInfo;
}

function closest(num, arr) {
    var curr = arr[0];
    var diff = Math.abs (num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs (num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return curr;
}

function getClosest (allTerms, allTermArr){
    return allTerms.reduce((prev, curr) => Math.abs(curr - allTermArr) < Math.abs(prev - allTermArr) ? curr : prev);
}
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) return false;
    }
    return true;
}


class ProductDetails extends Component {
  constructor(props) {
    super(props);
    const key = getProductRateKey(props);

    let providerRate = props.rateInfo.get(key);
    providerRate = (providerRate && providerRate.length) ? providerRate[0].Levels : null;
    const userPrefernce = props.userPrefernce.get(getUserPrefernceData(props));

    let {
      levelType1,
      levelType2,
      levelType3
    } = getLevels(providerRate, userPrefernce);

    let coverageIndex = 0;
    let programIndex = 0;
    let planIndex = 0;
    let termMilageIndex = 0;
    let deductibleIndex = 0;
    if (userPrefernce && props.product.is_rateable) {
      programIndex = getSaveIndex(levelType1, userPrefernce, 'program');
      levelType2 = levelType1.length ? levelType1[programIndex].Levels : [];
      coverageIndex = getSaveIndex(levelType2, userPrefernce, 'coverage');
      levelType3 = levelType2.length ? levelType2[coverageIndex].Levels : [];
      planIndex = getSaveIndex(levelType3, userPrefernce, 'plan');
    } else if (userPrefernce && !props.product.is_rateable) {
      let termArr = [];
      let { term, mileage } = this.getTermCombination(props.product.extension_data);
      term.map(t => {
        mileage.map(m => {
          termArr.push({
            term: t,
            mileage: m
          })
        })
      })
      termMilageIndex = termArr.findIndex(t => ((t.term == userPrefernce.term) && (t.mileage == userPrefernce.miles)))
       let termMileage = (termMilageIndex > -1) ? termMilageIndex : 0
      let count = 0;
      props.product.extension_data.map((e, i) => {
        if (e.option_name == "deductible") {
          if (userPrefernce.deductible == e.option_value) {
            deductibleIndex = count;
          }
          count++;
        }
      })
    }
    this.state = {
      rateIndex: 0,
      ...getLevels(providerRate, userPrefernce),
      programIndex,
      coverageIndex,
      planIndex,
      termMilageIndex,
      deductibleIndex,
      userPreferncedeductibleIndex: true,
      key,
      userPrefernce,
      RetailRate: {
        rate: 0
      },
      initialLoading: false,
      isDefaultAssigned : false,
      isDefaultUpdated : false,
      isPriceUpdated: false,
      isUserPriceAssigned: false,
      defCostUpdated: false,
      updateType: '',
      defaultAssignedValue : {} ,
      arrSelIndex: 0,
      isLevelSwitch: false,
      selectedDeductibleAmount: -1,
      defaultTermsValuesAssiged: false,
      isDeductableEventUpdated: false,
      updatedOptions: {},
    }
    this.getRateOptions = this.getRateOptions.bind(this);
  }

  prepareData() {
    if (!this.state.userPrefernce && this.props.product.is_rateable) {
        this.setState({})
    }
  }

  selectionEvent(priceObj, plan, options) {
    options = this.props.productPackageInfo.get(getProductPackageKey(this.props)).packageOption;
    console.log('Price Obj', priceObj)
    let RetailRate = this.state.RetailRate;
    if (!RetailRate.RetailRate) RetailRate.RetailRate = 0;
    if (priceObj.checked) {
      RetailRate.RetailRate += priceObj.price;
      RetailRate.min += priceObj.price;
      RetailRate.max += RetailRate.max > 0 ? priceObj.price : 0;
    } else {
      RetailRate.RetailRate -= priceObj.price;
      RetailRate.min -= priceObj.price;
      RetailRate.max -= RetailRate.max > 0 ? priceObj.price : 0;
    }
    RetailRate.OptionId = priceObj.OptionId;
    RetailRate.OptionName = priceObj.OptionName;
    RetailRate.checked = priceObj.checked;
    this.setState({
      RetailRate,
    });
    let savedOptions = [];
    if (this.state.userPrefernce && !this.props.productPackageInfo.get(getProductPackageKey(this.props)).isOptionsDirty) {
      savedOptions = this.state.userPrefernce.options
      if(options.length > 0){
        let upOpts = options.map(o => {
          if(savedOptions.length > 0){
            savedOptions.map(so => {
              if(so.option_cd == o.OptionName){
                o.IsSelected = so.is_selected;
                return o;
              }
            });
          }
        });
      }
    }
    let updatedOption = options.map(o => {
      if (o.OptionName == priceObj.OptionName){
        o.IsSelected = priceObj.checked
      }
    })
    const cost = priceObj.checked ? priceObj.price : -priceObj.price;
    this.props.dispatch(updatePlanPrice(plan, { rate: RetailRate.RetailRate }, this.props.product.id))
    this.props.dispatch(updateProductRate(RetailRate.RetailRate, this.props.product.id));

    let { state, props } = this;
    const levelType1 = state.levelType1;
    const levelType2 = state.levelType2;
    const levelType3 = state.levelType3;
    const levels = [levelType1, levelType2, levelType3];
    const productPackageKey = getProductPackageKey(this.props);
    const productPackageInfo = this.props.productPackageInfo.get(productPackageKey);
    const termMileage = productPackageInfo.termMileage;
    const deductible = productPackageInfo.deductible;
    let providerCde = (this.props.providerCode !== null ? this.props.providerCode : 'NR')
    this.props.dispatch(updateProductPackageInfo(termMileage, deductible, options,
      this.state, this.props.product.id, this.props.providerId,
      this.props.productCode, providerCde, this.props.plan, cost, cost,
      false, this.props.providerName,
      true, this.props.initialLoadSuccess, true));

  }
   setLevel1 = (levels, index) => {
      const levelType1 = levels[index];
      const levelType2 = (levelType1 && levelType1.Levels) ? levelType1.Levels : null;
      const level2Len = (levelType2 && levelType2.length >= 1) ?   levelType2.length : 0 ;
      const selectedCoverageIndex = (this.state.coverageIndex > (level2Len -1) ) ? 0 : this.state.coverageIndex;
      const levelType3 = (levelType2 && levelType2.length) ? levelType2[selectedCoverageIndex].Levels : null;
      let newState = {
        levelType1: levels,
        levelType2,
        levelType3,
        programIndex: index,
        isPriceUpdated: false,
        isDefaultAssigned: false,
        isDefaultUpdated: false,
        defaultTermsValuesAssiged: true
      }

      if(this.state.userPrefernce && (this.state.deductibleIndex > -1) && !this.state.defaultTermsValuesAssiged)
        newState.deductibleIndex = this.state.deductibleIndex;
        else   newState.deductibleIndex = 0;
      this.setState( newState , () => {
         this.updatePrice(this.state, this.props,'setLevel1',true, true);
      });
    }
  setLevel2 = (levels, index) => {
    const termMilageIndex = this.state.arrSelIndex; // it will update from willReceiveProps
    const levelType2 = levels[index];
    const levelType3 = (levelType2 && levelType2.Levels) ? levelType2.Levels : null;

    let newState = {
      levelType2: levels, levelType3, coverageIndex: index, isPriceUpdated: false,
      isDefaultAssigned: false, isDefaultUpdated: false, defaultTermsValuesAssiged: true
    }

    if(this.state.userPrefernce && (this.state.deductibleIndex > -1) && !this.state.defaultTermsValuesAssiged)
      newState.deductibleIndex = this.state.deductibleIndex;
      else newState.deductibleIndex = 0;

    this.setState(newState, () => {
      this.updatePrice(this.state, this.props, 'setLevel2', true, true);
    });
  }
  setLevel3 = (levels, index) => {
    let newState ={ rateIndex: index, planIndex: index,isPriceUpdated: false,
    isDefaultAssigned: false, isDefaultUpdated: false, defaultTermsValuesAssiged: true}
    if(this.state.userPrefernce && (this.state.deductibleIndex > -1) && !this.state.defaultTermsValuesAssiged)
      newState.deductibleIndex = this.state.deductibleIndex;
      else newState.deductibleIndex = 0;
    this.setState(newState, () => {
      this.updatePrice(this.state, this.props,'setLevel3', true, true);
    });
  }
  getRetailRate = (rate, plan, cost, termMilageIndex = 0, deductibleIndex = 0, deductible = -1) => {
    let retailPrice = {
      error: false,
      errorMessage: '',
      RetailRate: 0,
      isDisabled: false,
      OptionId: 0,
      checked: false,
      min: 0,
      max: 0,
      OptionName: ''
    };
    const product = this.props.product;

  if (rate) {
    if (termMilageIndex > rate.length - 1) {
      termMilageIndex = 0;
    }
    let termMileage = this.getTermMileage(rate, termMilageIndex);
    rate = rate.filter(rate => rate.TermMileage.Term == termMileage.term && rate.TermMileage.Mileage == termMileage.mileage);
    if (deductibleIndex > rate.length - 1) {
      deductibleIndex = 0;
    }

    let filteredrates = rate.filter(rate => rate.TermMileage.Term == termMileage.term && rate.TermMileage.Mileage == termMileage.mileage )

    let updatedFilteredRates = []
    if(deductible >= 0 && filteredrates.length > 0){
      updatedFilteredRates = filteredrates.filter((i)=> i.Deductible.DeductAmt == deductible);
      filteredrates = [...updatedFilteredRates];
    }

    if (deductibleIndex > filteredrates.length - 1) {
      deductibleIndex = 0;
    }
    rate = filteredrates[deductibleIndex]
    let RetailRate = 0;
        const RegulatedRuleId = rate.RegulatedRuleId;
        if (rate.RetailRate > 0) {
          RetailRate = rate.RetailRate;
        } else {
          if (RegulatedRuleId != 3) {
            RetailRate = this.getCalucatedPrice(product, RetailRate, cost);
            RetailRate = RetailRate < cost ? cost : RetailRate;
          }
      }
        //At this point if already selected should be surcharge
        let optionsTotal = 0;
        rate.Options.map(item => {
          if (item.IsSelected) {
        console.log('rate.Options',rate.Options);
        
            RetailRate += item.RetailRate;
            optionsTotal += item.RetailRate;
            retailPrice.OptionName = item.OptionName
          }
        })
        //Set minimum product price
        retailPrice.min = rate.MinRetailRate > 0 ? (rate.MinRetailRate + optionsTotal) : (cost + optionsTotal);

        //Set maximum product price
        retailPrice.max = rate.MaxRetailRate;

        //Adjust price in case lower than minimum
        retailPrice.RetailRate = RetailRate < retailPrice.min ? retailPrice.min: RetailRate;
        //Adjust price in case higher than maximum
        if (rate.MaxRetailRate > 0) {
          retailPrice.RetailRate = retailPrice.RetailRate > rate.MaxRetailRate ? rate.MaxRetailRate: retailPrice.RetailRate;
        }

        if (RegulatedRuleId) {
          retailPrice.regulatedId = RegulatedRuleId;
          if (RegulatedRuleId === 3) {
            retailPrice.RetailRate = rate.RetailRate;
            retailPrice.isDisabled = true;
          }
          if (RegulatedRuleId === 5) {
            if (rate.RetailRate > 0) {
              retailPrice.RetailRate = rate.RetailRate + optionsTotal;
            } else {
              retailPrice.RetailRate = RetailRate > rate.MaxRetailRate ? rate.MaxRetailRate : RetailRate;
            }
            if (retailPrice.RetailRate < retailPrice.min || retailPrice.RetailRate > retailPrice.max) {
              retailPrice.error = true;
              retailPrice.errorMessage = `Price sholud be in the range of ${retailPrice.min}  and ${retailPrice.min}`;
            }
          }
        }
      }
      if (!product.is_rateable) {
        retailPrice.RetailRate = product.default_price;
        retailPrice.RetailRate = this.getCalucatedPrice(product, product.default_price, product.cost)
        const productMinPrice = product.min_price;
        const productMaxPrice = product.max_price;
        if (retailPrice.RetailRate < productMinPrice || retailPrice.RetailRate > productMaxPrice) {
          retailPrice.error = true;
          retailPrice.errorMessage = `Price should be in the range of ${productMinPrice}  and ${productMaxPrice}`;
        }
      }
      this.state.RetailRate = retailPrice;
      return retailPrice;
    }

  getCalucatedPrice(product, retailPrice, cost) {
    const ParsedMarkUpAmt = parseInt(product.markup_value);
    let markupAmount = isNaN(ParsedMarkUpAmt) ? 0 : ParsedMarkUpAmt;
    if (product.is_markup === 0) {
      if (markupAmount <= 0) {
        return retailPrice;
      } else {
        markupAmount /= 100;
        return +cost + (+cost * markupAmount);
      }
    } else {
      return +cost + markupAmount;
    }
  }

  levels = (levelType, keyType, fn, selectedIndex = 0) => {
      const isRateable = this.props.product.is_rateable;
      const name = this.props.name;
      let FieldName = keyType.charAt(0).toUpperCase() + keyType.slice(1);
      if (isRateable && levelType && levelType.length) {
        if (selectedIndex > levelType.length - 1) {
          selectedIndex = 0
        }
        return (<div className="row r-small-bottom-margin" key={`${keyType}${this.props.product.id}${levelType[selectedIndex].Desc}`}>
          <p className="r-gray r-bottom-no-margin r-small-text">{levelType[0].LevelType}</p>
          <select value={levelType[selectedIndex].Desc} id={"Product"+FieldName} className="control-group" onChange={event => {
            fn(levelType, event.target.selectedIndex)
          }}>
            {levelType.map((item, i) => {
              return <option key={name + item.Desc + i}>{item.Desc}</option>
            })}
          </select>
        </div>);
      }
      return null;
    };

  getCost = (rate, termMilageIndex = 0, deductibleIndex = 0, deductible = -1) => {
    let cost = 0;
    deductibleIndex = 0;
    const isRateable = this.props.product.is_rateable;
    if (isRateable) {
      if (rate) {
        if (termMilageIndex > rate.length - 1) {
          termMilageIndex = 0;
        }
        let termMileage = this.getTermMileage(rate, termMilageIndex);
        let filteredrates = rate.filter(rate => rate.TermMileage.Term == termMileage.term && rate.TermMileage.Mileage == termMileage.mileage )

        if (deductibleIndex > filteredrates.length - 1) {
          deductibleIndex = 0;
        }
        let updatedFilteredRates = []
        if(deductible >= 0 && filteredrates.length > 0){
          updatedFilteredRates = filteredrates.filter((i)=> i.Deductible.DeductAmt == deductible);
          filteredrates = [...updatedFilteredRates];
        }
        cost = filteredrates[deductibleIndex].DealerCost;
        filteredrates[deductibleIndex].Options.map(item => {
          if (item.IsSelected) {
            cost += item.NetRate;
          }
        });
      }
    } else {
      cost = this.props.product.cost;
    }

    this.props.dispatch(updateProductRate(this.state.RetailRate.rate, this.props.product.id));
    this.props.dispatch(updateProductRateCost(this.props.product.id, cost));
    return cost;
  }

  getTermCombination = (extData) => {
    let len = extData.length;
    let term = [];
    let mileage = [];
    const termMilage = [];
    for (let i = 0; i < len; i++) {
      if (extData[i].option_name === 'term') {
        term.push(extData[i].option_value);
      }
      if (extData[i].option_name === 'miles') {
        mileage.push(extData[i].option_value);
      }
    }
    return { term, mileage };
  }

  getTerm = (rates, type, selectedOption, selectedDeductibleAmount = 0 ) => {
    let userPrefernceTerm = this.state.userPrefernce ? this.state.userPrefernce.term : null;
    const name = this.props.name;
    const product = this.props.product;
    let rateTermsList = [] ;
    if(rates){
    rates.map(function (item, i) {
      let cObj = `${item.TermMileage.Term} / ${item.TermMileage.Mileage < 0 ? 999999 : item.TermMileage.Mileage}`
        rateTermsList.push(cObj);
    })
  }

    let defaultValue = {};
    if ((this.state.termMilageIndex == 0 || this.state.termMilageIndex > 0) && this.state.initialLoading && this.state.isDefaultUpdated) {
      defaultValue = {}
    }
    else if (userPrefernceTerm !== null && !this.state.isDefaultUpdated ) {

        defaultValue = {
          value: `${userPrefernceTerm} / ${this.state.userPrefernce.miles}`
        }
        let arrSelIndex2 = rateTermsList.indexOf(defaultValue);
        if(arrSelIndex2 < 0 ){
            defaultValue = this.state.defaultAssignedValue;
        }
    }
    else if (userPrefernceTerm !== null && !this.state.defaultTermsValuesAssiged ) {
      this.setState({defaultTermsValuesAssiged : true},()=>{
        defaultValue = {
          value: `${userPrefernceTerm} / ${this.state.userPrefernce.miles}`
        }
      })
    }
    else if (this.state.isDefaultAssigned && !this.state.isDefaultUpdated) {
        defaultValue = this.state.defaultAssignedValue;
    }


    if (product.is_rateable) {
      if (!rates) {
        return null;
      }
    const updatedRates = (selectedDeductibleAmount >=  0) ?  rates.filter((item) => item.Deductible.DeductAmt == selectedDeductibleAmount) : rates;
      return (
        <div className="row r-small-bottom-margin">
          <p className="r-gray r-bottom-no-margin r-small-text">Term/Miles</p>
          <select {...defaultValue} ref = "termsSelIndex" id={"ProductTermMiles"} className={"control-group termmiles-select" + defaultValue.value}  onChange={event => {
            this.termMilageChangeEvent(event.target.selectedIndex, 'change',458, event.target.value, rateTermsList)
          }}>
          {updatedRates.map((item, i) => <option key={`${name}-${item.TermMileage.Term}-${item.TermMileage.Mileage}-${i}`}>{`${item.TermMileage.Term} / ${item.TermMileage.Mileage < 0 ? 999999 : item.TermMileage.Mileage}`}</option>)
            }
          </select>
        </div>
      );
    }
    const len = product.extension_data.length;
    const termMilage = [];
    let { term, mileage } = this.getTermCombination(product.extension_data);
    let options = [];
    term.map((item, i) => {
      mileage.map((miles, m) => {
        options.push(<option key={`${name}-${term[i]}-${mileage[m]}-${i}`}>{`${term[i]} / ${mileage[m]}`}</option>)
      })
    })
    return (
      <div className="row r-small-bottom-margin">
        <p className="r-gray r-bottom-no-margin r-small-text">Term/Miles</p>
        <select {...defaultValue} className="control-group" id={"ProductTermMiles"} onChange={event => {
          this.termMilageChangeEvent(event.target.selectedIndex, 'change',479)
        }}>
          {options}
        </select>
      </div>);
  }
  getDeductibleAmount(rates) {
    const DeductAmt = groupBy(rates, (item) => {
      return item.Deductible ? item.Deductible.DeductAmt : null;
    });
    const Deductibles = Object.keys(DeductAmt);
    return Deductibles.filter(item => item != "null");
  }
  getDeductible = (rates, termMilageIndex) => {
    const product = this.props.product;
    if (product.is_rateable) {
      if (!rates) {
        return [];
      }
      if (termMilageIndex > rates.length - 1) {
        termMilageIndex = 0;
      }
      let termMileage = this.getTermMileage(rates, termMilageIndex);
      let filteredrates = rates.filter(rate => rate.TermMileage.Term == termMileage.term && rate.TermMileage.Mileage == termMileage.mileage);
      const amount = this.getDeductibleAmount(filteredrates);
      return (
        amount.map((item, i) => {
          return <option key={item + i} > {item} </option>
        })
      );
    }
    const len = product.extension_data.length;
    const deductible = [], deductArr = [];
    for (let i = 0; i < len; i++) {
      if (product.extension_data[i].option_name === 'deductible') {
        deductArr.push(product.extension_data[i].option_value);
        deductible.push(<option key={`${product.extension_data[i].option_value}` + i} >
          {product.extension_data[i].option_value}
        </option>);
      }
    }
    return deductible;
  }
  getSelectedDeductibleAmount = (rates, termMilageIndex) => {
    const product = this.props.product;
    if (product.is_rateable) {
      if (!rates) {
        return [];
      }
      if (termMilageIndex > rates.length - 1) {
        termMilageIndex = 0;
      }
      let termMileage = this.getTermMileage(rates, termMilageIndex);
      let filteredrates = rates.filter(rate => rate.TermMileage.Term == termMileage.term && rate.TermMileage.Mileage == termMileage.mileage);
      const amount = this.getDeductibleAmount(filteredrates);
      return (
        amount.map((item, i) => item)
      );
    }
    const len = product.extension_data.length;
    const deductible = [];
    for (let i = 0; i < len; i++) {
      if (product.extension_data[i].option_name === 'deductible') {
        deductible.push(product.extension_data[i].option_value);
      }
    }
    return deductible;
  }
  getRateInfo = (levels) => {
    levels = levels.filter(level => level && level.length);
    if (levels) {
      return levels[levels.length - 1];
    }
  }
  getRates = (rateprops, rateIndex) => {
    if (rateprops && rateprops.length) {
      if (rateIndex > rateprops.length - 1) {
        rateIndex = 0;
      }
      return (rateprops[rateIndex].RateInfo ? rateprops[rateIndex].RateInfo.Rates : null);
    }
  }
  getRateOptions = (Rates, plan, rateIndex = 0) => {
      const isRateable = this.props.product.is_rateable;
      const options = [];
      if (isRateable) {
        if (rateIndex > Rates.length) {
          rateIndex = 0;
        }
        let self = this;
        console.group('Selected Opts')
        Rates[rateIndex].Options.map((opt, i) => {
          let selected = this.state.RetailRate.OptionName === opt.OptionName ? this.state.RetailRate.checked : opt.IsSelected;
          console.log('Selected Before Loop', selected, this.state.RetailRate, opt)
          if (this.state.userPrefernce) {
            this.state.userPrefernce.options.map((uo) => {
              if (uo.option_cd == opt.OptionName) {
                selected = uo.is_selected
              }
            })
          }
          console.groupEnd('Selected >', selected, this.state.RetailRate)
          options.push(
            <RatesOptions key={opt.OptionDesc + i}
              index={i}
              isSelected={selected}
              OptionDesc={opt.OptionDesc}
              IsSurcharge={opt.IsSurcharge}
              opt={opt}
              onSelect={event => this.selectionEvent(event, plan, Rates[rateIndex].Options)}
            />);
        });
        return (<div className="row r-small-bottom-margin">
          <p className="r-gray r-small-text">Options</p>
          {options.map(item => item)}
        </div>);
      }
      return null;
  }

  getTermMileage(rates, selectIndex) {
    if (!rates) {
      return null;
    }
    const selIndex = (selectIndex > -1 ) ? selectIndex : 0;
    const item = rates[selIndex];
    const itemReturn = {
      term: item.TermMileage && item.TermMileage.Term,
      mileage: item.TermMileage && item.TermMileage.Mileage,
      termId: item.TermMileage &&item.TermMileage.TermId
    }
    return itemReturn;
  }
  getTermMileageOnDeductible(rates, selectIndex, deductibleAmt) {
    if (!rates) {
      return null;
    }
    const selIndex = (selectIndex > -1 ) ? selectIndex : 0;
    let filteredrates = (deductibleAmt > 0) ? rates.filter((rate)=> rate.Deductible.deductibleAmt == deductibleAmt) : rates;
    const item = filteredrates[selIndex];

    return {
      term: item.TermMileage.Term,
      mileage: item.TermMileage.Mileage,
      termId: item.TermMileage.TermId
    };
  }
  termMilageChangeEvent(selectIndex, typ, lineFrom , eventValue = null, definedRates=[]) {
    if(eventValue !==null){
       if(definedRates.indexOf(eventValue) > -1) selectIndex = definedRates.indexOf(eventValue);
      }
    let newState = { termMilageIndex: selectIndex, initialLoading: true, updateType : typ, defCostUpdated: true};
    if(typ === 'change') {
      newState.isDefaultUpdated = true;
      newState.isPriceUpdated= false;
      newState.isDefaultAssigned= false;
      newState.isTermsUpdated = true;
    }

    if(typ === 'eventChange') this.setState({isDefaultUpdated : true, isTermsUpdated: false})
    if(lineFrom === 859 && !this.state.defCostUpdated ){
      this.setState(newState , () => {
        this.updatePrice(this.state, this.props,'termMilage-new', false,true, selectIndex, this.state.deductibleIndex);
      })
    }else if(lineFrom === 860 || lineFrom === 863 || lineFrom == 859){
      this.setState(newState , () => {
        this.updatePrice(this.state, this.props,'termMilage-level', false,true, selectIndex, this.state.deductibleIndex);
      })
    }
  else{
    this.setState(newState , () => {
      let userPrefInfo = false;
      if(this.state.userPrefernce){
      const deductible = this.state.userPrefernce.deductible;
      const cost = this.state.userPrefernce.cost;
      const price = this.state.userPrefernce.price;
      let userPrefInfo = {
        deductible,
        cost,
        price
      }
    }
      this.updatePrice(this.state, this.props,'termMilage', false,true, selectIndex, this.state.deductibleIndex, userPrefInfo);
    })
  }
  }
  deductibleChangeEvent(rates, selectIndex, from='change') {
    let { state, props } = this;
    const levelType1 = state.levelType1;
    const levelType2 = state.levelType2;
    const levelType3 = state.levelType3;
    const levels = [levelType1, levelType2, levelType3];
    const productPackageKey = getProductPackageKey(this.props);
    const productPackageInfo = this.props.productPackageInfo.get(productPackageKey);
    const termMileage = productPackageInfo.termMileage;
    const rateprops = this.getRateInfo(levels);
    const rate = this.getRates(rateprops, this.state.rateIndex);
    const deductible = (rate && props.product.is_rateable) ? this.getDeductibleAmount(rate)[selectIndex] : this.getDeductibleForNonRateableProduct(props.product.extension_data, selectIndex);

    this.props.dispatch(updateProductPackageInfo(termMileage, deductible, productPackageInfo.packageOption,
      this.state, this.props.product.id, this.props.providerId,
      this.props.productCode, this.props.providerCode, this.props.plan, 0, 0,
      false, this.props.providerName,
      true, this.props.initialLoadSuccess));
      let newState = { deductibleIndex: selectIndex, userPreferncedeductibleIndex: false, selectedDeductibleAmount: deductible };
      if(from == 'event') newState.isDeductableEventUpdated = true;
      this.setState(newState, () => {
             this.updatePrice(this.state, this.props, 'deductibleChange', false, true, this.state.termMilageIndex, selectIndex);
      });
  }
  getDeductibleForNonRateableProduct(ext, index) {
    if (ext && ext.length) {
      const len = ext.length;
      let arr = [];
      for (let i = 0; i < len; i++) {
        if (ext[i].option_name === 'deductible') {
          arr.push(ext[i].option_value);
        }
      }
      return arr[index];
    }
    return null;

  }
  getTermMileageForNonRateableProduct(extensionData, index) {
    if (extensionData && extensionData.length) {
      const termMileage = {
        "MaxTerm": 0,
        "Mileage": 0,
        "MinTerm": 0,
        "Term": 0,
        "TermId": 0
      };
      const term = [];
      const mileage = [];
      const termMilesArr = [];
      const len = extensionData.length;
      for (let i = 0; i < len; i++) {
        if (extensionData[i].option_name === 'term') {
          term.push(extensionData[i].option_value);
        }
        if (extensionData[i].option_name === 'miles') {
          mileage.push(extensionData[i].option_value);
        }
      }

      term.map(t => {
        mileage.map(m => {
          termMilesArr.push({
            "maxTerm": 0,
            "mileage": m,
            "minTerm": 0,
            "term": t,
            "termId": 0
          })
        })
      })

      return termMilesArr[index];
    }
    return null;
  }

  updatePrice = (state, props,from, isEventUpdated = false, levelChangePriceUpdate = false, termMilageIndex = 0, deductibleIndex = 0, userPrefernceInfo = false, initialLoad = false, initialLoadSuccess) => {
      return new Promise((resolve, reject) => {
        initialLoadSuccess = initialLoadSuccess ? initialLoadSuccess : props.initialLoadSuccess;
        const levelType1 = state.levelType1;
        const levelType2 = state.levelType2;
        const levelType3 = state.levelType3;
        const levels = [levelType1, levelType2, levelType3];
        const rateprops = (this.getRateInfo(levels)? this.getRateInfo(levels) : {});
        let localState = Object.assign({}, this.state);
        let localRateIndex = localState.rateIndex;
        if(levelType1 && levelType1[this.state.programIndex] && levelType1[this.state.programIndex].Levels){
          let lvl2 = levelType1[this.state.programIndex].Levels;
          localRateIndex = localState.programIndex;
          if(lvl2 && lvl2[0] && lvl2[0].LevelType && (lvl2[0].LevelType !== null && lvl2[0].LevelType !== undefined )){
            localRateIndex =  this.state.coverageIndex;
            if(lvl2[localRateIndex] && lvl2[localRateIndex].Levels && lvl2[localRateIndex].Levels.length > 0){
              let lvl3 = lvl2[localRateIndex].Levels;
              localRateIndex  = localState.planIndex;
            }
          }
        }

        const rate = this.getRates(rateprops, localRateIndex );
        const packageOption = props.product.is_rateable ? (rate && rate.length ? rate[0].Options : null) : null;
        const termMileageNonRatableIndex = this.state.userPrefernce && this.state.initialLoading;
        const termMileage = props.product.is_rateable ? this.getTermMileage(rate, termMilageIndex) : this.getTermMileageForNonRateableProduct(props.product.extension_data, state.termMilageIndex);
        if(rate){
          let ratesList = this.getDeductibleAmount(rate);
      		if(userPrefernceInfo && !isEventUpdated){
      			let deductIndex = ratesList.indexOf(userPrefernceInfo.deductible);
      			if(deductIndex > -1){
      				deductibleIndex = deductIndex;
      				this.setState({deductibleIndex: deductIndex});
      			}  
      			else {
      				deductibleIndex
      				this.setState({deductibleIndex: 0});
      			}
      		}
        }
        const deductible = (userPrefernceInfo && !isEventUpdated) ? userPrefernceInfo.deductible : (rate && props.product.is_rateable) ? this.getDeductibleAmount(rate)[deductibleIndex] : this.getDeductibleForNonRateableProduct(props.product.extension_data, this.state.deductibleIndex);
        let cost = (userPrefernceInfo && !isEventUpdated) ? userPrefernceInfo.cost : this.getCost(rate, termMilageIndex, deductibleIndex, deductible);
        let price = {};

        if (!props.product.is_rateable) {
          price = (userPrefernceInfo && !isEventUpdated) ? { RetailRate: userPrefernceInfo.price } : this.getRetailRate(rate, props.plan, cost);
        } else {
          price = (userPrefernceInfo && !isEventUpdated) ? { RetailRate: userPrefernceInfo.price } : this.getRetailRate(rate, props.plan, cost, termMilageIndex, deductibleIndex, deductible);
        }
        if(from == 'termMilage-new' || from == 'termMilage-level'){
          let deductibleArr = this.getDeductible(rate, state.termMilageIndex);
          let updatedDedArr = deductibleArr.map((item,i)=>item.props.children[1])
          deductibleIndex  =  (this.state.userPrefernceInfo && !isEventUpdated)  ? ((updatedDedArr.indexOf(this.state.userPrefernce.deductible) > -1 ? updatedDedArr.indexOf(this.state.userPrefernce.deductible) : 0) ): 0 ;
          cost = (this.state.userPrefernceInfo && !isEventUpdated) ? this.state.userPrefernce.cost : this.getCost(rate, termMilageIndex, deductibleIndex, deductible);
        }

        if(!userPrefernceInfo && props.userPrefernce && state.userPrefernce && state.updateType != 'change' && !state.isUserPriceAssigned){
            const price1 = state.userPrefernce.price;
              const userPrefernceInfo = {
                  price: price1
              };
          price = userPrefernceInfo &&  { RetailRate: userPrefernceInfo.price } ;
          this.setState({isUserPriceAssigned: true})
        }
       
        this.setState({selectedDeductibleAmount: deductible, rateIndex: localRateIndex}, ()=>{
          this.props.dispatch(updateProductPackageInfo(termMileage, deductible, packageOption, state, props.product.id, props.providerId, props.productCode, props.providerCode, props.plan, cost, price.RetailRate, levelChangePriceUpdate, props.providerName, initialLoad, initialLoadSuccess, false));
        })
        resolve();
      })
    }

  getUpdatedUserPrefernceState(providerRate, props) {
    let newState = new Object(this.state); // Cloning into new object for Local mutation
    const key = `${props.product.id}-${props.providerName}-${props.providerCode}-${props.productCode}-${props.plan}`;
    const userPlanPreference = props.userPrefernce.get(key);
    if (userPlanPreference && providerRate.length) {
      let programs = providerRate[0].Levels;
      for (let i = 0; i < programs.length; i++) {
        if (programs[i].Desc === userPlanPreference.program) {
          newState.programIndex = i;
          programs = programs[i];
          break;
        }
      }
      if (programs && programs.Levels.length) {
        for (let i = 0; i < programs.Levels.length; i++) {
          if (programs.Levels[i].Desc === userPlanPreference.coverage) {
            newState.coverageIndex = i;
            programs = programs[i];
          }
        }
      }
      if (programs && programs.Levels.length) {
        for (let i = 0; i < programs.Levels.length; i++) {
          if (programs.Levels[i].Desc === userPlanPreference.plan) {
            newState.planIndex = i;
            programs = programs[i];
          }
        }
      }
      const { deductibleIndex, termMilageIndex } = getDeductibleAndTermMilageInfo(programs, userPlanPreference);
      newState.price = userPlanPreference.price;
      newState.cost = userPlanPreference.cost;
      newState.deductibleIndex = deductibleIndex;
      newState.termMilageIndex = termMilageIndex;
      newState.providerName = userPlanPreference.provider_name;

      return newState;
    }
    return null;
  }
  componentWillMount() {
    let selectedOption = '';
      if (this.props.termRateOptions.options.termrateoptions[0].term)
         selectedOption = this.props.termRateOptions.options.termrateoptions[0].term;

    if (this.state.userPrefernce && this.props.product.is_rateable) {
      const deductible = this.state.userPrefernce.deductible;
      const cost = this.state.userPrefernce.cost;
      const price = this.state.userPrefernce.price;
      let levelType2 = this.state.levelType1.length ? this.state.levelType1[this.state.programIndex].Levels : [];
      let levelType3 = levelType2.length ? levelType2[this.state.coverageIndex].Levels : [];
      this.setState({
        levelType2,
        levelType3
      }, () => {
        const termMilageIndex = getUserSelectionTermMileage(this.state.userPrefernce, this.state);
        const userPrefernceInfo = {
          deductible,
          cost,
          price
        };
        this.updatePrice(this.state, this.props, 'userPrefInfo1',false,true, termMilageIndex, 0, userPrefernceInfo, true, true);
      });
    }
    else {
      if(this.state.userPrefernce){
        const userPrefernceInfo2 = {
          deductible:this.state.userPrefernce.deductible,
          cost : this.state.userPrefernce.cost,
          price: this.state.userPrefernce.price
        };
        this.updatePrice(this.state, this.props,'userPrefInfo2', false,false, 0, 0, userPrefernceInfo2).then(() => {});
      }
      else
      this.updatePrice(this.state, this.props,'userPrefInfo3', false).then(() => {});

    }
  }

  priceKeyPress(event, currentObj) {
    //Catches the user trying to enter a second decimal point and stops it
    if (this.refs.myPriceInput){
      if ((event.key == ".")  && (typeof currentObj.refs.myPriceInput.value == "string") && (currentObj.refs.myPriceInput.value.indexOf(".") >= 0)){
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  updatePackagePrice(event, selectedKey) {
    if (this.refs.myPriceInput){
      let cursorLocation = this.refs.myPriceInput.selectionStart;
      let eveTarget = event.target.value.replace(/[^\d.]/g, ''); //only allow numeric characters and the decimal point
      if (eveTarget.indexOf(".") >= 0){  //remove any numbers after the second decimal place
        eveTarget = eveTarget.split(".", 2);
        eveTarget = eveTarget[0] + "." + eveTarget[1].substring(0,2);
      }

      this.refs.myPriceInput.value = eveTarget;
      this.refs.myPriceInput.selectionStart = cursorLocation; //prevents the cursor from jumping around when the field needs to be adjusted
      this.refs.myPriceInput.selectionEnd = cursorLocation; //same as above line
    }
  }

  finishPriceUpdate(event, currentObj, selectedKey){
    if(currentObj.refs.myPriceInput){
      let eveTarget = parseFloat(currentObj.refs.myPriceInput.value);
      if(isNaN(eveTarget)){
         eveTarget = 0;
      }

      this.setState({isPriceUpdated: true}, ()=>{
      currentObj.props.dispatch(updateProductPackagePrice(selectedKey, currentObj.refs.myPriceInput.value, currentObj.props.product.id, currentObj.state.RetailRate));
      setTimeout(()=>{
        let productPackageInfo = currentObj.props.productPackageInfo.get(selectedKey);
        currentObj.refs.myPriceInput.value = productPackageInfo.price ? productPackageInfo.price.toFixed(2) : "0.00"
      }, 100)
      })
    }
  }

componentWillReceiveProps(nextProps) {

let userPrefernceTerm = this.state.userPrefernce ? this.state.userPrefernce.term : null;
if(!this.state.isPriceUpdated ){
  if( !this.state.isDefaultAssigned && !this.state.isDefaultUpdated ) {
    let newState = {};
    if(nextProps.providerSwitch){
    const productRateKey = getProductRateKey(nextProps);
    let productProviderRate = nextProps.rateInfo.get(productRateKey);
     productProviderRate = (productProviderRate && productProviderRate.length) ? productProviderRate[0].Levels : null;
     const productUserPref = nextProps.userPrefernce.get(getUserPrefernceData(nextProps));
    let {
      levelTyp1,
      levelTyp2,
      levelTyp3
    } = getUpdatedLevels(productProviderRate, productUserPref);
    newState ={ levelType1: levelTyp1, levelType2: levelTyp2, levelType3: levelTyp3 };
    nextProps.dispatch({type:'PROVIDER_SWITCH', providerSwitch: false})
  }

    this.setState({ newState }, () =>{
      const productPackageKey = getProductPackageKey(nextProps);
      const productPackageInfo = nextProps.productPackageInfo.get(productPackageKey);
      let levelType1 = this.state.levelType1 ? this.state.levelType1 : (productPackageInfo.levelType1 ? productPackageInfo.levelType1 : []);
      let levelType2 = this.state.levelType2 ? this.state.levelType2 : (productPackageInfo.levelType2 ? productPackageInfo.levelType2 : []);
      let levelType3 = this.state.levelType3 ? this.state.levelType3 : (productPackageInfo.levelType3 ? productPackageInfo.levelType3 : []);
      let rateprops = this.getRateInfo([levelType1, levelType2, levelType3]);
      const rates = (this.state.userPrefernce && this.props.product.is_rateable && !this.state.defaultTermsValuesAssiged) ?
      getRatesFromUserData(this.state.userPrefernce, this.state).Rates
      :      this.getRates(rateprops, this.state.rateIndex);
      let selectedOption = '';
      if (nextProps.termRateOptions.options.termrateoptions[0].term)
          selectedOption = nextProps.termRateOptions.options.termrateoptions[0].term;

    if ( selectedOption && !this.state.isDefaultAssigned && !this.state.isDefaultUpdated) {
      let milage = 999999;
      let terms = [], rateTermsListArr = [], rateTermsList = [], allTerms = [];
      let holder = {} ,dfVal = {}, defaultValue = {};
      if (rates && nextProps.product.is_rateable) {
          rates.map( (rate, i) => {
            if (rate.TermMileage.Term == selectedOption){
              terms.push(rate.TermMileage.Mileage / 1000);
              rateTermsListArr.push(rate.TermMileage.Mileage);
            }

            if(rate.Deductible.DeductAmt == this.state.selectedDeductibleAmount){
              if(allTerms.indexOf(rate.TermMileage.Term) < 0) allTerms.push(rate.TermMileage.Term)
              if(holder.hasOwnProperty(rate.TermMileage.Term)) {
              holder[rate.TermMileage.Term].push(rate.TermMileage.Mileage);
              } else {
              holder[rate.TermMileage.Term] = new Array();
              holder[rate.TermMileage.Term].push(rate.TermMileage.Mileage);
            }
          }
        });

        rates.map(function (item, i) {
          let cObj = `${item.TermMileage.Term} / ${item.TermMileage.Mileage < 0 ? 999999 : item.TermMileage.Mileage}`
            rateTermsList.push(cObj);
        })
        if(this.props.financialInfo &&
              (this.props.financialInfo.finance_method == 'LEAS' || this.props.financialInfo.finance_method == 'BALL'  )){
                   let inYrs =  parseFloat(this.props.financialInfo.term / 12) ;
                   let totalAnnualMiles = parseInt(this.props.financialInfo.annual_miles * inYrs);
                   milage  = closest(totalAnnualMiles, rateTermsListArr);
        } else if (terms[0] > 0)
          milage = (closest(selectedOption, terms)) * 1000

        defaultValue = {
          value: `${selectedOption} / ${milage}`
        }
         dfVal =  defaultValue['value'] ;
         let arrSelIndex = rateTermsList.indexOf(dfVal)
         this.setState({isDefaultAssigned: true, defaultAssignedValue : defaultValue , arrSelIndex: arrSelIndex })
         if(userPrefernceTerm != null){
          let defaultValueT = {
             value: `${userPrefernceTerm} / ${this.state.userPrefernce.miles}`
           }
           let ddfVal =  defaultValueT['value'] ;
           let arrSelIndexT = rateTermsList.indexOf(ddfVal);


           if(arrSelIndexT > -1 ){
             this.termMilageChangeEvent(arrSelIndexT, 'event',859);
             this.setState({defaultAssignedValue : defaultValueT})
           }else if(arrSelIndex >-1){
             this.termMilageChangeEvent(arrSelIndex,'event',860);
             this.setState({defaultAssignedValue : defaultValue});
           }
          else{
            let ddfVal2 =  defaultValue['value'] ;
            let arrSelIndex2 = rateTermsList.indexOf(ddfVal2);

            if(arrSelIndex2 > -1 ){
              this.termMilageChangeEvent(arrSelIndex2, 'event',870);
              this.setState({defaultAssignedValue : defaultValue});
            }else {
              let nextTerm = getClosest(allTerms, this.state.selectedDeductibleAmount);
              let nextMilage = 9999;
              if(holder.hasOwnProperty(nextTerm)) nextMilage = holder[nextTerm][0]
              let defaultValueNE = {
                 value: `${nextTerm} / ${nextMilage}`
               }
               let dnefVal =  defaultValueNE['value'] ;
               let arrSelIndexNE = rateTermsList.indexOf(dnefVal)
               if(arrSelIndexNE  > -1 ){
                  this.setState({isDefaultAssigned: true, defaultAssignedValue : defaultValueNE , arrSelIndex: arrSelIndexNE }, ()=>{

                    this.termMilageChangeEvent(arrSelIndexNE ,'event',871);
                  })

                }
               else this.termMilageChangeEvent(0 ,'event',872);
             }
          }

         }else if(arrSelIndex > -1 && !this.state.isDefaultAssigned){
           this.setState({defaultAssignedValue : defaultValue},()=>{
             this.termMilageChangeEvent(arrSelIndex, 'event',863);
           });

        }else{
            let ddfVal2 =  defaultValue['value'] ;
            let arrSelIndex2 = rateTermsList.indexOf(ddfVal2);

            if(arrSelIndex2 > -1 ){
              this.setState({defaultAssignedValue : defaultValue},()=>{
                this.termMilageChangeEvent(arrSelIndex2, 'event',870);
              });
            }else {
              let nextTerm = getClosest(allTerms, this.state.selectedDeductibleAmount);
              let nextMilage = 9999;
              if(holder.hasOwnProperty(nextTerm)) nextMilage = holder[nextTerm][0]
              let defaultValueNE = {
                 value: `${nextTerm} / ${nextMilage}`
               }
               let dnefVal =  defaultValueNE['value'] ;
               let arrSelIndexNE = rateTermsList.indexOf(dnefVal)
               if(arrSelIndexNE  > -1 ){
                  this.setState({isDefaultAssigned: true, defaultAssignedValue : defaultValueNE , arrSelIndex: arrSelIndexNE }, ()=>{
                    this.termMilageChangeEvent(arrSelIndexNE ,'event',871);
                  })

                }
               else this.termMilageChangeEvent(0 ,'event',872);
             }
        }

       }
       else if (!nextProps.product.is_rateable) {
         let milage = 999999;
         let terms = [], rateTermsList = [], milagesArr = [];
         let dfVal = {}, defaultValue = {};

         const len = nextProps.product.extension_data.length;
         const termMilage = [];
         let { term, mileage } = this.getTermCombination(nextProps.product.extension_data);
         let options = [];
         term.map((item, i) => {
           mileage.map((miles, m) => {
              if (term[i]== selectedOption)
              terms.push(term[i] )
           })

           mileage.map((miles, m) => {
             let cObj = `${term[i]} / ${mileage[m]}`
             rateTermsList.push(cObj);
             milagesArr.push(milage[m]);
           })
         })
         if(this.props.financialInfo &&
           (this.props.financialInfo.finance_method == 'LEAS' || this.props.financialInfo.finance_method == 'BALL'  )){
                let inYrs =  parseFloat(this.props.financialInfo.term / 12) ;
                let totalAnnualMiles = parseInt(this.props.financialInfo.annual_miles * inYrs);
                milage  = closest(totalAnnualMiles, mileage);
          } else if (terms[0] > 0)
           milage = (closest(selectedOption, terms)) * 1000


           defaultValue = {
             value: `${selectedOption} / ${milage}`
           }
           dfVal =  defaultValue['value'] ;
           let arrSelIndex = rateTermsList.indexOf(dfVal);

            this.setState({isDefaultAssigned: true, defaultAssignedValue : defaultValue , arrSelIndex: arrSelIndex })

            if(userPrefernceTerm != null){
             let defaultValueT = {
                value: `${userPrefernceTerm} / ${this.state.userPrefernce.miles}`
              }
              let ddfVal =  defaultValueT['value'] ;
              let arrSelIndexT = rateTermsList.indexOf(ddfVal)
              if(arrSelIndexT > -1 ){
                this.termMilageChangeEvent(arrSelIndexT, 'event',923);
              }else this.termMilageChangeEvent(0,'event',924);

            }
           else if(this.state.arrSelIndex > -1 && !this.state.isDefaultAssigned){
              this.termMilageChangeEvent(arrSelIndex, 'event',928);

           }else{
              this.termMilageChangeEvent(0,'event',931);
           }

      }


      }

   })
    }
  }


}

  render() {
    const productPackageKey = getProductPackageKey(this.props);
    const productPackageInfo = this.props.productPackageInfo.get(productPackageKey);

    let rateInfoSize = 0;
    if (this.props.products.find(p => p.is_rateable) && this.props.rateInfo && !this.props.rateInfo.size) {
      rateInfoSize = 1;
    }
    if (rateInfoSize || !productPackageInfo) {
      return null;
    }

    let { props } = this;
    let selTermrateoptions = '';
    if (this.props.termRateOptions.options.termrateoptions[0].term)
      selTermrateoptions = this.props.termRateOptions.options.termrateoptions[0].term;
    let selectedDeductibleAmount = -1;
    const levelType1 = this.state.levelType1 ? this.state.levelType1 : (productPackageInfo.levelType1 ? productPackageInfo.levelType1 : []);
    const levelType2 = this.state.levelType2 ? this.state.levelType2 : (productPackageInfo.levelType2 ? productPackageInfo.levelType2 : []);
    const levelType3 = this.state.levelType ? this.state.levelType3 : (productPackageInfo.levelType3 ? productPackageInfo.levelType3 : []);
    const rateprops = this.getRateInfo([levelType1, levelType2, levelType3]);
    const rate = ((this.state.userPrefernce && !this.state.defaultTermsValuesAssiged) && this.props.product.is_rateable ) ?
                  getRatesFromUserData(this.state.userPrefernce, this.state).Rates
                  : this.getRates(rateprops, productPackageInfo.rateIndex);

    const deductible = this.getDeductible(rate, this.state.termMilageIndex);
    const selectedDeductibleAmountArr = this.getSelectedDeductibleAmount(rate, this.state.termMilageIndex);
    let userSelectedDeductible = {};
    if(this.state.userPrefernce && !this.state.defaultTermsValuesAssiged  && !this.state.isDeductibleEventUpdated)
      userSelectedDeductible =  this.state.userPreferncedeductibleIndex ? { value: this.state.userPrefernce.deductible } : {};
    else if(!this.state.isDeductibleEventUpdated)
      userSelectedDeductible = (selectedDeductibleAmountArr.length > -1 ) ? {value: selectedDeductibleAmountArr[this.state.deductibleIndex]} : {}
    else if(this.state.isDeductibleEventUpdated) userSelectedDeductible = {}
    const rateOptions = rate ? this.getRateOptions(rate, this.props.plan) : [];
    const termMilage = this.getTerm(rate, '', selTermrateoptions, this.state.selectedDeductibleAmount);
    const cost = this.props.product.is_rateable ? parseFloat(productPackageInfo.cost) : parseFloat(this.props.product.cost)

    let price = productPackageInfo.price ? parseFloat(productPackageInfo.price) : 0
    let isPriceReadOnly = this.state.RetailRate.isDisabled ? "readOnly" : "";
    return (
      <div id="pkgrates" className={`span3 r-small-right-left-margin`} style={this.props.showMore ? {} : {display: 'none'}}>
        {productPackageInfo.cost ? <div className="rcorners" id={"ProductDetailPanel"+this.props.packageNum}>
          <div className="row r-small-bottom-margin-h"><b>{this.props.packageNames[this.props.name]}</b></div>
          {this.levels(levelType1, 'program', this.setLevel1, this.state.programIndex)}
          {this.levels(levelType2, 'coverage', this.setLevel2, this.state.coverageIndex)}
          {this.levels(levelType3, 'plan', this.setLevel3, this.state.planIndex)}
          {termMilage}
          {(!!deductible.length) &&
            <div className="row r-small-bottom-margin">
              <p className="r-gray r-bottom-no-margin r-small-text">Deductible</p>
              <select {...userSelectedDeductible} className="control-group" id={"ProductDeductible"} onChange={event => this.deductibleChangeEvent(rate, event.target.selectedIndex)}>
                {deductible.map(item => item)}
              </select>
            </div>}
          {rateOptions}
          <div className="row"><span className="prod-tot">Cost</span></div>
          <div className="row input-prepend default-margin-tp-btm cus-input">
            <span className="add-on" id="sizing-addon2">$</span>
            <input value={cost.toFixed(2)} type="text" className="form-control" id={"ProductCost"} readOnly />
          </div>
          <div className="row"><span className="prod-tot">Price</span></div>
          <div className="row input-prepend cus-input">
            <span className="add-on" id="sizing-addon2">$</span>
            <input key={productPackageInfo.cost} ref="myPriceInput" type="text"
            onChange={(event) => { this.updatePackagePrice(event, productPackageKey) }}
            onBlur={(event) => { this.finishPriceUpdate(event, this, productPackageKey) }}
            onKeyPress={(event) => { this.priceKeyPress(event, this) }}
            className="form-control priceInp" defaultValue={price.toFixed(2)} id={"ProductPrice"} readOnly={isPriceReadOnly}/>
          </div>
          {productPackageInfo.priceUpdateError ?
            <div className="alert alert-danger fade in">
              {productPackageInfo.priceUpdateError}
            </div> : null
          }
        </div> :
          <div>  Sorry! No Rates to Display. Please try later.</div>
        }
      </div>
    );
  }
}

const mapStateToprops = state => ({
  rateInfo: state.rates.providerRate,
  userPrefernce: state.rates.userPrefernce,
  productPackageInfo: state.product.productPackageInfo,
  packageNames: state.packagesNames,
  termRateOptions: state.termRateOptions,
  initialLoadSuccess: state.product.initialLoadSuccess,
  products: state.product.list,
  financialInfo: state.financialInfo,
  providerSwitch: state.product.providerSwitch,
});
const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToprops, mapDispatchToProps)(ProductDetails);
