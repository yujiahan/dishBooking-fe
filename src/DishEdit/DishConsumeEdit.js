import React, { Component } from 'react'
import { Flex, List,  WhiteSpace, Toast, Picker, Button, InputItem, NavBar, Icon } from 'antd-mobile'
import axios from 'axios'

const SORTMAP = new Map([
        ['meat', '肉类'],
        ['vegat', '蔬菜'],
        ['flavor', '调料']
    ]
);
const ItemMap = {
    'meat': [
        {
            value: "牛肉",
            label: "牛肉"
        },
        {
            value: "鸡肉",
            label: "鸡肉"
        }
    ],
    'vegat': [
        {
            value: "青笋",
            label: "青笋"
        },
        {
            value: "黄瓜",
            label: "黄瓜"
        }
    ]
}

const pickerData = [[]];

for (let [k, v] of SORTMAP) {
    pickerData[0].push({
        label: v,
        value: k
    })
}

export default class DishConsumeEdit extends Component {
    state = {
        dishId: "",
        consumeList: [],
        showAddItem: false,
        sortValue: "meat",
        itemPickerData: [ItemMap.meat],
        addItemName: ItemMap.meat[0].value,
        addAmount: ""
    }
    componentDidMount(){
        let consumeList = this.props.match.params.consumeList.split(",");
        
        this.setState({consumeList: consumeList});
    }
    deleteConsume (idx){
        this.state.consumeList.splice(idx, 1);
        this.setState({consumeList: this.state.consumeList})
      
    }
    saveItemConsume () { 
            let self = this;
            let newConsumeList = this.props.match.params.consumeList.split(",")
            newConsumeList.push(this.state.addItemName + "|" + this.state.addAmount);

            axios.get('/dish/updateConsumeList/'+ self.props.match.params.dishId + '/' +   newConsumeList.join(","))
                .then(function (response) {
                    if(response.success) {
                        self.setState({consumeList: newConsumeList});
                        self.setState({showAddItem: false})
                    }
            });
    }
    showAdd () {
        this.setState({showAddItem: true})
    }
    render() {
        
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => {
                        this.props.history.goBack();
                    
                    }} >{this.props.match.params.dishName}录入</NavBar>       
                <List>
                    {
                        this.state.consumeList.map((item, idx) => {
                            return <List.Item 
                                        key={idx}
                                        extra={ <Button inline type="ghost" size="small" 
                                        onClick={()=>{
                                            this.deleteConsume({idx});
                                        }}>删除</Button>} >
                                    {item}
                                   
                                   </List.Item>
                        })
                    }
                </List>
                <WhiteSpace />
                <List>    
                    { this.state.showAddItem && 
                        <List.Item>
                            <Flex>
                                <Flex.Item>
                                    <Picker
                                        data={pickerData}
                                        title="选择类别"
                                        cascade={false}
                                        value={[this.state.sortValue]}
                                        onOk={(val) => {
                                            this.setState({ sortValue: val[0] });
                                            this.setState({ itemPickerData: [ItemMap[val[0]]]})
                                            this.setState({ addItemName: ItemMap[val[0]][0].value})
                                        }}
                                    >
                                        <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}>{SORTMAP.get(this.state.sortValue)}</div>
                                    </Picker>
                                </Flex.Item>
                                <Flex.Item>
                                    <Picker
                                        data={this.state.itemPickerData}
                                        title="选择原料"
                                        cascade={false}
                                        value={[this.state.addItemName]}
                                        onOk={(val) => {
                                            this.setState({ addItemName: val[0] })
                                        }}
                                    >
                                        <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}>{this.state.addItemName}</div>
                                    </Picker>
                                </Flex.Item>
                                <Flex.Item>
                                    <InputItem onChange={(val) => {
                                        this.setState({ addAmount: val })
                                    }} placeholder="数量" />
                                </Flex.Item>
                                <Flex.Item>
                                    <Button size="small" onClick={()=>{ this.saveItemConsume()}}>保存</Button>
                                </Flex.Item>
                            </Flex>
                        </List.Item>
                    }
                </List>
                <Button onClick={()=>{this.showAdd()}}>add</Button>
            </div>
        )
      }
            
}
