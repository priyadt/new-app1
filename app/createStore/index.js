import { combineReducers } from 'redux';
import {
	setInitialValuesReducer,
	getPackageDetailsReducer,
	getPrintNamesReducer,
	getVehicleDataReducer,
	getFinancialDataReducer,
	getTradeinVehiclesReducer,
	setTermRateOptionsReducer,
	setPaymentOptionScenarioReducer,
	setPackagesNamesReducer,
	setSelectedPackageInfoReducer
} from '../reducers/reducers';
import rates from '../reducers/provider-rates';
import product from '../reducers/product';

export default combineReducers({
	setInitialValues: setInitialValuesReducer,
	printNames: getPrintNamesReducer,
	vehicleData: getVehicleDataReducer,
	financialInfo: getFinancialDataReducer,
	dealerPackage: getPackageDetailsReducer,
	tradeinData: getTradeinVehiclesReducer,
	termRateOptions: setTermRateOptionsReducer,
	setPaymentOptionScenario: setPaymentOptionScenarioReducer,
	packagesNames: setPackagesNamesReducer,
	rates,
	product,
	selectedPackageInfo: setSelectedPackageInfoReducer
});
