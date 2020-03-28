import json
from django.http import HttpResponse
from django.shortcuts import render
from .data import *
from .deal import *
import pandas as pd
import time
from .predict import *

# Create your views here.

# -------------返回值说明--------------
# code,代码
# name,名称
# industry,所属行业
# area,地区
# pe,市盈率c
# outstanding,流通股本(亿)
# totals,总股本(亿)
# totalAssets,总资产(万)
# liquidAssets,流动资产
# fixedAssets,固定资产
# reserved,公积金
# reservedPerShare,每股公积金
# esp,每股收益
# bvps,每股净资
# pb,市净率
# timeToMarket,上市日期
# undp,未分利润
# perundp, 每股未分配
# rev,收入同比(%)
# profit,利润同比(%)
# gpr,毛利率(%)
# npr,净利润率(%)
# holders,股东人数
# 首页数据


def kdata_(request):
    # 拿到前端发送的股票代码
    code = request.GET.get('code')
    data = {}
    # 获取当前股票的日k线图
    k_data = stock_k_data(code)
    datastr = []
    for index in k_data.index:
        one_day_list = []
        one_day_list.append(index)
        one_day_list.append(k_data.loc[index]['open'])
        one_day_list.append(k_data.loc[index]['close'])
        one_day_list.append(k_data.loc[index]['low'])
        one_day_list.append(k_data.loc[index]['high'])
        one_day_list.append(k_data.loc[index]['volume'])
        datastr.append(one_day_list)
    data['datastr'] = datastr[::-1]
    # 获取当前股票信息
    # 1：open，今日开盘价
    # 2：pre_close，昨日收盘价
    # 3：price，当前价格
    # 4：high，今日最高价
    # 5：low，今日最低价
    # 8：volume，成交量
    # 9：amount，成交金额（元
    # CNY）
    stockdata = {}
    stock_now = stock_now_all(code)
    name = stock_now.name
    code = stock_now.code
    price = "%.2f" % (float(stock_now.price[0]))
    open_price = "%.2f" % (float(stock_now.open[0]))
    high = "%.2f" % (float(stock_now.high[0]))
    low = "%.2f" % (float(stock_now.low[0]))
    pre_close = "%.2f" % (float(stock_now.pre_close[0]))
    volume = "%.2f" % (float(stock_now.volume[0]) / 100000000)
    amount = "%.2f" % (float(stock_now.amount[0]) / 100000000)
    change = "%.2f" % (float(price) - float(pre_close))
    perce = "%.2f" % (float(change) / float(pre_close) * 100)
    stockdata['name'] = str(name[0])
    stockdata['code'] = str(code[0])
    stockdata['price'] = price
    stockdata['open_price'] = open_price
    stockdata['high'] = high
    stockdata['low'] = low
    stockdata['pre_close'] = pre_close
    stockdata['volume'] = volume
    stockdata['amount'] = amount
    stockdata['change'] = change
    stockdata['perce'] = perce
    data['stockdata'] = stockdata

    # 返回数据处理结果给前端
    result = {"result": True, "data": data, "error": ""}
    # 将数据传输给预测模型, 返回预测结果
    # model = StockPredictionModel(k_data)
    # model_result = model.analysis()
    # 最终传给前端的结果集
    r = {}
    r.update(result)  # 字典的update()函数:为调用者增加新元素
    # r.update(model_result)

    # r{result{"result":True, data[datastr[], datadeep[]], "error":""},moedl_result{}}
    return HttpResponse(json.dumps(r))


def blin_(request):
    code = request.GET.get('code')
    print(code)
    data = {}
    # 获取当前股票的一年内日k线图
    kdata = stock_k_data(code)
    kdata = kdata[:200]
    date = kdata.index[::-1][19:]
    price = kdata.close[::-1][19:]
    middle, lower, upper = blin_data(kdata)
    middle = np.array(middle).T
    lower = np.array(lower).T
    price = np.array(price).T
    upper = np.array(upper).T
    blin_DataFrame = pd.DataFrame({"price": price, "middle": middle, "lower": lower, "upper": upper}, index=date)
    blindata = []
    for idx in blin_DataFrame.index:
        rowlist = []
        rowlist.append(idx)
        rowlist.append(blin_DataFrame.loc[idx]['price'])
        rowlist.append(blin_DataFrame.loc[idx]['middle'])
        rowlist.append(blin_DataFrame.loc[idx]['lower'])
        rowlist.append(blin_DataFrame.loc[idx]['upper'])
        blindata.append(rowlist)
    data['blindata'] = blindata[:]
    result = {"result": True, "data": data, "error": ""}
    r = {}
    r.update(result)
    return HttpResponse(json.dumps(r))


def analyze_(request):
    """
    对当前股票进行分析
    :param request:
    :return: 返回分析结果
    """
    code = request.GET.get('code')
    kdata = stock_k_data(code)
    kdata = kdata[:200]
    analyze = StockAnalyze(kdata)
    result = analyze.analyze_result()
    return HttpResponse(json.dumps(result))