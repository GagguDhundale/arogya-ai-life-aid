
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Phone, AlertTriangle, MessageCircle, Shield, Smile, Frown, Meh } from "lucide-react";
import { toast } from "sonner";

const MentalHealthSupport = () => {
  const [moodInput, setMoodInput] = useState("");
  const [currentMood, setCurrentMood] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskLevel, setRiskLevel] = useState("low");

  const moodOptions = [
    { emoji: "😊", label: "Great", value: "great", color: "text-green-600" },
    { emoji: "🙂", label: "Good", value: "good", color: "text-green-500" },
    { emoji: "😐", label: "Okay", value: "okay", color: "text-yellow-500" },
    { emoji: "😔", label: "Not Good", value: "sad", color: "text-orange-500" },
    { emoji: "😢", label: "Very Low", value: "very-low", color: "text-red-500" },
  ];

  const helplines = [
    { name: "National Suicide Prevention", number: "91-9152987821", available: "24/7" },
    { name: "Vandrevala Foundation", number: "91-9999666555", available: "24/7" },
    { name: "AASRA", number: "91-9820466726", available: "24/7" },
    { name: "iCall", number: "91-9152987821", available: "Mon-Sat, 10AM-8PM" },
  ];

  const analyzeMood = () => {
    if (!moodInput.trim()) {
      toast.error("Please share what's on your mind first.");
      return;
    }

    setIsAnalyzing(true);
    console.log("Analyzing mood input:", moodInput);

    // Simple keyword-based risk detection
    const highRiskKeywords = ["suicide", "kill myself", "end it all", "want to die", "no point living"];
    const moderateRiskKeywords = ["hopeless", "worthless", "can't cope", "overwhelming", "giving up"];
    
    const input = moodInput.toLowerCase();
    let detectedRisk = "low";
    
    if (highRiskKeywords.some(keyword => input.includes(keyword))) {
      detectedRisk = "high";
    } else if (moderateRiskKeywords.some(keyword => input.includes(keyword))) {
      detectedRisk = "moderate";
    }

    setTimeout(() => {
      setRiskLevel(detectedRisk);
      setIsAnalyzing(false);
      
      if (detectedRisk === "high") {
        toast.error("High risk detected! Please reach out for immediate help.", { duration: 8000 });
      } else if (detectedRisk === "moderate") {
        toast.warning("We're here to support you. Consider talking to a professional.", { duration: 6000 });
      } else {
        toast.success("Thanks for sharing. Keep taking care of your mental health!", { duration: 4000 });
      }
    }, 2000);
  };

  const selectMood = (mood) => {
    setCurrentMood(mood);
    console.log("Selected mood:", mood);
    toast.success(`Mood logged: ${mood.label}`);
  };

  const callHelpline = (number) => {
    console.log("Calling helpline:", number);
    toast.success(`Connecting to ${number}...`);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "moderate": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getMoodIcon = (value) => {
    if (value >= 80) return <Smile className="h-5 w-5 text-green-600" />;
    if (value >= 60) return <Meh className="h-5 w-5 text-yellow-600" />;
    return <Frown className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Mood Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Daily Mood Check-in
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How are you feeling today? Your mental health matters.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Select your current mood:</h4>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  variant={currentMood?.value === mood.value ? "default" : "outline"}
                  className="h-20 flex-col gap-2"
                  onClick={() => selectMood(mood)}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {currentMood && (
            <div className="p-4 bg-blue-50 rounded-lg space-y-3">
              <p className="text-sm text-blue-800">
                You're feeling <strong>{currentMood.label}</strong> today.
              </p>
              
              {/* Mood-specific instructions */}
              <div className="space-y-2">
                {currentMood.value === "great" && (
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <h5 className="font-medium text-green-800 mb-1">Great mood today! 🌟</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Share your positive energy with others</li>
                      <li>• Consider starting a new healthy habit</li>
                      <li>• Reflect on what made you feel this good</li>
                      <li>• Use this energy for productive activities</li>
                    </ul>
                  </div>
                )}
                
                {currentMood.value === "good" && (
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <h5 className="font-medium text-blue-800 mb-1">Feeling good! 😊</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Maintain your current routine</li>
                      <li>• Practice gratitude for 5 minutes</li>
                      <li>• Connect with friends or family</li>
                      <li>• Consider some light exercise or walk</li>
                    </ul>
                  </div>
                )}
                
                {currentMood.value === "okay" && (
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <h5 className="font-medium text-yellow-800 mb-1">It's okay to feel neutral 😐</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Try a mindfulness exercise (5-10 minutes)</li>
                      <li>• Listen to your favorite music</li>
                      <li>• Do something small that usually makes you smile</li>
                      <li>• Focus on one positive thing from today</li>
                    </ul>
                  </div>
                )}
                
                {currentMood.value === "sad" && (
                  <div className="p-3 bg-orange-50 rounded border border-orange-200">
                    <h5 className="font-medium text-orange-800 mb-1">Having a tough day 😔</h5>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Practice deep breathing (4-7-8 technique)</li>
                      <li>• Reach out to someone you trust</li>
                      <li>• Do a gentle activity like stretching</li>
                      <li>• Remember: this feeling is temporary</li>
                      <li>• Consider professional support if this persists</li>
                    </ul>
                  </div>
                )}
                
                {currentMood.value === "very-low" && (
                  <div className="p-3 bg-red-50 rounded border border-red-200">
                    <h5 className="font-medium text-red-800 mb-1">You're going through a very difficult time 😢</h5>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• <strong>Immediate action:</strong> Contact a mental health helpline</li>
                      <li>• Reach out to a trusted friend/family member right now</li>
                      <li>• Practice grounding: Name 5 things you can see, 4 you can touch</li>
                      <li>• Avoid being alone if possible</li>
                      <li>• Remember: You matter, and help is available</li>
                    </ul>
                    <div className="mt-3 p-2 bg-red-100 rounded">
                      <p className="text-xs text-red-800 font-medium">
                        If you're having thoughts of self-harm, call emergency helpline immediately: 91-9152987821
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Share Your Thoughts
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            What's on your mind? Our AI can help assess your mental wellbeing.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share what you're thinking or feeling... Everything is confidential."
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            className="min-h-[100px]"
          />
          
          <Button 
            onClick={analyzeMood} 
            disabled={isAnalyzing || !moodInput.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Check My Wellbeing
              </>
            )}
          </Button>

          {riskLevel && !isAnalyzing && (
            <Card className={`border-2 ${getRiskColor(riskLevel)}`}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">Wellbeing Assessment</span>
                  </div>
                  <Badge variant="secondary" className={getRiskColor(riskLevel)}>
                    {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                  </Badge>
                </div>
                
                {riskLevel === "high" && (
                  <div className="space-y-3">
                    <p className="text-sm">We detected concerning thoughts. Please reach out for immediate support:</p>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Emergency Helpline
                      </Button>
                      <Button variant="outline" size="sm">
                        Chat with Counselor
                      </Button>
                    </div>
                  </div>
                )}
                
                {riskLevel === "moderate" && (
                  <div className="space-y-3">
                    <p className="text-sm">You seem to be going through a tough time. Consider talking to someone:</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Find a Counselor
                      </Button>
                      <Button variant="outline" size="sm">
                        Self-Help Resources
                      </Button>
                    </div>
                  </div>
                )}
                
                {riskLevel === "low" && (
                  <p className="text-sm">Your mental wellbeing seems stable. Keep practicing self-care!</p>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Mental Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mood Trend</p>
                <p className="text-2xl font-bold text-green-600">↗️ Improving</p>
              </div>
              {getMoodIcon(75)}
            </div>
            <Progress value={75} className="mt-3" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Check-ins</p>
                <p className="text-2xl font-bold">12/14 days</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={85} className="mt-3" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Support Used</p>
                <p className="text-2xl font-bold">3 times</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <Progress value={60} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Emergency Helplines */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Phone className="h-5 w-5" />
            Mental Health Helplines
          </CardTitle>
          <p className="text-sm text-blue-700">
            Professional help is always available. You're not alone.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {helplines.map((helpline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <h4 className="font-medium">{helpline.name}</h4>
                  <p className="text-sm text-muted-foreground">{helpline.available}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm">{helpline.number}</span>
                  <Button 
                    size="sm" 
                    onClick={() => callHelpline(helpline.number)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              If you're having thoughts of self-harm, please call immediately. Help is available 24/7.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentalHealthSupport;
