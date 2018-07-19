import React, { Component } from 'react'
import { Button, Accordion, List, Flex } from 'antd-mobile';
import moment from 'moment'
import axios from 'axios'

let cacheSaleData = {
    lastUpdateTime:"",
    data:[]
}; 

export default class DaySale extends Component {
    state = {
        saleData: {
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
            this.setState({saleData: newState}) 
    
            cacheSaleData = Object.assign({}, newState);
        })
       /*  var result = {
            "data": [
               {
                    "dishName": "原钵蒸饭",
                    "dishUnit": "碗",
                    "accountNum": 90
                },
                {
                    "dishName": "sdfsdf",
                    "dishUnit": "碗",
                    "accountNum": 10
                }]
         } */
    }
    componentDidMount(){
        this.setState({saleData : cacheSaleData})
    }
    render() {
        return (
            <div>
                 <p>数据更新时间:{this.state.saleData.lastUpdateTime}</p>
                     <Button size="small" type="ghost" inline onClick={()=>this.pullData()}>重新更新数据</Button>
                     <List>
                        {
                            this.state.saleData.data.map((dish)=>{
                                return (  <List.Item key={dish.dishName}>
                                                <Flex>
                                                    <Flex.Item>{dish.dishName}</Flex.Item>
                                                    <Flex.Item>售{dish.accountNum}{dish.dishUnit}</Flex.Item>
                                                </Flex>
                                            </List.Item>
                                        )
                                                
                                })
                        }
                     </List>
            </div>
        )
    }
            
}