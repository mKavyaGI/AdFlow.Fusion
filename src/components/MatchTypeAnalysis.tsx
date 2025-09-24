import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";

interface MatchTypeAnalysisProps {
  viewType: 'comprehensive' | 'categorized';
  businessCategory?: string;
}

export function MatchTypeAnalysis({ viewType, businessCategory }: MatchTypeAnalysisProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Enhanced match type data with detailed analysis
  const matchTypeData = {
    broad: {
      title: "Broad Match",
      volume: "High",
      cost: "$12,450",
      conversions: 1247,
      ctr: 3.2,
      cpa: "$9.98",
      roas: 3.8,
      impressions: 125000,
      clicks: 4000,
      performance: 65,
      trend: "up",
      change: 12.5,
      insights: [
        "Strong reach but lower precision",
        "Good for discovery phase",
        "Consider phrase match for better control"
      ],
      recommendations: viewType === 'categorized' ? [
        `For ${businessCategory}: Focus on high-intent broad keywords`,
        "Add negative keywords to reduce waste",
        "Test phrase match variations"
      ] : [
        "Add negative keywords to improve relevance",
        "Test phrase match alternatives",
        "Monitor search terms weekly"
      ]
    },
    phrase: {
      title: "Phrase Match",
      volume: "Medium",
      cost: "$8,920",
      conversions: 892,
      ctr: 4.1,
      cpa: "$10.00",
      roas: 4.2,
      impressions: 65000,
      clicks: 2665,
      performance: 80,
      trend: "down",
      change: -3.2,
      insights: [
        "Balanced reach and precision",
        "Best overall performer",
        "Slight decline needs attention"
      ],
      recommendations: viewType === 'categorized' ? [
        `${businessCategory} keyword expansion opportunity`,
        "Increase bids for top performers",
        "Test long-tail variations"
      ] : [
        "Investigate performance decline",
        "Expand successful keywords",
        "Optimize ad copy for phrase match"
      ]
    },
    exact: {
      title: "Exact Match",
      volume: "Low",
      cost: "$15,670",
      conversions: 2134,
      ctr: 5.8,
      cpa: "$7.34",
      roas: 4.8,
      impressions: 45000,
      clicks: 2610,
      performance: 85,
      trend: "up",
      change: 8.7,
      insights: [
        "Highest precision and conversion rate",
        "Best ROI performance",
        "Limited reach potential"
      ],
      recommendations: viewType === 'categorized' ? [
        `Scale winning ${businessCategory} exact keywords`,
        "Find similar high-intent terms",
        "Increase budget allocation"
      ] : [
        "Scale successful exact match keywords",
        "Find keyword variations to expand reach",
        "Increase budget allocation for top performers"
      ]
    }
  };

  const overallInsights = viewType === 'categorized' && businessCategory ? {
    ecommerce: [
      "Product-specific exact match keywords perform best",
      "Broad match works well for seasonal trends",
      "Focus on commercial intent keywords"
    ],
    saas: [
      "Solution-focused phrase match drives quality leads",
      "Broad match good for awareness campaigns",
      "Exact match for competitor targeting"
    ],
    local: [
      "Location + service phrase match is optimal",
      "Broad match for local discovery",
      "Exact match for branded searches"
    ]
  }[businessCategory] || [] : [
    "Exact match delivers highest ROI but limited scale",
    "Phrase match offers best balance of reach and performance", 
    "Broad match needs better negative keyword management"
  ];

  const performanceScore = 78;
  const totalSpend = 37040;
  const totalConversions = 4273;
  const overallROAS = 4.3;

  return (
    <div className="space-y-8">
      {/* Analysis Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            Match Type Performance Analysis
          </h2>
          <p className="text-muted-foreground">
            Detailed breakdown of search match types to optimize your keyword strategy
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Key Insights Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
      >
        <div className="flex items-start gap-4">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Key Match Type Insights {viewType === 'categorized' && `for ${businessCategory}`}
            </h3>
            <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              {overallInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Match Type Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(matchTypeData).map(([key, data], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {data.title}
                      <Badge variant="outline" className="text-xs">
                        {data.volume} Volume
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {data.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${data.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {data.change > 0 ? "+" : ""}{data.change}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{data.cost}</div>
                    <div className="text-sm text-muted-foreground">Total Spend</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Conversions</div>
                    <div className="font-semibold">{data.conversions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">CTR</div>
                    <div className="font-semibold">{data.ctr}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">CPA</div>
                    <div className="font-semibold">{data.cpa}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">ROAS</div>
                    <div className="font-semibold">{data.roas}x</div>
                  </div>
                </div>

                {/* Performance Score */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Performance Score</span>
                    <span className="font-medium">{data.performance}/100</span>
                  </div>
                  <Progress value={data.performance} className="h-2" />
                </div>

                {/* Insights */}
                <div className="pt-2 border-t">
                  <div className="text-sm font-medium mb-2">Key Insights</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {data.insights.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-current mt-1.5 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="pt-2 border-t">
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Recommendations
                  </div>
                  <ul className="text-xs space-y-1">
                    {data.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-purple-500/5">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{performanceScore}</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">${totalSpend.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Spend</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalConversions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Conversions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{overallROAS}x</div>
              <div className="text-sm text-muted-foreground">Overall ROAS</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Priority Action Items</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <div>
                  <div className="font-medium text-sm">Fix Phrase Match Decline</div>
                  <div className="text-xs text-muted-foreground">-3.2% performance drop needs investigation</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                <div>
                  <div className="font-medium text-sm">Optimize Broad Match</div>
                  <div className="text-xs text-muted-foreground">Add negative keywords to improve efficiency</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <div>
                  <div className="font-medium text-sm">Scale Exact Match</div>
                  <div className="text-xs text-muted-foreground">Increase budget for high-performing exact keywords</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <div className="font-medium text-sm">Keyword Expansion</div>
                  <div className="text-xs text-muted-foreground">Find similar high-performing keywords</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}