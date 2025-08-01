
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Apple, 
  Plus, 
  Utensils, 
  Target, 
  TrendingUp,
  Clock,
  Trash2,
  BookOpen,
  Droplets,
  Minus,
  Sun,
  Moon
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
}

interface DietRecommendation {
  disease: string;
  foods: {
    recommended: string[];
    avoid: string[];
  };
  tips: string[];
}

interface DietTrackerProps {
  selectedLanguage: string;
}

const DietTracker = ({ selectedLanguage }: DietTrackerProps) => {
  const { t } = useTranslation(selectedLanguage);
  const [activeTab, setActiveTab] = useState<"recommendations" | "tracker" | "water">("recommendations");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal] = useState(8); // 8 glasses per day
  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    meal: "breakfast" as const
  });

  const diseases = [
    "Diabetes",
    "Hypertension", 
    "Heart Disease",
    "Kidney Disease",
    "Obesity",
    "PCOD/PCOS",
    "Thyroid",
    "High Cholesterol"
  ];

  const dietRecommendations: DietRecommendation[] = [
    {
      disease: "Diabetes",
      foods: {
        recommended: ["Whole grains", "Leafy greens", "Berries", "Fish", "Nuts", "Beans", "Greek yogurt"],
        avoid: ["Sugary drinks", "White bread", "Processed foods", "Candy", "Fried foods", "High-fat dairy"]
      },
      tips: [
        "Eat regular meals to maintain blood sugar levels",
        "Choose complex carbohydrates over simple sugars",
        "Include protein with each meal",
        "Monitor portion sizes carefully"
      ]
    },
    {
      disease: "Hypertension",
      foods: {
        recommended: ["Bananas", "Leafy greens", "Berries", "Oats", "Fish", "Garlic", "Beets"],
        avoid: ["High sodium foods", "Processed meats", "Canned soups", "Fast food", "Alcohol", "Caffeine"]
      },
      tips: [
        "Limit sodium intake to less than 2300mg per day",
        "Increase potassium-rich foods",
        "Maintain a healthy weight",
        "Stay hydrated with water"
      ]
    },
    {
      disease: "Heart Disease",
      foods: {
        recommended: ["Salmon", "Avocados", "Nuts", "Olive oil", "Berries", "Dark chocolate", "Green tea"],
        avoid: ["Trans fats", "Saturated fats", "Excess salt", "Refined sugars", "Processed meats"]
      },
      tips: [
        "Follow a Mediterranean-style diet",
        "Include omega-3 fatty acids",
        "Limit cholesterol intake",
        "Eat plenty of fiber"
      ]
    },
    {
      disease: "Kidney Disease",
      foods: {
        recommended: ["Cauliflower", "Bell peppers", "Cabbage", "Garlic", "Onions", "Apples", "Cranberries"],
        avoid: ["High sodium foods", "Processed meats", "Whole grain bread", "Brown rice", "Bananas", "Oranges"]
      },
      tips: [
        "Limit protein intake as advised by your doctor",
        "Control phosphorus and potassium intake",
        "Limit fluid intake if recommended",
        "Choose low-sodium alternatives"
      ]
    },
    {
      disease: "Obesity",
      foods: {
        recommended: ["Lean proteins", "Vegetables", "Fruits", "Whole grains", "Legumes", "Low-fat dairy"],
        avoid: ["Sugary beverages", "Fast food", "Processed snacks", "High-calorie desserts", "Fried foods"]
      },
      tips: [
        "Create a calorie deficit for weight loss",
        "Focus on portion control",
        "Eat more fiber-rich foods",
        "Stay hydrated and exercise regularly"
      ]
    },
    {
      disease: "PCOD/PCOS",
      foods: {
        recommended: ["Leafy greens", "Fatty fish", "Berries", "Nuts", "Seeds", "Lean proteins", "Whole grains"],
        avoid: ["Refined carbs", "Sugary foods", "Processed foods", "Trans fats", "Excessive dairy"]
      },
      tips: [
        "Choose low glycemic index foods",
        "Include anti-inflammatory foods",
        "Maintain stable blood sugar levels",
        "Consider omega-3 supplements"
      ]
    },
    {
      disease: "Thyroid",
      foods: {
        recommended: ["Iodized salt", "Seafood", "Dairy products", "Eggs", "Brazil nuts", "Seaweed"],
        avoid: ["Goitrogenic foods in excess", "Soy products", "Cruciferous vegetables (raw)", "Processed foods"]
      },
      tips: [
        "Ensure adequate iodine intake",
        "Cook goitrogenic vegetables before eating",
        "Take thyroid medication on empty stomach",
        "Monitor selenium intake"
      ]
    },
    {
      disease: "High Cholesterol",
      foods: {
        recommended: ["Oats", "Beans", "Fatty fish", "Nuts", "Olive oil", "Fruits", "Vegetables"],
        avoid: ["Saturated fats", "Trans fats", "High cholesterol foods", "Fried foods", "Processed meats"]
      },
      tips: [
        "Increase soluble fiber intake",
        "Choose lean protein sources",
        "Use healthy cooking oils",
        "Limit dietary cholesterol to 300mg per day"
      ]
    }
  ];

  const currentRecommendation = dietRecommendations.find(
    rec => rec.disease === selectedDisease
  );

  const addFoodEntry = () => {
    if (!newFood.name || !newFood.calories) {
      toast.error("Please fill in food name and calories");
      return;
    }

    const entry: FoodEntry = {
      id: Date.now().toString(),
      name: newFood.name,
      calories: parseInt(newFood.calories),
      protein: parseInt(newFood.protein) || 0,
      carbs: parseInt(newFood.carbs) || 0,
      fat: parseInt(newFood.fat) || 0,
      time: new Date().toLocaleTimeString(),
      meal: newFood.meal
    };

    setFoodEntries([...foodEntries, entry]);
    setNewFood({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      meal: "breakfast"
    });
    
    toast.success("Food entry added successfully!");
  };

  const removeFoodEntry = (id: string) => {
    setFoodEntries(foodEntries.filter(entry => entry.id !== id));
    toast.success("Food entry removed");
  };

  const addWater = () => {
    if (waterIntake < waterGoal) {
      setWaterIntake(waterIntake + 1);
      if (waterIntake + 1 === waterGoal) {
        toast.success(t("dailyWaterGoal"));
      }
    }
  };

  const removeWater = () => {
    if (waterIntake > 0) {
      setWaterIntake(waterIntake - 1);
    }
  };

  const getTotalCalories = () => {
    return foodEntries.reduce((total, entry) => total + entry.calories, 0);
  };

  const getMealEntries = (meal: string) => {
    return foodEntries.filter(entry => entry.meal === meal);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-lg">
          <Apple className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("dietManagement")}</h1>
          <p className="text-sm text-muted-foreground">{t("dietDescription")}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab("recommendations")}
          className={`flex items-center gap-2 py-2 px-4 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "recommendations"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          {t("dietRecommendations")}
        </button>
        <button
          onClick={() => setActiveTab("tracker")}
          className={`flex items-center gap-2 py-2 px-4 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "tracker"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Utensils className="h-4 w-4" />
          {t("foodTracker")}
        </button>
        <button
          onClick={() => setActiveTab("water")}
          className={`flex items-center gap-2 py-2 px-4 font-medium text-sm transition-colors border-b-2 ${
            activeTab === "water"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Droplets className="h-4 w-4" />
          {t("waterIntake")}
        </button>
      </div>

      {/* Diet Recommendations Tab */}
      {activeTab === "recommendations" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t("selectCondition")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {diseases.map((disease) => (
                  <Button
                    key={disease}
                    variant={selectedDisease === disease ? "default" : "outline"}
                    onClick={() => setSelectedDisease(disease)}
                    className="h-auto py-3"
                  >
                    {disease}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {currentRecommendation && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">{t("recommendedFoods")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentRecommendation.foods.recommended.map((food, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">{t("foodsToAvoid")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentRecommendation.foods.avoid.map((food, index) => (
                      <Badge key={index} variant="destructive" className="mr-2 mb-2">
                        {food}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentRecommendation && (
            <Card>
              <CardHeader>
                <CardTitle>{t("dietTips")} {selectedDisease}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentRecommendation.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{tip}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Water Intake Tab */}
      {activeTab === "water" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                {t("waterIntake")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="text-6xl font-bold text-blue-500">
                    {waterIntake}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    / {waterGoal} {t("glassesOfWater")}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${(waterIntake / waterGoal) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeWater}
                    disabled={waterIntake === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={addWater}
                    disabled={waterIntake >= waterGoal}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t("addWater")}
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {t("waterGoal")}: {waterGoal} {t("glassesOfWater")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Food Tracker Tab */}
      {activeTab === "tracker" && (
        <div className="space-y-6">
          {/* Daily Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("totalCalories")}</p>
                    <p className="text-2xl font-bold text-blue-600">{getTotalCalories()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("mealsLogged")}</p>
                    <p className="text-2xl font-bold text-green-600">{foodEntries.length}</p>
                  </div>
                  <Utensils className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("lastEntry")}</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {foodEntries.length > 0 ? foodEntries[foodEntries.length - 1].time : "None"}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meal Timing Suggestions */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Clock className="h-5 w-5" />
                Optimal Meal Timing Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded border border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-orange-700">{t("breakfast")}</span>
                  </div>
                  <p className="text-sm text-orange-600 font-medium">7:00 - 9:00 AM</p>
                  <p className="text-xs text-orange-500 mt-1">Within 1-2 hours of waking up</p>
                </div>
                <div className="p-3 bg-white rounded border border-yellow-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-yellow-700">{t("lunch")}</span>
                  </div>
                  <p className="text-sm text-yellow-600 font-medium">12:00 - 2:00 PM</p>
                  <p className="text-xs text-yellow-500 mt-1">Peak metabolism time</p>
                </div>
                <div className="p-3 bg-white rounded border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Moon className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-purple-700">{t("dinner")}</span>
                  </div>
                  <p className="text-sm text-purple-600 font-medium">6:00 - 8:00 PM</p>
                  <p className="text-xs text-purple-500 mt-1">3 hours before bedtime</p>
                </div>
                <div className="p-3 bg-white rounded border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Apple className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-700">{t("snack")}</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium">10:30 AM / 4:00 PM</p>
                  <p className="text-xs text-green-500 mt-1">Between main meals</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-blue-100 rounded">
                <p className="text-xs text-blue-700">
                  💡 <strong>Tip:</strong> Eating at consistent times helps regulate metabolism and improves digestion. 
                  Avoid eating large meals 3 hours before bedtime for better sleep quality.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Add Food Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {t("addFoodEntry")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="food-name">{t("foodName")}</Label>
                  <Input
                    id="food-name"
                    value={newFood.name}
                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                    placeholder="e.g., Chicken Breast"
                  />
                </div>
                <div>
                  <Label htmlFor="calories">{t("calories")}</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                    placeholder="200"
                  />
                </div>
                <div>
                  <Label htmlFor="meal">{t("mealType")}</Label>
                  <select
                    id="meal"
                    value={newFood.meal}
                    onChange={(e) => setNewFood({...newFood, meal: e.target.value as any})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="breakfast">{t("breakfast")}</option>
                    <option value="lunch">{t("lunch")}</option>
                    <option value="dinner">{t("dinner")}</option>
                    <option value="snack">{t("snack")}</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="protein">{t("protein")}</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({...newFood, protein: e.target.value})}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">{t("carbs")}</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="fat">{t("fat")}</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={newFood.fat}
                    onChange={(e) => setNewFood({...newFood, fat: e.target.value})}
                    placeholder="10"
                  />
                </div>
              </div>
              <Button onClick={addFoodEntry} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                {t("addFoodEntry")}
              </Button>
            </CardContent>
          </Card>

          {/* Food Entries by Meal */}
          {["breakfast", "lunch", "dinner", "snack"].map((meal) => {
            const mealEntries = getMealEntries(meal);
            if (mealEntries.length === 0) return null;

            return (
              <Card key={meal}>
                <CardHeader>
                  <CardTitle className="capitalize">{t(meal as any)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mealEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium">{entry.name}</p>
                              <p className="text-sm text-muted-foreground">{entry.time}</p>
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>{entry.calories} cal</span>
                              {entry.protein > 0 && <span>{entry.protein}g protein</span>}
                              {entry.carbs > 0 && <span>{entry.carbs}g carbs</span>}
                              {entry.fat > 0 && <span>{entry.fat}g fat</span>}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFoodEntry(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {foodEntries.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No food entries yet. Start tracking your meals above!</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DietTracker;
