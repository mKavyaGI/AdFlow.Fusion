import json
import os
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from google_auth_oauthlib.flow import Flow
from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from collections import defaultdict

from .models import AdPlatform, UserAdAccount, BusinessProfile, Campaign, Keyword

# --- Constants ---
CLIENT_SECRETS_FILE = os.path.join(settings.BASE_DIR, 'client_secrets.json')
SCOPES = ['https://www.googleapis.com/auth/adwords']
REDIRECT_URI = 'http://127.0.0.1:8000/google/callback/'

# --- User Authentication and Basic Page Views ---

class PlatformSelectorView(View):
    """Renders the main platform selection page."""
    def get(self, request):
        return render(request, 'index.html')

class LoginRegisterView(View):
    """Handles login and registration form POST requests."""
    def post(self, request):
        form_type = request.POST.get('form_type')
        if form_type == 'register':
            username = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')
            if User.objects.filter(username=username).exists():
                return render(request, 'index.html', {'register_error': 'Username already exists.'})
            user = User.objects.create_user(username=username, email=email, password=password)
            login(request, user)
            return redirect('platform_selector')
        elif form_type == 'login':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('platform_selector')
            else:
                return render(request, 'index.html', {'login_error': 'Invalid credentials.'})
        return redirect('platform_selector')

class LogoutView(View):
    """Handles user logout."""
    def get(self, request):
        logout(request)
        return redirect('platform_selector')

# --- Google Ads Connection Views ---

class GoogleOAuthInitiateView(LoginRequiredMixin, View):
    """
    Handles displaying the Google Ads credential form and starting the OAuth2 flow.
    """
    def get(self, request):
        # Store the selected platform in session
        request.session['selected_platform'] = 'google'
        google_platform, _ = AdPlatform.objects.get_or_create(name='Google Ads')
        existing_account = UserAdAccount.objects.filter(user=request.user, platform=google_platform).first()
        context = {'account': existing_account}
        return render(request, 'google_oauth.html', context)

    def post(self, request):
        developer_token = request.POST.get('developer_token')
        customer_id = request.POST.get('customer_id', '').replace('-', '')
        client_id = request.POST.get('client_id')
        client_secret = request.POST.get('client_secret')
        login_customer_id = request.POST.get('login_customer_id', '').replace('-', '')

        google_platform, _ = AdPlatform.objects.get_or_create(name='Google Ads')

        account, _ = UserAdAccount.objects.update_or_create(
            user=request.user,
            platform=google_platform,
            customer_id=customer_id,
            defaults={
                'account_name': f'Google Ads ({customer_id})',
                'developer_token': developer_token,
                'client_id': client_id,
                'client_secret': client_secret,
            }
        )
        request.session['authenticating_account_pk'] = account.pk

        client_config = {"web": {"client_id": client_id, "client_secret": client_secret, "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token"}}
        flow = Flow.from_client_config(client_config, scopes=SCOPES, redirect_uri=request.build_absolute_uri('/google/callback/'))
        authorization_url, state = flow.authorization_url(access_type='offline', include_granted_scopes='true')
        request.session['oauth_state'] = state
        return redirect(authorization_url)

class GoogleOAuthCallbackView(LoginRequiredMixin, View):
    """Handles the callback from Google and saves the refresh token."""
    def get(self, request):
        state = request.session.get('oauth_state', '')
        if state != request.GET.get('state'):
            return redirect('platform_selector')

        account_pk = request.session.pop('authenticating_account_pk', None)
        if not account_pk:
            return redirect('platform_selector')

        try:
            account = UserAdAccount.objects.get(pk=account_pk, user=request.user)
            client_config = {"web": {"client_id": account.client_id, "client_secret": account.client_secret, "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token"}}
            flow = Flow.from_client_config(client_config, scopes=SCOPES, redirect_uri=request.build_absolute_uri('/google/callback/'))
            flow.fetch_token(authorization_response=request.build_absolute_uri())
            account.refresh_token = flow.credentials.refresh_token
            account.save()
            return redirect('dashboard', account_pk=account.pk)
        except UserAdAccount.DoesNotExist:
            return redirect('platform_selector')

# --- Dashboard Views ---

