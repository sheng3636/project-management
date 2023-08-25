
<template>
    <div class="app-container">
        <div class="main-wrapper">
            <div class="main-header">
                <span class="title">看板工作项统计</span>
            </div>
            <div class="board-static-content">
                <div class="board-static-row  with-two">
                    <div class="static-block">
                        <h2 class="chart-title">
                            <span class="ico-drag"></span>
                            工作项状态统计
                        </h2>
                        <div class="status-charts-wrap">
                            <div class="pie-wrap" id="sideItem1_3"></div>
                            <div class="pie-wrap" id="sideItem1_4"></div>
                        </div>
                        <ul class="status-sheet-wrap">
                            <li>
                                <span class="status-sheet-number total">9</span><br>
                                <span class="status-sheet-label" title="工作项总数">工作项总数</span>
                            </li>
                            <li>
                                <span class="status-sheet-number finished">0</span><br>
                                <span class="status-sheet-label">已完成</span>
                            </li>
                            <li>
                                <span class="status-sheet-number unfinished">9</span><br>
                                <span class="status-sheet-label">未完成</span>
                            </li>
                            <li class="last">
                                <span class="status-sheet-number delay">0</span><br>
                                <span class="status-sheet-label">已延期</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="board-static-row  with-two">
                    <div class="static-block">
                        <h2 class="chart-title">
                            <span class="ico-drag"></span>
                            板块分布统计
                        </h2>
                        <div class="chart column" id="board-list-chart">
                            <div class="highcharts-container" id="sideItem4_0"></div>
                        </div>
                    </div>
                </div>
                <div class="board-static-row  with-one">
                    <div class="static-block">
                        <h2 class="chart-title">
                            <span class="ico-drag"></span>
                            成员工作分布统计
                        </h2>
                        <div class="chart column" id="board-owner-chart">
                            <div class="highcharts-container" id="sideItem4_1"></div>
                        </div>
                    </div>
                </div>
                <div class="board-static-row with-one">
                    <div class="static-block">
                        <h2 class="chart-title">
                            <span class="ico-drag"></span>
                            工作项趋势统计
                        </h2>
                        <div class="chart column" id="board-trend-chart">
                            <div class="highcharts-container" id="sideItem4_2">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage } from '@/utils/index'
