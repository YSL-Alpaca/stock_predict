import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.shortcuts import render
import logging

__author__ = 'ysl'
# 密码加密时加盐字符串
salt = 'YangsiLu'

# Create your views here.

# 登录
from user.models import UserInfo


def login_(request):
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        # 判断用户名是否为空
        if not username:
            return HttpResponse(json.dumps({"result": False, "data": "", "error": "用户名或密码不能为空"}))
        if not password:
            return HttpResponse(json.dumps({"result": False, "data": "", "error": "用户名或密码不能为空"}))
        # 使用django提供的验证方法，传入用户名和密码，会返回一个user对象
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            print("登录", request.user)
            url = request.COOKIES.get('source_url', '')
            return HttpResponse(json.dumps({"result": True, "data": {"url": url, "username": username}, "error": ""}))
        else:
            return HttpResponse(json.dumps({"result": False, "data": "", "error": "用户名或密码错误"}))

    if request.method == 'GET':
        return HttpResponse(json.dumps({"result": True, "data": "", "error": ""}))


# 注册
def register_(request):
    if request.method == 'POST':
        # 生成userInfo模型类对象
        new_user = UserInfo()
        new_user.username = request.POST.get('username','')
        if not new_user.username:
            return HttpResponse(json.dumps({"result":False, "data":"", "error":"用户名或密码不能为空"}))
        # 判断用户是否已经存在
        try:
            olduser = UserInfo.objects.filter(username=new_user.username)
            if olduser:
                return HttpResponse(json.dumps({"result":False, "data":"", "error":"用户名已存在"}))
        except ObjectDoesNotExist as e:
            logging.warning(e)
            # 判断两次输入密码是否一致
        if request.POST.get('pwd') != request.POST.get('repwd'):
            return HttpResponse(json.dumps({"result":False, "data":"", "error":"两次输入的密码不一样"}))
        new_user.password = make_password(request.POST.get('pwd'), salt, 'pbkdf2_sha1')
        # 判断手机号码是否输入
        if request.POST.get('tel') and len(request.POST.get('tel')) == 11:
            new_user.tel = request.POST.get('tel')
        else:
            return HttpResponse(json.dumps({"result":False, "data":"", "error":"手机号有误"}))
        # 保存用户信息
        try:
            new_user.save()
        except ObjectDoesNotExist as e:
            logging.warning(e)
        return HttpResponse(json.dumps({"result":True, "data":"注册成功", "error":""}))
    if request.method == 'GET':

        print("注册事件")

        return HttpResponse(json.dumps({"result":True, "data":"", "error":""}))

# 注销
def logout_(request):
    logout(request)
    return HttpResponse(json.dumps({"result":True, "data":"成功退出", "error":""}))

