import axios from 'axios';
import config from '../config.js';

const HttpHelper = (url, method, reqData, includeDealerCode = true) => {
    if (`${config.credentialsFlag}` == 'false'){
        var credentialFlag = false;
    }else{
        var credentialFlag = true;
    }
    if (method.toLowerCase() == 'post') {
        if (reqData == undefined) {
            reqData = {};
        }
        var configs = {
            headers: { 'Content-Type': 'application/json', 'Dealer-Code': (window.dealerData) ? window.dealerData.dealer_code : '1112016' },
            'withCredentials' : credentialFlag
        };
        return new Promise((resolve, reject) => {
            axios.post(url, reqData, configs)
                .then(function (response) {
                    if (response.status == 200) {
                        resolve(response.data);
                    } else if (response.status == 404 || response.status == 500) {
                        reject();
                    }
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
    else {
        var configs = {
            headers: { 'Content-Type': 'application/json' },
            'withCredentials' : credentialFlag
        };
        if (includeDealerCode) {
            configs.headers = {
                'Content-Type': 'application/json',
                'Dealer-Code': (window.dealerData) ? window.dealerData.dealer_code : '1112016'
            };
        }
        return new Promise((resolve, reject) => {
            axios.get(url, configs)
                .then(function (response) {
                    if (response.status == 200) {
                        console.log(url, response.data);
                        resolve(response.data);
                    } else if (response.status == 404 || response.status == 500) {
                        reject();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    reject();
                });
        });

   }

};

export default HttpHelper;
