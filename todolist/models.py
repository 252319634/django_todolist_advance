# -*- coding: utf-8 -*-
import datetime
from django.db import models
import json


class tdl(models.Model):
    content = models.CharField(u'内容', max_length=150)
    state = models.BooleanField(u'状态', default=0)
    create_time = models.DateTimeField(u'创建时间', auto_now_add=True)

    def toJSON(self):
        # 这个方法返回tdl对象的json序列,对datetime.datetime字段进行了可视化处理.
        fields = []
        for field in self._meta.fields:
            fields.append(field.name)
        d = {}
        for attr in fields:
            if isinstance(getattr(self, attr), datetime.datetime):
                d[attr] = getattr(self, attr).strftime('%Y-%m-%d %H:%M:%S')
            else:
                d[attr] = getattr(self, attr)
        return json.dumps(d)

    def __unicode__(self):  # 在Python3中用 __str__ 代替 __unicode__
        return self.content
