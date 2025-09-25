from django.db import models
from django.contrib.auth.models import User

class AdPlatform(models.Model):
    """
    Represents an advertising platform that a user can connect to.
    e.g., Google Ads, Meta Ads, etc.
    """
    name = models.CharField(max_length=100, unique=True)
    # Field to note the authentication type, e.g., 'oauth2' or 'apikey'
    auth_type = models.CharField(max_length=50, default='oauth2')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class UserAdAccount(models.Model):
    """
    Stores the specific ad account credentials and details for a user,
    linked to a specific platform.
    """
    # Links this account to a specific user in our system.
    # If a user is deleted, all their connected ad accounts are also deleted.
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Links to the platform this account is for (e.g., Google Ads).
    platform = models.ForeignKey(AdPlatform, on_delete=models.CASCADE)

    # A user-friendly name for this connection, e.g., "My E-commerce Store Ads"
    account_name = models.CharField(max_length=255)

    # The actual ID of the account on the ad platform (e.g., Google Ads Customer ID)
    customer_id = models.CharField(max_length=255, blank=True, null=True)

    # --- Credential Fields ---
    # These are nullable because not every platform uses every field.

    # For OAuth2.0 platforms like Google, Meta, Microsoft
    client_id = models.CharField(max_length=255, blank=True, null=True)
    client_secret = models.CharField(max_length=255, blank=True, null=True) # Note: Encrypt this in a real production app
    refresh_token = models.TextField(blank=True, null=True) # Refresh tokens can be long

    # For API Key platforms like Amazon
    api_key = models.CharField(max_length=255, blank=True, null=True)
    
    # Specific to Google Ads
    developer_token = models.CharField(max_length=255, blank=True, null=True) # Encrypt this as well

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        # Ensures a user can't connect the same platform with the same account name twice
        unique_together = ('user', 'platform', 'account_name')

    def __str__(self):
        return f"{self.user.username}'s {self.platform.name} - {self.account_name}"


class BusinessProfile(models.Model):
    """
    Stores detailed information about a user's business, which can be used
    to generate ad copy, suggest keywords, and configure campaigns.
    """
    # Each user can have multiple business profiles.
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='business_profiles')

    # Core Business Information
    business_name = models.CharField(max_length=255)
    website_url = models.URLField(max_length=500)
    industry = models.CharField(max_length=255, blank=True, null=True, help_text="e.g., E-commerce, SaaS, Local Restaurant")

    # Detailed Descriptions for Ad Generation
    business_description = models.TextField(help_text="A brief description of the business, its mission, and what it does.")
    products_or_services = models.TextField(help_text="List the main products or services offered. Separate items with a new line.")

    # Targeting Information
    target_audience = models.TextField(help_text="Describe the ideal customer (e.g., age, interests, location).")
    target_locations = models.CharField(max_length=500, help_text="Comma-separated list of cities, states, or countries to target.")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'business_name')
        ordering = ['business_name']

    def __str__(self):
        return f"{self.business_name} ({self.user.username})"


class Campaign(models.Model):
    """
    Stores campaign information for different ad platforms.
    Each campaign is linked to a user and their ad account.
    """
    # Basic Information
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='campaigns')
    ad_account = models.ForeignKey(UserAdAccount, on_delete=models.CASCADE, related_name='campaigns')
    business_profile = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE, related_name='campaigns', null=True, blank=True)
    
    # Campaign Details
    campaign_name = models.CharField(max_length=255)
    campaign_description = models.TextField(blank=True, null=True)
    
    # Budget and Bidding
    daily_budget = models.DecimalField(max_digits=10, decimal_places=2, help_text="Daily budget in USD")
    total_budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Total budget in USD")
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount per click in USD")
    
    # Campaign Settings
    CAMPAIGN_TYPES = [
        ('search', 'Search Campaign'),
        ('display', 'Display Campaign'),
        ('video', 'Video Campaign'),
        ('shopping', 'Shopping Campaign'),
        ('app', 'App Campaign'),
    ]
    campaign_type = models.CharField(max_length=20, choices=CAMPAIGN_TYPES, default='search')
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('ended', 'Ended'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    
    # Targeting
    target_locations = models.TextField(help_text="Comma-separated list of target locations")
    target_languages = models.CharField(max_length=500, blank=True, null=True, help_text="Comma-separated list of target languages")
    
    # Keywords (stored as JSON for flexibility)
    keywords = models.JSONField(default=list, help_text="List of keywords with match types")
    
    # Timestamps
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'ad_account', 'campaign_name')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.campaign_name} ({self.ad_account.platform.name})"


class Keyword(models.Model):
    """
    Stores individual keywords with their match types and bid amounts.
    """
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='keyword_set')
    
    keyword_text = models.CharField(max_length=100)
    
    MATCH_TYPES = [
        ('exact', 'Exact Match'),
        ('phrase', 'Phrase Match'),
        ('broad', 'Broad Match'),
        ('broad_match_modifier', 'Broad Match Modifier'),
    ]
    match_type = models.CharField(max_length=20, choices=MATCH_TYPES, default='broad')
    
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Custom bid amount for this keyword")
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('deleted', 'Deleted'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('campaign', 'keyword_text', 'match_type')
    
    def __str__(self):
        return f"{self.keyword_text} ({self.get_match_type_display()})"
class CampaignPerformance(models.Model):
    """ 
    Stores the daily aggregated performance metrics for a specific campaign. 
    This is for campaign-level totals.
    """
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='performance_data')
    date = models.DateField(db_index=True)

    # Core metrics fetched from the API
    impressions = models.PositiveIntegerField(default=0)
    clicks = models.PositiveIntegerField(default=0)
    cost = models.DecimalField(max_digits=12, decimal_places=2, help_text="Cost in your account's currency")
    conversions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # CRITICAL FOR ROAS: You must fetch and store conversion value
    conversion_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        unique_together = ('campaign', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.campaign.campaign_name} on {self.date}"


class KeywordPerformance(models.Model):
    """
    Stores the daily performance metrics for each individual keyword.
    This is needed for the Broad, Phrase, and Exact match breakdown.
    """
    keyword = models.ForeignKey(Keyword, on_delete=models.CASCADE, related_name='performance_data')
    date = models.DateField(db_index=True)

    # Core metrics fetched from the API
    impressions = models.PositiveIntegerField(default=0)
    clicks = models.PositiveIntegerField(default=0)
    cost = models.DecimalField(max_digits=12, decimal_places=2)
    conversions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    conversion_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    class Meta:
        unique_together = ('keyword', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.keyword.keyword_text} on {self.date}"
