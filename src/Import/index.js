import React, { Component } from 'react'
import { Tabs, WhiteSpace, Button, Calendar, InputItem} from 'antd-mobile';

import axios from 'axios'

const tabs = [
    { title: '营业数据导入' },
    { title: '退菜数据导入' }
  ];
export default class Import extends Component {
    state = {
        dateShow :false,
        start: "",
        data: ""
    }
    onConfirmDate(date){
        this.setState({
            start: date,
            dateShow: false
        })


    } 
    submit(){
        var BDataMap = new Map();
        var data =  JSON.parse(this.state.data).data.rows;
        
        data.map((item)=>{
            var date = item['账单号'].slice(0, 8)
            if(!BDataMap.get(date)) {
                BDataMap.set(date, [])
            }
            BDataMap.get(date).push(item['桌位或订单来源']+"|" + item['实收额']+"|" +item['折扣率'])
        })

        axios.post('/import/busData',{data: {
            start: this.state.start,
            bData: [...BDataMap]
        }})
    }
    render() {
        return (
            <div>
                <WhiteSpace />
                <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                    <p onClick={()=>this.setState({dateShow: true})}>选择日期</p>
                    <InputItem
                        onChange={(val)=>{
                            this.setState({
                                data: val
                            })
                        }}
                        placeholder="营业数据json"
                    />
                    <Button onClick={()=>{this.submit()}}>提交</Button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                    Content of second tab
                </div>         
                </Tabs>
                <WhiteSpace />
                <Calendar
                    type ="one"
                    visible={this.state.dateShow}  
                    onCancel={()=>{
                        this.setState({dateShow: false})
                    }}                 
                    onConfirm={(start,end)=>{this.onConfirmDate(start,end)}}                   
                />
            </div>
        )
    }
            
}