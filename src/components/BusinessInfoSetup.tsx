import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Building2, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Brain,
  Zap,
  Users,
  DollarSign,
  MapPin
} from "lucide-react";
import { AdPlatform } from "./PlatformSelector";

interface BusinessInfoSetupProps {
  platform: AdPlatform;
  onBack: () => void;
  onComplete: (businessInfo: BusinessInfo) => void;
}

export interface BusinessInfo {
  businessName: string;
  industry: string;
  businessType: string;
  targetAudience: string;
  products: string[];
  location: string;
  budget: string;
  goals: string[];
  description: string;
}

const industries = [
  "E-commerce & Retail",
  "Technology & Software", 
  "Healthcare & Medical",
  "Finance & Banking",
  "Education & Training",
  "Real Estate",
  "Food & Beverage",
  "Travel & Tourism",
  "Fashion & Beauty",
  "Automotive",
  "Professional Services",
  "Entertainment & Media",
  "Non-profit",
  "Other"
];

const businessTypes = [
  "B2C (Business to Consumer)",
  "B2B (Business to Business)", 
  "B2B2C (Business to Business to Consumer)",
  "Marketplace",
  "SaaS (Software as a Service)",
  "Local Business",
  "E-commerce Store",
  "Service Provider",
  "Consultant/Freelancer"
];

const budgetRanges = [
  "Under $500/month",
  "$500 - $1,000/month",
  "$1,000 - $5,000/month", 
  "$5,000 - $10,000/month",
  "$10,000 - $25,000/month",
  "$25,000+/month"
];

const commonGoals = [
  "Increase Brand Awareness",
  "Generate Leads", 
  "Drive Website Traffic",
  "Boost Sales",
  "App Downloads",
  "Local Foot Traffic",
  "Customer Retention",
  "Product Launches"
];

export function BusinessInfoSetup({ platform, onBack, onComplete }: BusinessInfoSetupProps) {
  const [step, setStep] = useState(1);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "",
    industry: "",
    businessType: "",
    targetAudience: "",
    products: [],
    location: "",
    budget: "",
    goals: [],
    description: ""
  });
  const [currentProduct, setCurrentProduct] = useState("");
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const addProduct = () => {
    if (currentProduct.trim() && !businessInfo.products.includes(currentProduct.trim())) {
      setBusinessInfo(prev => ({
        ...prev,
        products: [...prev.products, currentProduct.trim()]
      }));
      setCurrentProduct("");
    }
  };

  const removeProduct = (product: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      products: prev.products.filter(p => p !== product)
    }));
  };

  const toggleGoal = (goal: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsGeneratingKeywords(true);
    // Simulate AI keyword generation
    setTimeout(() => {
      onComplete(businessInfo);
    }, 3000);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return businessInfo.businessName && businessInfo.industry && businessInfo.businessType;
      case 2:
        return businessInfo.targetAudience && businessInfo.location && businessInfo.budget;
      case 3:
        return businessInfo.products.length > 0 && businessInfo.goals.length > 0;
      case 4:
        return businessInfo.description;
      default:
        return false;
    }
  };

  if (isGeneratingKeywords) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <motion.div
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-10 w-10 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold mb-2">🤖 AI is analyzing your business</h3>
            <p className="text-muted-foreground">
              Our AI is generating personalized keyword suggestions based on your business information...
            </p>
          </div>
          <motion.div
            className="flex justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-4"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 30px rgba(139, 92, 246, 0.4)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Business Setup</h1>
          </motion.div>
          
          <div className="flex items-center gap-3 justify-center mb-6">
            <motion.div 
              className="text-2xl"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {platform.logo}
            </motion.div>
            <div className="text-left">
              <h2 className="text-lg font-semibold">{platform.name}</h2>
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Keywords
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </motion.div>

        {/* Setup Card */}
        <Card className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(135deg, ${platform.color}, transparent)`
            }}
          />
          
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {step === 1 && <Building2 className="h-5 w-5" />}
                {step === 2 && <Target className="h-5 w-5" />}
                {step === 3 && <Lightbulb className="h-5 w-5" />}
                {step === 4 && <Brain className="h-5 w-5" />}
                {step === 1 && "Business Basics"}
                {step === 2 && "Target & Budget"}
                {step === 3 && "Products & Goals"}
                {step === 4 && "Business Description"}
              </div>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Business Basics */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Enter your business name"
                      value={businessInfo.businessName}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, businessName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select 
                      value={businessInfo.industry} 
                      onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select 
                      value={businessInfo.businessType} 
                      onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, businessType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Target & Budget */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Target Audience *</Label>
                    <Input
                      id="targetAudience"
                      placeholder="e.g., Young professionals aged 25-35"
                      value={businessInfo.targetAudience}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, targetAudience: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Primary Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="e.g., United States, New York, Global"
                        value={businessInfo.location}
                        onChange={(e) => setBusinessInfo(prev => ({ ...prev, location: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Monthly Ad Budget *</Label>
                    <Select 
                      value={businessInfo.budget} 
                      onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, budget: value }))}
                    >
                      <SelectTrigger>
                        <DollarSign className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map(range => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Products & Goals */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="products">Products/Services *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="products"
                        placeholder="Enter a product or service"
                        value={currentProduct}
                        onChange={(e) => setCurrentProduct(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addProduct()}
                      />
                      <Button onClick={addProduct} disabled={!currentProduct.trim()}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {businessInfo.products.map(product => (
                        <Badge 
                          key={product} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeProduct(product)}
                        >
                          {product} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Campaign Goals * (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {commonGoals.map(goal => (
                        <motion.div
                          key={goal}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Badge
                            variant={businessInfo.goals.includes(goal) ? "default" : "outline"}
                            className="cursor-pointer w-full text-center p-2 h-auto"
                            onClick={() => toggleGoal(goal)}
                          >
                            {goal}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Business Description */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your business, what makes it unique, and what you're trying to achieve with advertising..."
                      value={businessInfo.description}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, description: e.target.value }))}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 This helps our AI generate more relevant keyword suggestions
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => step > 1 ? setStep(step - 1) : onBack()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {step > 1 ? "Previous" : "Back"}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {step === totalSteps ? "Generate Keywords" : "Next"}
                {step === totalSteps ? (
                  <Sparkles className="h-4 w-4 ml-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}