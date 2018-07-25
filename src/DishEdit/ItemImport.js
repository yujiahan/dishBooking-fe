import React, { Component } from 'react'
import { Flex, List,  WhiteSpace, Toast, Picker, Button, InputItem } from 'antd-mobile'
import axios from 'axios'
import { SORTMAP }  from './common.js'

const pickerData = [[]];
for (let [k,v] of SORTMAP) {
        pickerData[0].push({
            label: v,
            value: k
        })
 }
export default class ItemImport extends Component {
    state = {
        dishName: "",
        sortValue: 'meat',
        remark: "",
        itemList: []
    }
    componentWillMount() {
        this.getAllItemList();
    }
    getAllItemList() {
        let self = this;
        axios.get('/dish/getAllItem')
            .then(function (response) {
                self.setState({ itemList: response.data })
            });
    }

    addDishItem(sortVal, dishName, remark) {
        axios.get('/dish/addItem/' + sortVal + "/" + dishName + "/" + (remark||"空")).then((response) => {
            if (response.data.success) {
                Toast.info('添加成功')
                this.getAllItemList();
            }
        }).catch(function(err) {
            Toast.info("保存失败")
        });
    }
    render() {
        return (
            <div>
                <List>
                    <List.Item >
                        <Flex>
                            <Flex.Item>
                                <Picker
                                    data={pickerData}
                                    title="选择类别"
                                    cascade={false}
                                    extra="请选择(可选)"
                                    value={[this.state.sortValue]}
                                    onOk={(val) => {
                                        this.setState({ sortValue: val[0] })
                                    }}
                                >
                                    <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}>{SORTMAP.get(this.state.sortValue)}</div>
                                </Picker>
                            </Flex.Item>
                            <div style={{flex:2}}> 
                                <InputItem onChange={(val) => {
                                    this.setState({ dishName: val })
                                }} placeholder="原料名称" />
                            </div>
                            <Flex.Item>
                                <InputItem onChange={(val) => {
                                    this.setState({ remark: val })
                                }} placeholder="备注" />
                            </Flex.Item>
                        </Flex>
                    </List.Item>
                </List>
                <Button icon="check-circle-o" onClick={() => this.addDishItem(this.state.sortValue, this.state.dishName, this.state.remark)} >确认添加</Button><WhiteSpace />
                <div>原料list</div>
                {
                    this.state.itemList.map((item) => {
                        return <p key={item.item_id}>{item.item_name}</p>
                    })
                }
            </div>
        )
    }
}