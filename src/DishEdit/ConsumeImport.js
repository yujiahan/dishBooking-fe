import React, { Component } from 'react'
import { Flex, List,  WhiteSpace, Toast, Picker, Button, InputItem,Grid } from 'antd-mobile'
import {
    Link
  } from 'react-router-dom'
import axios from 'axios'
import { SORTMAP }  from './common.js'
const pickerData = [[]];
for (let [k, v] of SORTMAP) {
    pickerData[0].push({
        label: v,
        value: k
    })
}
export default class ConsumeImport extends Component {
    state = {
        dishList: [],
        sortValue: 'meat',
    }
    componentDidMount(){
        let self = this;
        axios.get('/dish/getAllDish')
            .then(function (response) {
                self.setState({ dishList: response.data })
        });
    }
    pullDishData(){
        let self = this;
        axios.get('/dish/updateDish')
            .then(function (response) {
               if(response.data.success > 0) {
                    Toast.show("更新了" + response.data.success  + "条数据");
                    axios.get('/dish/getAllDish')
                        .then(function (newDishResponse) {
                            self.setState({ dishList: newDishResponse.data })
                    });
               }
        });
    }
    render() {
        return (
            <div>
                <Button>从二维火拉取菜品</Button>
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