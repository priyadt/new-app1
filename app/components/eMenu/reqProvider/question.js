import React from 'react';
import _ from 'lodash';
import Radio from '../../common/radioBtn';
import Select from '../../common/select';
import TextBox from '../../common/textbox';
import Calender from '../../common/datepicker';

const Question = (props) => {

    if (props.data.ControlType == "Calendar") {

        return (<div style={{ height: '55px' }}>
            <span>
                <div style={{ width: '40%', marginLeft: '16px', display: 'inline-block' }}>{props.data.Caption}</div>
                <Calender data={props.data} events={props.events.opendatepicker} />
            </span>
        </div>);
    }
    else {
        return (
            <div style={{ height: props.data.FieldValues && props.data.FieldValues.length || props.data.ControlType == 'Textbox' ? '50px': 0 }}>
                {
                    (typeof props.data.FieldValues == undefined) ? <div /> :
                        <span>  {(typeof props.data.FieldValues != undefined && props.data.FieldValues.length > 0) || props.data.ControlType == 'Textbox' ?
                            <div style={{ width: '40%', marginLeft: '16px', display: 'inline-block' }}>{props.data.Caption}</div> : null}
                            <form style={{ display: 'inline-block' }}>
                                <div className="radio" style={{ display: 'inline-block' }}>
                                    <div className="control-group" style={{ padding: '0px' }}>
                                        {typeof props.data.FieldValues != undefined && props.data.FieldValues.length <= 4 ?
                                            _.map(props.data.FieldValues, function (c, i) {
                                                return <Radio key={props.clientproductId + "-" + i} isValid={props.data.isValid} caption={props.data.Caption} data={c} categoryName={props.categoryName} clientProductId={props.clientproductId} selected={props.data.Value == c.Code ? true : false} qId={props.qId} events={props.events.eMenuOptionselect} />;
                                            })
                                            : <Select data={props.data} categoryName={props.categoryName} caption={props.data.Caption}
                                                clientProductId={props.clientproductId} qId={props.qId} events={props.events.eMenuOptionselect} />
                                        }
                                        {props.data.ControlType == 'Textbox' &&
                                            <TextBox data={props.data} categoryName={props.categoryName} caption={props.data.Caption}
                                                clientProductId={props.clientproductId} qId={props.qId} events={props.events.eMenuOptionselect} />
                                        }
                                    </div>
                                </div>
                            </form>
                        </span>
                }

            </div>
        );
    }
};

export default Question;
