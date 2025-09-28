from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_dealer = models.BooleanField(default=False)
    is_dealer_staff = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True, null=True)

class Brand(models.Model):
    name = models.CharField(max_length=120, unique=True)
    logo = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Dealership(models.Model):
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="owned_dealerships")
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Branch(models.Model):
    dealership = models.ForeignKey(Dealership, on_delete=models.CASCADE, related_name="branches")
    name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    location_details = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.dealership.name} - {self.name}"

class VehicleModel(models.Model):
    STATUS_CHOICES = [("AVAILABLE","Available"),("SOLD","Sold"),("HOLD","Hold")]
    CATEGORY_CHOICES = [("BIKE","Bike"),("SCOOTER","Scooter"),("EV","EV")]
    FUEL_TYPES = [("PETROL","Petrol"),("ELECTRIC","Electric"),("HYBRID","Hybrid")]
    DISCOUNT_TYPE_CHOICES = [
        ("percentage", "Percentage Off"),
        ("fixed", "Fixed Amount Off"),
        ("cashback", "Cashback")
    ]
    TYPE_CHOICES = [("NEW","New"),("USED","Used")]

    # Common fields for both new and used vehicles
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    dealer = models.ForeignKey(Dealership, on_delete=models.CASCADE, null=True, blank=True)
    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="used_listings")
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    fuel_type = models.CharField(max_length=20, choices=FUEL_TYPES)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="AVAILABLE")
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="branches", null=True, blank=True)
    added_on = models.DateTimeField(auto_now_add=True)
    is_featured = models.BooleanField(default=False)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    model_name = models.CharField(max_length=200, blank=True, null=True)
    
    # Discount fields
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, blank=True, null=True)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount_description = models.CharField(max_length=200, blank=True, null=True)
    
    # Used vehicle specific fields (null for new vehicles)
    year = models.IntegerField(blank=True, null=True)
    km_driven = models.IntegerField(blank=True, null=True)
    condition = models.CharField(max_length=120, blank=True, null=True)
    exchange_offer = models.BooleanField(default=False)
    loan_option = models.BooleanField(default=False)
    approved = models.BooleanField(default=False)
    
    # Base specs for new vehicles, custom specs for used vehicles
    specs = models.JSONField(default=dict, blank=True)
    
    # Optional variant
    variant = models.ForeignKey('VehicleModelVariant', on_delete=models.SET_NULL, null=True, blank=True, related_name="vehicle_instances")

    def get_effective_specs(self):
        """Get effective specs based on vehicle type"""
        return self.specs

    def __str__(self):
        return f"{self.name}"

class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    vehicle = models.ForeignKey(VehicleModel, on_delete=models.CASCADE, related_name='wishlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'vehicle')

    def __str__(self):
        return f'{self.user.username} - {self.vehicle.name}'

class VehicleModelVariant(models.Model):
    vehicle_model = models.ForeignKey('VehicleModel', on_delete=models.CASCADE, related_name="variants")
    name = models.CharField(max_length=200)
    specs = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.vehicle_model.name}"
    
class InventoryItem(models.Model):
    STATUS_CHOICES = [("AVAILABLE","Available"),("SOLD","Sold"),("HOLD","Hold")]
    DISCOUNT_TYPE_CHOICES = [
        ("percentage", "Percentage Off"),
        ("fixed", "Fixed Amount Off"),
        ("cashback", "Cashback")
    ]

    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="inventory")
    vehicle_model_variant = models.ForeignKey(VehicleModelVariant, on_delete=models.CASCADE, related_name="inventory_items")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="AVAILABLE")
    added_on = models.DateTimeField(auto_now_add=True)
    is_featured = models.BooleanField(default=False)
    specs_override = models.JSONField(default=dict, blank=True)
    
    # Discount fields
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, blank=True, null=True)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount_description = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.vehicle_model_variant} - {self.branch.name}"

class VehicleImage(models.Model):
    vehicle = models.ForeignKey(VehicleModel, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to='vehicles/')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return f"{self.id} - {self.vehicle}"


class Booking(models.Model):
    BOOKING_TYPE = [("TEST_RIDE","Test Ride"),("INQUIRY","Inquiry"),("SERVICE","Service Request")]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.SET_NULL, null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    booking_type = models.CharField(max_length=30, choices=BOOKING_TYPE)
    preferred_date = models.DateField()
    preferred_time = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=30, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    vehicle = models.ForeignKey(VehicleModel, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    rating = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=200)
    message = models.TextField()
    seen = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)