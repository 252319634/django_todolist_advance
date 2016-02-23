# -*- coding: utf-8 -*-
from urllib import unquote
import datetime
from django.http import HttpResponse
from django.shortcuts import render_to_response
from models import tdl
import MySQLdb,pymysql
from django.core import serializers
# import sys
# reload(sys)
# sys.setdefaultencoding('utf-8')


def index(request):
    try:
        pymysql.connect(user='root', db='todolist', passwd='root', host='localhost')
        # MySQLdb.connect(user='root', db='todolist', passwd='root', host='localhost')
    except:
        return HttpResponse('可能是数据库出错了!')
    try:
        logs = tdl.objects.order_by('-create_time')[0:10]  # 第一次返回10条记录
    except:
        return HttpResponse('读取信息时,出错了!!!')
    return render_to_response('index.html', locals())
def all(request):


    page = request.GET.get('page')
    # print(page)
    if page == None:  # 获取请求的页数
        page = 1
    page = int(page)
    start = (page - 1) * 10
    end = page * 10

    try:
        counts = tdl.objects.count()
        logs = tdl.objects.order_by('-create_time')[start:end]
    except:
        return HttpResponse('读取信息时,出错了!!!')
    if counts % 10 == 0 and counts != 0:  # 计算页数
        pages = counts // 10
    else:
        pages = counts // 10 + 1  # 计算页数

    plist = []  # 生成页数列表,模板循环用
    for p in range(1, pages + 1):
        plist.append(p)

    return render_to_response('all.html', locals())


def add(request):
    content = request.POST['content']
    # print content
    try:
        log = tdl(content=content)
        # print 'log', log
        log.save()
    except Exception, e:
        print '出错了!', e
        return HttpResponse(False)

    return HttpResponse(log.toJSON())


def edit(request):
    id = request.GET.get('id')
    content = request.GET.get('content')
    try:
        log = tdl.objects.get(id=id)
        log.content = content
        log.save()
    except:
        return HttpResponse(False)
    return HttpResponse(True)


def delete(request):
    id = request.GET.get('id')
    try:
        log = tdl.objects.get(id=id)
        log.delete()
    except:
        return HttpResponse(False)

    return HttpResponse(True)


def state(request):
    id_ = request.GET.get('id')
    state_ = request.GET.get('state')
    try:
        log = tdl.objects.get(id=id_)
        if state_ == 'true':
            log.state = 1
        else:
            log.state = 0
        log.save()
    except:
        return HttpResponse(False)
    return HttpResponse(True)


def more(request):
    id = request.GET.get('id')
    logs = tdl.objects.filter(id__lt=id).order_by('-create_time')[0:5]  # 每次加载5条记录
    json = serializers.serialize("json", logs)
    return HttpResponse(json)

