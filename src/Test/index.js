import React, { Component } from 'react'
import {observer} from "mobx-react";
import { Button } from 'antd-mobile';
import './store.js';

@observer
export default class Test extends Component {
    render() {
        return (
            <Button>{'testStore.aaa'}</Button>
        )
    }
            
}