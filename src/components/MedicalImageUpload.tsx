import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MedicalImageUploadProps {
  patientId: string;
  onImageAnalyzed?: (analysis: any) => void;
}

export default function MedicalImageUpload({ patientId, onImageAnalyzed }: MedicalImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        // Simulate AI analysis
        const analysis = await simulateAIImageAnalysis(file);
        const imageData = {
          id: Date.now() + Math.random(),
          file: file,
          url: URL.createObjectURL(file),
          analysis: analysis,
          timestamp: new Date().toISOString()
        };
        
        setUploadedImages(prev => [...prev, imageData]);
        onImageAnalyzed?.(analysis);
      }
      toast.success('Images uploaded and analyzed');
    } catch (error) {
      toast.error('Failed to analyze images');
    } finally {
      setUploading(false);
    }
  };

  const simulateAIImageAnalysis = async (file: File): Promise<any> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const imageType = file.name.toLowerCase();
    if (imageType.includes('skin') || imageType.includes('mole')) {
      return {
        type: 'dermatology',
        findings: ['Asymmetric borders detected', 'Color variation noted'],
        risk_level: 'medium',
        recommendation: 'Recommend dermatological review within 2 weeks',
        confidence: 0.78
      };
    } else if (imageType.includes('eye')) {
      return {
        type: 'ophthalmology',
        findings: ['Redness in conjunctiva', 'No corneal involvement'],
        risk_level: 'low',
        recommendation: 'Consistent with allergic conjunctivitis - routine follow-up',
        confidence: 0.85
      };
    } else {
      return {
        type: 'general',
        findings: ['No immediate abnormalities detected'],
        risk_level: 'low',
        recommendation: 'Clinical correlation recommended',
        confidence: 0.72
      };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Medical Image Triage Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-3">
            Upload skin conditions, wounds, eyes, ears, or throat images
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="medical-image-upload"
            disabled={uploading}
          />
          <label htmlFor="medical-image-upload">
            <Button asChild disabled={uploading}>
              <span>{uploading ? 'Analyzing...' : 'Upload Images'}</span>
            </Button>
          </label>
        </div>

        {uploadedImages.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">AI Analysis Results</h4>
            {uploadedImages.map((image) => (
              <div key={image.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <img 
                    src={image.url} 
                    alt="Medical image" 
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={
                        image.analysis.risk_level === 'high' ? 'destructive' : 
                        image.analysis.risk_level === 'medium' ? 'default' : 'secondary'
                      }>
                        {image.analysis.risk_level.toUpperCase()} PRIORITY
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Confidence: {Math.round(image.analysis.confidence * 100)}%
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Findings:</strong> {image.analysis.findings.join(', ')}
                      </div>
                      <div className="p-3 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-start gap-2">
                          {image.analysis.risk_level === 'high' ? (
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                          )}
                          <div>
                            <strong className="text-blue-800">AI Recommendation:</strong>
                            <p className="text-blue-700">{image.analysis.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}