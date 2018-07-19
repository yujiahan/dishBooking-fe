import React, { Component } from 'react'
import { Button, Accordion, List, Flex } from 'antd-mobile';
import moment from 'moment'
import axios from 'axios'

let cacheOrderData = {
    lastUpdateTime:"",
    data:[]
}; 

export default class DayOrder extends Component {
    state = {
        orderData: {
            lastUpdateTime:"",
            data:[]
        }

    }
    pullData() {
        axios.get('/chart/getDishRank').then((response) => {
            var newState = {
                lastUpdateTime: moment().format('YYYY:MM:DD hh:mm:ss'),
                data: response.data
            }
            this.setState({orderData: newState}) 
    
            cacheOrderData = Object.assign({}, newState) ;
        })
       /*  var result =  {
            data: [{
                "orderId": "0013810264abff1a0164b0bf750438c9",
                "dishList": [{
                    "name": "原钵蒸饭",
                    "amount": 3,
                    "unit": "碗"
                }, {
                    "name": "干煸豆角",
                    "amount": 1,
                    "unit": "份"
                }],
                "seatName": "B7",
                "receiveAmount": 160
            }]
        } */
    }
    componentDidMount(){
        this.setState({orderData : cacheOrderData})
    }
    render() {
        return (
            <div>
                 <p>数据更新时间:{this.state.orderData.lastUpdateTime}</p>
                     <Button size="small" type="ghost" inline onClick={()=>this.pullData()}>重新更新数据</Button>
                     <Accordion defaultActiveKey="0">
                        {
                            this.state.orderData.data.map((item)=>{
                                return (
                                    <Accordion.Panel key={item.orderId} header={item.seatName + " 消费" + item.receiveAmount}>
                                            <List>
                                                {
                                                    item.dishList.map((dish)=>{
                                                        return  <List.Item key={dish.name}>
                                                                    <Flex>
                                                                        <Flex.Item>{dish.name}</Flex.Item>
                                                                        <Flex.Item>售{dish.amount}{dish.unit}</Flex.Item>
                                                                    </Flex>
                                                                </List.Item>
                                                    })
                                                }
                                            </List>
                                        </Accordion.Panel>
                                    )
                            })
                        }
                     </Accordion>                
            </div>
        )
    }
            
}