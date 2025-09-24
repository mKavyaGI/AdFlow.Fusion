import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { MetricCard } from "./MetricCard";
import { MatchTypeAnalysis } from "./MatchTypeAnalysis";
import { 
  Plus, 
  BarChart3, 
  Filter, 
  Search, 
  TrendingUp,
  DollarSign,
  MousePointer,
  Target,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useState } from "react";

interface EnhancedDashboardProps {
  platform: any;
  isDarkMode: boolean;
  viewType: 'comprehensive' | 'categorized';
  businessCategory?: string;
}

export function EnhancedDashboard({ platform, isDarkMode, viewType, businessCategory }: EnhancedDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced metric data to match the image
  const metricData = {
    broad: {
      title: "Broad Match",
      subtitle: "Keywords performance",
      value: "$12,450",
      label: "Total Spend",
      conversions: "1,247",
      clickRate: "3.2%",
      performance: 65,
      change: 12.5,
      changeType: "increase" as const,
      description: "Keywords performance",
      data: Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 100) + 50,
      })),
      color: "#3b82f6",
      icon: "🎯"
    },
    phrase: {
      title: "Phrase Match",
      subtitle: "Keywords performance", 
      value: "$8,920",
      label: "Total Spend",
      conversions: "892",
      clickRate: "4.1%",
      performance: 80,
      change: -3.2,
      changeType: "decrease" as const,
      description: "Keywords performance",
      data: Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 100) + 50,
      })),
      color: "#f97316",
      icon: "📊"
    },
    exact: {
      title: "Exact Match",
      subtitle: "Keywords performance",
      value: "$15,670", 
      label: "Total Spend",
      conversions: "2,134",
      clickRate: "5.8%",
      performance: 85,
      change: 8.7,
      changeType: "increase" as const,
      description: "Keywords performance",
      data: Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 100) + 50,
      })),
      color: "#10b981",
      icon: "$"
    }
  };

  const summaryStats = [
    { label: "Total Spend", value: "$37,040", change: "+18%", icon: DollarSign },
    { label: "Total Conversions", value: "4,273", change: "+12%", icon: Target },
    { label: "Avg. CTR", value: "4.4%", change: "+8%", icon: MousePointer },
    { label: "ROAS", value: "4.2x", change: "+15%", icon: TrendingUp }
  ];

  const performanceScore = 84;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-2">
              {viewType === 'comprehensive' ? 'Comprehensive Dashboard' : `${businessCategory} Dashboard`} 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              {viewType === 'comprehensive' 
                ? 'Complete match-type performance analysis across all your campaigns'
                : `Tailored insights for ${businessCategory} businesses with smart recommendations`
              }
            </p>
          </motion.div>

          {/* Performance Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="flex items-center gap-4"
          >
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Performance Score</div>
              <div className="text-2xl font-bold">{performanceScore}</div>
            </div>
            <motion.div 
              className="relative w-16 h-16"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-muted-foreground/20"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 175.929" }}
                  animate={{ 
                    strokeDasharray: `${(performanceScore / 100) * 175.929} 175.929` 
                  }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center text-xs font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {performanceScore}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" className="border-primary/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" className="border-primary/20">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </motion.div>

          {/* Search */}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Match Type Performance Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Match Type Performance Analysis</h2>
            <p className="text-muted-foreground">
              {viewType === 'comprehensive' 
                ? 'Comprehensive breakdown of broad, phrase, and exact match performance'
                : `${businessCategory}-specific match type insights with industry benchmarks`
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              🔴 Live Data
            </Badge>
            {viewType === 'categorized' && (
              <Badge variant="outline" className="border-primary/20 text-primary">
                📊 {businessCategory} Optimized
              </Badge>
            )}
          </div>
        </div>

        {/* Enhanced Match Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(metricData).map(([key, data], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
              className="perspective-1000"
            >
              <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-500 group">
                {/* Background gradient */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: data.color }}
                />
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="text-2xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        {data.icon}
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg">{data.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{data.subtitle}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className="text-xs"
                      style={{ 
                        backgroundColor: `${data.color}15`,
                        color: data.color,
                        borderColor: `${data.color}30`
                      }}
                    >
                      {data.change > 0 ? "+" : ""}{data.change}%
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Total Spend */}
                  <div>
                    <div className="text-sm text-muted-foreground">{data.label}</div>
                    <div className="text-2xl font-bold" style={{ color: data.color }}>
                      {data.value}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Conversions</div>
                      <div className="font-semibold">{data.conversions}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Click Rate</div>
                      <div className="font-semibold">{data.clickRate}</div>
                    </div>
                  </div>

                  {/* Performance Bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="font-medium">{data.performance}%</span>
                    </div>
                    <Progress 
                      value={data.performance} 
                      className="h-2"
                      style={{
                        backgroundColor: `${data.color}20`
                      }}
                    />
                  </div>
                </CardContent>

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${data.color}, transparent 70%)`
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith("+");
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Card className="p-6 bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {isPositive ? (
                        <ArrowUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    <Icon className="h-8 w-8 text-primary/60" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Match Type Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <MatchTypeAnalysis 
          viewType={viewType}
          businessCategory={businessCategory}
        />
      </motion.div>
    </div>
  );
}