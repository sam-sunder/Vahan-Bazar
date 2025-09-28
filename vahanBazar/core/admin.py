from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(User)
admin.site.register(Dealership)
admin.site.register(Branch)
admin.site.register(Brand)
admin.site.register(VehicleModel)
admin.site.register(VehicleModelVariant)
admin.site.register(InventoryItem)
admin.site.register(VehicleImage)
