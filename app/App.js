import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './createStore';
import Emenu from './components/eMenu/eMenu';
import InvoiceView from './components/eMenu/invoice/invoiceView.js';
import PrintFinal from './components/eMenu/invoice/printFinal.js';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(reducers, composeWithDevTools(
  applyMiddleware(thunk),
  
));


class App extends Component {

  render() {
    let content = '';
    let container = 'container';
    if (window.location.href.indexOf('printselection') > -1) {
      content = <InvoiceView />
    } else if (window.location.href.indexOf('printFinalMenu') > -1) {
      content = <PrintFinal />
    } else {
      content = <Emenu />
      container = 'container-fluid';
    }

    return (
      <Provider store={store}>
        <div>
          <div className={container} style={{ marginTop: '10px' }}>
            {content}
          </div>
        </div>
      </Provider>
    );
  }
}
export default App;
