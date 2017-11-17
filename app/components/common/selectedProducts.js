import React, { Component } from 'react';

class SelectedProducts extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        let { selectedpackageOption } = this.props;
        return (
            <div className="row">
                <div className="span6">
                    <div className="package-card">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h3 className="panel-title">DECLINED PRODUCTS</h3>
                            </div>
                            <div className="panel-body print-card print-card-v2">
                                <div className="row-fluid main">
                                    {this.props.first_name} {this.props.last_name} confirms that the following products were
                                                    presented as below and declined. These products are offered as a part of vehicle sales transactions
                                                    and may not be available after the fact, in retrospect, or as stand-alone products.
                                                </div>
                                {
                                    this.props.declinedProducts.map((p, i) => {
                                        let selectedPayment = selectedpackageOption;
                                        if (selectedpackageOption === null) {
                                            selectedPayment = p.payment_options[0].termrateoptions.term;
                                        }

                                        return (
                                            <div className="row-fluid main" key={`declined_products_${i}`}>
                                                <div className="span6">{p.name}</div>
                                                <div className="span6 text-right padding-right">${Math.round((p.price / selectedPayment) * 100) / 100}/Mo</div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="span6">
                    <div className="package-card">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h3 className="panel-title">SELECTED PRODUCTS</h3>
                            </div>
                            <div className="panel-body print-card print-card-v2">
                                <div className="row-fluid main">
                                    {this.props.first_name} {this.props.last_name} confirms that the following products were
                                                    presented as below and accepted. These products are offered as a part of vehicle sales transactions
                                                    and may not be available after the fact, in retrospect, or as stand-alone products.
                                </div>
                                {
                                    this.props.selectedProducts.map((p, i) => {
                                        let selectedPayment = selectedpackageOption;
                                        if (selectedpackageOption === null) {
                                            selectedPayment = p.payment_options[0].termrateoptions.term;
                                        }

                                        return (
                                            <div className="main">
                                                <div className="row-fluid " key={`selected_products_${i}`}>
                                                    <div className="span6">{p.name}</div>
                                                    <div className="span6 text-right ">${Math.round((p.price / selectedPayment) * 100) / 100}/Mo</div>
                                                </div>
                                                <div className="row-fluid" key={`selected_productsV2_${i}`}>
                                                    <div className="span6">{p.term} mo/{p.miles} mi</div>
                                                    <div className="span6 text-right ">{(p.deductible != null && p.deductible != 0) ? `$${p.deductible} Ded` : ``}</div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SelectedProducts;