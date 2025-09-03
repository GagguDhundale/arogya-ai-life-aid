import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  Pill, 
  FileText, 
  MessageSquare,
  TrendingUp,
  User,
  MapPin
} from 'lucide-react';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export default function PatientProfileModal({ isOpen, onClose, patient }: PatientProfileModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">
                {patient.first_name[0]}{patient.last_name[0]}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{patient.first_name} {patient.last_name}</h2>
              <p className="text-sm text-muted-foreground">
                Patient ID: {patient.id?.slice(-8)} • Age: {Math.floor((Date.now() - new Date(patient.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <Badge variant={patient.risk_level === 'high' ? 'destructive' : patient.risk_level === 'medium' ? 'default' : 'secondary'}>
                {patient.risk_level?.toUpperCase()} RISK
              </Badge>
              {patient.has_new_data && <Badge variant="outline">NEW DATA</Badge>}
            </div>
          </DialogTitle>
          <DialogDescription>
            Comprehensive patient health timeline and AI-powered clinical insights
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="summary">AI Summary</TabsTrigger>
            <TabsTrigger value="vitals">Vitals & Trends</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            {/* AI-Powered Synopsis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  AI Clinical Synopsis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm">
                    <strong>AI Assessment:</strong> Patient with well-controlled hypertension presents with 4-day history of worsening cough and subjective fever. 
                    Symptom correlation analysis shows alignment with local peak pollen levels (PM2.5: 145 µg/m³). 
                    Mental health stability index remains at baseline (7.2/10). 
                    Recommended triage: <span className="font-semibold text-blue-700">Routine follow-up with allergy consideration</span>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Health Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Timeline Entry */}
                  <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Symptom Check - High Priority</h4>
                        <Badge variant="destructive">2 hours ago</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Symptoms:</strong> Persistent cough, fever (101°F), shortness of breath
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>AI Risk Assessment:</strong> Medium-High (7.5/10) - Respiratory pattern suggests viral vs allergic etiology
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Respond to Patient</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Environmental Alert</h4>
                        <Badge className="bg-yellow-600">4 hours ago</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Air Quality Alert:</strong> PM2.5 levels reached 145 µg/m³ in patient's area (Delhi NCR)
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Correlation:</strong> 78% likelihood that symptoms are exacerbated by environmental factors
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Mental Health Check-in</h4>
                        <Badge variant="secondary">Yesterday</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Mood Score:</strong> 7.2/10 (Stable) • <strong>Anxiety Level:</strong> 3/10 (Low)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Patient reports good mental wellness despite physical symptoms
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Medication Adherence</h4>
                        <Badge variant="outline">3 days ago</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Compliance:</strong> 95% (Excellent) • Missed 1 dose of Lisinopril in past week
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            {/* Patient Demographics & History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Demographics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Age:</span>
                      <p className="font-medium">{Math.floor((Date.now() - new Date(patient.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gender:</span>
                      <p className="font-medium">Female</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Blood Type:</span>
                      <p className="font-medium">O+</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium">Delhi NCR</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <span className="text-muted-foreground text-sm">Emergency Contact:</span>
                    <p className="font-medium">Rajesh Sharma (Husband)</p>
                    <p className="text-sm text-muted-foreground">+91 98765-43210</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Allergies & Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-red-700">Penicillin</span>
                      <Badge variant="destructive" className="text-xs">Severe</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium text-yellow-700">Dust Mites</span>
                      <Badge className="bg-yellow-600 text-xs">Moderate</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="font-medium text-orange-700">Pollen (Seasonal)</span>
                      <Badge className="bg-orange-600 text-xs">Mild</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Medical History */}
            <Card>
              <CardHeader>
                <CardTitle>Past Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Chronic Conditions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">Hypertension</span>
                        <Badge variant="outline">Well Controlled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">Allergic Rhinitis</span>
                        <Badge variant="secondary">Seasonal</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Surgical History</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 border border-border rounded">
                        <span className="font-medium">Appendectomy</span>
                        <p className="text-muted-foreground">March 2018 - No complications</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Vital Signs Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Blood Pressure */}
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Blood Pressure</h4>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-600">125/78</div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Target: &lt;140/90</span>
                          <span className="text-green-600">✓ On target</span>
                        </div>
                      </div>
                      <div className="h-20 bg-gradient-to-r from-green-100 to-green-200 rounded flex items-end justify-center">
                        <span className="text-xs text-green-700 mb-2">7-day trend: Stable</span>
                      </div>
                    </div>
                  </div>

                  {/* Heart Rate */}
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Heart Rate</h4>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">72 BPM</div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Resting HR</span>
                          <span className="text-blue-600">Normal</span>
                        </div>
                      </div>
                      <div className="h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-end justify-center">
                        <span className="text-xs text-blue-700 mb-2">Rhythm: Regular</span>
                      </div>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-semibold mb-2">Temperature</h4>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-red-600">101.2°F</div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Last 4 hours</span>
                          <span className="text-red-600">⚠ Elevated</span>
                        </div>
                      </div>
                      <div className="h-20 bg-gradient-to-r from-red-100 to-red-200 rounded flex items-end justify-center">
                        <span className="text-xs text-red-700 mb-2">Trending up</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Lisinopril 10mg</h4>
                      <Badge variant="outline">Daily</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Indication:</span>
                        <p>Hypertension</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Adherence:</span>
                        <p className="text-green-600">95% (Excellent)</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Refill:</span>
                        <p>15 days ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Cetirizine 10mg</h4>
                      <Badge variant="outline">PRN</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Indication:</span>
                        <p>Allergic Rhinitis</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Usage:</span>
                        <p className="text-yellow-600">As needed</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Used:</span>
                        <p>3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-2">⚠ Drug Interaction Check</h5>
                  <p className="text-sm text-yellow-700">
                    No significant interactions detected with current medications. 
                    Consider monitoring potassium levels with ACE inhibitor therapy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Message History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">From Patient</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm">
                      "My cough is getting worse and I have a fever. Should I be concerned?"
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">From You</span>
                      <span className="text-xs text-muted-foreground">1 day ago</span>
                    </div>
                    <p className="text-sm">
                      "Please continue your current medications and monitor your symptoms. Schedule a follow-up if symptoms worsen."
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Appointment History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Routine Check-up</span>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">March 15, 2024 • 30 mins</p>
                    <p className="text-sm">BP monitoring, medication review</p>
                  </div>
                  
                  <div className="p-3 border border-border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Follow-up Scheduled</span>
                      <Badge>Upcoming</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">March 25, 2024 • 2:30 PM</p>
                    <p className="text-sm">Symptom review, treatment adjustment</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Send Message</Button>
                  <Button size="sm" variant="outline">Schedule Appointment</Button>
                  <Button size="sm" variant="outline">Request Lab Work</Button>
                  <Button size="sm" variant="outline">Update Prescription</Button>
                  <Button size="sm" variant="outline">Generate Care Plan</Button>
                  <Button size="sm" variant="outline">Refer to Specialist</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}