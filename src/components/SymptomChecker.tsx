
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Mic, MicOff, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { toast } from "sonner";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const mockAnalysis = {
    conditions: [
      { name: "Viral Fever", confidence: 85, severity: "Moderate", description: "Common viral infection causing fever and body aches" },
      { name: "Common Cold", confidence: 60, severity: "Mild", description: "Upper respiratory tract infection" },
      { name: "Dengue Fever", confidence: 15, severity: "High", description: "Mosquito-borne viral infection" },
    ],
    recommendations: [
      "Rest and increase fluid intake",
      "Monitor temperature regularly",
      "Consult a doctor if symptoms worsen",
      "Avoid contact with others to prevent spread"
    ],
    urgency: "Low",
    nextSteps: "Monitor symptoms for 24-48 hours. Seek medical attention if fever exceeds 102°F or breathing difficulties occur."
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      toast.success("Voice recording started. Speak your symptoms...");
      
      // Simulate voice recording
      setTimeout(() => {
        setIsListening(false);
        setSymptoms("I have fever, headache, and body aches since yesterday");
        toast.success("Voice input recorded successfully!");
      }, 3000);
    } else {
      setIsListening(false);
      toast.info("Voice recording stopped.");
    }
  };

  const analyzeSymptoms = () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms first.");
      return;
    }

    setIsAnalyzing(true);
    console.log("Analyzing symptoms:", symptoms);

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      toast.success("Analysis complete! Review your results below.");
    }, 2000);
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "high": return "text-red-600 bg-red-50";
      case "moderate": return "text-orange-600 bg-orange-50";
      case "mild": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Symptom Checker
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Describe your symptoms and get instant AI-powered medical insights
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe Your Symptoms</label>
            <div className="relative">
              <Textarea
                placeholder="e.g., I have fever, headache, and body aches since yesterday..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-[100px] pr-12"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleVoiceInput}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
            {isListening && (
              <p className="text-xs text-red-600 animate-pulse">🔴 Recording... Speak clearly</p>
            )}
          </div>

          <Button 
            onClick={analyzeSymptoms} 
            disabled={isAnalyzing || !symptoms.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze Symptoms
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-4">
          {/* Analysis Results */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-3">
                  {analysis.conditions.map((condition, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{condition.name}</h3>
                          <Badge className={getSeverityColor(condition.severity)}>
                            {condition.severity}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{condition.confidence}%</div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                        </div>
                      </div>
                      <Progress value={condition.confidence} className="h-2" />
                      <p className="text-sm text-muted-foreground">{condition.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Immediate Care:</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Next Steps:</h4>
                      <p className="text-sm text-yellow-700 mt-1">{analysis.nextSteps}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    Book Doctor Appointment
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Disclaimer */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-medium">Medical Disclaimer:</p>
              <p>This AI analysis is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomChecker;
