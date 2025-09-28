from rest_framework import permissions

class IsDealerStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and (request.user.is_dealer or request.user.is_dealer_staff)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
            
        if hasattr(obj, 'branch'):
            return obj.branch.dealership.owner == request.user or request.user in obj.branch.dealership.staff.all()
        return False
    
class IsDealerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_dealer

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'dealer'):
            return obj.dealer == request.user
        elif hasattr(obj, 'branch'):
            return obj.branch.dealership.owner == request.user or request.user in obj.branch.dealership.staff.all()
        return False