class DashboardView(LoginRequiredMixin, View):
    """Renders the dashboard with live data from the Google Ads API."""
    def get(self, request, account_pk):
        try:
            account = UserAdAccount.objects.get(pk=account_pk, user=request.user)
        except UserAdAccount.DoesNotExist:
            return redirect('platform_selector')

        credentials = {
            'developer_token': account.developer_token,
            'refresh_token': account.refresh_token,
            'client_id': account.client_id,
            'client_secret': account.client_secret,
            'use_proto_plus': True,
            'login_customer_id': 'YOUR_LOGIN_CUSTOMER_ID' # You need to save and retrieve this
        }

        try:
            gads_client = GoogleAdsClient.load_from_dict(credentials)
            ga_service = gads_client.get_service("GoogleAdsService")
            query = """
                SELECT ad_group_criterion.keyword.match_type, metrics.clicks,
                       metrics.impressions, metrics.cost_micros, metrics.conversions
                FROM keyword_view WHERE segments.date DURING LAST_30_DAYS"""
            
            response = ga_service.search(customer_id=account.customer_id, query=query)
            
            # Process live data here...
            context = {
                'account': account,
                'platform_name': account.platform.name,
                'data': "Live Data Processing not fully implemented yet."
            }
            return render(request, 'dashboard.html', context)

        except GoogleAdsException as ex:
            context = {
                'account': account,
                'platform_name': account.platform.name,
                'error': f"Google Ads API failed: {ex}"
            }
            return render(request, 'dashboard.html', context)
        except Exception as e:
            context = {
                'account': account,
                'platform_name': account.platform.name,
                'error': f"An unexpected error occurred: {e}"
            }
            return render(request, 'dashboard.html', context)


class DashboardDummyDataView(LoginRequiredMixin, View):
    """Renders the dashboard with data, including recent campaigns."""
    def get(self, request):
        platform = request.GET.get('platform') or request.session.get('selected_platform', 'google')
        request.session['selected_platform'] = platform
        
        platform_name = f'{platform.title()} Ads'
        recent_campaigns = []
        mock_account = None

        try:
            platform_obj = AdPlatform.objects.get(name=platform_name)
            ad_accounts = UserAdAccount.objects.filter(user=request.user, platform=platform_obj)
            if ad_accounts.exists():
                mock_account = ad_accounts.first()
            
            # --- MODIFIED PART: Query for the 2 most recent campaigns ---
            # This fetches campaigns linked to the user and the specific platform,
            # ordered by the newest first, and takes the top 2.
            recent_campaigns = Campaign.objects.filter(
                user=request.user, 
                ad_account__platform=platform_obj
            ).order_by('-created_at')[:2]

        except AdPlatform.DoesNotExist:
            pass

        context = {
            'is_dummy': True,
            'account': mock_account,
            'platform_name': platform_name,
            'selected_platform': platform,
            'recent_campaigns': recent_campaigns, # Pass the real campaigns to the template
            'total_spend': 37040,
            'total_conversions': 4273,
            'avg_ctr': 4.4,
            'roas': 4.2,
            'match_types': {
                'BROAD': {'spend': 12450, 'conversions': 1247, 'ctr': 3.2, 'roas': 3.8, 'performance_score': 65},
                'PHRASE': {'spend': 8920, 'conversions': 892, 'ctr': 4.1, 'roas': 4.2, 'performance_score': 80},
                'EXACT': {'spend': 15670, 'conversions': 2134, 'ctr': 5.8, 'roas': 4.8, 'performance_score': 85},
            }
        }
        return render(request, 'dashboard.html', context)


