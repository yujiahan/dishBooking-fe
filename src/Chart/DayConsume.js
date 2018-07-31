import React, { Component } from 'react'
import { Button, Accordion, List, Flex } from 'antd-mobile';
import axios from 'axios'

let cacheConsumeData = {
    lastUpdateTime:"",
    data:[]
}; 

export default class DayConsume extends Component {
    state = {
        consumeData: {
            lastUpdateTime:"",
            data:[]
        }
        

    }
    pullData() {
        axios.get('/chart/getDishConsumeList').then((response) => {
            var consumeList = {
                lastUpdateTime: response.data.lastUpdateTime,
                data: response.data.data
            }
            this.setState({consumeData : consumeList})
            cacheConsumeData = Object.assign({}, consumeList) ;
        })
        
    }
    componentDidMount(){
        this.setState({consumeData : cacheConsumeData})
    }
    render() {
        return (
            <div>
                 <p>数据更新时间:{this.state.consumeData.lastUpdateTime}</p>
                     <Button size="small" type="ghost" inline onClick={()=>this.pullData()}>重新更新数据</Button>
                     <Accordion defaultActiveKey="0">
                        {
                            this.state.consumeData.data.map((item)=>{
                                return (
                                    <Accordion.Panel key={item.name} header={item.name + " 消耗" + item.totalConsume}>
                                            <List>
                                                {
                                                    item.saleDishList.map((dish)=>{
                                                        return  <List.Item key={dish.name}>
                                                                    <Flex>
                                                                        <Flex.Item>{dish.name}</Flex.Item>
                                                                        <Flex.Item>售{dish.num}份</Flex.Item>
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