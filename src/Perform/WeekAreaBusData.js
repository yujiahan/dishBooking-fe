import React, { Component } from 'react'
import moment from 'moment'
import { Tabs, Calendar } from 'antd-mobile';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios'
const Busin_First_Bonus  = 1,
      Busin_Second_Bonus = 0,
      Busin_Growth_Bonus = 1, //每增长10%奖金
      Roll_First_Bonus = 3,
      Roll_Second_Bonus = 1,
      Roll_Growth_Bonus = 1 ;//每增长0.1奖金


const areaDivide = {
    'jia': 'A1|A2|A3|A4|A5|A6|C1',
    'yi': 'B1|B2|B3|B4|B5|B6|B7|B8|B9|C3',
    'bing': 'C2|C4|C5|C6'
}
const tabs = [
    { title: '奖金计算'},
    { title: '营业额分区' },
    { title: '翻台率分区' }
];

export default class WeekData extends Component {
    state = {
        data: [],
        dateShow: false, //是否展示日历
        dataForBusin: [],  //区域营业数据
        dataForRoll : [], //区域翻台数据
        performOption: {
           
        },
        rollOption: {
           
        }

    }

    componentWillMount() {
        axios.get('/perform/getAllData').then((response) => {
            this.genChartOption(response.data);
        })

    }
    genChartOption(serverData) {
        var self = this;
        var dataForBusin = [];
        var dataForRoll = []; //翻台率
        serverData.map((item) => {
            var originAreaAmount = self.computeAreaAmount(item.bdata);
            var originRollRatio = self.computeRollTotal(item.bdata);

            var cofAreaAmount = {  //乘以节假日系数
                jia: parseFloat(parseFloat(originAreaAmount.jia * item.Cof).toFixed(2)),
                yi: parseFloat(parseFloat(originAreaAmount.yi * item.Cof).toFixed(2)),
                bing: parseFloat(parseFloat(originAreaAmount.bing * item.Cof).toFixed(2)),
                else: parseFloat(parseFloat(originAreaAmount.else * item.Cof).toFixed(2)),
            }
            var finalRollRatio = {
                jia: parseFloat(parseFloat(originRollRatio.jia / 7).toFixed(2)),
                yi: parseFloat(parseFloat(originRollRatio.yi / 10).toFixed(2)),
                bing: parseFloat(parseFloat(originRollRatio.bing / 4).toFixed(2))
            }


            dataForBusin.push({
                date: item.Date,
                areaAmount: cofAreaAmount,
                total: cofAreaAmount.jia + cofAreaAmount.yi + cofAreaAmount.bing + cofAreaAmount.else
            })
            dataForRoll.push({
                date: item.Date,
                rollRatio: finalRollRatio
            })
        })

        self.setState({
            dataForBusin: dataForBusin,
            dataForRoll: dataForRoll,
            performOption: this.getPerOption(dataForBusin),
            rollOption: this.getRollOption(dataForRoll)
        })
    }

