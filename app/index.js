import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { populateDealerData } from './helper/index.js';

let status = false;

let queryparam = function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}


if (window.location.href.indexOf('printselection') > -1 || window.location.href.indexOf('printFinalMenu') > -1) {
    var hrefArr = window.location.href.split('#/')[1].split('/');
    window.dealerData = {};
    window.dealerData.dealid = hrefArr[2]
    window.dealerData.dealjacketid = hrefArr[1]
    window.dealerData.dealer_code = hrefArr[3]
}

if (window.dealerData) {

window.dealerData.deal_type = queryparam().deal_type;

}

populateDealerData();

ReactDOM.render(<App />, document.getElementById('root'));

// var timer = setInterval(function () {
//     if (!status) {
//         if (window.dealerData) {
//             getWinObj();
//             status = true;
//         }
//     } else {
//         myStopFunction()
//     }
// }, 300)
//
// function myStopFunction() {
//     clearInterval(timer);
// }
//
// function getWinObj() {
//     if (window.dealerData) {
//         window.dealerData.deal_type = queryparam().deal_type;
//         populateDealerData()
//         ReactDOM.render(<App />, document.getElementById('root'));
//     }
// }