export default {
    components: {
    },
    data() {
        return {
            sideItem1_3: {
                id: 'sideItem1_3',
                cahrtsOpt: {
                    title: '完成度',
                    selectFan: '已完成',
                    colorList: ['rgba(121,222,163)', 'rgba(227,227,227)'],
                    list: [
                        {
                            name: '已完成',
                            value: 4
                        },
                        {
                            name: '未完成',
                            value: 2
                        }
                    ],
                }
            },
            sideItem1_4: {
                id: 'sideItem1_4',
                cahrtsOpt: {
                    title: '延期率',
                    selectFan: '已延期',
                    colorList: ['#f6695e', 'rgba(227,227,227)'],
                    list: [
                        {
                            name: '已延期',
                            value: 1
                        },
                        {
                            name: '未延期',
                            value: 9
                        }
                    ],
                }
            },
            sideItem4_0: {
                id: 'sideItem4_0',
                xAxis: ['步骤一', '步骤二', '步骤三', '步骤四', '步骤五'],
                stack: true,
                barWidth: '30px',
                chartArr: [
                {
                        name: '已完成',
                        chartType: 'bar',
                        color: '#f6695e',
                        yAxis: [4, 5, 4, 7, 3],
                    },{
                        name: '未完成',
                        chartType: 'bar',
                        color: 'rgba(33,150,243)',
                        yAxis: [6, 3, 5, 2, 1],
                    },
                ],
            },
            sideItem4_1: {
                id: 'sideItem4_1',
                xAxis: ['未分配', '张三', '李四', '王五', '马六'],
                stack: true,
                barWidth: '30px',
                chartArr: [
                {
                        name: '已完成',
                        chartType: 'bar',
                        color: '#f6695e',
                        yAxis: [5, 4, 6, 9, 6],
                    },{
                        name: '未完成',
                        chartType: 'bar',
                        color: 'rgba(33,150,243)',
                        yAxis: [6, 4, 6, 4, 3],
                    },
                ],
            },
            sideItem4_2: {
                id: 'sideItem4_2',
                xAxis: ['8-20', '8-21', '8-22', '8-23', '8-24'],
                barWidth: '30px',
                chartArr: [
                {
                        name: '当天新增',
                        chartType: 'line',
                        color: '#f6695e',
                        yAxis: [1, 3, 4, 6, 5],
                    },{
                        name: '当天完成',
                        chartType: 'line',
                        color: 'rgba(33,150,243)',
                        yAxis: [2, 1, 2, 4, 3],
                    },
                ],
            },
        }
    },
    mounted() {
        this.pieChart(this.sideItem1_3)
        this.pieChart(this.sideItem1_4)
        this.barLineChart(this.sideItem4_0)
        this.barLineChart(this.sideItem4_1)
        this.barLineChart(this.sideItem4_2)
    },
    methods: {
        // 获取文档列表
        queryTableList() {
            const params = {
                cmd: "project_doclist",
                sid: getSessionStorage('token'),
                data: {
                    project_id: this.$route.params.id,
                    type: this.queryParams.type,
                    page: this.queryParams.page,
                    num: this.queryParams.num
                }
            }
            apiPost('/V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                const { data } = res
                this.total = data.total
                this.tableList = data.list
            })
        },
        // 饼图
        pieChart(data) {
            let legends = []
            for (let i = 0; i < data.cahrtsOpt.list.length; i++) {
                legends.push(data.cahrtsOpt.list[i].name)
            }
            let chart = this.$echarts.init(document.getElementById(data.id))
            let option = {
                backgroundColor: 'transparent',
                title: {
                    text: data.cahrtsOpt.title,
                    bottom: 10,
                    right: 'center',
                    textStyle: {
                        color: 'rgb(51, 51, 51)',
                        fontWeight: 'normal',
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)'
                },
                series: [{
                    name: data.cahrtsOpt.name,
                    type: 'pie',
                    radius: [45, 70],
                    center: ['50%', '45%'],
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                            formatter: '{d|{d}%}',
                            rich: {
                                d: {
                                    fontSize: 18,
                                    padding: [8, 0],
                                    color: data.cahrtsOpt.colorList[0]
                                }
                            }
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        normal: {
                            color: function (params) {
                                return data.cahrtsOpt.colorList[params.dataIndex]
                            }
                        }
                    },
                    data: data.cahrtsOpt.list
                }]
            }
            chart.clear()
            chart.setOption(option)
            pieSelected(chart, data.cahrtsOpt.list, data.cahrtsOpt.selectFan)

            function pieSelected(target, data, selecdFan) {
                let k = data.findIndex(function (value) {
                    return value.name === selecdFan
                })
                target.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: k
                })
                target.on('mouseover', function (e) {
                    if (e.dataIndex != k) {
                        target.dispatchAction({
                            type: 'downplay',
                            seriesIndex: 0,
                            dataIndex: k
                        })
                    }
                })
                target.on('mouseout', function (e) {
                    target.dispatchAction({
                        type: 'highlight',
                        seriesIndex: 0,
                        dataIndex: k
                    })
                })
            }
        },
        // 柱状图+折线图
        barLineChart(data) {
            let legends = []
            let barLineColors = []
            let seriesArr = []
            for (let i = 0; i < data.chartArr.length; i++) {
                legends.push(data.chartArr[i].name)
                barLineColors.push(data.chartArr[i].color)
                if (!data.chartArr[i].markLine) {
                    seriesArr.push({
                        name: data.chartArr[i].name,
                        type: data.chartArr[i].chartType,
                        symbol: 'circle',
                        symbolSize: 8,

                        barWidth: data.barWidth,
                        barGap: '0%',
                        itemStyle: {
                            normal: {
                                color: (params) => {
                                    if (params.name === this.cityName || params.name === this.countyName) {
                                        return data.chartArr[i].lightColor
                                    } else {
                                        return data.chartArr[i].color
                                    }
                                }
                            }
                        },
                        label: {
                            normal: {
                                show: !data.chartArr[i].labelHide,
                                position: data.stack ? 'inside' : 'top',
                                textStyle: {
                                    fontSize: 16,
                                    color: '#333'
                                }
                            }
                        },
                        // markLine: data.markLine ? data.markLine : null,
                        data: data.chartArr[i].yAxis
                    })
                    if (data.chartArr[i].yAxisIndex) {
                        seriesArr[i].yAxisIndex = data.chartArr[i].yAxisIndex
                    }
                    if (data.stack) {
                        seriesArr[i].stack = data.stack
                    }
                } else {
                    seriesArr.push(data.chartArr[i])
                }
            }
            let chart = this.$echarts.init(document.getElementById(data.id))
            let option = {
                color: barLineColors,
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    top: '2%',
                    x: 'center',
                    textStyle: {
                        fontSize: 14,
                        color: '#333'
                    },
                    data: legends
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel: {
                        interval: 0,
                        formatter: function (value) {
                            var ret = ""; //拼接加\n返回的类目项 
                            var maxLength = 6; //每项显示文字个数
                            var valLength = value.length; //X轴类目项的文字个数
                            var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                            if (rowN > 1) //如果类目项的文字大于3,
                            {
                                for (var i = 0; i < rowN; i++) {
                                    var temp = ""; //每次截取的字符串
                                    var start = i * maxLength; //开始截取的位置
                                    var end = start + maxLength; //结束截取的位置
                                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                                    temp = value.substring(start, end) + "\n";
                                    ret += temp; //凭借最终的字符串
                                }
                                return ret;
                            } else {
                                return value;
                            }
                        },
                        padding: [5, 0, 5, 0],
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#6291fb'
                        }
                    },
                    data: data.xAxis
                }],
                yAxis: [{
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            type: 'solid',
                            color: '#333'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: '#0124b3'
                        }
                    }
                },
                {
                    name: '',
                    type: 'value',
                    max: function (value) {
                        return Math.ceil(value.max + 20)
                    },
                    axisTick: {
                        // y轴刻度
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            type: 'solid',
                            color: '#fff' // 左边线的颜色
                        }
                    },
                    splitLine: {
                        show: false // y轴分隔线
                    }
                }
                ],
                series: seriesArr
            }
            chart.clear()
            chart.setOption(option)
        },
    }
}
</script>
<style lang="scss" scoped>
.board-static-content {
    overflow: auto;
}

