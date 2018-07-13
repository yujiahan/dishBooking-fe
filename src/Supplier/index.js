import React, { Component } from 'react'
import SupplierStore from './store'
import { Button } from 'antd-mobile';
import {observer} from "mobx-react";

@observer
export default class Supplier extends Component {
    
    render() {
        let { suppliers } = SupplierStore;

        return (
            <div>
                <Button onClick={()=>SupplierStore.addNew({id: "2", name:"xx", phone:"12323"})}></Button>
                { suppliers.map((supplier) =>
                    <li key={supplier.id}>{supplier.name}</li>
                )}
            </div>
        )
    }
            
}