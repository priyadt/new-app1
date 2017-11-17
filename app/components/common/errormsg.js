import React from 'react';

const ErrorMsg = (props) => {
    return (
        <div style={{backgroundColor:'transparent',color:'red'}}>
            <ul style={{listStyle: 'none',marginBottom:'0px',paddingLeft: '18px'}}>
                <li><span><sup style={{"color":"red"}}>*</sup></span><strong>{props.Caption} </strong><span /></li>
            </ul>
        </div>
    );
};

export default ErrorMsg;
