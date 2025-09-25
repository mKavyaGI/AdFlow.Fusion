# prompt_templates.py

NEW_KEYWORD_RECOMMENDATION_PROMPT = """
You are a Google Ads expert. Recommend 5 new keywords and match types for a business in the {industry} sector, targeting {target_audience}, that sells {main_products}. Here is their past keyword performance data: {keyword_data}
"""

STRUCTURED_KEYWORD_RECOMMENDATION_PROMPT = """
You are a Google Ads expert. For a business in the {industry} sector, targeting {target_audience}, that sells {main_products}, analyze the following keyword performance data:

{keyword_data}

Based on this, recommend exactly 5 new keywords. Provide your response as a JSON array of objects. Each object must have the following keys:
- "keyword": The suggested keyword string.
- "match_type": The suggested match type (e.g., "exact", "phrase", "broad").
- "reason": A concise explanation (max 25 words) of why you are recommending this keyword.

Example JSON response:
[
  {
    "keyword": "sustainable running shoes",
    "match_type": "phrase",
    "reason": "Targets eco-conscious consumers and aligns with growing sustainability trends, leveraging the user's good performance in the 'shoes' category."
  }
]
"""

# Add other prompt templates here as needed