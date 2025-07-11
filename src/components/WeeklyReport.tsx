
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Apple, 
  Droplets, 
  Activity,
  Target,
  Calendar,
  CheckCircle
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface WeeklyReportProps {
  selectedLanguage: string;
}

const WeeklyReport = ({ selectedLanguage }: WeeklyReportProps) => {
  const { t } = useTranslation(selectedLanguage);

  // Mock data for the weekly report
  const weeklyData = {
    overallScore: 82,
    improvement: 8,
    metrics: {
      waterIntake: { current: 6.2, target: 8, unit: "glasses/day" },
      calories: { current: 1850, target: 2000, unit: "kcal/day" },
      exercise: { current: 4, target: 7, unit: "days" },
      sleep: { current: 7.2, target: 8, unit: "hours/day" }
    },
    trends: [
      { label: "Water Intake", value: 78, trend: "up", color: "text-blue-600" },
      { label: "Calorie Balance", value: 92, trend: "up", color: "text-green-600" },
      { label: "Exercise Days", value: 57, trend: "down", color: "text-orange-600" },
      { label: "Sleep Quality", value: 90, trend: "up", color: "text-purple-600" }
    ],
    recommendations: [
      "Try to increase your daily water intake",
      "Maintain regular meal times",
      "Get at least 30 minutes of exercise daily",
      "Keep consistent sleep schedule"
    ],
    achievements: [
      "Met calorie goals 5 out of 7 days",
      "Completed symptom check 3 times",
      "Maintained hydration above 75%"
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("weeklyHealthReport")}</h1>
          <p className="text-sm text-muted-foreground">{t("reportDescription")}</p>
        </div>
      </div>

      {/* Overall Health Score */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              {t("overallHealth")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="text-5xl font-bold text-green-600">
                  {weeklyData.overallScore}%
                </div>
                <Badge variant="secondary" className="mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{weeklyData.improvement}% {t("improvement")}
                </Badge>
              </div>
              <Progress value={weeklyData.overallScore} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {t("goodProgress")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Weekly Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(weeklyData.metrics).map(([key, metric]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span>{metric.current} / {metric.target} {metric.unit}</span>
                  </div>
                  <Progress 
                    value={(metric.current / metric.target) * 100} 
                    className="w-full h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            {t("healthTrends")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weeklyData.trends.map((trend, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {trend.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">{trend.label}</span>
                </div>
                <div className={`text-2xl font-bold ${trend.color}`}>
                  {trend.value}%
                </div>
                <Progress value={trend.value} className="w-full h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Weekly Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">{achievement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5 text-blue-500" />
            {t("recommendations")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyData.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">{t(recommendation.replace(/\s+/g, '') as any) || recommendation}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-800">
              {t("keepUpGoodWork")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyReport;