class BusinessProfileView(LoginRequiredMixin, View):
    """Create new BusinessProfile and list all user's businesses."""
    def get(self, request, platform=None):
        # Store the platform in session if provided
        if platform:
            request.session['selected_platform'] = platform
        
        # Get platform from session if not provided in URL
        current_platform = platform or request.session.get('selected_platform', 'google')
        
        profiles = BusinessProfile.objects.filter(user=request.user)
        context = {
            'profiles': profiles,
            'selected_platform': current_platform,
        }
        return render(request, 'business_profile.html', context)

    def post(self, request):
        business_name = request.POST.get('business_name', '').strip()
        website_url = request.POST.get('website_url', '').strip()
        industry = request.POST.get('industry', '').strip() or None
        business_description = request.POST.get('business_description', '').strip()
        products_or_services = request.POST.get('products_or_services', '').strip()
        target_audience = request.POST.get('target_audience', '').strip()
        target_locations = request.POST.get('target_locations', '').strip()

        # Check if business with same name already exists for this user
        if BusinessProfile.objects.filter(user=request.user, business_name=business_name).exists():
            profiles = BusinessProfile.objects.filter(user=request.user)
            context = {
                'profiles': profiles,
                'error': f'A business with the name "{business_name}" already exists.'
            }
            return render(request, 'business_profile.html', context)

        # Create new business profile
        BusinessProfile.objects.create(
            user=request.user,
            business_name=business_name,
            website_url=website_url,
            industry=industry,
            business_description=business_description,
            products_or_services=products_or_services,
            target_audience=target_audience,
            target_locations=target_locations,
        )

        profiles = BusinessProfile.objects.filter(user=request.user)
        context = {
            'profiles': profiles,
            'success': f'Business "{business_name}" created successfully.'
        }
        return render(request, 'business_profile.html', context)


class MetaOAuthInitiateView(LoginRequiredMixin, View):
    """
    Handles displaying the Meta Ads credential form and starting the OAuth2 flow.
    """
    def get(self, request):
        # Store the selected platform in session
        request.session['selected_platform'] = 'meta'
        meta_platform, _ = AdPlatform.objects.get_or_create(name='Meta Ads')
        existing_account = UserAdAccount.objects.filter(user=request.user, platform=meta_platform).first()
        context = {'account': existing_account}
        return render(request, 'meta_oauth.html', context)

    def post(self, request):
        app_id = request.POST.get('app_id')
        app_secret = request.POST.get('app_secret')
        account_id = request.POST.get('account_id', '').replace('-', '')
        access_token = request.POST.get('access_token')

        meta_platform, _ = AdPlatform.objects.get_or_create(name='Meta Ads')

        account, _ = UserAdAccount.objects.update_or_create(
            user=request.user,
            platform=meta_platform,
            account_name=f'Meta Ads ({account_id})',
            defaults={
                'client_id': app_id,
                'client_secret': app_secret,
                'api_key': access_token,
                'customer_id': account_id,
            }
        )

        # For Meta Ads, we'll redirect to business profile for now
        # In a real implementation, you'd handle OAuth2 flow here
        return redirect('business_profile')


class AmazonOAuthInitiateView(LoginRequiredMixin, View):
    """
    Handles displaying the Amazon Ads credential form for API key authentication.
    """
    def get(self, request):
        # Store the selected platform in session
        request.session['selected_platform'] = 'amazon'
        amazon_platform, _ = AdPlatform.objects.get_or_create(name='Amazon Ads')
        existing_account = UserAdAccount.objects.filter(user=request.user, platform=amazon_platform).first()
        context = {'account': existing_account}
        return render(request, 'amazon_oauth.html', context)

    def post(self, request):
        client_id = request.POST.get('client_id')
        client_secret = request.POST.get('client_secret')
        refresh_token = request.POST.get('refresh_token')
        profile_id = request.POST.get('profile_id', '').replace('-', '')

        amazon_platform, _ = AdPlatform.objects.get_or_create(name='Amazon Ads')

        account, _ = UserAdAccount.objects.update_or_create(
            user=request.user,
            platform=amazon_platform,
            account_name=f'Amazon Ads ({profile_id})',
            defaults={
                'client_id': client_id,
                'client_secret': client_secret,
                'refresh_token': refresh_token,
                'customer_id': profile_id,
            }
        )

        # For Amazon Ads, we'll redirect to business profile for now
        return redirect('business_profile')


