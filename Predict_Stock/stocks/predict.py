from .deal import *


class StockAnalyze(object):
    """
        股票数据分析模型,对股票走势进行预估,返回意见
        每种分析模型对应给出每种模型的意见

        Attributes:
        kdata:  存储当前股票每天的k线数据，结构如下：
                |date|open|high|low|close|volume|ma5|ma10|ma20|
                date: 交易日期
                opening_price: 开盘价
                highest_price: 最高价
                lowest_price:  最低价
                closing_price: 收盘价
                volume:        当日交易量
                ma5:           5日均线
                ma10:          10日均线
                ma20:          20日均线
    """

    def __init__(self, kdata):
        """
        :param kdata:当前股票数据
        """
        self.kdata = kdata

    def analyze_result(self):
        """
        分析当前股票数据,得出不同技术指标的分析结果
        :return: 返回分析结果的字典
        """
        result_dict = {
            "blin": self.blin_analyze(self.kdata[::-1]),
        }
        return result_dict

    def blin_analyze(self, kdata):
        ma20 = kdata['ma20']
        close_price = kdata['close']
        middle, lower, upper = blin_data(kdata)
        # 穿透布林带
        if np.all(close_price[-2:] > upper[-2:]):
            return '上涨趋势下穿透布林带顶部压力线,建议卖出'
        elif np.all(close_price[-2:] < lower[-2:]):
            return '下跌趋势下骨架穿透布林带底部支撑线,建议买入'
        # 在布林带中震荡的行情
        if ((close_price[-10:] > ma20[-10:]).sum() > 6) and (close_price[-1] < ma20[-1]) and (close_price[-2] > ma20[-2]):
            return '股价持续在高位震荡,向下穿透布林带中轨,建议卖出'
        elif ((close_price[-10:] < ma20[-10:]).sum() > 6) and (close_price[-1] > ma20[-1]) and (close_price[-2] < ma20[-2]):
            return '股价持续在地位震荡,向上穿透布林带中轨,建议买入'

        return '股价没有太大波动,建议持有'
