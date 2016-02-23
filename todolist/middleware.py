# -*- coding: utf-8 -*-

import re
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import loader, Context
# 必须返回 HttpResponse ,不能用render_to_response

class CheckVersion(object):
    def process_request(self, request):

        if request.META.get('PATH_INFO', None) == u'/':
            agent_info = request.META.get('HTTP_USER_AGENT', None)
            # print agent_info
            version = re.findall('MSIE\s*(\d+.\d+)', agent_info)
            if version:  # IE浏览器 6-10
                c = Context({'v': version[0], 'name': 'IE'})
                t = loader.get_template("info.html")
                return HttpResponse(t.render(c))

            if re.search('Firefox', agent_info):  # Firefox浏览器,放在ie11之前
                c = Context({'name': 'Firefox'})
                t = loader.get_template("info.html")
                return HttpResponse(t.render(c))

            if re.search('rv:11', agent_info):  # ie浏览器11
                c = Context({'v': 11.0, 'name': 'IE'})
                t = loader.get_template("info.html")
                return HttpResponse(t.render(c))

            if re.search('OPR', agent_info):
                c = Context({'name': 'Opera'})
                t = loader.get_template("info.html")
                return HttpResponse(t.render(c))

            if re.search('Safari', agent_info):  # safari浏览器
                if re.search('Chrome', agent_info):  # chrome浏览器
                    c = Context({'name': 'Chrome'})
                    t = loader.get_template("info.html")
                    return HttpResponse(t.render(c))
                c = Context({'name': 'Safari'})
                t = loader.get_template("info.html")
                return HttpResponse(t.render(c))


# Firefox
# Mozilla/5.0 (Windows NT 6.1; WOW64; rv:11.0) Gecko/20100101 Firefox/11.0

# Chrome
# Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11

# opera
# Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36 OPR/32.0.1948.69 (Edition Baidu)

# IE9
# Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 9.0; Trident/5.0)

# ie10
# Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)

# ie11
# Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko

