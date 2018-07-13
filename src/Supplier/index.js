import React, { Component } from 'react'
import SupplierStore from './store'
import { observer } from "mobx-react";
import {
     Link
} from 'react-router-dom'

@observer
export default class Supplier extends Component {
    
    render() {
        let { suppliers } = SupplierStore;

        return (
            <div>   
                <Link to="supplierEdit">新增供应商</Link>                   
                { suppliers.map((supplier) =>
                    <li key={supplier.id}>{supplier.name}</li>
                )}
            </div>
        )
    }
            
}