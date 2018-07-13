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
                    <li><Link to="supplier">供应商管理</Link></li>
                    <li><Link to="storage">采购入库</Link></li>
                </ul>  
            </div>
          </div>
        )
      }
            
}