import React, { Component } from 'react'
import { NavBar, Icon, List, Drawer } from 'antd-mobile';
import DayConsume from './DayConsume.js';
import DaySale from './DayDishSale.js';
import DayOrder from './DayOrderList.js';

export default class Chart extends Component {
    state  =  {
        open: false,
        tab: "dayOrder"
    }
    changeTab(tabName) {
        this.setState({ tab: tabName });
        this.setState({open: false})
    }

    onOpenChange(){
        this.setState({open: !this.state.open})
    }
    render() {
        const sidebar = (<List>
            <List.Item key={0} onClick={()=> {this.changeTab('dayOrder')}} >订单列表</List.Item>
            <List.Item key={1} onClick={()=> {this.changeTab('daySale')}} >菜品销量</List.Item>
            <List.Item key={2} onClick={()=> {this.changeTab('dayConsume')}} >菜品消耗</List.Item>
        </List>);
        return (
            <div style={{ height: '100%' }}>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => {
                        this.props.history.goBack();
                    }}
                    rightContent={[
                        <Icon key="1" type="ellipsis"   onClick={()=>{
                            this.onOpenChange()}}/>,
                    ]}
                >xxchart</NavBar>       
                <Drawer
                    className="my-drawer"
                    style={{ minHeight: document.documentElement.clientHeight, top: '45px' }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    sidebarStyle={{ border: '1px solid #ddd' }}
                    sidebar={sidebar}
                    docked={this.state.open}
                >
                   {
                      this.state.tab === "dayConsume" && <DayConsume />
                   }  
                   {
                       this.state.tab === "daySale" && <DaySale />
                   } 
                   {
                       this.state.tab === "dayOrder" && <DayOrder />
                   }                
                </Drawer>
             </div>
        )
    }
            
}