import React, { Component } from 'react'
import {
    Link
  } from 'react-router-dom'

export default class App extends Component {
    render() {
        return (
          <div>
            <div className="master">
                <ul>
                    <li><Link to="/dishEdit">菜品test录入</Link></li>
                    <li><Link to="/showChart">报表</Link></li>
                </ul>  
            </div>
          </div>
        )
      }
            
}