from django.urls import path
from .views import (
    PlatformSelectorView,
    LoginRegisterView,
    LogoutView,
    GoogleOAuthInitiateView,
    GoogleOAuthCallbackView,
    DashboardView,
    DashboardDummyDataView,
    BusinessProfileView,
    MetaOAuthInitiateView,
    AmazonOAuthInitiateView,
    CampaignCreateView,
    CampaignDetailView,
)

urlpatterns = [
    # Main and Auth URLs
    path('', PlatformSelectorView.as_view(), name='platform_selector'),
    path('auth/', LoginRegisterView.as_view(), name='auth'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Google Ads Connection URLs
    path('google/connect/', GoogleOAuthInitiateView.as_view(), name='google-initiate'),
    path('google/callback/', GoogleOAuthCallbackView.as_view(), name='google-callback'),

    # Dashboard URLs
    path('dashboard/<int:account_pk>/', DashboardView.as_view(), name='dashboard'),
    path('dashboard/dummy/', DashboardDummyDataView.as_view(), name='dashboard_dummy'),
    # Business profile page
    path('business/', BusinessProfileView.as_view(), name='business_profile'),
    path('business/<str:platform>/', BusinessProfileView.as_view(), name='business_profile_platform'),
    
    # Meta Ads Connection URLs
    path('meta/connect/', MetaOAuthInitiateView.as_view(), name='meta-initiate'),
    
    # Amazon Ads Connection URLs
    path('amazon/connect/', AmazonOAuthInitiateView.as_view(), name='amazon-initiate'),
    
    # Campaign URLs
    path('campaign/create/<str:platform>/', CampaignCreateView.as_view(), name='campaign_create'),
    path('campaign/<int:campaign_id>/', CampaignDetailView.as_view(), name='campaign_detail'),
]

