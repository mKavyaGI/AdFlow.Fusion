import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ArrowLeft, Building, Target, DollarSign, MapPin, Users, Clock, BarChart3 } from "lucide-react";
import { AdPlatform, SubPlatform } from "./PlatformSelector";

interface AccountSetupFormProps {
  platform: AdPlatform;
  subPlatform?: SubPlatform | null;
  onBack: () => void;
  onComplete: (setupData: AccountSetupData) => void;
}

export interface AccountSetupData {
  // Account Information
  accountType: 'individual' | 'business' | 'agency';
  companyName?: string;
  industry: string;
  monthlySpend: string;
  
  // Campaign Objectives
  primaryObjectives: string[];
  campaignTypes: string[];
  
  // Targeting & Audience
  targetMarkets: string[];
  audienceSize: string;
  demographics: {
    ageRanges: string[];
    interests: string[];
  };
  
  // Performance Goals
  targetCPA?: number;
  targetROAS?: number;
  conversionGoals: string[];
  
  // Experience & History
  experienceLevel: string;
  currentPlatforms: string[];
  previousSpend?: number;
  
  // Technical Setup
  hasGTM: boolean;
  hasGA4: boolean;
  trackingSetup: string;
}

const industries = [
  'E-commerce & Retail', 'Technology & Software', 'Healthcare & Medical',
  'Finance & Insurance', 'Real Estate', 'Education & Training',
  'Travel & Hospitality', 'Food & Beverage', 'Automotive',
  'Fashion & Beauty', 'Sports & Fitness', 'Entertainment & Media',
  'Professional Services', 'Manufacturing', 'Non-profit', 'Other'
];

const spendRanges = [
  'Under $1,000/month', '$1,000 - $5,000/month', '$5,000 - $15,000/month',
  '$15,000 - $50,000/month', '$50,000 - $100,000/month', 'Over $100,000/month'
];

const objectives = [
  'Brand Awareness', 'Lead Generation', 'Sales/Conversions', 'App Installs',
  'Website Traffic', 'Local Store Visits', 'Video Views', 'Engagement'
];

const campaignTypes = [
  'Search Campaigns', 'Display Campaigns', 'Shopping Campaigns', 'Video Campaigns',
  'App Campaigns', 'Performance Max', 'Local Campaigns', 'Smart Campaigns'
];

const conversionGoals = [
  'Purchase/Sale', 'Lead Form', 'Phone Call', 'Email Signup',
  'App Install', 'Page View', 'Video Watch', 'Store Visit'
];

