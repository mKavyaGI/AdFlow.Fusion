import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Shield, 
  Users, 
  BarChart3,
  Lightbulb,
  Rocket,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "completed" | "in-progress" | "planned";
  category: "ai" | "automation" | "analytics" | "management" | "security";
  icon: any;
  estimatedTime: string;
  businessValue: string;
}

const crucialFeatures: Feature[] = [
  // AI & Machine Learning Features
  {
    id: "ai-bid-optimization",
    title: "AI Bid Optimization",
    description: "Automatically adjust bids based on performance data and conversion probability using machine learning algorithms.",
    priority: "high",
    status: "planned",
    category: "ai",
    icon: Brain,
    estimatedTime: "3-4 weeks",
    businessValue: "15-30% improvement in ROAS"
  },
  {
    id: "predictive-analytics",
    title: "Predictive Performance Analytics",
    description: "Forecast campaign performance, budget requirements, and optimal scaling opportunities using historical data patterns.",
    priority: "high",
    status: "planned", 
    category: "ai",
    icon: TrendingUp,
    estimatedTime: "4-6 weeks",
    businessValue: "Better budget planning and 20% cost reduction"
  },
  {
    id: "smart-audience-insights",
    title: "Smart Audience Insights",
    description: "AI-powered audience analysis to identify high-value customer segments and lookalike opportunities.",
    priority: "medium",
    status: "planned",
    category: "ai",
    icon: Users,
    estimatedTime: "2-3 weeks",
    businessValue: "Higher quality leads and improved targeting"
  },

  // Campaign Management
  {
    id: "campaign-wizard",
    title: "Campaign Creation Wizard",
    description: "Step-by-step guided campaign setup with best practice recommendations and template suggestions.",
    priority: "high",
    status: "planned",
    category: "management",
    icon: Rocket,
    estimatedTime: "2-3 weeks",
    businessValue: "Faster campaign launches and reduced setup errors"
  },
  {
    id: "ab-testing-framework",
    title: "A/B Testing Framework",
    description: "Built-in split testing for ads, landing pages, and audience segments with statistical significance tracking.",
    priority: "high",
    status: "planned",
    category: "analytics",
    icon: BarChart3,
    estimatedTime: "3-4 weeks",
    businessValue: "Data-driven optimization and performance improvements"
  },
  {
    id: "bulk-operations",
    title: "Bulk Operations Manager",
    description: "Mass edit keywords, ads, and campaigns with advanced filtering, import/export, and bulk validation.",
    priority: "medium",
    status: "planned",
    category: "management",
    icon: Zap,
    estimatedTime: "2 weeks",
    businessValue: "90% time savings on campaign management tasks"
  },

  // Automation & Alerts
  {
    id: "performance-alerts",
    title: "Smart Performance Alerts",
    description: "Customizable alerts for budget pacing, performance drops, competitor activity, and optimization opportunities.",
    priority: "high",
    status: "planned",
    category: "automation",
    icon: AlertTriangle,
    estimatedTime: "1-2 weeks",
    businessValue: "Prevent budget waste and catch issues early"
  },
  {
    id: "automated-rules",
    title: "Automated Campaign Rules",
    description: "Set up automated actions based on performance thresholds (pause low performers, increase winning budgets).",
    priority: "medium",
    status: "planned",
    category: "automation",
    icon: Target,
    estimatedTime: "2-3 weeks",
    businessValue: "24/7 campaign optimization without manual intervention"
  },

  // Analytics & Reporting
  {
    id: "competitor-analysis",
    title: "Competitor Intelligence",
    description: "Track competitor ad strategies, keyword overlaps, and market share analysis across platforms.",
    priority: "medium",
    status: "planned",
    category: "analytics",
    icon: Shield,
    estimatedTime: "4-5 weeks",
    businessValue: "Strategic advantage and market positioning insights"
  },
  {
    id: "attribution-modeling",
    title: "Cross-Platform Attribution",
    description: "Track customer journeys across multiple touchpoints and platforms for accurate conversion attribution.",
    priority: "high",
    status: "planned",
    category: "analytics",
    icon: BarChart3,
    estimatedTime: "5-6 weeks",
    businessValue: "Accurate ROI measurement and budget allocation"
  },
  {
    id: "custom-dashboards",
    title: "Custom Dashboard Builder",
    description: "Drag-and-drop dashboard creation with custom metrics, widgets, and white-label reporting for agencies.",
    priority: "medium",
    status: "planned",
    category: "analytics",
    icon: Lightbulb,
    estimatedTime: "3-4 weeks",
    businessValue: "Client-specific reporting and improved presentation"
  },

  // Security & Compliance
  {
    id: "user-permissions",
    title: "Advanced User Management",
    description: "Role-based access control, team collaboration features, and audit logs for enterprise security.",
    priority: "medium",
    status: "planned",
    category: "security",
    icon: Shield,
    estimatedTime: "2-3 weeks",
    businessValue: "Enterprise readiness and team scalability"
  }
];

