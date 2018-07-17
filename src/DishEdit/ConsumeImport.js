import React, { Component } from 'react'
import { Flex, List,  WhiteSpace, Toast, Picker, Button, InputItem,Grid } from 'antd-mobile'
import {
    Link
  } from 'react-router-dom'
import axios from 'axios'
const SORTMAP = new Map([
    ['meat', '肉类'],
    ['vegat', '蔬菜'],
    ['flavor', '调料']
]
);
const pickerData = [[]];
for (let [k, v] of SORTMAP) {
    pickerData[0].push({
        label: v,
        value: k
    })
}
export default class ConsumeImport extends Component {
    state = {
        dishList: [
            {code : 123,  name: "cai1", consume_list: "牛肉|3,青笋|1"},
            {code : 234,  name: "cai2"},
            {code : 2344, name: "cai3"},
            {code : 1233, name: "cai4"}
        ],
        itemList: [{
            item_id: 1, name: "青笋",
            item_id: 2, name: "牛肉"
        }],
        sortValue: 'meat',
    }

    render() {
        return (
            <div>
                <Grid   data={this.state.dishList}
                        columnNum={3}
                        renderItem={dataItem => (
                            <div style={{ padding: '12.5px' }}>                               
                                <div style={{ color: 'rgb(16, 142, 233)', fontSize: '18px', marginTop: '12px' }}>
                                   <Link to={"/dishConsume/"+ dataItem.code + "/"+ dataItem.consume_list + "/" + dataItem.name} >{dataItem.name}</Link>
                                </div>
                                <div style={{fontSize: '12px'}}>{dataItem['consume_list']}</div>
                            </div>
                        )}
                />   
            </div>
        )
    }
}