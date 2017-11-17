import React from 'react';
import { updateProductRate, updateProductRateCost, updatePlanRate, updatePlanPrice } from '../../../actions/actions';
import RatesOptions from './rateOptions';
import ProductDetails from './productDetails';

class ExpandedProduct extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row-fluid" id={"productDetailSection"+this.props.idNum} key={getKey(this.props.product.id, this.props)}>
        <ProductDetails
          providerId={this.props.providerId}
          providerCode={this.props.providerCode}
          productCode={this.props.productCode}
          providerName={this.props.providerName}
          name="package1"
          plan="plan1"
          product={this.props.product}
          key={getKey('PLATINUM', this.props)}
          showMore={this.props.showMore}
          userPrefernce={this.props.userPrefernce}
          packageNum='1'
        />
        <ProductDetails
          providerId={this.props.providerId}
          providerCode={this.props.providerCode}
          providerName={this.props.providerName}
          productCode={this.props.productCode}
          name="package2"
          plan="plan2"
          product={this.props.product}
          key={getKey('GOLD', this.props)}
          showMore={this.props.showMore}
          userPrefernce={this.props.userPrefernce}
          packageNum='2'
        />
        <ProductDetails
          providerId={this.props.providerId}
          providerCode={this.props.providerCode}
          providerName={this.props.providerName}
          productCode={this.props.productCode}
          name="package3"
          plan="plan3"
          product={this.props.product}
          key={getKey('SILVER', this.props)}
          showMore={this.props.showMore}
          userPrefernce={this.props.userPrefernce}
          packageNum='3'
        />
        <ProductDetails
          providerId={this.props.providerId}
          providerCode={this.props.providerCode}
          providerName={this.props.providerName}
          productCode={this.props.productCode}
          name="package4"
          plan="plan4"
          product={this.props.product}
          key={getKey('BASIC', this.props)}
          showMore={this.props.showMore}
          userPrefernce={this.props.userPrefernce}
          packageNum='4'
        />
      </div>
    );
  }
}
function getKey(type, props) {
  if(props.providerCode !== null)
    return `${type}-${props.providerId}-${props.providerCode}-${props.productCode}`;
  else  return `${type}-${props.providerId}-NR-${props.productCode}`;
}

export default ExpandedProduct;
