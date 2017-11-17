import {
	SET_INITIAL_VALUES,
	PRINT_NAMES_LIST,
	VEHICLE_DATA,
	DEALER_PACKAGE_DATA,
	FINANCIAL_DATA,
	TRADEIN_VEHICLE_DATA,
	SET_PAYMENT_SCENARIO,
	SET_PACKAGE_NAMES,
	SET_SELECTEDPACKAGE_INFO,
	UPDATE_TOTAL_PACKAGE_PRICE,
	SET_TERM_RATE_OPTIONS
} from '../constants';


export var setInitialValuesReducer = (state = {}, action) => {
	switch (action.type) {
		case SET_INITIAL_VALUES:
			return action.value;
		default:
			return state;
	}
};
// updating the store
export var getPrintNamesReducer = (state = {}, action) => {
	switch (action.type) {
		case PRINT_NAMES_LIST:
			return action.printNames;
		default:
			return state;
	}
};
export var getVehicleDataReducer = (state = {}, action) => {
	switch (action.type) {
		case VEHICLE_DATA:
			return action.vehicleData;
		default:
			return state;
	}
};
export var getPackageDetailsReducer = (state = [], action) => {
	switch (action.type) {
		case DEALER_PACKAGE_DATA:
			return action.dealerPackagInfo;
		default:
			return state;
	}
};
export var getFinancialDataReducer = (state = {}, action) => {
	switch (action.type) {
		case FINANCIAL_DATA:
			return action.financialData;
		default:
			return state;
	}
};
export var getTradeinVehiclesReducer = (state = {}, action) => {
	switch (action.type) {
		case TRADEIN_VEHICLE_DATA:
			return action.tradeinData;
		default:
			return state;
	}
};
export var setTermRateOptionsReducer = (state = {}, action) => {
	switch (action.type) {
		case SET_TERM_RATE_OPTIONS:
			return action.payload;
		default:
			return state;
	}
};
export const setPaymentOptionScenarioReducer = (state = [], action) => {
	switch (action.type) {
		case SET_PAYMENT_SCENARIO:
			return action.paymentOptions;
		default:
			return state;
	}
};

const defaultPackagesNames = {
	"package1": "PLATINUM",
	"package2": "GOLD",
	"package3": "SILVER",
	"package4": "BASIC"
};
export const setPackagesNamesReducer = (state = defaultPackagesNames, action) => {
	switch (action.type) {
		case SET_PACKAGE_NAMES:
			return action.packageNames;
		default:
			return state;
	}
};

export const setSelectedPackageInfoReducer = (state = {}, action) => {
	switch (action.type) {
		case SET_SELECTEDPACKAGE_INFO:
			return action.packageInfo;
		default:
			return state;
	}
};
