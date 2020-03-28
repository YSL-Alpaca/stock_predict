from django.db import models
from django.contrib.auth.models import AbstractUser


# from stocks.models import *


# Create your models here.
class UserInfo(AbstractUser):
    username = models.CharField(max_length=40, blank=True, null=False, unique=True, verbose_name="用户姓名")
    tel = models.CharField(max_length=11, blank=True, null=False, unique=True, verbose_name="电话号码")

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'User'
        verbose_name = '用户信息'
        verbose_name_plural = verbose_name
        ordering = ['-id']
