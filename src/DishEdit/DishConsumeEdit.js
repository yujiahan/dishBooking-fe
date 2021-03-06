import React, { Component } from 'react'
import { Flex, List,  WhiteSpace, Toast, Picker, Button, InputItem, NavBar, Icon } from 'antd-mobile'
import axios from 'axios'
import { SORTMAP }  from './common.js'
let ItemMap = {};
for (var key of SORTMAP.keys()) {
    ItemMap[key] = [];
}

let pickerData = [[]];

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
        addItemName: "牛肉",
        addAmount: ""
    }
    componentDidMount(){
        let consumeList = this.props.match.params.consumeList !=="null"? this.props.match.params.consumeList.split(","): [];
        
        axios.get('/dish/getAllItem').then(function (response) {
            var itemData = response.data;
            
            for (var key of SORTMAP.keys()) {
                ItemMap[key].length = 0;
                itemData.forEach((item)=>{
                    if(item.item_sort === key) {
                        ItemMap[key].push({
                            value: item['item_name'],
                            label: item['item_name']
                        });
                    }
                })
            }
        });
        
       
        
        this.setState({consumeList: consumeList});
    }
    deleteConsume (idx){
        this.state.consumeList.splice(idx, 1);
        this.setState({consumeList: this.state.consumeList})
      
    }
    saveCurrentItem(){
        var self = this;
        var hasDuplicatItem = this.state.consumeList.some((item) => { //是否有重复元素
            return self.state.addItemName  === item.split("|")[0];
        })
        if(hasDuplicatItem) {
            Toast.show("有重复元素");

            return;
        } 
        if( self.state.addAmount === "") {
            Toast.show("请输入数量");

            return;
        }
        this.state.consumeList.push(this.state.addItemName + "|" + this.state.addAmount)
        this.setState({consumeList:this.state.consumeList});
        this.clearNewAddinput();

    }
    clearNewAddinput(){
        this.setState({
            sortValue: "meat",
            itemPickerData: [ItemMap.meat],
            addItemName: "牛肉",
            showAddItem: false,
            addAmount: ""
        })
    }
    saveItemConsume () { 
            let self = this;

            axios.get('/dish/updateConsumeList/'+ self.props.match.params.dishId + '/' +   this.state.consumeList.join(","))
                .then(function (response) {
                    if(response.data.success) {
                        Toast.show("保存成功")
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
                                    <InputItem 
                                       value={this.state.addAmount}
                                       onChange={(val) => {
                                        this.setState({ addAmount: val })
                                    }} placeholder="数量" />
                                </Flex.Item>
                                <Flex.Item>
                                    <Button size="small" onClick={()=>{ this.saveCurrentItem()}}>暂存</Button>
                                </Flex.Item>
                            </Flex>
                        </List.Item>
                    }
                </List>
                <Button onClick={()=>{this.showAdd()}}>add</Button>
                <Button onClick={()=>{this.saveItemConsume()}}>最终保存</Button>
            </div>
        )
      }
            
}
