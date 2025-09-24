import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BarChart3, Filter, Target, TrendingUp, Users, Building2, ShoppingBag, Gamepad2, Briefcase, Heart, Car, Home, GraduationCap, Plane } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { AdPlatform, SubPlatform } from "./PlatformSelector";
import { AccountSetupData } from "./AccountSetupForm";

interface DashboardOptionsProps {
  platform: AdPlatform;
  subPlatform?: SubPlatform | null;
  setupData: AccountSetupData;
  onBack: () => void;
  onOptionSelect: (option: 'comprehensive' | 'categorized', category?: string, keywordCategories?: KeywordCategorization) => void;
}

interface KeywordCategorization {
  campaignIntent: string[];
  keywordThemes: string[];
  seasonality: string[];
  competitionLevel: string;
  budgetAllocation: { [key: string]: number };
  performanceGoals: { [key: string]: number };
}

const businessCategories = [
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingBag, description: 'Online retail, product sales, marketplaces' },
  { id: 'saas', label: 'SaaS/Tech', icon: Target, description: 'Software services, apps, tech solutions' },
  { id: 'local', label: 'Local Business', icon: Building2, description: 'Restaurants, services, brick & mortar' },
  { id: 'finance', label: 'Finance/Insurance', icon: Briefcase, description: 'Banking, insurance, financial services' },
  { id: 'healthcare', label: 'Healthcare', icon: Heart, description: 'Medical, dental, health services' },
  { id: 'automotive', label: 'Automotive', icon: Car, description: 'Cars, dealers, automotive services' },
  { id: 'realestate', label: 'Real Estate', icon: Home, description: 'Property sales, rentals, real estate' },
  { id: 'education', label: 'Education', icon: GraduationCap, description: 'Schools, courses, training' },
  { id: 'travel', label: 'Travel', icon: Plane, description: 'Hotels, flights, travel services' },
  { id: 'content', label: 'Content/Media', icon: Users, description: 'Blogs, news, entertainment, courses' },
  { id: 'gaming', label: 'Gaming/Apps', icon: Gamepad2, description: 'Mobile games, app installs, gaming' },
  { id: 'b2b', label: 'B2B Services', icon: TrendingUp, description: 'Professional services, consulting, B2B' },
];

const campaignIntents = [
  'Brand Awareness', 'Lead Generation', 'Direct Sales', 'App Downloads',
  'Local Store Visits', 'Phone Calls', 'Email Signups', 'Content Engagement'
];

const getKeywordThemesForCategory = (category: string) => {
  const themes: { [key: string]: string[] } = {
    ecommerce: ['Product Names', 'Category Terms', 'Brand Keywords', 'Comparison Keywords', 'Reviews & Ratings', 'Sale/Discount Terms'],
    saas: ['Software Solutions', 'Features/Benefits', 'Integrations', 'Competitor Terms', 'Problem-Solution', 'Free Trial/Demo'],
    local: ['Service + Location', 'Near Me Terms', 'Emergency Services', 'Business Hours', 'Reviews/Ratings', 'Local Events'],
    finance: ['Financial Products', 'Rates/Pricing', 'Loan Types', 'Investment Terms', 'Insurance Coverage', 'Credit Terms'],
    healthcare: ['Conditions/Symptoms', 'Treatments', 'Doctors/Specialists', 'Insurance Accepted', 'Emergency Care', 'Preventive Care'],
    automotive: ['Car Models', 'Dealership Names', 'Service Types', 'Parts/Accessories', 'Financing Options', 'Trade-in Terms'],
    realestate: ['Property Types', 'Location Terms', 'Price Ranges', 'Agent Names', 'Mortgage/Financing', 'Market Conditions'],
    education: ['Course Names', 'Degrees/Certifications', 'Online Learning', 'Admission Terms', 'Tuition/Costs', 'Career Outcomes'],
    travel: ['Destinations', 'Travel Dates', 'Hotel Names', 'Flight Routes', 'Package Deals', 'Travel Insurance'],
    content: ['Topic Keywords', 'Content Types', 'Creator Names', 'Platform Terms', 'Subscription Terms', 'Trending Topics'],
    gaming: ['Game Titles', 'Platform Names', 'Game Genres', 'In-App Purchases', 'Gaming Hardware', 'Esports Terms'],
    b2b: ['Business Solutions', 'Industry Terms', 'Company Size', 'Decision Maker Titles', 'ROI/Benefits', 'Implementation']
  };
  return themes[category] || themes.ecommerce;
};