.board-static-row {
    float: left;
    margin-right: 10px;
    margin-bottom: 24px;
    min-height: 440px;
    overflow: hidden;

    &:first-child {
        margin-left: 0px;
    }

    &.with-one {
        width: 98.8%;
    }

    &.with-two {
        width: 48.9%;
    }
}


.static-block {
    float: left;
    margin-left: 1.9%;
    width: 100%;
    height: 437px;
    background: #fff;
    border-top: 3px solid #e8e8e8;

    .chart-title {
        padding: 14px 15px;
        border-bottom: 1px solid #efefef;
        font-size: 16px;
        font-weight: normal;

        .ico-drag {
            display: inline-block;
            width: 12px;
            height: 14px;
            background: url('~@/assets/sprite.png') no-repeat;
            background-position: -318px -260px;
        }
    }
}

.status-charts-wrap {
    .pie-wrap {
        display: inline-block;
        width: 50%;
        height: 250px;
        text-align: center;
    }
}

.status-sheet-wrap {
    height: 117px;
    line-height: 117px;
    border-top: 1px solid #e9e9e9;
    background-color: #fbfbfb;

    li {
        display: inline-block;
        width: 24%;
        height: 70px;
        line-height: 30px;
        border-right: 1px solid #e7e7e7;
        vertical-align: middle;
        text-align: center;

        &.last {
            border: 1px solid transparent;
        }

        .status-sheet-number {
            font-size: 30px;
        }

        .total {
            color: #3AAFFF;
        }

        .finished {
            color: #79DEA3;
        }

        .unfinished {
            color: #EC9749;
        }

        .delay {
            color: #F6695E;
        }

        .status-sheet-label {
            display: inline-block;
            padding: 0 5px;
            width: 100%;
            font-size: 16px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: border-box;
        }
    }
}

.highcharts-container {
    height: 370px;
    // background-color: #3b434d;
}
</style>