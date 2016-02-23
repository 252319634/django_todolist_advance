from django.conf.urls import patterns, include, url
from django.contrib import admin
from todolist import views
urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_todolist.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^index/$', views.index),
    url(r'^all/$', views.all),
    url(r'^add/', views.add),
    url(r'^edit/', views.edit),
    url(r'^delete/', views.delete),
    url(r'^state/$', views.state),
    url(r'^more/', views.more),
)
