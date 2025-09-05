import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  Heart,
  Activity,
  Download,
  Plus,
  Eye,
  User,
  ClipboardList,
  Pill,
  AlertTriangle,
  ChevronRight,
  Stethoscope,
  TrendingUp
} from 'lucide-react';
import { cn } from "../../../components/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const PatientRecordsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const patients = [
    {
      id: 1,
      name: "Emily Carter",
      age: 28,
      gender: "Female",
      bloodType: "O+",
      mrn: "MRN-001",
      phone: "+1 (555) 123-4567",
      email: "emily.carter@email.com",
      lastVisit: "2024-01-15",
      status: "stable",
      condition: "Hypertension",
      allergies: ["Penicillin"],
      medications: ["Lisinopril 10mg", "Hydrochlorothiazide 25mg"],
      consultations: [
        {
          id: 1,
          date: "2024-01-15",
          type: "Follow-up",
          doctor: "Dr. Sarah Johnson",
          diagnosis: "Hypertension - Stable",
          notes: "Blood pressure well controlled. Continue current medication.",
          vitals: { bp: "125/80", hr: "72", temp: "98.6", spo2: "98" }
        },
        {
          id: 2,
          date: "2024-01-01",
          type: "Regular Checkup",
          doctor: "Dr. Sarah Johnson",
          diagnosis: "Hypertension - Monitoring",
          notes: "Slight elevation in BP. Adjusted medication dosage.",
          vitals: { bp: "135/85", hr: "75", temp: "98.4", spo2: "97" }
        }
      ],
      vitalHistory: [
        { date: "Jan 1", bp: 135, hr: 75, weight: 145 },
        { date: "Jan 8", bp: 130, hr: 73, weight: 144 },
        { date: "Jan 15", bp: 125, hr: 72, weight: 143 }
      ]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      age: 45,
      gender: "Male",
      bloodType: "A+",
      mrn: "MRN-002",
      phone: "+1 (555) 234-5678",
      email: "michael.rodriguez@email.com",
      lastVisit: "2024-01-14",
      status: "monitoring",
      condition: "Diabetes Type 2",
      allergies: ["None known"],
      medications: ["Metformin 500mg", "Insulin Glargine"],
      consultations: [
        {
          id: 1,
          date: "2024-01-14",
          type: "Diabetes Management",
          doctor: "Dr. Sarah Johnson",
          diagnosis: "Diabetes Type 2 - Good control",
          notes: "HbA1c levels improved. Continue current regimen.",
          vitals: { bp: "120/78", hr: "68", temp: "98.2", spo2: "98" }
        }
      ],
      vitalHistory: [
        { date: "Dec 15", bp: 125, hr: 70, weight: 180 },
        { date: "Jan 1", bp: 122, hr: 69, weight: 178 },
        { date: "Jan 14", bp: 120, hr: 68, weight: 176 }
      ]
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'stable':
        return 'bg-medical-success text-white';
      case 'monitoring':
        return 'bg-status-pending text-white';
      case 'critical':
        return 'bg-medical-error text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const renderPatientDetail = () => {
    if (!selectedPatient) return null;

    return (
      <div className="space-y-6">
        {/* Patient Header */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-medical-primary text-white text-lg">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedPatient.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-muted-foreground">{selectedPatient.age} years old • {selectedPatient.gender}</span>
                    <Badge className={getStatusColor(selectedPatient.status)}>
                      {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>MRN: {selectedPatient.mrn}</span>
                    <span>Blood Type: {selectedPatient.bloodType}</span>
                    <span>Last Visit: {new Date(selectedPatient.lastVisit).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-medical-primary text-medical-primary hover:bg-medical-primary hover:text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export Records
                </Button>
                <Button onClick={() => setSelectedPatient(null)} variant="outline">
                  Back to List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="vitals">Vitals & Trends</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="stethoscope">Stethoscope Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Basic Information */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-medical-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Phone:</span>
                    <span className="text-sm">{selectedPatient.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm">{selectedPatient.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Blood Type:</span>
                    <span className="text-sm">{selectedPatient.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">MRN:</span>
                    <span className="text-sm">{selectedPatient.mrn}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Current Condition */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-medical-primary" />
                    Current Condition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-foreground">{selectedPatient.condition}</p>
                  <p className="text-sm text-muted-foreground mt-2">Status: {selectedPatient.status}</p>
                </CardContent>
              </Card>

              {/* Allergies */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-medical-warning" />
                    Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPatient.allergies.length > 0 ? (
                    <div className="space-y-1">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="border-medical-warning text-medical-warning">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No known allergies</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Consultations */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedPatient.consultations.slice(0, 3).map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-3 bg-medical-card rounded-lg border border-border">
                      <div>
                        <h4 className="font-semibold text-foreground">{consultation.type}</h4>
                        <p className="text-sm text-muted-foreground">{new Date(consultation.date).toLocaleDateString()} • {consultation.doctor}</p>
                        <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Consultation History</h3>
              <Button className="bg-medical-primary hover:bg-medical-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Consultation
              </Button>
            </div>
            
            <div className="space-y-4">
              {selectedPatient.consultations.map((consultation) => (
                <Card key={consultation.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">{consultation.type}</h4>
                        <p className="text-muted-foreground">{new Date(consultation.date).toLocaleDateString()} • {consultation.doctor}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-foreground mb-2">Diagnosis</h5>
                        <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-foreground mb-2">Vitals</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-medical-error" />
                            BP: {consultation.vitals.bp}
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-medical-primary" />
                            HR: {consultation.vitals.hr} bpm
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Notes</h5>
                      <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Blood Pressure Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedPatient.vitalHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[110, 140]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="bp" stroke="hsl(var(--medical-primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm">Heart Rate Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedPatient.vitalHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[60, 80]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="hr" stroke="hsl(var(--medical-error))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest Vitals */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Latest Vital Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-medical-card rounded-lg">
                    <Heart className="h-8 w-8 text-medical-error mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Heart Rate</p>
                    <p className="text-xl font-bold text-foreground">72 bpm</p>
                  </div>
                  <div className="text-center p-4 bg-medical-card rounded-lg">
                    <Activity className="h-8 w-8 text-medical-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Blood Pressure</p>
                    <p className="text-xl font-bold text-foreground">125/80</p>
                  </div>
                  <div className="text-center p-4 bg-medical-card rounded-lg">
                    <TrendingUp className="h-8 w-8 text-status-pending mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="text-xl font-bold text-foreground">98.6°F</p>
                  </div>
                  <div className="text-center p-4 bg-medical-card rounded-lg">
                    <Activity className="h-8 w-8 text-medical-accent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">SpO2</p>
                    <p className="text-xl font-bold text-foreground">98%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Current Medications</h3>
              <Button className="bg-medical-primary hover:bg-medical-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>

            <div className="grid gap-3">
              {selectedPatient.medications.map((medication, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-medical-accent rounded-full">
                          <Pill className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{medication}</h4>
                          <p className="text-sm text-muted-foreground">Daily • With food</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stethoscope" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-medical-primary" />
                  Kalafo Digital Stethoscope Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Heart Sound Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-medical-card rounded">
                          <span className="text-sm">S1 Clarity</span>
                          <Badge className="bg-medical-success text-white">Normal</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-medical-card rounded">
                          <span className="text-sm">S2 Clarity</span>
                          <Badge className="bg-medical-success text-white">Normal</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-medical-card rounded">
                          <span className="text-sm">Murmur Detection</span>
                          <Badge variant="outline">None</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Lung Sound Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-medical-card rounded">
                          <span className="text-sm">Breath Sounds</span>
                          <Badge className="bg-medical-success text-white">Clear</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-medical-card rounded">
                          <span className="text-sm">Adventitious Sounds</span>
                          <Badge variant="outline">None</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Recent Recordings</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-medical-card rounded-lg border border-border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Heart - Apex</span>
                          <span className="text-xs text-muted-foreground">Jan 15, 2024</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Play
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Analyze
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-medical-card rounded-lg border border-border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Lungs - Right Upper</span>
                          <span className="text-xs text-muted-foreground">Jan 15, 2024</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Play
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Analyze
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {selectedPatient ? (
        renderPatientDetail()
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Patient Records</h2>
              <p className="text-muted-foreground">Access and manage detailed patient medical records</p>
            </div>
            <Button className="bg-medical-primary hover:bg-medical-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Record
            </Button>
          </div>

          {/* Search */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, MRN, or condition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Patient List */}
          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-elevated transition-shadow duration-200 cursor-pointer shadow-card" onClick={() => setSelectedPatient(patient)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-medical-primary text-white">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{patient.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>MRN: {patient.mrn}</span>
                          <span>{patient.age} years old</span>
                          <span>{patient.condition}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Consultations</p>
                        <p className="font-semibold text-foreground">{patient.consultations.length}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No records found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PatientRecordsTab;