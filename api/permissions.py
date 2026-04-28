from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadWrite(BasePermission):
    """
    - Any authenticated user can list/create/update customers.
    - Only admin users can delete customers.
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        if request.method == "DELETE":
            return bool(getattr(user, "is_admin_user", lambda: False)())

        return True
