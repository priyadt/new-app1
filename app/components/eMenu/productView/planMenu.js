import React, { Component } from 'react';

class PlanMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      package1Name: 'Platinum',
      package2Name: 'Gold',
      package3Name: 'Silver',
      package4Name: 'Basic'
    };
    this.renderPlan = this.renderPlan.bind(this);
  }

  getPackage1Name = (event) => {
    this.props.setPackageNames("package1", event.target.value);
  }

  getPackage2Name = (event) => {
    this.props.setPackageNames("package2", event.target.value);
  }

  getPackage3Name = (event) => {
    this.props.setPackageNames("package3", event.target.value);
  }

  getPackage4Name = (event) => {
    this.props.setPackageNames("package4", event.target.value);
  }
  renderPlan(planList) {
    var listProducts = planList.map((itm, index) =>
      <div style={{ "border": "1px solid #ccc", "padding": "3px 6px", "margin": " 5px" }} className="btn" key={"itmVl1" + index} >
        <span>{itm.title}</span>
      </div>
    );
    return listProducts;
  }
  render() {
    let { packagesNames } = this.props;
    return (
      <div className="plan-menu">
        <span id="prod-head">Products</span>
        <div className="menu-options">
          <div>
            <input type='text' className='form-control pkgname' defaultValue={packagesNames.package1} onBlur={this.getPackage1Name} ></input>
            <input type='text' className='form-control pkgname' defaultValue={packagesNames.package2} onBlur={this.getPackage2Name}  ></input>
            <input type='text' className='form-control pkgname' defaultValue={packagesNames.package3} onBlur={this.getPackage3Name}  ></input>
            <input type='text' className='form-control pkgname' defaultValue={packagesNames.package4} onBlur={this.getPackage4Name}  ></input>
          </div>
        </div>
      </div>
    )
  }
}
export default PlanMenu;
