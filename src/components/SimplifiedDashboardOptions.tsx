import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BarChart3, Target, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { AdPlatform, SubPlatform } from "./PlatformSelector";
import { PlatformCredentials } from "./ApiCredentialsForm";

interface SimplifiedDashboardOptionsProps {
  platform: AdPlatform;
  subPlatform?: SubPlatform | null;
  credentials: PlatformCredentials;
  onBack: () => void;
  onOptionSelect: (option: 'comprehensive' | 'categorized') => void;
}

export function SimplifiedDashboardOptions({ 
  platform, 
  subPlatform, 
  credentials, 
  onBack, 
  onOptionSelect 
}: SimplifiedDashboardOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const dashboardOptions = [
    {
      id: 'comprehensive',
      title: 'All Campaigns View',
      description: 'Comprehensive match-type analysis across all your campaigns',
      icon: BarChart3,
      features: [
        'All campaigns and ad groups',
        'Complete keyword match-type breakdown',
        'Performance comparisons',
        'Cost and conversion metrics',
        'Search term analysis'
      ],
      color: '#3b82f6'
    },
    {
      id: 'categorized',
      title: 'Campaign Categories',
      description: 'Organized view by campaign types and objectives',
      icon: Target,
      features: [
        'Grouped by campaign objectives',
        'Category-specific insights',
        'Match-type recommendations',
        'Budget allocation analysis',
        'Performance by category'
      ],
      color: '#10b981'
    }
  ];

  const getConnectedAccountInfo = () => {
    if (credentials.googleAds) {
      return {
        accountId: credentials.googleAds.customerId,
        type: 'Customer ID'
      };
    } else if (credentials.metaAds) {
      return {
        accountId: credentials.metaAds.adAccountId,
        type: 'Ad Account'
      };
    } else if (credentials.amazonAds) {
      return {
        accountId: credentials.amazonAds.profileId,
        type: 'Profile ID'
      };
    } else if (credentials.microsoftAds) {
      return {
        accountId: credentials.microsoftAds.accountId,
        type: 'Account ID'
      };
    }
    return null;
  };

  const accountInfo = getConnectedAccountInfo();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1>Choose Your Dashboard View</h1>
            <p className="text-muted-foreground">
              How would you like to analyze your {subPlatform?.name || platform.name} keyword match-type performance?
            </p>
          </div>
          {accountInfo && (
            <Badge variant="outline" className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Connected: {accountInfo.accountId}
            </Badge>
          )}
        </div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="p-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <motion.div 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {platform.logo}
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  Successfully Connected to {subPlatform?.name || platform.name}
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Ready to fetch keyword match-type data from {accountInfo?.type}: {accountInfo?.accountId}
                </p>
              </div>
              <Badge className="bg-green-600 text-white">
                API Connected
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Dashboard Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {dashboardOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`p-8 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'hover:shadow-md hover:border-primary/20'
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div 
                        className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent text-accent-foreground'
                        }`}
                        style={{
                          backgroundColor: isSelected ? option.color : undefined
                        }}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                        <p className="text-muted-foreground">{option.description}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                        What you'll get:
                      </h4>
                      <ul className="space-y-2">
                        {option.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + featureIndex * 0.1 }}
                            className="flex items-center gap-3 text-sm"
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: option.color }}
                            />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Select Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant={isSelected ? "default" : "outline"}
                        className="w-full"
                        style={{
                          backgroundColor: isSelected ? option.color : undefined,
                          borderColor: option.color
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOption(option.id);
                        }}
                      >
                        {isSelected ? "Selected" : "Choose This View"}
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center pt-8"
          >
            <Button 
              onClick={() => onOptionSelect(selectedOption as 'comprehensive' | 'categorized')}
              size="lg"
              className="min-w-64 bg-primary hover:bg-primary/90"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Start Analyzing Match Types
            </Button>
          </motion.div>
        )}

        {/* Data Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Card className="p-6 bg-muted/20">
            <div className="space-y-4">
              <h4 className="font-medium">Match Types We'll Analyze</h4>
              <div className="flex justify-center gap-4">
                <Badge variant="outline">Exact Match</Badge>
                <Badge variant="outline">Phrase Match</Badge>
                <Badge variant="outline">Broad Match</Badge>
                <Badge variant="outline">Broad Match Modifier</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Get detailed performance insights, cost analysis, and optimization recommendations for each match type
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}