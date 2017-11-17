import React, { Component } from 'react';

class PackageCard extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    let pkg = this.props.pkg;
    let selecetedpackageOptionTerm = pkg.package_options.find(po=>po.is_option_selected);
    selecetedpackageOptionTerm = (selecetedpackageOptionTerm==undefined) ? null : parseInt(selecetedpackageOptionTerm.termrateoptions.term);
    return (
      <div className="package-card">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h3 className="panel-title">{pkg.package_name}</h3>
          </div>
          <div className="panel-body print-card">
            {
              pkg.products.map((p, i) => {
                let selectedPayment = selecetedpackageOptionTerm; 
                if(selecetedpackageOptionTerm===null){
                  selectedPayment = p.payment_options[0].termrateoptions.term;
                }
                 
                return (
                  <div className="main">
                    <div className="row-fluid" key={`${pkg.package_name}_${i}`}>
                      <div className="span6 prod-name">{p.name}</div>
                      <div className="span6 text-right padding-right">${Math.round((p.price/selectedPayment)*100)/100}/Mo</div>
                    </div>
                  
                    <div className="row-fluid" key={`${pkg.package_name}v_${i}`}>
                      <div className="span6">{p.term} mo/{p.miles} mi</div>
                      <div className="span6 text-right padding-right">{(p.deductible !== null && p.deductible !== 0) ? `$${p.deductible} Ded` : ``}</div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
        <ul className="list-group print-list">
          {
            pkg.package_options.map((opt, i) => {
              return (
                <li key={`${pkg.package_name}_${i}_options`} className="list-group-item"> ____{opt.termrateoptions.term} months = ${opt.payment}</li>
              );
            })

          }
        </ul>
      </div>
    );
  }
}

export default PackageCard;