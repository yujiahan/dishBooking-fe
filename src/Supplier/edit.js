import React, { Component } from 'react'
import SupplierStore from './store'
import { observer } from "mobx-react";
import { Button } from 'antd-mobile';
import {
     Link
} from 'react-router-dom'

@observer
export default class SupplierEdit extends Component {
    
    render() {
        return (
            <div>   
                 <Button onClick={()=> SupplierStore.addNew({id: "2", name:"xx", phone:"12323"})}>增加供货商</Button>
            </div>
        )
    }
            
}