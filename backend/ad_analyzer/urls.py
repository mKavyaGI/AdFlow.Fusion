from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # This path is for the Django admin interface.
    path('admin/', admin.site.urls),
    
    # This line is the crucial part. It tells Django that any URL starting
    # with 'api/' should be handled by the urls.py file inside your 'api' app.
    path('api/', include('api.urls')),
]