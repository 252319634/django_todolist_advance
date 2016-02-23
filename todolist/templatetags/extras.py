# -*- coding: utf-8 -*-
from django import template
import datetime

register = template.Library()


@register.filter()
def time_to_befor(value):
    d1 = datetime.datetime.now()
    d2 = value.replace(tzinfo=None)
    if d1.year - d2.year > 0:
        return str(d1.year - d2.year) + '年前发布'
    elif d1.month - d2.month > 0:
        return str(d1.month - d2.month) + '月前发布'
    elif (d1.day - d2.day) // 7 > 0:
        return str((d1.day - d2.day) // 7) + '周前发布'
    elif d1.day - d2.day > 0:
        return str(d1.day - d2.day) + '天前发布'
    elif d1.hour - d2.hour > 0:
        return str(d1.hour - d2.hour) + '小时前发布'
    elif d1.minute - d2.minute > 0:
        return str(d1.minute - d2.minute) + '分钟前发布'
    elif d1.second - d2.second < 60:
        return '刚刚发布'

