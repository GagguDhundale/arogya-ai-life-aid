import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceAssistantProps {
  onCommand?: (command: string, result: any) => void;
}

export default function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandResult, setCommandResult] = useState<string>('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening... Say "Hey Aarogya" followed by your command');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Heard:', transcript);
      
      if (transcript.includes('hey aarogya') || transcript.includes('hey arogya')) {
        processVoiceCommand(transcript);
      } else {
        toast.error('Please start with "Hey Aarogya"');
      }
    };

    recognition.onerror = (event) => {
      toast.error(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = async (transcript: string) => {
    setIsProcessing(true);
    setLastCommand(transcript);

    try {
      // Simulate command processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      let result = '';
      
      if (transcript.includes('show') && transcript.includes('patient')) {
        const patientName = extractPatientName(transcript);
        result = `Displaying profile for ${patientName}. Loading latest symptom checks and vital signs.`;
        onCommand?.('show_patient', { patientName });
      } else if (transcript.includes('draft message')) {
        if (transcript.includes('diabetic patients')) {
          result = 'Drafting message to all diabetic patients about blood glucose monitoring reminders.';
          onCommand?.('draft_message', { group: 'diabetic' });
        } else {
          result = 'Please specify which patients to message.';
        }
      } else if (transcript.includes('schedule') || transcript.includes('appointment')) {
        result = 'Opening smart scheduling interface. Analyzing optimal time slots.';
        onCommand?.('schedule', {});
      } else if (transcript.includes('risk assessment')) {
        result = 'Running AI risk assessment on all active patients. High-risk cases will be highlighted.';
        onCommand?.('risk_assessment', {});
      } else if (transcript.includes('summary') || transcript.includes('report')) {
        result = 'Generating comprehensive practice summary with key metrics and insights.';
        onCommand?.('summary', {});
      } else {
        result = 'Command not recognized. Try: "Show me [patient name]", "Draft message to diabetic patients", "Schedule appointment", or "Risk assessment".';
      }

      setCommandResult(result);
      speak(result);
      
    } catch (error) {
      toast.error('Failed to process voice command');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractPatientName = (transcript: string): string => {
    // Simple name extraction - in real implementation, this would be more sophisticated
    const words = transcript.split(' ');
    const showIndex = words.findIndex(word => word.includes('show'));
    if (showIndex !== -1 && showIndex + 2 < words.length) {
      return `${words[showIndex + 2]} ${words[showIndex + 3] || ''}`.trim();
    }
    return 'Unknown Patient';
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Button 
            onClick={startListening}
            disabled={isListening || isProcessing}
            size="lg"
            className="w-32 h-32 rounded-full"
            variant={isListening ? "destructive" : "default"}
          >
            {isListening ? (
              <div className="flex flex-col items-center gap-2">
                <Mic className="h-8 w-8 animate-pulse" />
                <span className="text-xs">Listening</span>
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center gap-2">
                <Brain className="h-8 w-8 animate-spin" />
                <span className="text-xs">Processing</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Mic className="h-8 w-8" />
                <span className="text-xs">Activate</span>
              </div>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-semibold mb-2">Voice Commands</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• "Hey Aarogya, show me [patient name]'s profile"</p>
              <p>• "Hey Aarogya, draft message to diabetic patients"</p>
              <p>• "Hey Aarogya, schedule appointment"</p>
              <p>• "Hey Aarogya, run risk assessment"</p>
              <p>• "Hey Aarogya, generate practice summary"</p>
            </div>
          </div>

          {lastCommand && (
            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Volume2 className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Last Command</span>
                </div>
                <p className="text-sm text-blue-700">{lastCommand}</p>
              </div>
              
              {commandResult && (
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">AI Response</span>
                  </div>
                  <p className="text-sm text-green-700">{commandResult}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Badge variant="outline" className="text-xs">
            🎤 Voice Recognition Active
          </Badge>
          <Badge variant="outline" className="text-xs">
            🔊 Text-to-Speech Enabled
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}