export function FeatureRoadmap() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100 dark:bg-red-900";
      case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900";
      case "low": return "text-green-600 bg-green-100 dark:bg-green-900";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100 dark:bg-green-900";
      case "in-progress": return "text-blue-600 bg-blue-100 dark:bg-blue-900";
      case "planned": return "text-gray-600 bg-gray-100 dark:bg-gray-900";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ai": return "🤖";
      case "automation": return "⚡";
      case "analytics": return "📊";
      case "management": return "🛠️";
      case "security": return "🔒";
      default: return "💡";
    }
  };

  const highPriorityFeatures = crucialFeatures.filter(f => f.priority === "high");
  const implementationProgress = (crucialFeatures.filter(f => f.status === "completed").length / crucialFeatures.length) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
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
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            🚀
          </motion.div>
          <h1 className="text-3xl font-bold">Feature Roadmap</h1>
        </motion.div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Strategic features that would make AdFlow Fusion a comprehensive, enterprise-ready advertising platform
        </p>

        {/* Progress Overview */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Implementation Progress</span>
            <span>{Math.round(implementationProgress)}%</span>
          </div>
          <Progress value={implementationProgress} className="h-3" />
        </div>
      </motion.div>

      {/* High Priority Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <h2 className="text-2xl font-bold">Critical Features for MVP</h2>
          <Badge variant="destructive">High Priority</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {highPriorityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Card className="h-full relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg">{getCategoryIcon(feature.category)}</span>
                            <Badge variant="outline" className={getStatusColor(feature.status)}>
                              {feature.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(feature.priority)}>
                        {feature.priority}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{feature.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Clock className="h-3 w-3" />
                          Estimated Time
                        </div>
                        <div className="font-medium">{feature.estimatedTime}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Star className="h-3 w-3" />
                          Business Value
                        </div>
                        <div className="font-medium text-green-600">{feature.businessValue}</div>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      View Technical Specs
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* All Features by Category */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Complete Feature Roadmap</h2>
        
        {["ai", "automation", "analytics", "management", "security"].map((category, categoryIndex) => {
          const categoryFeatures = crucialFeatures.filter(f => f.category === category);
          const categoryNames = {
            ai: "AI & Machine Learning",
            automation: "Automation & Alerts", 
            analytics: "Analytics & Reporting",
            management: "Campaign Management",
            security: "Security & Compliance"
          };

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + categoryIndex * 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <h3 className="text-xl font-semibold">{categoryNames[category]}</h3>
                <Badge variant="secondary">{categoryFeatures.length} features</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + categoryIndex * 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <Card className="h-full relative group hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-1.5 rounded bg-primary/10">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getPriorityColor(feature.priority)}`}
                                >
                                  {feature.priority}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getStatusColor(feature.status)}`}
                                >
                                  {feature.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {feature.status === "in-progress" && <Clock className="h-3 w-3 mr-1" />}
                                  {feature.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-3">
                            {feature.description}
                          </p>
                          <div className="text-xs text-green-600 font-medium">
                            {feature.businessValue}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Implementation Summary */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">🎯 Recommended Implementation Strategy</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Focus on <strong>AI Bid Optimization</strong>, <strong>Campaign Wizard</strong>, and <strong>Performance Alerts</strong> first. 
                These features provide immediate ROI and establish the foundation for advanced automation capabilities.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Phase 1: Core MVP (8-10 weeks)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Phase 2: Advanced Features (12-16 weeks)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Phase 3: Enterprise & Scale (16+ weeks)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}