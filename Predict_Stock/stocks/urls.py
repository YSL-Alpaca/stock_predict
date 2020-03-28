from django.conf.urls import url
from stocks import views

urlpatterns = [
    url(r'kdata', views.kdata_, name='kdata'),
    url(r'blin', views.blin_, name='blin'),
    url(r'analyze', views.analyze_, name='analyze'),
]