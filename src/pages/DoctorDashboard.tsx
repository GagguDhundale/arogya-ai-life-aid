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
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Patient List
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
                <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer">
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
        </Tabs>
      </div>
    </div>
  );
}