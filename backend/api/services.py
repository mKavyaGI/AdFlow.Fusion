# In yourapp/services.py

import json
from datetime import date, timedelta
from decimal import Decimal
from django.db.models import Sum, F, Case, When, DecimalField
from .models import Campaign, Keyword, CampaignPerformance, KeywordPerformance, BusinessProfile
from .gemini_service import generate_text_from_gemini
from . import prompt_templates

# You will need your Google Ads client library here
# from google.ads.googleads.client import GoogleAdsClient
# from google.ads.googleads.errors import GoogleAdsException

def sync_daily_performance_data():
    """
    Fetches yesterday's performance data for all active campaigns and keywords
    and stores it in the database.
    
    This function should be run daily by a background task.
    """
    yesterday = date.today() - timedelta(days=1)
    
    # 1. Get all active campaigns you want to track
    active_campaigns = Campaign.objects.filter(status='active')
    
    for campaign in active_campaigns:
        # Here you would connect to the Ad Platform API (e.g., Google Ads)
        # using the credentials stored in campaign.ad_account
        
        # --- This is a conceptual example of the API call ---
        # gads_client = initialize_google_ads_client(campaign.ad_account)
        # ga_service = gads_client.get_service("GoogleAdsService")
        
        # NOTE: Your query MUST include keyword and date segments
        # to get the data needed for both models.
        query = f"""
            SELECT
                campaign.id,
                ad_group_criterion.criterion_id,
                segments.date,
                metrics.impressions,
                metrics.clicks,
                metrics.cost_micros,
                metrics.conversions,
                metrics.conversions_value
            FROM keyword_view
            WHERE segments.date = '{yesterday.strftime('%Y-%m-%d')}'
              AND campaign.id = {campaign.platform_campaign_id} 
              -- You'll need to store the actual platform campaign ID in your Campaign model
        """

        # --- Pretend 'api_results' is the list of rows from the API ---
        # In reality, you'd loop through the response from ga_service.search(...)
        api_results = [] # Replace this with your actual API call loop
        
        # 2. Loop through API results and store data
        for row in api_results:
            # Find the matching keyword in your database
            try:
                keyword = Keyword.objects.get(
                    campaign=campaign,
                    # You would need to store the platform's keyword ID
                    platform_keyword_id=row.ad_group_criterion.criterion_id 
                )
            except Keyword.DoesNotExist:
                continue # Skip if keyword is not tracked in our DB

            # Convert cost from micros (e.g., Google) to a standard decimal
            cost_decimal = row.metrics.cost_micros / 1_000_000
            
            # 3. Create or update KeywordPerformance record
            KeywordPerformance.objects.update_or_create(
                keyword=keyword,
                date=yesterday,
                defaults={
                    'impressions': row.metrics.impressions,
                    'clicks': row.metrics.clicks,
                    'cost': cost_decimal,
                    'conversions': row.metrics.conversions,
                    'conversion_value': row.metrics.conversions_value,
                }
            )

    # 4. After processing all keywords, aggregate data for the CampaignPerformance model
    for campaign in active_campaigns:
        # Sum up the performance from all its keywords for that day
        daily_totals = KeywordPerformance.objects.filter(
            keyword__campaign=campaign,
            date=yesterday
        ).aggregate(
            total_impressions=Sum('impressions'),
            total_clicks=Sum('clicks'),
            total_cost=Sum('cost'),
            total_conversions=Sum('conversions'),
            total_conversion_value=Sum('conversion_value')
        )

        # Create or update CampaignPerformance record
        CampaignPerformance.objects.update_or_create(
            campaign=campaign,
            date=yesterday,
            defaults={
                'impressions': daily_totals.get('total_impressions', 0),
                'clicks': daily_totals.get('total_clicks', 0),
                'cost': daily_totals.get('total_cost', 0),
                'conversions': daily_totals.get('total_conversions', 0),
                'conversion_value': daily_totals.get('total_conversion_value', 0),
            }
        )

    print(f"Successfully synced performance data for {yesterday}")

