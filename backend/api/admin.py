from django.contrib import admin
from .models import AdPlatform, UserAdAccount, BusinessProfile, Campaign, Keyword

# This tells Django to show the AdPlatform model in the admin site.
admin.site.register(AdPlatform)

# This tells Django to show the UserAdAccount model in the admin site.
admin.site.register(UserAdAccount)

admin.site.register(BusinessProfile)
admin.site.register(Campaign)
admin.site.register(Keyword)

