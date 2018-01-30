import React, { Component } from 'react'
import {observer} from "mobx-react";
import { Button } from 'antd-mobile';
import store from store.js

@observer
export default class Test extends Component {
    render() {
        const { body, visible, store } = this.props
        return (
            <Button>试试</Button>
        )
    }
            
}