def get_keyword_performance_data(campaign_id, start_date, end_date):
    """
    Fetches and aggregates keyword performance data for a specific campaign
    within a given date range.

    Args:
        campaign_id (int): The ID of the campaign to fetch data for.
        start_date (date): The start date of the period.
        end_date (date): The end date of the period.

    Returns:
        A list of dictionaries, each containing aggregated performance
        metrics for a keyword.
    """
    performance_data = KeywordPerformance.objects.filter(
        keyword__campaign_id=campaign_id,
        date__gte=start_date,
        date__lte=end_date
    ).values(
        'keyword__keyword_text',
        'keyword__match_type'
    ).annotate(
        total_impressions=Sum('impressions'),
        total_clicks=Sum('clicks'),
        total_cost=Sum('cost'),
        total_conversions=Sum('conversions'),
        total_conversion_value=Sum('conversion_value')
    ).order_by('-total_clicks')

    # Add calculated metrics like CTR and CPC
    for item in performance_data:
        item['ctr'] = (item['total_clicks'] / item['total_impressions'] * 100) if item['total_impressions'] > 0 else 0
        item['cpc'] = (item['total_cost'] / item['total_clicks']) if item['total_clicks'] > 0 else 0
        item['cpa'] = (item['total_cost'] / item['total_conversions']) if item['total_conversions'] > 0 else 0

    return list(performance_data)

def recommend_top_keywords(performance_data):
    """
    Recommends the top 5 keywords based on the total number of conversions.

    Args:
        performance_data (list): A list of dictionaries, where each dictionary
                                 contains keyword performance metrics, including
                                 a 'total_conversions' key.

    Returns:
        list: A list containing the top 5 keyword dictionaries, sorted by
              total conversions in descending order.
    """
    # Sort the list by the 'total_conversions' value in descending order
    sorted_by_conversions = sorted(
        performance_data,
        key=lambda k: k.get('total_conversions', 0),
        reverse=True
    )

    # Return the top 5
    return sorted_by_conversions[:5]

def get_keyword_performance_for_user(user, days=30):
    """
    Fetches and aggregates keyword performance data for a specific user
    over a given number of days.

    Args:
        user (User): The user to fetch data for.
        days (int): The number of past days to include in the report.

    Returns:
        A list of dictionaries, each containing aggregated performance
        metrics for a keyword.
    """
    start_date = date.today() - timedelta(days=days)

    queryset = KeywordPerformance.objects.filter(
        keyword__campaign__user=user,
        date__gte=start_date
    ).values(
        'keyword__keyword_text',
        'keyword__match_type'
    ).annotate(
        total_impressions=Sum('impressions'),
        total_clicks=Sum('clicks'),
        total_cost=Sum('cost'),
        total_conversions=Sum('conversions'),
        cpc=Case(
            When(total_clicks__gt=0, then=F('total_cost') / F('total_clicks')),
            default=0.0,
            output_field=DecimalField()
        )
    ).order_by('-total_clicks')

    return list(queryset)

def get_keyword_analysis_from_llm(user):
    """
    Fetches keyword performance data, sends it to an LLM for analysis,
    and returns the analysis.
    """
    # 1. Fetch the data
    performance_data = get_keyword_performance_for_user(user)

    if not performance_data:
        return "No keyword performance data found for this user in the last 30 days."

    # Convert Decimal types to string for JSON serialization
    for item in performance_data:
        for key, value in item.items():
            if isinstance(value, Decimal):
                item[key] = str(value)

    # 2. Format the data
    data_as_json = json.dumps(performance_data, indent=2)

    # 3. Build the prompt
    prompt = f"""
    Here is the performance data for a user's keywords over the last 30 days in JSON format:

    {data_as_json}

    Please perform the following analysis:
    1.  Identify the top 3 performing keywords based on conversions and CPC.
    2.  Identify the bottom 3 performing keywords that have a high cost but low conversions.
    3.  Provide actionable recommendations to improve the campaign performance. For example, suggest pausing underperforming keywords, reallocating budget to top performers, or adjusting match types.
    4.  Keep the analysis concise and easy to understand for a non-expert.
    """

    # 4. Call the LLM
    analysis = generate_text_from_gemini(prompt)

    return analysis

def generate_new_keyword_recommendations(business_profile, user):
    """
    Generates new keyword recommendations using a pre-defined prompt template.
    """
    # 1. Fetch keyword performance data
    keyword_data = get_keyword_performance_for_user(user)

    # Convert Decimal to string for JSON
    for item in keyword_data:
        for key, value in item.items():
            if isinstance(value, Decimal):
                item[key] = str(value)
    
    keyword_data_json = json.dumps(keyword_data, indent=2)

    # 2. Get data from business profile
    industry = business_profile.industry
    target_audience = business_profile.target_audience
    main_products = business_profile.products_or_services

    # 3. Build the prompt from the template
    prompt = prompt_templates.NEW_KEYWORD_RECOMMENDATION_PROMPT.format(
        industry=industry,
        target_audience=target_audience,
        main_products=main_products,
        keyword_data=keyword_data_json
    )

    # 4. Call the LLM
    recommendations = generate_text_from_gemini(prompt)

    return recommendations
