import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  Bell, 
  Search,
  Filter,
  Heart,
  Stethoscope,
  LogOut,
  FileText,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import PatientProfileModal from '@/components/PatientProfileModal';
import MedicalImageUpload from '@/components/MedicalImageUpload';
import VoiceAssistant from '@/components/VoiceAssistant';
import PatientMessaging from '@/components/PatientMessaging';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  user_id: string;
  created_at: string;
  last_report?: string;
  risk_level?: 'low' | 'medium' | 'high';
  has_new_data?: boolean;
  next_appointment?: string;
}

interface DashboardStats {
  total_patients: number;
  unread_reports: number;
  today_appointments: number;
  high_risk_patients: number;
}

export default function DoctorDashboard() {
  const { user, userType, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_patients: 0,
    unread_reports: 0,
    today_appointments: 0,
    high_risk_patients: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'new_data' | 'appointments' | 'high_risk'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // Redirect if not a doctor
  if (user && userType !== 'doctor') {
    return <Navigate to="/dashboard" replace />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    try {
      setLoading(true);
      
      // Get doctor's patients through relationships
      const { data: relationships, error: relError } = await supabase
        .from('doctor_patient_relationships')
        .select(`
          patient_id,
          patients (
            id,
            first_name,
            last_name,
            date_of_birth,
            user_id,
            created_at
          )
        `)
        .eq('is_active', true);

      if (relError) throw relError;

      // Get shared reports for recent activity
      const { data: reports, error: reportsError } = await supabase
        .from('shared_health_reports')
        .select('patient_id, created_at, is_urgent')
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      // Process patient data
      const patientList: Patient[] = relationships?.map((rel: any) => {
        const patient = rel.patients;
        const patientReports = reports?.filter((r: any) => r.patient_id === patient.id) || [];
        const latestReport = patientReports[0];
        const hasNewData = latestReport && new Date(latestReport.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);
        const riskLevel = patientReports.some((r: any) => r.is_urgent) ? 'high' : 
                         patientReports.length > 3 ? 'medium' : 'low';

        return {
          ...patient,
          last_report: latestReport?.created_at,
          risk_level: riskLevel,
          has_new_data: hasNewData
        };
      }) || [];

      setPatients(patientList);

      // Calculate stats
      const newStats: DashboardStats = {
        total_patients: patientList.length,
        unread_reports: reports?.filter(r => new Date(r.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length || 0,
        today_appointments: 0, // This would come from appointments table
        high_risk_patients: patientList.filter(p => p.risk_level === 'high').length
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error loading doctor data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (filterType) {
      case 'new_data':
        return matchesSearch && patient.has_new_data;
      case 'high_risk':
        return matchesSearch && patient.risk_level === 'high';
      case 'appointments':
        return matchesSearch && patient.next_appointment;
      default:
        return matchesSearch;
    }
  });

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-primary">Arogya-AI</span>
                <Badge variant="secondary">Professional</Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 max-w-4xl">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="clinical-support" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Clinical AI
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-copilot" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              AI Co-Pilot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_patients}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unread Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.unread_reports}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.today_appointments}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High-Risk Patients</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.high_risk_patients}</div>
                </CardContent>
              </Card>
            </div>

            {/* Priority Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Priority Patients
                </CardTitle>
                <CardDescription>Patients requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients
                    .filter(p => p.risk_level === 'high' || p.has_new_data)
                    .slice(0, 5)
                    .map(patient => (
                      <div key={patient.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h4 className="font-medium">{patient.first_name} {patient.last_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {patient.has_new_data && 'New data shared • '}
                              Last active: {patient.last_report ? new Date(patient.last_report).toLocaleDateString() : 'No recent activity'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getRiskBadgeVariant(patient.risk_level || 'low')}>
                            {patient.risk_level?.toUpperCase()}
                          </Badge>
                          {patient.has_new_data && <Badge variant="outline">New</Badge>}
                        </div>
                      </div>
                    ))}
                  
                  {patients.filter(p => p.risk_level === 'high' || p.has_new_data).length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No priority patients at this time</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'new_data' ? 'default' : 'outline'}
                  onClick={() => setFilterType('new_data')}
                  size="sm"
                >
                  New Data
                </Button>
                <Button
                  variant={filterType === 'high_risk' ? 'default' : 'outline'}
                  onClick={() => setFilterType('high_risk')}
                  size="sm"
                >
                  High Risk
                </Button>
              </div>
            </div>

            {/* Patient List */}
            <div className="grid gap-4">
              {filteredPatients.map(patient => (
                <Card 
                  key={patient.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedPatient(patient);
                    setIsPatientModalOpen(true);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {patient.first_name[0]}{patient.last_name[0]}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{patient.first_name} {patient.last_name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>DOB: {new Date(patient.date_of_birth).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Age: {Math.floor((Date.now() - new Date(patient.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}</span>
                          </div>
                          {patient.last_report && (
                            <p className="text-sm text-muted-foreground">
                              Last report: {new Date(patient.last_report).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={getRiskBadgeVariant(patient.risk_level || 'low')}>
                          {patient.risk_level?.toUpperCase()}
                        </Badge>
                        {patient.has_new_data && (
                          <Badge variant="outline" className="border-primary text-primary">
                            New Data
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredPatients.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No patients found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || filterType !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'No patients have been assigned to you yet'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="clinical-support" className="space-y-6">
            {/* AI Clinical Decision Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  AI Clinical Decision Support
                </CardTitle>
                <CardDescription>Evidence-based diagnostic and treatment assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Differential Diagnosis</h4>
                      <p className="text-sm text-muted-foreground mb-3">AI-powered diagnostic suggestions based on symptoms</p>
                      <Button variant="outline" size="sm">Launch Tool</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Drug Interaction Checker</h4>
                      <p className="text-sm text-muted-foreground mb-3">Real-time medication safety analysis</p>
                      <Button variant="outline" size="sm">Check Interactions</Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Risk Stratification</h4>
                      <p className="text-sm text-muted-foreground mb-3">AI risk assessment for clinical cases</p>
                      <Button variant="outline" size="sm">Analyze Risk</Button>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Medical Imaging Assistant */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Medical Imaging Triage Assistant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      AI-powered analysis of patient-uploaded images for triage and clinical decision support
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium">Recent Image Analysis</h5>
                        <div className="space-y-2">
                          <div className="p-3 border border-border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium">Skin Lesion Analysis</span>
                              <Badge variant="destructive">Urgent</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Asymmetry and irregular borders detected. Flagged for dermatological review.
                            </p>
                          </div>
                          <div className="p-3 border border-border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium">Eye Examination</span>
                              <Badge variant="secondary">Low Priority</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Consistent with allergic conjunctivitis. Standard treatment recommended.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium">Upload New Image</h5>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <p className="text-sm text-muted-foreground">
                            Drag & drop medical images or click to upload
                          </p>
                          <Button variant="outline" className="mt-2">Select Images</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            {/* Communication Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PatientMessaging
                patientId="sample-patient-id"
                patientName="Priya Sharma"
                onVideoCall={() => toast.success('Launching video call...')}
                onScheduleAppointment={() => toast.success('Opening appointment scheduler...')}
              />
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Recent Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredPatients.slice(0, 5).map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <h4 className="font-medium">{patient.first_name} {patient.last_name}</h4>
                            <p className="text-sm text-muted-foreground">Last message: 2 hours ago</p>
                          </div>
                          <Badge variant="outline">2 new</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <MedicalImageUpload
                  patientId="sample-patient-id"
                  onImageAnalyzed={(analysis) => {
                    toast.success(`Image analyzed: ${analysis.recommendation}`);
                  }}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Telemedicine Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Upcoming Session</h4>
                        <Badge className="bg-blue-600">In 30 min</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Anita Desai - Follow-up consultation
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm">Join Call</Button>
                        <Button variant="outline" size="sm">Reschedule</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium">Today's Sessions</h5>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border border-border rounded">
                          <span className="text-sm">10:00 AM - Vikram Singh</span>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border border-border rounded">
                          <span className="text-sm">2:30 PM - Anita Desai</span>
                          <Badge>Upcoming</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 border border-border rounded">
                          <span className="text-sm">4:00 PM - Suresh Patel</span>
                          <Badge variant="outline">Scheduled</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Practice Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Practice Analytics & Insights
                </CardTitle>
                <CardDescription>Evidence-based insights into your practice performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Outcome Tracking */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Treatment Outcomes</h4>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-800">Back Pain Protocol</h5>
                      <p className="text-sm text-green-700 mt-1">
                        45% faster pain reduction vs. standard care
                      </p>
                      <Badge variant="outline" className="mt-2 text-green-600 border-green-300">
                        Above Average
                      </Badge>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="font-medium text-blue-800">Diabetes Management</h5>
                      <p className="text-sm text-blue-700 mt-1">
                        85% of patients achieving target HbA1c
                      </p>
                      <Badge variant="outline" className="mt-2 text-blue-600 border-blue-300">
                        Excellent
                      </Badge>
                    </div>
                  </div>

                  {/* Population Health */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Population Health</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Hypertension Control Rate</span>
                        <span className="font-semibold text-green-600">75%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Vaccination Compliance</span>
                        <span className="font-semibold text-blue-600">92%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Follow-up Adherence</span>
                        <span className="font-semibold text-orange-600">68%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded border border-orange-200">
                      <p className="text-sm text-orange-700">
                        <strong>Insight:</strong> Consider automated follow-up reminders to improve adherence.
                      </p>
                    </div>
                  </div>

                  {/* Clinical Trends */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Clinical Trends</h4>
                    <div className="space-y-2">
                      <div className="p-3 border border-border rounded">
                        <h5 className="font-medium text-sm">Rising: Respiratory Symptoms</h5>
                        <p className="text-xs text-muted-foreground">
                          25% increase this week - correlates with air quality alerts
                        </p>
                      </div>
                      <div className="p-3 border border-border rounded">
                        <h5 className="font-medium text-sm">Stable: Mental Health Scores</h5>
                        <p className="text-xs text-muted-foreground">
                          Average wellness index: 7.2/10
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Research & Evidence */}
            <Card>
              <CardHeader>
                <CardTitle>Clinical Research Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Evidence-Based Medicine</h4>
                    <div className="space-y-3">
                      <div className="p-3 border border-border rounded-lg">
                        <h5 className="font-medium">Latest Guidelines</h5>
                        <p className="text-sm text-muted-foreground">
                          Updated hypertension management protocols (2024)
                        </p>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          View Guidelines →
                        </Button>
                      </div>
                      <div className="p-3 border border-border rounded-lg">
                        <h5 className="font-medium">Clinical Decision Tools</h5>
                        <p className="text-sm text-muted-foreground">
                          ASCVD Risk Calculator, Wells Score, CURB-65
                        </p>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          Access Tools →
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Research Opportunities</h4>
                    <div className="space-y-3">
                      <div className="p-3 border border-border rounded-lg bg-blue-50">
                        <h5 className="font-medium">Clinical Trial Match</h5>
                        <p className="text-sm text-muted-foreground">
                          3 patients may be eligible for ongoing diabetes studies
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Review Matches
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-copilot" className="space-y-6">
            {/* AI Co-Pilot Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  AI Clinical Command Center
                </CardTitle>
                <CardDescription>Your intelligent assistant for clinical workflow management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Voice Assistant */}
                  <VoiceAssistant
                    onCommand={(command, result) => {
                      console.log('Voice command executed:', command, result);
                      if (command === 'show_patient') {
                        setActiveTab('patients');
                        toast.success(`Switching to patient view for ${result.patientName}`);
                      } else if (command === 'draft_message') {
                        setActiveTab('communication');
                        toast.success('Opening messaging interface');
                      } else if (command === 'schedule') {
                        toast.success('Smart scheduling activated');
                      }
                    }}
                  />

                  {/* Predictive Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Today's Predictions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium text-yellow-800">High Load Expected</span>
                          </div>
                          <p className="text-sm text-yellow-700">
                            Predicting 15% more respiratory cases due to air quality
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-800">Optimal Scheduling</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Best appointment slots: 10-11 AM, 2-3 PM
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Automated Triage</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                            <span className="text-sm font-medium text-red-800">[URGENT: CARDIAC]</span>
                            <Badge variant="destructive">2 cases</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                            <span className="text-sm font-medium text-yellow-800">[REVIEW: PSYCH]</span>
                            <Badge className="bg-yellow-600">1 case</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                            <span className="text-sm font-medium text-green-800">[ROUTINE: FU]</span>
                            <Badge variant="secondary">8 cases</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h4 className="font-semibold mb-3">AI-Powered Quick Actions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline" className="h-16 flex-col gap-1">
                        <FileText className="h-4 w-4" />
                        Generate SOAP Notes
                      </Button>
                      <Button variant="outline" className="h-16 flex-col gap-1">
                        <Users className="h-4 w-4" />
                        Patient Education
                      </Button>
                      <Button variant="outline" className="h-16 flex-col gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Risk Assessment
                      </Button>
                      <Button variant="outline" className="h-16 flex-col gap-1">
                        <Calendar className="h-4 w-4" />
                        Smart Scheduling
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Patient Profile Modal */}
      <PatientProfileModal
        isOpen={isPatientModalOpen}
        onClose={() => {
          setIsPatientModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
      />
    </div>
  );
}