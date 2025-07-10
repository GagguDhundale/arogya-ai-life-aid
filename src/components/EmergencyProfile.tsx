
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Phone, User, Heart, AlertTriangle, Save, Download } from "lucide-react";
import { toast } from "sonner";

const EmergencyProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    age: "32",
    bloodGroup: "B+",
    allergies: "Penicillin, Shellfish",
    medicalConditions: "Hypertension, Diabetes Type 2",
    emergencyContact1: "+91-9876543210",
    emergencyContact2: "+91-9876543211",
    insurance: "Health Plus - Policy #HP123456",
    medications: "Metformin 500mg, Lisinopril 10mg"
  });

  const [showQR, setShowQR] = useState(false);

  const handleSave = () => {
    console.log("Saving emergency profile:", profile);
    toast.success("Emergency profile saved successfully!");
  };

  const generateQRCode = () => {
    setShowQR(true);
    toast.success("Emergency QR code generated! Share this with medical professionals.");
  };

  const downloadProfile = () => {
    const profileData = JSON.stringify(profile, null, 2);
    const blob = new Blob([profileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emergency-profile.json';
    a.click();
    toast.success("Emergency profile downloaded!");
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Emergency Medical Profile
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Create your emergency profile for instant medical access during crises
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({...profile, age: e.target.value})}
                placeholder="Enter age"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              <Select value={profile.bloodGroup} onValueChange={(value) => setProfile({...profile, bloodGroup: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance Details</Label>
              <Input
                id="insurance"
                value={profile.insurance}
                onChange={(e) => setProfile({...profile, insurance: e.target.value})}
                placeholder="Insurance provider and policy number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Known Allergies *</Label>
            <Textarea
              id="allergies"
              value={profile.allergies}
              onChange={(e) => setProfile({...profile, allergies: e.target.value})}
              placeholder="List any known allergies (drugs, food, etc.)"
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical Conditions</Label>
            <Textarea
              id="medicalConditions"
              value={profile.medicalConditions}
              onChange={(e) => setProfile({...profile, medicalConditions: e.target.value})}
              placeholder="List any ongoing medical conditions"
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea
              id="medications"
              value={profile.medications}
              onChange={(e) => setProfile({...profile, medications: e.target.value})}
              placeholder="List current medications with dosages"
              className="min-h-[60px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact1">Emergency Contact 1 *</Label>
              <Input
                id="contact1"
                value={profile.emergencyContact1}
                onChange={(e) => setProfile({...profile, emergencyContact1: e.target.value})}
                placeholder="+91-XXXXXXXXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact2">Emergency Contact 2</Label>
              <Input
                id="contact2"
                value={profile.emergencyContact2}
                onChange={(e) => setProfile({...profile, emergencyContact2: e.target.value})}
                placeholder="+91-XXXXXXXXXX"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
            <Button variant="outline" onClick={generateQRCode} className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Generate QR Code
            </Button>
            <Button variant="outline" onClick={downloadProfile} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {showQR && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <QrCode className="h-5 w-5" />
              Emergency QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Placeholder QR Code */}
                <div className="w-48 h-48 bg-black flex items-center justify-center text-white text-xs text-center">
                  QR CODE<br/>
                  {profile.fullName}<br/>
                  Blood: {profile.bloodGroup}<br/>
                  Emergency: {profile.emergencyContact1}
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <h3 className="font-semibold text-green-800">How to Use:</h3>
                  <ul className="text-sm space-y-1 text-green-700">
                    <li>• Scan this QR code to access your emergency medical info</li>
                    <li>• Show to paramedics, doctors, or emergency responders</li>
                    <li>• Keep a screenshot on your phone's lock screen</li>
                    <li>• Print and keep in your wallet</li>
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download QR
                  </Button>
                  <Button size="sm" variant="outline">
                    Print QR Code
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Actions */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            Emergency Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="destructive" className="h-20 flex-col gap-2">
              <Phone className="h-6 w-6" />
              Call Ambulance
              <span className="text-xs">108 / 102</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-red-300">
              <Heart className="h-6 w-6" />
              Alert Contacts
              <span className="text-xs">SMS + Call</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 border-red-300">
              <User className="h-6 w-6" />
              Share Location
              <span className="text-xs">GPS + Address</span>
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-red-100 rounded-lg">
            <p className="text-sm text-red-800">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              In case of emergency, these buttons will automatically send your medical profile to emergency services and contacts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyProfile;
