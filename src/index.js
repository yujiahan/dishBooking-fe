
import ReactDOM from 'react-dom';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Supplier from './Supplier/index.js'
import SupplierEdit from './Supplier/edit.js'
import Storage from './Storage/index.js'

import App from './App'


ReactDOM.render((
  <Router>    
      <div>
        <Route path="/nav" component={App}/>  
        <Route path="/supplier" component={Supplier}/>  
        <Route path="/supplierEdit" component={SupplierEdit}/>  
        <Route path="/storage" component={Storage}/>  
      </div>    
   </Router>
), document.getElementById('root'))