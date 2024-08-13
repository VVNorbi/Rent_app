from django.db import models

from django.contrib.auth.models import User

class Offer(models.Model):
    location = models.CharField(max_length=255)
    district = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    rooms = models.IntegerField()
    area = models.FloatField()
    price = models.FloatField()
    url = models.URLField()
    img = models.URLField(max_length=500)
    

    def __str__(self):
        return f'{self.location} - {self.street}'