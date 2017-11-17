import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTermRateOptions } from '../../../actions/actions';
import GridView from './GridView';

class TermRate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showGridView: false,
      optionTypes: [
        { name: 'option 1', position: 1, pointer: 0, title: 'option1' },
        { name: 'option 2', position: 2, pointer: 1, title: 'option2' },
        { name: 'option 3', position: 3, pointer: 2, title: 'option3' },
        { name: 'option 4', position: 4, pointer: 3, title: 'option4' }
      ]
    };
    this.promoteHandle = this.promoteHandle.bind(this);
    this.openGridView = this.openGridView.bind(this);

  }
  openGridView(open){
    this.setState({ showGridView: open});
  }
  onEditClick(event){
    this.setState({ showGridView: true});
    this.props.editTermRate();
  }

  promoteHandle() {
    return this.props.events(this.props.termRateOptions.options.termrateoptions);

  }
  render() {

    let options = this.state.optionTypes;

    return (
      <div className="row">
        <div className="row rootborder"><div className="col-xs-12 emenucol-head" style={{ padding: '10px' }}>
          <span id="TermRateTitleSpan" className="term-rate">Term & Rate Options</span>
          {!this.state.showGridView &&
            <strong style={{ float: 'right', cursor: 'pointer', textDecoration: 'underline', color: '#3f3fb5' }} id="TermRateEditButton" onClick={this.onEditClick.bind(this)}>Edit</strong>}
          <div className="App">
            <GridView showGridView={this.state.showGridView} openGridView={this.openGridView}
              options={this.state.optionTypes} selectedOption={'BALL'} ref="grid" promot={this.promoteHandle} hasChangedTermOptionsData={this.props.hasChangedTermOptionsData} hasRenderedPackagePmt={this.props.hasRenderedPackagePmt} />
          </div>
        </div></div>
        <button className="btn btn-primary pull-right btn-cus" type="button" id="GetRatesButton" onClick={() => { this.refs['grid'].wrappedInstance.submitHandle(); }}>get rates</button>
      </div>
    );
  }


}
//export default TermRate;
const mapStateToprops = state => ({
  termRateOptions: state.termRateOptions
});
const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(mapStateToprops, mapDispatchToProps, null, { withRef: true })(TermRate);
