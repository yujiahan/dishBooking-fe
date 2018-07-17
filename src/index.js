
import ReactDOM from 'react-dom';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Supplier from './Supplier/index.js'
import SupplierEdit from './Supplier/edit.js'
import StorageEdit from './Storage/index.js'
import DishEdit from './DishEdit/index'

import App from './App'


ReactDOM.render((
  <Router>    
      <div>
        <Route path="/nav" component={App}/>  
        <Route path="/supplier" component={Supplier}/>  
        <Route path="/supplierEdit" component={SupplierEdit}/>  
        <Route path="/storage" component={StorageEdit}/>  
        <Route path="/mainPage/dishEdit" component={DishEdit}/>  
        {/* <Route path="/genChart" component={GenChart}/>   */}
      </div>    
   </Router>
), document.getElementById('root'))