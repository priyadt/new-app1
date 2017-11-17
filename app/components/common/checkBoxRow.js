import React, { Component } from 'react';

class CheckBoxRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlan1Selected:  props.isPlan1Selected,
            isPlan2Selected:  props.isPlan2Selected,
            isPlan3Selected:  props.isPlan3Selected,
            isPlan4Selected:  props.isPlan4Selected
        }
        this.onPlanChange = this.onPlanChange.bind(this);
    }

    onPlanChange = (plan) => {
        let isSelected = false;
        switch (plan) {
            case 'plan1':
                isSelected = !this.state.isPlan1Selected;
                this.setState({
                    isPlan1Selected: !this.state.isPlan1Selected
                }, () => {
                    setTimeout(() => {
                        this.props.onPlanChangeStep2(plan, isSelected)
                    }, 1)
                });
                break;
            case 'plan2':
                isSelected = !this.state.isPlan2Selected;
                this.setState({
                    isPlan2Selected: !this.state.isPlan2Selected
                }, () => {
                    setTimeout(() => {
                        this.props.onPlanChangeStep2(plan, isSelected)
                    }, 1)
                });
                break;
            case 'plan3':
                isSelected = !this.state.isPlan3Selected;
                this.setState({
                    isPlan3Selected: !this.state.isPlan3Selected
                }, () => {
                    setTimeout(() => {
                        this.props.onPlanChangeStep2(plan, isSelected)
                    }, 1)
                });
                break;
            case 'plan4':
                isSelected = !this.state.isPlan4Selected;
                this.setState({
                    isPlan4Selected: !this.state.isPlan4Selected
                }, () => {
                    setTimeout(() => {
                        this.props.onPlanChangeStep2(plan, isSelected)
                    }, 1)
                }); break;
        }
    }

    render() {
        return (
            <span className="row">
                <input type="checkbox" checked={this.state.isPlan1Selected} key="platinum" onChange={(event) => { this.onPlanChange('plan1') }} value={this.state.platinum} />
                <input type="checkbox" checked={this.state.isPlan2Selected} key="gold" onChange={(event) => { this.onPlanChange('plan2') }} value={this.state.gold} />
                <input type="checkbox" checked={this.state.isPlan3Selected} key="silver" onChange={(event) => { this.onPlanChange('plan3') }} value={this.state.silver} />
                <input type="checkbox" checked={this.state.isPlan4Selected} key="basic" onChange={(event) => { this.onPlanChange('plan4') }} value={this.state.basic} />
            </span>
        )
    }
}

export default CheckBoxRow;