const seasonalityOptions = [
  'Holiday Seasons', 'Back to School', 'Summer/Vacation', 'Tax Season',
  'Black Friday/Cyber Monday', 'New Year Resolutions', 'Spring Cleaning', 'None/Year-Round'
];

export function DashboardOptions({ platform, subPlatform, setupData, onBack, onOptionSelect }: DashboardOptionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCategories, setShowCategories] = useState(false);
  const [showKeywordCategories, setShowKeywordCategories] = useState(false);
  const [keywordCategorization, setKeywordCategorization] = useState<KeywordCategorization>({
    campaignIntent: [],
    keywordThemes: [],
    seasonality: [],
    competitionLevel: 'medium',
    budgetAllocation: {},
    performanceGoals: {}
  });

  const handleComprehensiveView = () => {
    onOptionSelect('comprehensive');
  };

  const handleCategorizedView = () => {
    if (selectedCategory) {
      setShowKeywordCategories(true);
    }
  };

  const handleKeywordCategorizationComplete = () => {
    onOptionSelect('categorized', selectedCategory, keywordCategorization);
  };

  const toggleArrayField = (field: keyof KeywordCategorization, value: string) => {
    setKeywordCategorization(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="hover:bg-accent/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="flex items-center gap-3">
              Choose Your Dashboard View
            </h1>
            <p className="text-muted-foreground">
              Connected to {subPlatform?.name || platform.name} • Select how you want to analyze your match-type performance
            </p>
          </div>
        </div>

        {!showCategories ? (
          /* Main Options */
          <div className="grid md:grid-cols-2 gap-6">
            {/* Comprehensive Dashboard Option */}
            <motion.div
              whileHover={{ y: -5, rotateX: 5 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-background to-accent/20 h-full">
                <div className="text-center space-y-6">
                  <motion.div 
                    className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.1, rotateY: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </motion.div>
                  
                  <div>
                    <h3 className="mb-3">Comprehensive View</h3>
                    <p className="text-muted-foreground mb-4">
                      See all your {subPlatform?.name || platform.name} campaigns with complete match-type breakdown
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">Broad Match</Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">Phrase Match</Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">Exact Match</Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 text-left">
                      <li>• All campaign performance data</li>
                      <li>• Match-type comparison analytics</li>
                      <li>• Cross-campaign insights</li>
                      <li>• Advanced filtering & sorting</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handleComprehensiveView}
                    className="w-full mt-6 bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    View All Campaigns
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Categorized View Option */}
            <motion.div
              whileHover={{ y: -5, rotateX: 5 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-background to-accent/20 h-full">
                <div className="text-center space-y-6">
                  <motion.div 
                    className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.1, rotateY: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Filter className="w-8 h-8 text-primary" />
                  </motion.div>
                  
                  <div>
                    <h3 className="mb-3">Categorized View</h3>
                    <p className="text-muted-foreground mb-4">
                      Get tailored insights based on your business category with smart recommendations
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="border-orange-200 text-orange-700">Smart Insights</Badge>
                      <Badge variant="outline" className="border-teal-200 text-teal-700">AI Recommendations</Badge>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 text-left">
                      <li>• Industry-specific benchmarks</li>
                      <li>• Personalized match-type strategy</li>
                      <li>• Competitor analysis</li>
                      <li>• Goal-oriented optimization</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={() => setShowCategories(true)}
                    variant="outline"
                    className="w-full mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    size="lg"
                  >
                    Choose Category
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        ) : !showKeywordCategories ? (
          /* Category Selection */
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setShowCategories(false)}
                className="hover:bg-accent/50"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2>Select Your Business Category</h2>
                <p className="text-muted-foreground">Based on your account setup, we recommend these categories</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {businessCategories.map((category) => {
                const isRecommended = setupData.industry.toLowerCase().includes(category.id) || 
                                    category.label.toLowerCase().includes(setupData.industry.toLowerCase().split(' ')[0]);
                
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`p-6 cursor-pointer transition-all duration-300 relative ${
                        selectedCategory === category.id 
                          ? 'border-primary bg-primary/5 shadow-lg' 
                          : 'hover:shadow-md hover:border-primary/20'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {isRecommended && (
                        <Badge className="absolute -top-2 -right-2 bg-green-500">
                          Recommended
                        </Badge>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          selectedCategory === category.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent text-accent-foreground'
                        }`}>
                          <category.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-2">{category.label}</h4>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center pt-6"
              >
                <Button 
                  onClick={handleCategorizedView}
                  size="lg"
                  className="min-w-48 bg-primary hover:bg-primary/90"
                >
                  Continue with {businessCategories.find(c => c.id === selectedCategory)?.label}
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Keyword Categorization */
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setShowKeywordCategories(false)}
                className="hover:bg-accent/50"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2>Keyword Strategy Configuration</h2>
                <p className="text-muted-foreground">
                  Help us categorize and optimize your keywords for {businessCategories.find(c => c.id === selectedCategory)?.label}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Campaign Intent */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Campaign Intent
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  What actions do you want users to take?
                </p>
                <div className="space-y-2">
                  {campaignIntents.map((intent) => (
                    <div key={intent} className="flex items-center space-x-2">
                      <Checkbox
                        id={intent}
                        checked={keywordCategorization.campaignIntent.includes(intent)}
                        onCheckedChange={() => toggleArrayField('campaignIntent', intent)}
                      />
                      <Label htmlFor={intent} className="text-sm cursor-pointer">
                        {intent}
                      </Label>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Keyword Themes */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Keyword Themes
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select relevant keyword categories for your business
                </p>
                <div className="space-y-2">
                  {getKeywordThemesForCategory(selectedCategory).map((theme) => (
                    <div key={theme} className="flex items-center space-x-2">
                      <Checkbox
                        id={theme}
                        checked={keywordCategorization.keywordThemes.includes(theme)}
                        onCheckedChange={() => toggleArrayField('keywordThemes', theme)}
                      />
                      <Label htmlFor={theme} className="text-sm cursor-pointer">
                        {theme}
                      </Label>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Seasonality */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Seasonality Patterns
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  When is your business most active?
                </p>
                <div className="space-y-2">
                  {seasonalityOptions.map((season) => (
                    <div key={season} className="flex items-center space-x-2">
                      <Checkbox
                        id={season}
                        checked={keywordCategorization.seasonality.includes(season)}
                        onCheckedChange={() => toggleArrayField('seasonality', season)}
                      />
                      <Label htmlFor={season} className="text-sm cursor-pointer">
                        {season}
                      </Label>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Competition & Goals Summary */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Account Summary
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-medium">Monthly Budget:</span>
                    <span className="ml-2 text-muted-foreground">{setupData.monthlySpend}</span>
                  </div>
                  <div>
                    <span className="font-medium">Primary Objectives:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {setupData.primaryObjectives.slice(0, 3).map((obj) => (
                        <Badge key={obj} variant="outline" className="text-xs">
                          {obj}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Target Markets:</span>
                    <div className="text-muted-foreground mt-1">
                      {setupData.targetMarkets.slice(0, 2).join(', ')}
                      {setupData.targetMarkets.length > 2 && ` +${setupData.targetMarkets.length - 2} more`}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Experience Level:</span>
                    <span className="ml-2 text-muted-foreground capitalize">{setupData.experienceLevel}</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleKeywordCategorizationComplete}
                size="lg"
                className="min-w-48 bg-primary hover:bg-primary/90"
                disabled={keywordCategorization.campaignIntent.length === 0 || keywordCategorization.keywordThemes.length === 0}
              >
                Complete Setup & View Dashboard
              </Button>
            </div>
          </motion.div>
        )}

        {/* Quick Stats Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10"
        >
          <div className="text-center mb-4">
            <h4 className="text-sm uppercase tracking-wide text-muted-foreground">What You'll Get</h4>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">📊</div>
              <p className="text-sm">Match-Type Performance Breakdown</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm">Keyword Optimization Insights</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📈</div>
              <p className="text-sm">Performance Trending Analysis</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}