import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Target,
  DollarSign,
  Eye,
  MousePointer,
  Sparkles,
  Brain,
  Filter,
  Download,
  Upload,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { BusinessInfo } from "./BusinessInfoSetup";
import { SubPlatform } from "./PlatformSelector";

interface KeywordManagerProps {
  businessInfo: BusinessInfo;
  subPlatform: SubPlatform;
  onComplete: () => void;
}

interface Keyword {
  id: string;
  text: string;
  matchType: "broad" | "phrase" | "exact";
  searchVolume: number;
  competition: "low" | "medium" | "high";
  suggestedBid: number;
  cpc: number;
  status: "active" | "paused" | "suggested";
  source: "manual" | "ai" | "imported";
}

interface KeywordSuggestion {
  keyword: string;
  matchType: "broad" | "phrase" | "exact";
  searchVolume: number;
  competition: "low" | "medium" | "high";
  suggestedBid: number;
  relevanceScore: number;
  reason: string;
}

export function KeywordManager({ businessInfo, subPlatform, onComplete }: KeywordManagerProps) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedMatchType, setSelectedMatchType] = useState<"broad" | "phrase" | "exact">("phrase");
  const [editingKeyword, setEditingKeyword] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMatchType, setFilterMatchType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("manage");

  // Generate AI keyword suggestions based on business info
  useEffect(() => {
    generateAISuggestions();
  }, []);

  const generateAISuggestions = () => {
    setIsGeneratingSuggestions(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const aiSuggestions: KeywordSuggestion[] = [
        // Generate suggestions based on business info
        ...businessInfo.products.flatMap(product => [
          {
            keyword: product.toLowerCase(),
            matchType: "exact",
            searchVolume: Math.floor(Math.random() * 10000) + 1000,
            competition: "medium",
            suggestedBid: Math.round((Math.random() * 3 + 1) * 100) / 100,
            relevanceScore: 95,
            reason: `Direct product match for "${product}"`
          },
          {
            keyword: `best ${product.toLowerCase()}`,
            matchType: "phrase",
            searchVolume: Math.floor(Math.random() * 5000) + 500,
            competition: "high",
            suggestedBid: Math.round((Math.random() * 4 + 2) * 100) / 100,
            relevanceScore: 85,
            reason: `High intent keyword for "${product}"`
          },
          {
            keyword: `${product.toLowerCase()} ${businessInfo.location.toLowerCase()}`,
            matchType: "phrase",
            searchVolume: Math.floor(Math.random() * 2000) + 200,
            competition: "low",
            suggestedBid: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
            relevanceScore: 80,
            reason: `Local targeting for "${product}"`
          }
        ]),
        // Industry-specific suggestions
        {
          keyword: businessInfo.industry.toLowerCase().replace(" & ", " "),
          matchType: "broad",
          searchVolume: Math.floor(Math.random() * 15000) + 5000,
          competition: "medium",
          suggestedBid: Math.round((Math.random() * 2.5 + 1) * 100) / 100,
          relevanceScore: 75,
          reason: `Industry relevance for ${businessInfo.industry}`
        },
        // Target audience based
        {
          keyword: businessInfo.targetAudience.toLowerCase(),
          matchType: "broad",
          searchVolume: Math.floor(Math.random() * 8000) + 2000,
          competition: "medium",
          suggestedBid: Math.round((Math.random() * 3 + 1.5) * 100) / 100,
          relevanceScore: 70,
          reason: `Target audience alignment`
        }
      ].slice(0, 12); // Limit suggestions

      setSuggestions(aiSuggestions);
      setIsGeneratingSuggestions(false);
    }, 2500);
  };

  const addKeyword = (text: string, matchType: "broad" | "phrase" | "exact", source: "manual" | "ai" = "manual") => {
    const keyword: Keyword = {
      id: Date.now().toString(),
      text: text.trim(),
      matchType,
      searchVolume: Math.floor(Math.random() * 5000) + 500,
      competition: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
      suggestedBid: Math.round((Math.random() * 3 + 1) * 100) / 100,
      cpc: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
      status: "active",
      source
    };

    setKeywords(prev => [...prev, keyword]);
    setNewKeyword("");
  };

  const addSuggestedKeyword = (suggestion: KeywordSuggestion) => {
    addKeyword(suggestion.keyword, suggestion.matchType, "ai");
    setSuggestions(prev => prev.filter(s => s.keyword !== suggestion.keyword));
  };

  const deleteKeyword = (id: string) => {
    setKeywords(prev => prev.filter(k => k.id !== id));
  };

  const updateKeyword = (id: string, updates: Partial<Keyword>) => {
    setKeywords(prev => prev.map(k => k.id === id ? { ...k, ...updates } : k));
    setEditingKeyword(null);
  };

  const toggleKeywordStatus = (id: string) => {
    setKeywords(prev => prev.map(k => 
      k.id === id 
        ? { ...k, status: k.status === "active" ? "paused" : "active" }
        : k
    ));
  };

  const filteredKeywords = keywords.filter(keyword => {
    const matchesSearch = keyword.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterMatchType === "all" || keyword.matchType === filterMatchType;
    const matchesStatus = filterStatus === "all" || keyword.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case "broad": return "#3b82f6";
      case "phrase": return "#f97316";
      case "exact": return "#10b981";
      default: return "#6b7280";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  🎯
                </motion.div>
                Keyword Manager
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage keywords for {subPlatform.name} • {businessInfo.businessName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary"
                style={{ 
                  backgroundColor: `${subPlatform.color}20`,
                  color: subPlatform.color 
                }}
              >
                {subPlatform.logo} {subPlatform.name}
              </Badge>
              <Button onClick={onComplete} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Manage Keywords
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Suggestions
              {suggestions.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {suggestions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Manage Keywords Tab */}
          <TabsContent value="manage" className="space-y-6">
            {/* Add New Keyword */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Keyword
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter keyword or phrase"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && newKeyword.trim() && addKeyword(newKeyword, selectedMatchType)}
                    className="flex-1"
                  />
                  <Select value={selectedMatchType} onValueChange={(value: any) => setSelectedMatchType(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="broad">Broad</SelectItem>
                      <SelectItem value="phrase">Phrase</SelectItem>
                      <SelectItem value="exact">Exact</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => newKeyword.trim() && addKeyword(newKeyword, selectedMatchType)}
                    disabled={!newKeyword.trim()}
                  >
                    Add Keyword
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterMatchType} onValueChange={setFilterMatchType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Match Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="broad">Broad</SelectItem>
                      <SelectItem value="phrase">Phrase</SelectItem>
                      <SelectItem value="exact">Exact</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keywords List */}
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredKeywords.map((keyword, index) => (
                  <motion.div
                    key={keyword.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`transition-all duration-300 ${keyword.status === "paused" ? "opacity-60" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex-1">
                              {editingKeyword === keyword.id ? (
                                <Input
                                  defaultValue={keyword.text}
                                  onBlur={(e) => updateKeyword(keyword.id, { text: e.target.value })}
                                  onKeyPress={(e) => e.key === 'Enter' && updateKeyword(keyword.id, { text: (e.target as HTMLInputElement).value })}
                                  className="font-medium"
                                />
                              ) : (
                                <div className="font-medium text-lg">{keyword.text}</div>
                              )}
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <Badge 
                                  variant="outline"
                                  style={{ 
                                    borderColor: getMatchTypeColor(keyword.matchType),
                                    color: getMatchTypeColor(keyword.matchType)
                                  }}
                                >
                                  {keyword.matchType}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {keyword.searchVolume.toLocaleString()} searches/mo
                                </div>
                                <div className={`flex items-center gap-1 ${getCompetitionColor(keyword.competition)}`}>
                                  <TrendingUp className="h-3 w-3" />
                                  {keyword.competition} competition
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  ${keyword.suggestedBid} suggested bid
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={keyword.status === "active" ? "default" : "secondary"}>
                              {keyword.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingKeyword(keyword.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleKeywordStatus(keyword.id)}
                            >
                              {keyword.status === "active" ? "⏸️" : "▶️"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteKeyword(keyword.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredKeywords.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-muted-foreground"
              >
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No keywords found</h3>
                <p>Add some keywords to get started or check out the AI suggestions.</p>
              </motion.div>
            )}
          </TabsContent>

          {/* AI Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Generated Keyword Suggestions
                </h2>
                <p className="text-muted-foreground">
                  Based on your business information and industry analysis
                </p>
              </div>
              <Button 
                onClick={generateAISuggestions}
                disabled={isGeneratingSuggestions}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                {isGeneratingSuggestions ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isGeneratingSuggestions ? "Generating..." : "Regenerate"}
              </Button>
            </div>

            {isGeneratingSuggestions ? (
              <div className="text-center py-16">
                <motion.div
                  className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">AI is analyzing your business</h3>
                <p className="text-muted-foreground">Generating personalized keyword suggestions...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.keyword}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-lg">{suggestion.keyword}</h3>
                              <Badge 
                                variant="outline"
                                style={{ 
                                  borderColor: getMatchTypeColor(suggestion.matchType),
                                  color: getMatchTypeColor(suggestion.matchType)
                                }}
                              >
                                {suggestion.matchType}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Progress value={suggestion.relevanceScore} className="w-16 h-2" />
                                <span className="text-xs text-muted-foreground">{suggestion.relevanceScore}%</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {suggestion.searchVolume.toLocaleString()}/mo
                              </div>
                              <div className={`flex items-center gap-1 ${getCompetitionColor(suggestion.competition)}`}>
                                <TrendingUp className="h-3 w-3" />
                                {suggestion.competition} competition
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                ${suggestion.suggestedBid}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Lightbulb className="h-3 w-3" />
                              {suggestion.reason}
                            </div>
                          </div>
                          <Button
                            onClick={() => addSuggestedKeyword(suggestion)}
                            className="ml-4"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Keyword
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Keywords</p>
                      <p className="text-2xl font-bold">{keywords.length}</p>
                    </div>
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Keywords</p>
                      <p className="text-2xl font-bold">{keywords.filter(k => k.status === "active").length}</p>
                    </div>
                    <div className="text-green-600">▶️</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Search Volume</p>
                      <p className="text-2xl font-bold">
                        {keywords.length > 0 ? Math.round(keywords.reduce((sum, k) => sum + k.searchVolume, 0) / keywords.length).toLocaleString() : 0}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}