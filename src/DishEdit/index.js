import { NavBar, Icon, List, Drawer } from 'antd-mobile';
import React, { Component } from 'react'
import ItemImport from './ItemImport'
import ConsumeImport from './ConsumeImport'

export default class DishEdit extends Component {
  state = {
    open: false,
    tab: "consume"
  }
  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }
  changeTab = (tabName) =>{
      this.setState({tab: tabName, open: false});
  }
  render() {
    const sidebar = (<List>
                        
                        <List.Item key={0} onClick={()=> {this.changeTab('consume')}}>xxx2</List.Item>
                        <List.Item key={1} onClick={()=> {this.changeTab('item')}} >xxx1</List.Item>
                    </List>);

    return (<div  style={{ height: '100%' }}>
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
                >xx编辑</NavBar>       
                <Drawer
                    className="my-drawer"
                    style={{ minHeight: document.documentElement.clientHeight, top: '45px' }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    sidebarStyle={{ border: '1px solid #ddd' }}
                    sidebar={sidebar}
                    docked={this.state.open}
                >
                   {
                      this.state.tab === "item" && <ItemImport />
                   }
                   {
                      this.state.tab === "consume" && <ConsumeImport />
                   }
                </Drawer>
             </div>);
  }
}


