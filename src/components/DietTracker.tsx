
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Apple, 
  Plus, 
  Utensils, 
  Target, 
  TrendingUp,
  Clock,
  Trash2,
  BookOpen
} from "lucide-react";
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

const DietTracker = () => {
  const [activeTab, setActiveTab] = useState<"recommendations" | "tracker">("recommendations");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
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
          <h1 className="text-2xl font-bold text-gray-900">Diet Management</h1>
          <p className="text-sm text-muted-foreground">Get personalized diet recommendations and track your meals</p>
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
          Diet Recommendations
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
          Food Tracker
        </button>
      </div>

      {/* Diet Recommendations Tab */}
      {activeTab === "recommendations" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Select Your Condition
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
                  <CardTitle className="text-green-600">Recommended Foods</CardTitle>
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
                  <CardTitle className="text-red-600">Foods to Avoid</CardTitle>
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
                <CardTitle>Diet Tips for {selectedDisease}</CardTitle>
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

      {/* Food Tracker Tab */}
      {activeTab === "tracker" && (
        <div className="space-y-6">
          {/* Daily Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Calories</p>
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
                    <p className="text-sm text-muted-foreground">Meals Logged</p>
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
                    <p className="text-sm text-muted-foreground">Last Entry</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {foodEntries.length > 0 ? foodEntries[foodEntries.length - 1].time : "None"}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Food Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Food Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="food-name">Food Name</Label>
                  <Input
                    id="food-name"
                    value={newFood.name}
                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                    placeholder="e.g., Chicken Breast"
                  />
                </div>
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                    placeholder="200"
                  />
                </div>
                <div>
                  <Label htmlFor="meal">Meal Type</Label>
                  <select
                    id="meal"
                    value={newFood.meal}
                    onChange={(e) => setNewFood({...newFood, meal: e.target.value as any})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({...newFood, protein: e.target.value})}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
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
                Add Food Entry
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
                  <CardTitle className="capitalize">{meal}</CardTitle>
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
