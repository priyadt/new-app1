import React, { Component } from 'react';
import { cloneDeep,map } from 'lodash';
import moment from 'moment';
import { Router, Route, Link, IndexRoute } from 'react-router';
import HttpHelper from '../../utils/httpHelper';
import RequireProvider from './reqProvider/requiredField';
import TermRate from './termAndRateOption/termRate';
import ProductHeading from './productView/productHeading';
import config from '../../config.js';
import { dealerData } from '../../helper/index.js';
import { connect } from 'react-redux';
import {set_dealerProduct} from  '../../actions/actions';

class eMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            saveEMenu: true,
            products: [],
            active: true,
            datevalue: moment(),
            isError: false,
            VehicleInfo_data: '',
            financialInfo_data: '',
            reserveData: '',
            isDataChanged: false,
            isSaved: false,
            dealjacketid: dealerData.dealjacketid,
            dealid: dealerData.dealid,
            deal_type: dealerData.deal_type,
            dealer_code: dealerData.dealer_code,
            originalLoad: true,
            nullCheckRequired: true,
            isChangedTermOptionsData: false,
            isRenderedPackagePmt: false,
            checkFlag: true
        };

        this.events = {};
        this.data = {};
        this.data.eMenusecOne = [];
        this.data.eMenusecOneObject = {};
        this.events.eMenuOptionselect = this.eMenuOptionselect.bind(this);
        this.events.editEMenu = this.editEMenu.bind(this);
        this.events.eMenuOnsave = this.eMenuOnsave.bind(this);
        this.events.opendatepicker = this.opendatepicker.bind(this);
        this.renderUI = this.renderUI.bind(this);
        this.handleVinIDChange = this.handleVinIDChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.mapGroupCategory = this.mapGroupCategory.bind(this);
        this.getDealerProduct = this.getDealerProduct.bind(this);
        this.getRenderdataFields = this.getRenderdataFields.bind(this);
        this.getMappedRequiredField = this.getMappedRequiredField.bind(this);
        this.hasChangedTermOptionsData = this.hasChangedTermOptionsData.bind(this);
        this.hasRenderedPackagePmt = this.hasRenderedPackagePmt.bind(this);
        this.reqFieldsValidator = this.reqFieldsValidator.bind(this);

    }


    componentDidMount() {
        HttpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/required-fields/`, 'get')
            .then((reqRes) => {
                if (reqRes.deal_menu_json.length) {
                    let resData = JSON.parse(reqRes.deal_menu_json);
                    resData = this.mapGroupCategory(resData);

                    this.setState({
                        reqFieldResponseUI: resData,
                        products: resData.Products,
                        responseTomap: resData,
                        originalLoad: false,
                        nullCheckRequired: false
                    });
                    return HttpHelper(`${config.emenuMobileGatewayAPI}/dealer-products/`, 'get');
                } else {
                    this.loadData();
                }
            }).then(dealerProduct => {
                 this.props.dispatch(set_dealerProduct(dealerProduct.results));
                this.setState({ dealerProduct });
                return HttpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/deal-finance-summary/`, 'get');
            }).then((financialInfo_data) => {
                this.setState({ financialInfo_data });
            }).catch(() => {
                this.loadData();
            });

        let vinId = window.document.getElementById('id_vin_number');
        if (vinId)
            vinId.addEventListener('keyup', this.handleVinIDChange);

    }

    handleVinIDChange(event) {
        this.loadData();
    }

    loadData() {
        let callPromiseArr = [];
        callPromiseArr.push(
            HttpHelper(`${config.dealMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/vehicle/`, 'get')
        );
        callPromiseArr.push(
            HttpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/deal-finance-summary/`, 'get')
        );
        Promise.all(callPromiseArr).then(data => { this.getDealerProduct(data[0], data[1]); });
    }


    getDealerProduct(VehicleInfodata, financialInfo_data) {
        let dealerProduct = null;
        let dataTosend = {};
        let self = this;
        HttpHelper(`${config.emenuMobileGatewayAPI}/dealer-products/`, 'get')
            .then((data) => {
                dealerProduct = data;
                let modifiedDate = "/Date(" + Date.now().toString(); + ")/";
                let modDate = modifiedDate + ")/";
                dataTosend["KeyData"] = {
                    "ClientId": "DEM",
                    "ClientDealerId": data.results[0].dealer_id,
                    "DTDealerId": data.results[0].dealer_id,
                    "RequestDate": modDate
                };
                return HttpHelper(`${config.dealMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/vehicle/`, 'get');
            }).then((data) => {
                dataTosend["Vehicle"] = { "BookType": "2", "Type": data.certified_used == 'N' ? 1 : 2 };
                return HttpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/deal-finance-summary/`, 'get');
            }).then((data) => {
                if (data.finance_method == 'RETL')
                    dataTosend["Finance"] = { "DealType": "1" };
                else if (data.finance_method == 'LEAS') {
                    dataTosend["Finance"] = { "DealType": "2" };
                }
                else if (data.finance_method == 'BALL') {
                    dataTosend["Finance"] = { "DealType": "3" };
                }
                else if (data.finance_method == 'CASH') {
                    dataTosend["Finance"] = { "DealType": "4" };
                }
                let productArray = [];
                dealerProduct.results.map((item, index) => {
                    if (item['is_rateable'] && !item['is_deleted']) {
                        productArray.push({
                            "ProductTypeCode": item.category_code,
                            "ProviderId": item.provider_code,
                            "ProviderDealerId": ""
                        });
                    }
                });
                dataTosend['Products'] = productArray;
                return HttpHelper(`${config.emenuMobileGatewayAPI}/Rating/RatingRESTAPI/json/requiredfields_json/`, 'post', dataTosend);
            }).then((data) => {
                data.Products.map((p) => {
                    if (p.ProviderProductId == null) p.ProviderProductId = '';
                });
                let modifiedDate = "/Date(" + Date.now().toString(); + ")/";
                let modDate = modifiedDate + ")/";
                data.keydata.EchoData = '';
                data.keydata.ContractDate = modDate;
                let resPhase1 = self.getMappedRequiredField(data, dealerProduct);
                data.Products = self.getRenderdataFields(resPhase1, VehicleInfodata, financialInfo_data);
                self.setState({
                    products: data.Products,
                    reqFieldResponseUI: data,
                    responseTomap: data,
                    responseTosend: dataTosend,
                    dealerProduct,
                    VehicleInfo_data: VehicleInfodata,
                    financialInfo_data
                });
            });
    }

    getRenderdataFields(RequiredFieldResponseProduct, VehicleInfodata, financialInfo_data) {
        let grpResponseObj = {};
        RequiredFieldResponseProduct.map((item, idx) => {
            item.Fields.map((childitem, index) => {
                if (childitem.MappingAPI != '' && childitem.MappingField != '') {
                    if (childitem.MappingAPI == 'Vehicle') {
                        childitem.Value = VehicleInfodata.results[0][childitem.MappingField];
                    } else if (childitem.MappingAPI == 'DealFinanceSummary') {
                        childitem.Value = financialInfo_data[childitem.MappingField];
                    }
                }
                if (childitem.Name == 'provider_dealer_id') {
                    childitem.Value = '';
                } else if (childitem.Name == 'type') {
                    childitem.Value = 'N';
                }
                if (childitem.Value == 'RETL') {
                    childitem.Value = "Finance";
                } else if (childitem.Value == 'LEAS') {
                    childitem.Value = "Lease";
                } else if (childitem.Value == 'BALL') {
                    childitem.Value = "Balloon";
                } else if (childitem.Value == 'CASH') {
                    childitem.Value = "Cash";
                }

                if (Object.keys(grpResponseObj).indexOf(childitem.Category) == -1) {
                    grpResponseObj[childitem.Category] = [];
                }
                if (childitem.DisplayOnUI && childitem.ControlType != 'NA') {
                    grpResponseObj[childitem.Category].push(childitem);
                }
            });
            RequiredFieldResponseProduct[idx]['GroupedCategory'] = grpResponseObj;
            grpResponseObj = {};
        });
        return RequiredFieldResponseProduct;
    }

    getMappedRequiredField(data, dealerProduct) {
        let responseTomap = data.Products;
        let dealerProductData = dealerProduct.results;
        let mappedData = [];
        responseTomap.map((childitem, i) => {
            dealerProductData.map((item, idx) => {
                if (item['is_rateable'] && !item['is_deleted']) {
                    if ((item['category_code'] == childitem['ProductTypeCode'])
                        && (item['provider_code'] == childitem['ProviderId']) && (item['provider_code'] != null && item['product_id'])) {
                        childitem['ClientProductId'] = item['product_id'];
                        mappedData.push(childitem);
                    }
                }
            });
        });
        return mappedData;
    }

    mapGroupCategory(data) {
        let grpResponseObj = {};
        data.Products.map((p, i) => {
            p.Fields.map((f, y) => {
                if (Object.keys(grpResponseObj).indexOf(f.Category) == -1) {
                    grpResponseObj[f.Category] = [];
                }
                if (f.DisplayOnUI && f.ControlType != 'NA') {
                    grpResponseObj[f.Category].push(f);
                }
            });
            p.GroupedCategory = grpResponseObj;
            grpResponseObj = {};
        });
        return data;
    }

    eMenuOptionselect(ClientProductId, qid, catname, optvalue, caption) {
        let reqFieldResponseUI = this.state.reqFieldResponseUI;
        let questiondata = reqFieldResponseUI.Products;
        let isFilled = true;
        questiondata.map((category, idx) => {
            if (category.GroupedCategory[catname] !== null && category.GroupedCategory[catname] !== undefined) {
                category.GroupedCategory[catname].map((q, i) => {
                    if (q.DisplayOnUI && q.Caption == caption && (q.ControlType != 'NA' && q.ControlType != 'Calendar' && (q.FieldValues !== undefined && q.FieldValues.length > 0 && q.FieldValues.length <= 4))) {
                        q['isValid'] = true;
                        isFilled = true;
                        q.Value = optvalue.Code;
                    } else if (q.DisplayOnUI && q.Caption == caption && (q.ControlType != 'NA' && q.ControlType != 'Calendar' && (q.FieldValues !== undefined && q.FieldValues.length > 4))) {
                        if (optvalue.target && optvalue.target.value) {
                            q['isValid'] = true;
                            isFilled = true;
                            q.Value = optvalue.target.value;
                        } else if (optvalue.Code != undefined) {
                            q['isValid'] = true;
                            isFilled = true;
                            q.Value = optvalue.Code;
                        }
                    } else if (q.DisplayOnUI && q.Caption == caption && (q.ControlType != 'NA' && q.ControlType != 'Calendar') && (q.FieldValues !== undefined && q.FieldValues.length == 0)) {
                        q['isValid'] = true;
                        isFilled = true;
                        q.Value = optvalue.target.value;
                    } else {
                        if (q['isValid']) {
                            isFilled = true;
                        }
                    }
                });
            }
        });
        if (isFilled) {
            this.setState({ reqFieldResponseUI, isDataChanged: isFilled, isSaved: true });
        }
        else {
            this.setState({ reqFieldResponseUI, isDataChanged: isFilled, isError: true });
        }
    }

    reqFieldsValidator(){
      let isvalidData = true;
      let reqFieldResponseUI = this.state.reqFieldResponseUI;
      let questiondata = reqFieldResponseUI.Products;

      questiondata.map((category, idx) => {
          for (let qs in category.GroupedCategory) {
              category.GroupedCategory[qs].map((q, i) => {
                  if (q.DisplayOnUI && (!q.Value) && (q.ControlType != 'NA' && q.ControlType != 'Calendar' && (q.FieldValues !== undefined && q.FieldValues.length == 1))) {
                      q['Value'] = q.FieldValues[0].Desc;
                  }

                  if (q.DisplayOnUI && (!q.Value || q.Value == 'please select') && (q.ControlType != 'NA' && q.ControlType != 'Calendar' && (q.FieldValues !== undefined && q.FieldValues.length > 0 && q.FieldValues.length <= 4))) {
                      isvalidData = false;
                      q['isValid'] = false;
                  } else if (q.DisplayOnUI && (!q.Value || q.Value == 'please select') && (q.ControlType != 'NA' && q.ControlType != 'Calendar' && (q.FieldValues !== undefined && q.FieldValues.length > 4))) {
                      isvalidData = false;
                      q['isValid'] = false;
                  }
                //   else if (q.DisplayOnUI && (!q.Value || q.Value == 'please select') && (q.ControlType != 'NA' && q.ControlType != 'Calendar') && (q.FieldValues !== undefined && q.FieldValues.length == 0)) {
                //       isvalidData = false;
                //       q['isValid'] = false;
                //   }
                  else if (q.DisplayOnUI && (!q.Value || q.Value == 'please select') && (q.ControlType != 'NA' && q.ControlType == 'Calendar') && (q.FieldValues !== undefined && q.FieldValues.length == 0)) {
                      isvalidData = false;
                      q['isValid'] = false;
                  }
              });
          } });
          return isvalidData;
    }

    eMenuOnsave(termRate) {
        return new Promise((resolve, reject) => {
            let isvalidData = this.reqFieldsValidator();

            let reqFieldResponseUI = this.state.reqFieldResponseUI;
            let questiondata = reqFieldResponseUI.Products;
            this.setState({saveEMenu: true});

            questiondata.map((category, idx) => {
                category.Fields.map(f => {
                    if (f.Name == 'finance_term2') {
                        if (termRate.length > 1) {
                            f.Value = termRate[1].term;
                        } else {
                            f.Value = termRate[0].term;
                        }
                    }
                });
            });


            if (isvalidData) {
                let dataWithNoCategory = [];
                if (this.state.isDataChanged || this.state.checkFlag) {
                    this.state.checkFlag = false;
                    let cloneReq = cloneDeep(reqFieldResponseUI);
                    cloneReq.Products.map((value, i) => {
                        let val = value;
                        delete val["GroupedCategory"];
                        dataWithNoCategory.push(val);
                    });
                     dataWithNoCategory.map(d => {
                        d.Fields.map(f => {
                             if (f.DataType=="Numeric" && f.Required=="Y" && f.Value == null) {
                                f.Value = '0';
                            } else if (f.DataType=="Date" && f.Required=="Y" && f.Value == null) {
                                f.Value = "/Date(" + Date.now().toString(); + ")/";
                            } else if (f.DataType=="Alphanumeric" && f.Required=="Y" && f.Value == null) {
                                f.Value = "";
                            } else if (f.DataType=="" && f.Required=="Y" && f.Value == null) {
                                f.Value = "";
                            }
                        });
                    });

                    cloneReq.Products = dataWithNoCategory;
                    let dataToSend = {};
                    dataToSend['deal_menu_json'] = JSON.stringify(cloneReq);
                    dataToSend["deal_id"] = dealerData.dealid;
                    dataToSend["deal_jacket_id"] = dealerData.dealjacketid;
                    dataToSend["dlr_cd"] = dealerData.dealer_code;
                    HttpHelper(`${config.emenuMobileGatewayAPI}/deal-jackets/${this.state.dealjacketid}/deals/${this.state.dealid}/required-fields/`,
                        'post', dataToSend).then(() => {
                            this.setState({ isSaved: true, isError: false, saveEMenu: false, originalLoad: false, reserveData: JSON.parse(JSON.stringify(questiondata)) });
                                            resolve();
                        }).catch(e => console.log(e));
                }else{
                    this.setState({ isSaved: true, isError: false, saveEMenu: false, originalLoad: false, reserveData: JSON.parse(JSON.stringify(questiondata)) });
                                            resolve();
                    resolve();
                }
            } else {
                this.setState({ saveEMenu: true, isError: true },()=>resolve());
            }
        });
    }

    editEMenu() {
        if (this.state.nullCheckRequired) {
            this.setState({ saveEMenu: true, originalLoad: true, isDataChanged: false, isChangedTermOptionsData: false, isRenderedPackagePmt: false });
        } else {
            this.setState({ saveEMenu: true, originalLoad: true, isChangedTermOptionsData: false, isRenderedPackagePmt: false });
        }
    }

    editTermRate(event){
      this.setState({ saveEMenu: true, isChangedTermOptionsData: false, isRenderedPackagePmt: false });
    }

    opendatepicker(date) {
        let reqFieldResponseUI = this.state.reqFieldResponseUI;
        let questiondata = reqFieldResponseUI.Products;
        let isDataChanged = false;
        let isFilled = true;
        if (questiondata.length > 0) {
            questiondata.map((category, idx) => {
                for (let qs in category.GroupedCategory) {
                    category.GroupedCategory[qs].map((q, i) => {
                        if (q.ControlType == 'Calendar') {
                            q['isValid'] = true;
                            isDataChanged = true;
                            return q.Value = date.toDate();
                        }
                        if (q.ControlType != 'Calendar' && q.isValid == false) {
                            isFilled = false;
                        }
                    });
                }
            });
        }
        this.setState({ reqFieldResponseUI, isDataChanged, isError: !isFilled });
    }

    hasChangedTermOptionsData(hasChangedInd) {
        if (hasChangedInd == true) {
            if (this.state.isRenderedPackagePmt == true)
                this.setState({ isChangedTermOptionsData: true });
        } else {
            this.setState({ isChangedTermOptionsData: false });
        }
    }

    hasRenderedPackagePmt(isRenderedInd) {
        this.setState({ isRenderedPackagePmt: isRenderedInd });
    }

    renderUI() {
        if ((this.state.VehicleInfo_data == '' || this.state.financialInfo_data == '') && (this.state.nullCheckRequired)) {
            return;
        }
        // else if (this.state.VehicleInfo_data.results[0].vin == null || this.state.financialInfo_data.monthly_payment == null) {
        //     return 'No Data to Display'
        // }
        else {
            let show = this.state.reqFieldResponseUI && this.calculateFieldsView(this.state.reqFieldResponseUI.Products);
            let ui = <div>{this.state.reqFieldResponseUI && <div style={!show?{display:'none'}:{}}><RequireProvider header="eMenu" error={this.state.isError}
                isEdit={this.state.originalLoad} originalLoad={this.state.originalLoad} data={this.state.reqFieldResponseUI} events={this.events} /></div>}
                <TermRate events={this.events.eMenuOnsave} editTermRate={this.editTermRate.bind(this)}
                  hasChangedTermOptionsData={this.hasChangedTermOptionsData} hasRenderedPackagePmt={this.hasRenderedPackagePmt} />
                {!this.state.saveEMenu && !(this.state.isRenderedPackagePmt && this.state.isChangedTermOptionsData) && <ProductHeading financialInfo_data={this.state.financialInfo_data} items={this.state.dealerProduct} hasRenderedPackagePmt={this.hasRenderedPackagePmt} />}</div>;
            return ui;
        }
    }


    calculateFieldsView(questiondata){
        let show = false;
        questiondata.map((category, idx) => {
            map(category.GroupedCategory, function (qs, catname) {
                if(qs.length) show = true
            })
        })
        return show;
    }


    render() {

        return (
            <div>
                {this.renderUI()}
            </div>
        );
    }

}
const mapDispatchToProps = dispatch => ({ dispatch });
const mapStateToprops = state => ({
  dealerProduct: state.product.dealerProduct,
});

export default connect(mapStateToprops, mapDispatchToProps)(eMenu);