    computeAreaAmount(bData) {
        var data = {
            'jia': 0,
            'yi': 0,
            'bing': 0,
            'else': 0
        }
        var areaBusData = bData.split(',');

        areaBusData.map((item) => {
            if (areaDivide['jia'].indexOf(item.split("|")[0].slice(0, 2)) > -1) {
                data['jia'] += parseFloat(item.split("|")[1]);
            } else if (areaDivide['yi'].indexOf(item.split("|")[0].slice(0, 2)) > -1) {
                data['yi'] += parseFloat(item.split("|")[1]);
            } else if (areaDivide['bing'].indexOf(item.split("|")[0].slice(0, 2)) > -1) {
                data['bing'] += parseFloat(item.split("|")[1]);
            } else {
                data['else'] += parseFloat(item.split("|")[1]);
            }
        })
        return data;

    }
    computeRollTotal(bData) {
        var data = {
            'jia': 0,
            'yi': 0,
            'bing': 0,
            'else': 0
        }
        var areaAmountData = bData.split(',');

        areaAmountData.map((item) => {
            if (parseFloat(item.split("|")[1]) >= 50) { //翻台率剔除小于50的订单
                if (areaDivide['jia'].indexOf(item.split("|")[0].slice(0, 2)) > -1) {
                    data['jia']++
                } else if (areaDivide['yi'].indexOf(item.split("|")[0].slice(0, 2)) > -1) {
                    data['yi']++
                } else if (areaDivide['bing'].indexOf(item.split("|")[0].slice(0, 2)) > -1) {
                    data['bing']++
                } else {
                    data['else']++
                }
            }
        })
        return data;
    }
    getPerOption(data) {
        return {
            title: {
                text: '营业数据分布'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                data: data.map((item) => {
                    return item.date;
                })
            },
            yAxis: {
                splitLine: {
                    show: false
                }
            },
            legend: {
                data: ['A1-A6&C1', 'B1-B9&C3', 'C2,C4-C6']
            },
            dataZoom: [{
                startValue: '20180430'
            }, {
                type: 'inside'
            }],
            series: [
                {
                    name: 'A1-A6&C1',
                    type: 'line',
                    data: data.map((item) => {
                        return item.areaAmount.jia;
                    }),
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
                {
                    name: 'B1-B9&C3',
                    type: 'line',
                    data: data.map((item) => {
                        return item.areaAmount.yi;
                    }),
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
                {
                    name: 'C2,C4-C6',
                    type: 'line',
                    data: data.map((item) => {
                        return item.areaAmount.bing;
                    }),
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
            ]
        }
    }
    getRollOption(data) {
        return {
            title: {
                text: '翻台率分布'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                data: data.map((item) => {
                    return item.date;
                })
            },
            yAxis: {
                splitLine: {
                    show: false
                }
            },
            legend: {
                data: ['A1-A6&C1', 'B1-B9&C2', 'C3-C6']
            },
            dataZoom: [{
                startValue: '20180430'
            }, {
                type: 'inside'
            }],
            series: [
                {
                    name: 'A1-A6&C1',
                    type: 'line',
                    data: data.map((item) => {
                        return item.rollRatio.jia;
                    }),
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
                {
                    name: 'B1-B9&C2',
                    type: 'line',
                    data: data.map((item) => {
                        return item.rollRatio.yi;
                    }),
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
                {
                    name: 'C3-C6',
                    type: 'line',
                    data: data.map((item) => {
                        return item.rollRatio.bing;
                    }),
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值' },
                            { type: 'min', name: '最小值' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: '平均值' }
                        ]
                    }
                },
            ]
        }
    }
    computeBonus (date){
        var fiveWeekRange = [ new Date(date).getTime()- 36*24*60*60*1000, new Date(date).getTime()];
        var thisWeekRange = [ new Date(date).getTime()- 24*60*60*1000, new Date(date).getTime() + 7*24*60*60*1000];

        var lastFiveWeekData = {
            'jiaBus': 0,
            'yiBus': 0,
            'bingBus': 0,
            'busDays': 0,
            'jiaRoll': 0,
            'yiRoll': 0,
            'bingRoll': 0,
            'rollDays': 0
        }
        var thisWeekData = {
            'jiaBus': 0,
            'yiBus': 0,
            'bingBus': 0,
            'busDays': 0,
            'jiaRoll': 0,
            'yiRoll': 0,
            'bingRoll': 0,
            'rollDays': 0
        }
         var lastFiveWeekTotalBusin = 0;
         var thisWeekTotalBusin = 0;
         
         this.state.dataForBusin.map((item) => {//计算营业额
            if( moment(item.date).valueOf() > fiveWeekRange[0] && moment(item.date).valueOf() < fiveWeekRange[1]) { //五周范围
                lastFiveWeekData.busDays++;
                lastFiveWeekData.jiaBus += item.areaAmount.jia;
                lastFiveWeekData.yiBus += item.areaAmount.yi;
                lastFiveWeekData.bingBus += item.areaAmount.bing;
                lastFiveWeekTotalBusin += item.total;
            }  
            if( moment(item.date).valueOf()> thisWeekRange[0] && moment(item.date) < thisWeekRange[1]) { //五周范围
                thisWeekData.busDays++;
                thisWeekData.jiaBus += item.areaAmount.jia;
                thisWeekData.yiBus += item.areaAmount.yi;
                thisWeekData.bingBus += item.areaAmount.bing;

                thisWeekTotalBusin += item.total;
            }  
        })

        this.state.dataForRoll.map((item) => { //计算翻台率
            if( moment(item.date).valueOf()> fiveWeekRange[0] && moment(item.date).valueOf() < fiveWeekRange[1]) { //五周范围
                lastFiveWeekData.rollDays++;
                lastFiveWeekData.jiaRoll += item.rollRatio.jia;
                lastFiveWeekData.yiRoll += item.rollRatio.yi;
                lastFiveWeekData.bingRoll += item.rollRatio.bing;
            }  
            if( moment(item.date).valueOf()> thisWeekRange[0] && moment(item.date) < thisWeekRange[1]) { //五周范围
                thisWeekData.rollDays++;
                thisWeekData.jiaRoll += item.rollRatio.jia;
                thisWeekData.yiRoll += item.rollRatio.yi;
                thisWeekData.bingRoll += item.rollRatio.bing;
            }  
        })


        var lastFiveWeekBusDataAverge = { //前五周营业数据均值
            'jia': parseFloat((lastFiveWeekData.jiaBus/lastFiveWeekData.busDays).toFixed(2)),
            'yi': parseFloat((lastFiveWeekData.yiBus/lastFiveWeekData.busDays).toFixed(2)),
            'bing': parseFloat((lastFiveWeekData.bingBus/lastFiveWeekData.busDays).toFixed(2))
        }
        var thisWeekBusDataAverge = { //本周营业数据均值
            'jia': parseFloat((thisWeekData.jiaBus/thisWeekData.busDays).toFixed(2)),
            'yi': parseFloat((thisWeekData.yiBus/thisWeekData.busDays).toFixed(2)),
            'bing': parseFloat((thisWeekData.bingBus/thisWeekData.busDays).toFixed(2))
        } 
        var lastFiveWeekRollAverge = { //前五周翻台率均值
            'jia': parseFloat((lastFiveWeekData.jiaRoll/lastFiveWeekData.rollDays).toFixed(2)),
            'yi': parseFloat((lastFiveWeekData.yiRoll/lastFiveWeekData.rollDays).toFixed(2)),
            'bing': parseFloat((lastFiveWeekData.bingRoll/lastFiveWeekData.busDays).toFixed(2))
        }
        var thisWeekRollAverge = { //本周翻台率均值
            'jia': parseFloat((thisWeekData.jiaRoll/thisWeekData.rollDays).toFixed(2)),
            'yi': parseFloat((thisWeekData.yiRoll/thisWeekData.rollDays).toFixed(2)),
            'bing': parseFloat((thisWeekData.bingRoll/thisWeekData.rollDays).toFixed(2))
        }
       

        var initBonus = { //依据第一第二名的奖金
            'jia': {
                'busin': 0,
                'roll': 0
            },
            'yi': {
                'busin': 0,
                'roll': 0
            },
            'bing': {
                'busin': 0,
                'roll': 0
            }           
        }

        let firstBusOne = this.findFirstAndSecondOne(thisWeekBusDataAverge).first;
        let secondBusOne = this.findFirstAndSecondOne(thisWeekBusDataAverge).second;
        
        let firstRollOne = this.findFirstAndSecondOne(thisWeekRollAverge).first;
        let secondRollOne = this.findFirstAndSecondOne(thisWeekRollAverge).second;

        initBonus[firstBusOne].busin = Busin_First_Bonus;
        initBonus[secondBusOne].busin = Busin_Second_Bonus;
        initBonus[firstRollOne].roll = Roll_First_Bonus;
        initBonus[secondRollOne].roll = Roll_Second_Bonus;

        var growthBonus = { //增长奖金
            'jia': {
                'busin': this.computeGrowthBonus('busin', 'jia',thisWeekBusDataAverge,lastFiveWeekBusDataAverge, thisWeekRollAverge , lastFiveWeekRollAverge),
                'roll': this.computeGrowthBonus('roll', 'jia',thisWeekBusDataAverge,lastFiveWeekBusDataAverge, thisWeekRollAverge , lastFiveWeekRollAverge)
            },
            'yi': {
                'busin': this.computeGrowthBonus('busin', 'yi',thisWeekBusDataAverge,lastFiveWeekBusDataAverge, thisWeekRollAverge , lastFiveWeekRollAverge),
                'roll': this.computeGrowthBonus('roll', 'yi',thisWeekBusDataAverge,lastFiveWeekBusDataAverge, thisWeekRollAverge , lastFiveWeekRollAverge)
            },
            'bing': {
                'busin': this.computeGrowthBonus('busin', 'bing', thisWeekBusDataAverge,lastFiveWeekBusDataAverge, thisWeekRollAverge , lastFiveWeekRollAverge),
                'roll': this.computeGrowthBonus('roll', 'bing', thisWeekBusDataAverge,lastFiveWeekBusDataAverge, thisWeekRollAverge , lastFiveWeekRollAverge)
            }           
        }
       
        var finalBonus = this.computeFinalBonus(initBonus, growthBonus, thisWeekTotalBusin/thisWeekData.busDays, lastFiveWeekTotalBusin/lastFiveWeekData.busDays)
    }
    computeGrowthBonus(type, areaName, thisWeekBusDataAverge , lastFiveWeekBusDataAverge, thisWeekRollAverge , lastFiveWeekRollAverge) { //计算个人涨幅奖金
        if (type === 'busin') {
            return thisWeekBusDataAverge[areaName] > lastFiveWeekBusDataAverge[areaName] > 0 ? //区域营业额增长
                    parseInt((thisWeekBusDataAverge[areaName]/lastFiveWeekBusDataAverge[areaName] - 1 )/0.1)* Busin_Growth_Bonus :
                    0
        } 
        if (type === 'roll') {
            return thisWeekRollAverge[areaName]- lastFiveWeekRollAverge[areaName] >0 ? // 翻台率是否增长
                     parseInt((thisWeekRollAverge[areaName]- lastFiveWeekRollAverge[areaName])/0.1)* Roll_Growth_Bonus: 0
        }
    }

    computeFinalBonus(initBonus,  growthBonus, thisWeekTotalBusin, lastFiveWeekTotalBusin ) {
        var finalBonus = {
            'jia': {
                'busin': 0,
                'roll': 0
            },
            'yi': {
                'busin': 0,
                'roll': 0
            },
            'bing': {
                'busin': 0,
                'roll': 0
            },
            'otherTotal': 0,
            'totalBonus': 0
        }
        var busHasDrop = growthBonus.jia.busin < 0 || growthBonus.yi.busin < 0 || growthBonus.bing.busin ;
        var rollHasDrop = growthBonus.jia.roll < 0 || growthBonus.yi.roll < 0 || growthBonus.bing.roll ;
        
        finalBonus.jia.busin = initBonus.jia.busin + growthBonus.jia.busin;
        finalBonus.jia.roll = initBonus.jia.roll + growthBonus.jia.roll;

        finalBonus.yi.busin = initBonus.yi.busin + growthBonus.yi.busin;
        finalBonus.yi.roll = initBonus.yi.roll + growthBonus.yi.roll;

        finalBonus.bing.busin = initBonus.bing.busin + growthBonus.bing.busin;
        finalBonus.bing.roll = initBonus.bing.roll + growthBonus.bing.roll;

        finalBonus.otherTotal = growthBonus.jia.busin + growthBonus.yi.busin + growthBonus.bing.busin +
                                growthBonus.jia.roll + growthBonus.yi.roll + growthBonus.bing.roll + 
                                initBonus.jia.busin + initBonus.yi.busin + initBonus.bing.busin +
                                initBonus.jia.roll + initBonus.yi.roll + initBonus.bing.roll

        var onePointEqualMoney = 0;  //85-95 一分10元    2：95-105 一分20元  3：>105   涨10+10元

        var growthRate = thisWeekTotalBusin/lastFiveWeekTotalBusin;
        if(growthRate < 0.95 && growthRate > 0.85) {
            onePointEqualMoney = 10;
        } else if (growthRate < 1.05 && growthRate >= 0.95) {
            onePointEqualMoney = 20;
        } else if (growthRate >= 1.05) {
            onePointEqualMoney = 20 + parseInt((growthRate-1.05)/0.1) * 10;
        }
        finalBonus.totalBonus = finalBonus.otherTotal* onePointEqualMoney * 2;

        console.log('本周总奖金： '+ finalBonus.totalBonus + "; " + 
                    " 其中A区营业额奖金：" + (initBonus.jia.busin +  growthBonus.jia.busin)* onePointEqualMoney + "元；" +
                    " 其中A区翻台率奖金：" + (initBonus.jia.roll +  growthBonus.jia.roll)* onePointEqualMoney + "元；" +
                    " 其中B区营业额奖金：" + (initBonus.yi.busin +  growthBonus.yi.busin)* onePointEqualMoney + "元；" + 
                    " 其中B区翻台率奖金：" + (initBonus.yi.roll +  growthBonus.yi.roll)* onePointEqualMoney + "元；" + 
                    " 其中C区营业额奖金：" + (initBonus.bing.busin +  growthBonus.bing.busin)* onePointEqualMoney + "元；" + 
                    " 其中C区翻台率奖金：" + (initBonus.bing.roll +  growthBonus.bing.roll)* onePointEqualMoney + "元；" + 
                     "其他人总奖金：" + finalBonus.otherTotal * onePointEqualMoney   )

    }
    computePointMeetBonus() {

    }
    findFirstAndSecondOne(obj){
        var firstValue = 0;
        var firstOne = null;
        var secondValue = 0;
        var secondOne = null;

        Object.keys(obj).forEach((key) => {
            if (obj[key] > firstValue) {
                firstValue = obj[key];
                firstOne = key;
            }
        });

        Object.keys(obj).forEach((key) => {
            if (obj[key] > secondValue && key !== firstOne) {
                secondValue = obj[key];
                secondOne = key;
            }
        });

        return {
            first: firstOne,
            second: secondOne
        }
    }
    render() {
        return (
            <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false}>
                <div>
                    <p onClick={()=>this.setState({dateShow: true})}>选择日期</p>
                    <Calendar
                        type ="one"
                        visible={this.state.dateShow}
                        defaultDate={new Date('2018-06-04 00:00:00')}  
                        onCancel={()=>{
                            this.setState({dateShow: false})
                        }}                 
                        onConfirm={(date)=>{this.computeBonus(date)}}                   
                    />
                </div>
                <div>
                    <ReactEcharts option={this.state.performOption} />
                </div>
                <div>
                    <ReactEcharts option={this.state.rollOption} />
                </div>               
            </Tabs>

        )
    }

}

