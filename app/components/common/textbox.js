import React from 'react';

const TextBox = (props) => {
    return (
            <div className="answer">
            <input type="text" className={"form-control" + (props.data.isValid==false?' errorMsg':'')} style={{width:'20%'}}
                   name={props.clientProductId+"-"+props.qId} value={props.data.Value}
                   onChange={(event)=>props.events(props.clientProductId,props.clientProductId+"-"+props.qId,props.categoryName,event,props.caption)} />
            </div>
    );
};

export default TextBox;
