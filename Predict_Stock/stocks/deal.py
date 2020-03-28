import numpy as np
import time

# 布林带
def blin_data(kdata):
    """
    布林带
    中轨往往是一条加权均线
    上轨和下轨分别是中轨加上或减去同期收盘价的标准差的2倍
    :param kdata: 股票的k线数据
    :return: 中轨(middle),下轨(lower),上轨(upper)
    """
    dates = kdata.index
    closing_prince = kdata['close']
    ma20 = kdata['ma20']
    # 求标准差
    stds = np.zeros(ma20.size - 19)
    for i in range(0, stds.size):
        stds[i] = closing_prince[i:i + 20].std()
    middle = ma20[19:]
    lower = ma20[19:] - 2 * stds
    upper = ma20[19:] + 2 * stds
    return middle, lower, upper