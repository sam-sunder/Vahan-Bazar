from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views.auth_views import RegisterView, LoginView
from core.views.dealer_views import (
    DealerProfileView,
    DealerBranchViewSet,
    DealerDashboardView
)
from .views.brand_views import BrandViewSet
from .views.vehicle_views import VehicleModelViewSet
from .views.image_views import ImageUploadView
from .views.wishlist_views import WishlistViewSet
from .views.user_views import UserProfileView
from .views.book_view import BookingViewSet

router = DefaultRouter()
router.register(r'brands', BrandViewSet)
router.register(r'vehicles', VehicleModelViewSet)
router.register(r'dealer/branches', DealerBranchViewSet, basename='dealer-branches')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'bookings', BookingViewSet, basename='bookings')


dealer_urlpatterns = [
    path('profile/', DealerProfileView.as_view(), name='dealer-profile'),
    path('dashboard/', DealerDashboardView.as_view(), name='dealer-dashboard'),
]

account_urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]

urlpatterns = [
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('dealer/', include(dealer_urlpatterns)),
    path('account/', include(account_urlpatterns)),
    path('upload-image/', ImageUploadView.as_view(), name='upload-image'),
    path('', include(router.urls)),
]