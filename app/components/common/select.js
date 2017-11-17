import React from 'react';

const Select = (props) => {
    let FieldValues = [];
    if (!props.data.Value) {
        FieldValues = props.data.FieldValues;
        if (FieldValues[0].Code != "please select") {
            FieldValues.unshift({ "Code": "please select", "Desc": "Please select" });
        }
    } else {
        FieldValues = props.data.FieldValues;
    }

    let options = FieldValues.map((c, i) => {
        return <option key={i} value={c.Code}>{c.Desc}</option>;
    });

    return (
        <div className="answer">
            <select className={"form-control" + (props.data.isValid == false ? ' errorMsg' : '')} style={{ width: 'auto' }} value={props.data.Value}
                onChange={(event) => props.events(props.clientProductId, props.clientProductId + "-" + props.qId, props.categoryName, event, props.caption)} >
                {options}
            </select>
        </div>
    );
};

export default Select;
