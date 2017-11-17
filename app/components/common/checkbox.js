import React from 'react';

const Checkbox = (props) => {
    return (
        <label className="choices radio-inline">
            <input type="checkbox" className="radio"
            name={props.clientProductId+"-"+props.qId} checked={props.selected}
            onChange={()=>props.events(props.clientProductId,props.clientProductId+"-"+props.qId,props.categoryName,props.data)} />
            <span>{props.data.Desc}</span>
        </label>
    )
}

export default Checkbox