export function AccountSetupForm({ platform, subPlatform, onBack, onComplete }: AccountSetupFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AccountSetupData>({
    accountType: 'business',
    industry: '',
    monthlySpend: '',
    primaryObjectives: [],
    campaignTypes: [],
    targetMarkets: ['United States'],
    audienceSize: '',
    demographics: { ageRanges: [], interests: [] },
    conversionGoals: [],
    experienceLevel: '',
    currentPlatforms: [],
    hasGTM: false,
    hasGA4: false,
    trackingSetup: 'basic'
  });

  const totalSteps = 5;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: keyof AccountSetupData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.accountType && formData.industry && formData.monthlySpend);
      case 2:
        return formData.primaryObjectives.length > 0 && formData.campaignTypes.length > 0;
      case 3:
        return formData.targetMarkets.length > 0 && formData.audienceSize;
      case 4:
        return formData.conversionGoals.length > 0 && formData.experienceLevel;
      case 5:
        return formData.trackingSetup !== '';
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
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
          <Button variant="ghost" onClick={handlePrevious}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1>Account Setup for {subPlatform?.name || platform.name}</h1>
            <p className="text-muted-foreground">
              Help us optimize your campaigns by providing detailed account information
            </p>
          </div>
          <Badge variant="outline">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[...Array(totalSteps)].map((_, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index + 1 === currentStep
                      ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {index + 1}
                </motion.div>
                {index < totalSteps - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    index + 1 < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-6 h-6" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  <div className="space-y-3">
                    <Label>Account Type</Label>
                    <RadioGroup 
                      value={formData.accountType} 
                      onValueChange={(value) => updateFormData('accountType', value)}
                      className="grid grid-cols-3 gap-4"
                    >
                      {['individual', 'business', 'agency'].map((type) => (
                        <div key={type} className="flex items-center space-x-2 border rounded-lg p-4">
                          <RadioGroupItem value={type} id={type} />
                          <Label htmlFor={type} className="capitalize cursor-pointer flex-1">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {formData.accountType !== 'individual' && (
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.companyName || ''}
                        onChange={(e) => updateFormData('companyName', e.target.value)}
                        placeholder="Enter your company name"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry/Vertical</Label>
                    <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spend">Monthly Ad Spend Budget</Label>
                    <Select value={formData.monthlySpend} onValueChange={(value) => updateFormData('monthlySpend', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your monthly spend range" />
                      </SelectTrigger>
                      <SelectContent>
                        {spendRanges.map((range) => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </div>
            )}

            {/* Step 2: Campaign Objectives */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    Campaign Objectives & Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  <div className="space-y-3">
                    <Label>Primary Advertising Objectives (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {objectives.map((objective) => (
                        <motion.div
                          key={objective}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              formData.primaryObjectives.includes(objective)
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => toggleArrayField('primaryObjectives', objective)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={formData.primaryObjectives.includes(objective)}
                                onChange={() => {}}
                              />
                              <span className="text-sm">{objective}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Campaign Types You Want to Run</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {campaignTypes.map((type) => (
                        <motion.div
                          key={type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              formData.campaignTypes.includes(type)
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => toggleArrayField('campaignTypes', type)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={formData.campaignTypes.includes(type)}
                                onChange={() => {}}
                              />
                              <span className="text-sm">{type}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            )}

            {/* Step 3: Targeting & Audience */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Target Audience & Geography
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  <div className="space-y-2">
                    <Label>Target Markets/Countries</Label>
                    <Textarea
                      value={formData.targetMarkets.join(', ')}
                      onChange={(e) => updateFormData('targetMarkets', e.target.value.split(', '))}
                      placeholder="United States, Canada, United Kingdom..."
                      className="min-h-20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estimated Audience Size</Label>
                    <Select value={formData.audienceSize} onValueChange={(value) => updateFormData('audienceSize', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local (City/Region)</SelectItem>
                        <SelectItem value="regional">Regional (State/Province)</SelectItem>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Age Ranges</Label>
                    <div className="flex flex-wrap gap-2">
                      {['18-24', '25-34', '35-44', '45-54', '55-64', '65+'].map((age) => (
                        <Badge
                          key={age}
                          variant={formData.demographics.ageRanges.includes(age) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newAges = formData.demographics.ageRanges.includes(age)
                              ? formData.demographics.ageRanges.filter(a => a !== age)
                              : [...formData.demographics.ageRanges, age];
                            updateFormData('demographics', { ...formData.demographics, ageRanges: newAges });
                          }}
                        >
                          {age}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Primary Customer Interests/Categories</Label>
                    <Textarea
                      value={formData.demographics.interests.join(', ')}
                      onChange={(e) => updateFormData('demographics', { 
                        ...formData.demographics, 
                        interests: e.target.value.split(', ') 
                      })}
                      placeholder="Technology, Fashion, Sports, Travel..."
                      className="min-h-20"
                    />
                  </div>
                </CardContent>
              </div>
            )}

            {/* Step 4: Performance Goals */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" />
                    Performance Goals & Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cpa">Target Cost Per Acquisition (CPA)</Label>
                      <Input
                        id="cpa"
                        type="number"
                        value={formData.targetCPA || ''}
                        onChange={(e) => updateFormData('targetCPA', Number(e.target.value))}
                        placeholder="$50.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roas">Target Return on Ad Spend (ROAS)</Label>
                      <Input
                        id="roas"
                        type="number"
                        step="0.1"
                        value={formData.targetROAS || ''}
                        onChange={(e) => updateFormData('targetROAS', Number(e.target.value))}
                        placeholder="4.0"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Primary Conversion Goals</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {conversionGoals.map((goal) => (
                        <motion.div
                          key={goal}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              formData.conversionGoals.includes(goal)
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => toggleArrayField('conversionGoals', goal)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={formData.conversionGoals.includes(goal)}
                                onChange={() => {}}
                              />
                              <span className="text-sm">{goal}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Your Experience Level with {platform.name}</Label>
                    <RadioGroup 
                      value={formData.experienceLevel} 
                      onValueChange={(value) => updateFormData('experienceLevel', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <Label htmlFor="beginner">Beginner - New to {platform.name}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" />
                        <Label htmlFor="intermediate">Intermediate - Some experience</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced">Advanced - Extensive experience</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expert" id="expert" />
                        <Label htmlFor="expert">Expert - Managing multiple accounts</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </div>
            )}

            {/* Step 5: Technical Setup */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    Technical & Tracking Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="gtm"
                        checked={formData.hasGTM}
                        onCheckedChange={(checked) => updateFormData('hasGTM', checked)}
                      />
                      <Label htmlFor="gtm">I have Google Tag Manager installed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ga4"
                        checked={formData.hasGA4}
                        onCheckedChange={(checked) => updateFormData('hasGA4', checked)}
                      />
                      <Label htmlFor="ga4">I have Google Analytics 4 configured</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Conversion Tracking Setup Preference</Label>
                    <RadioGroup 
                      value={formData.trackingSetup} 
                      onValueChange={(value) => updateFormData('trackingSetup', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="basic" id="basic" />
                        <Label htmlFor="basic">Basic - Standard platform tracking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enhanced" id="enhanced" />
                        <Label htmlFor="enhanced">Enhanced - Custom events & parameters</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced-tracking" />
                        <Label htmlFor="advanced-tracking">Advanced - Full attribution modeling</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Previous Monthly Ad Spend (Optional)</Label>
                    <Input
                      type="number"
                      value={formData.previousSpend || ''}
                      onChange={(e) => updateFormData('previousSpend', Number(e.target.value))}
                      placeholder="$5,000"
                    />
                    <p className="text-sm text-muted-foreground">
                      This helps us benchmark your performance expectations
                    </p>
                  </div>
                </CardContent>
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t">
            <Button variant="outline" onClick={handlePrevious}>
              {currentStep === 1 ? 'Back' : 'Previous'}
            </Button>
            <div className="text-sm text-muted-foreground">
              {currentStep} of {totalSteps} steps completed
            </div>
            <Button 
              onClick={handleNext}
              disabled={!isStepComplete(currentStep)}
            >
              {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}