class CampaignCreateView(LoginRequiredMixin, View):
    """Create a new campaign for a specific platform."""
    def get(self, request, platform):
        # Store platform in session for consistency
        request.session['selected_platform'] = platform
        
        # Get user's ad accounts for this platform
        try:
            platform_obj = AdPlatform.objects.get(name=f'{platform.title()} Ads')
            ad_accounts = UserAdAccount.objects.filter(user=request.user, platform=platform_obj)
            business_profiles = BusinessProfile.objects.filter(user=request.user)
        except AdPlatform.DoesNotExist:
            ad_accounts = []
            business_profiles = []
        
        context = {
            'platform': platform,
            'platform_display': f'{platform.title()} Ads',
            'ad_accounts': ad_accounts,
            'business_profiles': business_profiles,
        }
        return render(request, 'campaign_create.html', context)
    
    def post(self, request, platform):
        campaign_name = request.POST.get('campaign_name', '').strip()
        campaign_description = request.POST.get('campaign_description', '').strip()
        daily_budget = request.POST.get('daily_budget', '0')
        bid_amount = request.POST.get('bid_amount', '0')
        campaign_type = request.POST.get('campaign_type', 'search')
        target_locations = request.POST.get('target_locations', '').strip()
        target_languages = request.POST.get('target_languages', '').strip()
        ad_account_id = request.POST.get('ad_account')
        business_profile_id = request.POST.get('business_profile')
        
        # Get keywords from form
        keywords_data = []
        keyword_texts = request.POST.getlist('keyword_text')
        keyword_types = request.POST.getlist('keyword_type')
        
        for text, match_type in zip(keyword_texts, keyword_types):
            if text.strip():
                keywords_data.append({
                    'text': text.strip(),
                    'match_type': match_type,
                })
        
        try:
            ad_account = UserAdAccount.objects.get(id=ad_account_id, user=request.user)
            business_profile = BusinessProfile.objects.get(id=business_profile_id, user=request.user) if business_profile_id else None
            
            # Create campaign
            campaign = Campaign.objects.create(
                user=request.user,
                ad_account=ad_account,
                business_profile=business_profile,
                campaign_name=campaign_name,
                campaign_description=campaign_description,
                daily_budget=float(daily_budget),
                bid_amount=float(bid_amount),
                campaign_type=campaign_type,
                target_locations=target_locations,
                target_languages=target_languages,
                keywords=keywords_data,
            )
            
            # Create individual keyword records
            for keyword_data in keywords_data:
                Keyword.objects.create(
                    campaign=campaign,
                    keyword_text=keyword_data['text'],
                    match_type=keyword_data['match_type'],
                )
            
            return redirect('campaign_detail', campaign_id=campaign.id)
            
        except (UserAdAccount.DoesNotExist, BusinessProfile.DoesNotExist, ValueError) as e:
            context = {
                'platform': platform,
                'platform_display': f'{platform.title()} Ads',
                'ad_accounts': UserAdAccount.objects.filter(user=request.user, platform__name=f'{platform.title()} Ads'),
                'business_profiles': BusinessProfile.objects.filter(user=request.user),
                'error': f'Error creating campaign: {str(e)}'
            }
            return render(request, 'campaign_create.html', context)


class CampaignDetailView(LoginRequiredMixin, View):
    """Display campaign details."""
    def get(self, request, campaign_id):
        try:
            campaign = Campaign.objects.get(id=campaign_id, user=request.user)
            keywords = campaign.keyword_set.all()
            
            context = {
                'campaign': campaign,
                'keywords': keywords,
            }
            return render(request, 'campaign_detail.html', context)
        except Campaign.DoesNotExist:
            return redirect('platform_selector')


class CampaignListView(LoginRequiredMixin, View):
    """List campaigns for a specific platform."""
    def get(self, request, platform):
        # Store platform in session for consistency
        request.session['selected_platform'] = platform
        
        # Get campaigns for this platform
        try:
            platform_obj = AdPlatform.objects.get(name=f'{platform.title()} Ads')
            ad_accounts = UserAdAccount.objects.filter(user=request.user, platform=platform_obj)
            campaigns = Campaign.objects.filter(user=request.user, ad_account__platform=platform_obj)
        except AdPlatform.DoesNotExist:
            campaigns = []
        
        context = {
            'platform': platform,
            'platform_display': f'{platform.title()} Ads',
            'campaigns': campaigns,
        }
        return render(request, 'campaign_list.html', context)