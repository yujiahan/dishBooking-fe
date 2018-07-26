
import ReactDOM from 'react-dom';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import Chart from './Chart/index.js'
import DishEdit from './DishEdit/index'
import DishConsumeEdit from './DishEdit/DishConsumeEdit.js'

import App from './App'


ReactDOM.render((
  <Router>    
      <div>
        <Route path="/dishEdit" component={DishEdit}/>  
        <Route path="/nav" component={App}/>  
        <Route path="/showChart" component={Chart}/>  
        <Route path="/dishConsume/:dishId/:consumeList/:dishName" component={DishConsumeEdit}/>  
        {/* <Route path="/genChart" component={GenChart}/>   */}
      </div>    
   </Router>
), document.getElementById('root'))