import React, { Component } from 'react';

export default class RatesOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: props.isSelected
    };
  }
  onChange(e) {
    const option = {
      checked: !this.state.isChecked,
      price: this.props.opt.RetailRate,
      OptionId: this.props.opt.OptionId,
      index: this.props.index,
      OptionName: this.props.opt.OptionName,
      OptionDesc: this.props.OptionDesc
    };

    this.props.onSelect(option);
    this.setState({
      isChecked: !this.state.isChecked
    });
  }
  render() {
    let options = { checked: false, disabled: false };
    if (this.state.isChecked) {
      options.checked = true;
    }
    if (this.props.IsSurcharge) {
      options.disabled = true;
    }

    return (
      <p>
        <input id={"ProductCheckbox"+(this.props.index+1)} type="checkbox" {...options} onChange={e => this.onChange(e)} />
        <span className="r-small-left-padding">{this.props.OptionDesc}
        </span>
      </p>);
  }
}
