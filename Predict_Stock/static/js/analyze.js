
$(() =>{
    // k线图
    var upColor = '#00da3c';
    var downColor = '#ec0000';
    var myChart = echarts.init(document.getElementById('k_line'));
    var blinChart = echarts.init(document.getElementById('blin'));

    function splitData(rawData) {
        var categoryData = [];  //股票每天的数据对应的日期
        var values = [];        //股票每天的信息
        var volumes = [];       //股票每天总的涨跌情况,涨记1,跌记-1
        for (var i = 0; i < rawData.length; i++) {
            categoryData.push(rawData[i].splice(0, 1)[0]);
            values.push(rawData[i]);
            volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1: -1]);
        }
        return {
            categoryData: categoryData,
            values: values,
            volumes: volumes
        };
    }

    function blin_line(nu, data) {
        // nu决定取二维表中那一列的值(price, middle, lower, uooer)
        var result = []
        for (var i = 0, len = data.values.length; i < len; i++) {
            result.push(data.values[i][nu])
        }
        console.log(result);
        return result
    }

   function calculateMA(dayCount, data) {
       var result = [];
       for (var i = 0, len = data.values.length; i < len; i++) {
           if (i < dayCount) {
               result.push('-');
               continue;
           }
           var sum = 0;
           for (var j = 0; j < dayCount; j++) {
               sum += data.values[i - j][1];
           }
           result.push(+(sum / dayCount).toFixed(3));
       }
       return result
   }

   function k(code) {
       // k线图
       $.ajax({
           type: "get",
           url: baseUrl + '/stocks/kdata',
           data: {
               code: code
           },
           success: function (rawData) {
               // 当前股票信息
               var kTitleData = JSON.parse(rawData).data.stockdata;
               var titleHTML = `<div data-v-0fea8eec="" class="name stock_info">
                        <div data-v-0fea8eec="" class="title">股票名称:</div>
                        <div data-v-0fea8eec="" class="value">${kTitleData.name}</div>
                    </div>
                    <div data-v-0fea8eec="" class="newcode stock_info">
                        <div data-v-0fea8eec="" class="title">股票代码:</div>
                        <div data-v-0fea8eec="" class="value">${kTitleData.code}</div>
                    </div>
                    <div data-v-0fea8eec="" class="newprice stock_info">
                        <div data-v-0fea8eec="" class="title">当前价格:</div>
                        <div data-v-0fea8eec="" class="value">${kTitleData.price}</div>
                    </div>
                    <div data-v-0fea8eec="" class="lowprice stock_info">
                        <div data-v-0fea8eec="" class="title">开盘价:</div>
                        <div data-v-0fea8eec="" class="value">${kTitleData.open_price}</div>
                    </div>
                    <div data-v-0fea8eec="" class="higprice  stock_info">
                        <div data-v-0fea8eec="" class="title">收盘价:</div>
                        <div data-v-0fea8eec="" class="value">${kTitleData.pre_close}</div>
                    </div>
                    <div data-v-0fea8eec="" class="high stock_info">
                        <div data-v-0fea8eec="" class="title">最高价:</div>
                        <div data-v-0fea8eec="" class="value">${kTitleData.high}</div>
                    </div>
                    <div data-v-0fea8eec="" class="low stock_info">
                        <div data-v-0fea8eec="" class="title">最低价:</div>
                        <div data-v-0fea8eec="" class="value">${kTitleData.low}</div>
                    </div>
                    <div data-v-0fea8eec="" class="sellone stock_info">
                        <div data-v-0fea8eec="" class="title">成交量(亿):</div>
                        <div data-v-0fea8eec="" class="value">${kTitleData.volume}</div>
                    </div>
                    <div data-v-0fea8eec="" class="change stock_info">
                        <div data-v-0fea8eec="" class="title">成交金额(亿):</div>
                        <div data-v-0fea8eec="" class="value">${kTitleData.amount}</div>
                    </div>`;
               $("#re_k").html(titleHTML);

               // k线图
               var rawData = JSON.parse(rawData).data.datastr;
               var data = splitData(rawData);
               myChart.setOption(option = {
                   backgroundColor: 'rgb(235,238,240)',
                   animation: false,
                   legend: {
                       bottom: 10,
                       left:'center',
                       data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
                   },
                   tooltip: {
                       trigger: 'axis',
                       axisPointer: {
                           type: 'cross'
                       },
                       backgroundColor: 'rgba(245, 245, 245, 0.8)',
                       borderWidth: 1,
                       borderColor: '#ccc',
                       padding: 10,
                       textStyle: {
                           color: '#000'
                       },
                       position: function (pos, params, el, elRect, size) {
                           var obj = {
                               top: 10
                           };
                           obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                           return obj;
                       }
                   },
                   axisPointer: {
                       link: {
                           xAxisIndex: 'all'
                       },
                       label: {
                           backgroundColor: '#777'
                       }
                   },
                   toolbox: {
                       feature: {
                           dataZoom: {
                               yAxisIndex: false
                           },
                           brush: {
                               type: ['lineX', 'clear']
                           }
                       }
                   },
                   brush: {
                        xAxisIndex: 'all',
                        brushLink: 'all',
                        outOfBrush: {
                            colorAlpha: 0.4
                        }
                    },
                    visualMap: {
                        show: false,
                        seriesIndex: 5,
                        dimension: 2,
                        pieces: [{
                            value: 1,
                            color: downColor
                        }, {
                            value: -1,
                            color: upColor
                        }]
                    },
                    grid: [{
                            left: '10%',
                            right: '8%',
                            height: '50%'
                        },
                        {
                            left: '10%',
                            right: '8%',
                            top: '63%',
                            height: '16%'
                        }
                    ],
                    xAxis: [{
                            type: 'category',
                            data: data.categoryData,
                            scale: true,
                            boundaryGap: false,
                            axisLine: {
                                onZero: false
                            },
                            splitLine: {
                                show: false
                            },
                            splitNumber: 20,
                            min: 'dataMin',
                            max: 'dataMax',
                            axisPointer: {
                                z: 100
                            }
                        },
                        {
                            type: 'category',
                            gridIndex: 1,
                            data: data.categoryData,
                            scale: true,
                            boundaryGap: false,
                            axisLine: {
                                onZero: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            },
                            splitNumber: 20,
                            min: 'dataMin',
                            max: 'dataMax'
                            // axisPointer: {
                            //     label: {
                            //         formatter: function (params) {
                            //             var seriesValue = (params.seriesData[0] || {}).value;
                            //             return params.value
                            //             + (seriesValue != null
                            //                 ? '\n' + echarts.format.addCommas(seriesValue)
                            //                 : ''
                            //             );
                            //         }
                            //     }
                            // }
                        }
                    ],
                    yAxis: [{
                            scale: true,
                            splitArea: {
                                show: true
                            }
                        },
                        {
                            scale: true,
                            gridIndex: 1,
                            splitNumber: 2,
                            axisLabel: {
                                show: false
                            },
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }
                        }
                    ],
                    dataZoom: [{
                            type: 'inside',
                            xAxisIndex: [0, 1],
                            start: 98,
                            end: 100
                        },
                        {
                            show: true,
                            xAxisIndex: [0, 1],
                            type: 'slider',
                            top: '85%',
                            start: 98,
                            end: 100
                        }
                    ],
                    series: [{
                            name: 'Dow-Jones index',
                            type: 'candlestick',
                            data: data.values,
                            itemStyle: {
                                normal: {
                                    color: upColor,
                                    color0: downColor,
                                    borderColor: null,
                                    borderColor0: null,
                                }
                            },
                            tooltip: {
                                formatter: function (param) {
                                    param = param[0];
                                    return [
                                        'Date: ' + param.name +
                                        '<hr size=1 style="margin: 3px 0">',
                                        'Open: ' + param.data[0] + '<br/>',
                                        'Close: ' + param.data[1] + '<br/>',
                                        'Lowest: ' + param.data[2] + '<br/>',
                                        'Highest: ' + param.data[3] + '<br/>'
                                    ].join('');
                                }
                            }
                        },
                        {
                            name: 'MA5',
                            type: 'line',
                            data: calculateMA(5, data),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    opacity: 0.5
                                }
                            }
                        },
                        {
                            name: 'MA10',
                            type: 'line',
                            data: calculateMA(10, data),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    opacity: 0.5
                                }
                            }
                        },
                        {
                            name: 'MA20',
                            type: 'line',
                            data: calculateMA(20, data),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    opacity: 0.5
                                }
                            }
                        },
                        {
                            name: 'MA30',
                            type: 'line',
                            data: calculateMA(30, data),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    opacity: 0.5
                                }
                            }
                        },
                        {
                            name: 'Volume',
                            type: 'bar',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: data.volumes
                        }
                    ]
               }, true);
               myChart.dispatchAction({
                    type: 'brush',
                    areas: [{
                        brushType: 'lineX',
                        coordRange: ['2016-06-02', '2016-06-20'],
                        xAxisIndex: 0
                    }]
                });
               // $(".main_out").show();
           },
           error: function (error) {
                console.log(error)
            }
       });
   }

    function blin(code) {
        // 布林带
        $.ajax({
            type: "get",
            url: baseUrl + '/stocks/blin',
            data: {
                code: code
            },
            success: function (rawData) {
                var rawData = JSON.parse(rawData).data.blindata;
                var data = splitData(rawData);
                console.log(data.values)
                blinChart.setOption(option = {
                    backgroundColor: 'rgb(235,238,240)',
                    animation: false,
                    title: {
                        text: "布林带图",
                        x: "center",
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        data: ['price', 'middle', 'lower', 'upper']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        backgroundColor: 'rgba(245, 245, 245, 0.8)',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        textStyle: {
                            color: '#000'
                        },
                        position: function (pos, params, el, elRect, size) {
                            var obj = {
                                top: 10
                            };
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                            return obj;
                        },
                        extraCssText: 'width: 170px'
                    },
                    axisPointer: {
                        link: {
                            xAxisIndex: 'all'
                        },
                        label: {
                            backgroundColor: '#777'
                        }
                    },
                    toolbox: {
                        feature: {
                            dataZoom: {
                                yAxisIndex: false
                            },
                            brush: {
                                type: ['lineX', 'clear']
                            }
                        }
                    },
                    // brush: {
                    //     xAxisIndex: 'all',
                    //     brushLink: 'all',
                    //     outOfBrush: {
                    //         colorAlpha: 0.1
                    //     }
                    // },
                    // visualMap: {
                    //     show: false,
                    //     seriesIndex: 5,
                    //     dimension: 2,
                    //     pieces: [{
                    //         value: 1,
                    //         color: downColor
                    //     }, {
                    //         value: -1,
                    //         color: upColor
                    //     }]
                    // },
                    grid: [{
                            left: '10%',
                            right: '8%',
                            height: '50%'
                        },
                        {
                            left: '10%',
                            right: '8%',
                            top: '63%',
                            height: '16%'
                        }
                    ],
                    xAxis: [{
                            type: 'category',
                            data: data.categoryData,
                            scale: true,
                            boundaryGap: false,
                            axisLine: {
                                onZero: false
                            },
                            splitLine: {
                                show: false
                            },
                            // splitNumber: 20,
                            // min: 'dataMin',
                            // max: 'dataMax',
                            // axisPointer: {
                            //     z: 100
                            // }
                        },
                        {
                            type: 'category',
                            gridIndex: 1,
                            data: data.categoryData,
                            scale: false,
                            boundaryGap: false,
                            axisLine: {
                                onZero: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            },
                            splitNumber: 20,
                            min: 'dataMin',
                            max: 'dataMax'
                            // axisPointer: {
                            //     label: {
                            //         formatter: function (params) {
                            //             var seriesValue = (params.seriesData[0] || {}).value;
                            //             return params.value
                            //             + (seriesValue != null
                            //                 ? '\n' + echarts.format.addCommas(seriesValue)
                            //                 : ''
                            //             );
                            //         }
                            //     }
                            // }
                        }
                    ],
                    yAxis: [{
                            scale: true,
                            splitArea: {
                                show: true
                            }
                        },
                        {
                            scale: true,
                            gridIndex: 1,
                            splitNumber: 2,
                            axisLabel: {
                                show: false
                            },
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }
                        }
                    ],
                    dataZoom: [{
                            type: 'inside',
                            xAxisIndex: [0, 1],
                            start: 40,
                            end: 100
                        },
                        {
                            show: true,
                            xAxisIndex: [0, 1],
                            type: 'slider',
                            top: '85%',
                            start: 40,
                            end: 100
                        }
                    ],
                    series: [
                        {
                            name: 'price',
                            type: 'line',
                            data: blin_line(0, data),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    opacity: 0.5
                                }
                            }
                        },
                        {
                            name: 'middle',
                            type: 'line',
                            data: blin_line(1, data),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    opacity: 0.5
                                }
                            }
                        },
                        {
                            name: 'lower',
                            type: 'line',
                            data: blin_line(2, data),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    opacity: 0.5
                                }
                            }
                        },
                        {
                            name: 'upper',
                            type: 'line',
                            data: blin_line(3, data),
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    opacity: 0.5
                                }
                            }
                        },

                    ]
                }, true);

                // myChart.on('brushSelected', renderBrushed);

                // function renderBrushed(params) {
                //     var sum = 0;
                //     var min = Infinity;
                //     var max = -Infinity;
                //     var countBySeries = [];
                //     var brushComponent = params.brushComponents[0];

                //     var rawIndices = brushComponent.series[0].rawIndices;
                //     for (var i = 0; i < rawIndices.length; i++) {
                //         var val = data.values[rawIndices[i]][1];
                //         sum += val;
                //         min = Math.min(val, min);
                //         max = Math.max(val, max);
                //     }

                //     panel.innerHTML = [
                //         '<h3>STATISTICS:</h3>',
                //         'SUM of open: ' + (sum / rawIndices.length).toFixed(4) + '<br>',
                //         'MIN of open: ' + min.toFixed(4) + '<br>',
                //         'MAX of open: ' + max.toFixed(4) + '<br>'
                //     ].join(' ');
                // }

                blinChart.dispatchAction({
                    type: 'brush',
                    areas: [{
                        brushType: 'lineX',
                        coordRange: ['2016-06-02', '2016-06-20'],
                        xAxisIndex: 0
                    }]
                });
            },
            error: function (error) {
                console.log(error)
            }
        })
    }

    function analyze(code) {
        $.ajax({
            type: "get",
            url: baseUrl + '/stocks/analyze',
            data: {
                code: code
            },
            success: function (result) {
                var blinAnalyze = JSON.parse(result).blin;
                var blinHTML = `
                    <div class="analyze_title">布林带分析结果</div>
                    <div class="analyze_text">${blinAnalyze}</div>
                    <div class="introduce_title">布林带</div>
                    <div class="introduce_text">
                        布林线(Bollinger Band) 是根据统计学中的标准差原理设计出来的一种非常实用的技术指标。
                        它由三条轨道线组成，其中上下两条线分别可以看成是价格的压力线和支撑线，在两条线之间是一条价
                        格平均线，一般情况价格线在由上下轨道组成的带状区间游走，而且随价格的变化而自动调整轨道的位置。
                        当波带变窄时，激烈的价格波动有可能随即产生；若高低点穿越带边线时，立刻又回到波带内，则会有回档
                        产生.
                    </div>
                `;
                $('#re_blin').html(blinHTML)
            },
            error: function (error) {
                console.log(error)
            }
        })
    }

   // 首页默认加载'000001'平安银行指数分析
    $(() =>{
        k('000001');
        blin('000001')
        analyze('000001')
    });

    // 股票代码提交按钮事件
   $("#submit").click(() =>{
       var code = $("#code").val();
       k(code);
       blin(code);
       analyze(code)
   })

});