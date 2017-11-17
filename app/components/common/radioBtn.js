import React from 'react';

const Radio = (props) => {
    return (
        <div className="answer" style={{display:'inline-block'}}>
        <label className="choices">
            <input type="radio" className="radio"
            name={props.clientProductId+"-"+props.qId} checked={props.selected}
            onChange={()=>props.events(props.clientProductId,props.clientProductId+"-"+props.qId,props.categoryName,props.data,props.caption)} />
            <span  className={(props.isValid==false?' errorMsgText':'')}>{props.data.Desc}</span>
        </label></div>
    );
};

export default Radio;
