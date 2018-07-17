import React, { Component } from 'react'
import { Flex, List,  WingBlank, WhiteSpace, Toast, Picker, Button, InputItem } from 'antd-mobile'
import axios from 'axios'
const SORTMAP = new Map([
                            ['meat', '肉类'],
                            ['vegat', '蔬菜'],
                            ['flavor', '调料']
                        ]
                );
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
        itemList: [
            {
                code: 1,
                name: "qingsun"
            }, {
                code: 2,
                name: "niurou"
            }
        ]
    }
    componentWillMount() {
        //this.getAllItemList();
    }
    getAllItemList() {
        let self = this;
        axios.get('/dish/getAllItem')
            .then(function (response) {
                self.state.setState({ itemlist: response })
            });
    }

    addDishItem(sortVal, dishName) {
        axios.get('/dish/addItem/' + sortVal + "/" + dishName).then((response) => {
            if (response.success) {
                Toast.info('添加成功')
            }
        })
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
                            <Flex.Item>
                                <InputItem onChange={(val) => {
                                    this.setState({ dishName: val })
                                }} placeholder="原料名称" />
                            </Flex.Item>
                        </Flex>
                    </List.Item>
                </List>
                <Button icon="check-circle-o" onClick={() => this.addDishItem(this.state.sortValue, this.state.dishName)} >确认添加</Button><WhiteSpace />
                <div>原料list</div>
                {
                    this.state.itemList.map((item) => {
                        return <p key={item.code}>{item.name}</p>
                    })
                }
            </div>
        )
    }
}