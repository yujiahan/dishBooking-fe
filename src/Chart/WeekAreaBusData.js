import React, { Component } from 'react'
import moment from 'moment'
import { Tabs } from 'antd-mobile';
import ReactEcharts from 'echarts-for-react';
import axios from 'axios'

const areaDivide = {
    'jia': 'A1|A2|A3|A4|A5|A6|C1',
    'yi': 'B1|B2|B3|B4|B5|B6|B7|B8|B9|C3',
    'bing': 'C2|C4|C5|C6'
}
const tabs = [
    { title: '营业额分区' },
    { title: '翻台率分区' }
];

export default class WeekData extends Component {
    state = {
        data: [],
        dataForShow: [],
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
        var dataForShow = [];
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


            dataForShow.push({
                date: moment(item.Date).format("YYYYMMDD") + "星期" + (new Date(item.Date).getDay() || "日"),
                areaAmount: cofAreaAmount,
                total: cofAreaAmount.jia + cofAreaAmount.yi + cofAreaAmount.bing + cofAreaAmount.else
            })
            dataForRoll.push({
                date: moment(item.Date).format("YYYYMMDD") + "星期" + (new Date(item.Date).getDay() || "日"),
                rollRatio: finalRollRatio
            })
        })
        self.setState({
            performOption: this.getPerOption(dataForShow),
            rollOption: this.getRollOption(dataForRoll),
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
    render() {
        return (
            <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false}>
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

