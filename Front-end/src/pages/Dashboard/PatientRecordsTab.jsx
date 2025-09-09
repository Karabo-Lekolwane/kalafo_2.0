import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import './index.css';
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
import { cn } from "../../components/lib/utils";
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
        return 'patient-status-stable';
      case 'monitoring':
        return 'patient-status-monitoring';
      case 'critical':
        return 'patient-status-critical';
      default:
        return 'patient-status-default';
    }
  };

  const renderPatientDetail = () => {
    if (!selectedPatient) return null;

    return (
      <div className="patient-records-detail">
        {/* Patient Header */}
        <Card className="patient-records-header-card">
          <CardContent className="patient-records-header-content">
            <div className="patient-records-header-container">
              <div className="patient-records-header-info">
                <Avatar className="patient-records-avatar">
                  <AvatarFallback className="patient-records-avatar-fallback">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="patient-records-name">{selectedPatient.name}</h2>
                  <div className="patient-records-demographics">
                    <span className="patient-records-age-gender">{selectedPatient.age} years old • {selectedPatient.gender}</span>
                    <Badge className={`patient-records-status ${getStatusColor(selectedPatient.status)}`}>
                      {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="patient-records-meta">
                    <span>MRN: {selectedPatient.mrn}</span>
                    <span>Blood Type: {selectedPatient.bloodType}</span>
                    <span>Last Visit: {new Date(selectedPatient.lastVisit).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="patient-records-header-actions">
                <Button variant="outline" className="patient-records-export-btn">
                  <Download className="patient-records-export-icon" />
                  Export Records
                </Button>
                <Button onClick={() => setSelectedPatient(null)} variant="outline" className="patient-records-back-btn">
                  Back to List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="patient-records-tabs-list">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="vitals">Vitals & Trends</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="stethoscope">Stethoscope Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="patient-records-tab-content">
            <div className="patient-records-overview-grid">
              {/* Basic Information */}
              <Card className="patient-records-info-card">
                <CardHeader>
                  <CardTitle className="patient-records-card-title">
                    <User className="patient-records-card-icon" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="patient-records-card-content">
                  <div className="patient-records-info-item">
                    <span className="patient-records-info-label">Phone:</span>
                    <span className="patient-records-info-value">{selectedPatient.phone}</span>
                  </div>
                  <div className="patient-records-info-item">
                    <span className="patient-records-info-label">Email:</span>
                    <span className="patient-records-info-value">{selectedPatient.email}</span>
                  </div>
                  <div className="patient-records-info-item">
                    <span className="patient-records-info-label">Blood Type:</span>
                    <span className="patient-records-info-value">{selectedPatient.bloodType}</span>
                  </div>
                  <div className="patient-records-info-item">
                    <span className="patient-records-info-label">MRN:</span>
                    <span className="patient-records-info-value">{selectedPatient.mrn}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Current Condition */}
              <Card className="patient-records-info-card">
                <CardHeader>
                  <CardTitle className="patient-records-card-title">
                    <ClipboardList className="patient-records-card-icon" />
                    Current Condition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="patient-records-condition">{selectedPatient.condition}</p>
                  <p className="patient-records-condition-status">Status: {selectedPatient.status}</p>
                </CardContent>
              </Card>

              {/* Allergies */}
              <Card className="patient-records-info-card">
                <CardHeader>
                  <CardTitle className="patient-records-card-title">
                    <AlertTriangle className="patient-records-card-icon patient-records-allergy-icon" />
                    Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPatient.allergies.length > 0 ? (
                    <div className="patient-records-allergies">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="patient-records-allergy-badge">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="patient-records-no-allergies">No known allergies</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Consultations */}
            <Card className="patient-records-consultations-card">
              <CardHeader>
                <CardTitle>Recent Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="patient-records-consultations-list">
                  {selectedPatient.consultations.slice(0, 3).map((consultation) => (
                    <div key={consultation.id} className="patient-records-consultation-item">
                      <div>
                        <h4 className="patient-records-consultation-type">{consultation.type}</h4>
                        <p className="patient-records-consultation-meta">{new Date(consultation.date).toLocaleDateString()} • {consultation.doctor}</p>
                        <p className="patient-records-consultation-diagnosis">{consultation.diagnosis}</p>
                      </div>
                      <ChevronRight className="patient-records-consultation-arrow" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="patient-records-tab-content">
            <div className="patient-records-consultations-header">
              <h3 className="patient-records-consultations-title">Consultation History</h3>
              <Button className="patient-records-add-btn">
                <Plus className="patient-records-add-icon" />
                New Consultation
              </Button>
            </div>
            
            <div className="patient-records-consultations-detail">
              {selectedPatient.consultations.map((consultation) => (
                <Card key={consultation.id} className="patient-records-consultation-card">
                  <CardContent className="patient-records-consultation-content">
                    <div className="patient-records-consultation-header">
                      <div>
                        <h4 className="patient-records-consultation-title">{consultation.type}</h4>
                        <p className="patient-records-consultation-subtitle">{new Date(consultation.date).toLocaleDateString()} • {consultation.doctor}</p>
                      </div>
                      <Button variant="outline" size="sm" className="patient-records-view-btn">
                        <Eye className="patient-records-view-icon" />
                        View Details
                      </Button>
                    </div>
                    
                    <div className="patient-records-consultation-grid">
                      <div>
                        <h5 className="patient-records-consultation-subheading">Diagnosis</h5>
                        <p className="patient-records-consultation-text">{consultation.diagnosis}</p>
                      </div>
                      <div>
                        <h5 className="patient-records-consultation-subheading">Vitals</h5>
                        <div className="patient-records-vitals-grid">
                          <div className="patient-records-vital-item">
                            <Heart className="patient-records-vital-icon patient-records-vital-heart" />
                            BP: {consultation.vitals.bp}
                          </div>
                          <div className="patient-records-vital-item">
                            <Activity className="patient-records-vital-icon patient-records-vital-activity" />
                            HR: {consultation.vitals.hr} bpm
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="patient-records-consultation-subheading">Notes</h5>
                      <p className="patient-records-consultation-text">{consultation.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="patient-records-tab-content">
            <div className="patient-records-vitals-grid">
              <Card className="patient-records-vitals-card">
                <CardHeader>
                  <CardTitle className="patient-records-vitals-title">Blood Pressure Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="patient-records-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedPatient.vitalHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[110, 140]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="bp" stroke="hsl(197, 89%, 48%)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="patient-records-vitals-card">
                <CardHeader>
                  <CardTitle className="patient-records-vitals-title">Heart Rate Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="patient-records-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedPatient.vitalHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[60, 80]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="hr" stroke="hsl(0, 84%, 60%)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest Vitals */}
            <Card className="patient-records-latest-vitals-card">
              <CardHeader>
                <CardTitle>Latest Vital Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="patient-records-vitals-display">
                  <div className="patient-records-vital-box">
                    <Heart className="patient-records-vital-display-icon patient-records-vital-heart" />
                    <p className="patient-records-vital-label">Heart Rate</p>
                    <p className="patient-records-vital-value">72 bpm</p>
                  </div>
                  <div className="patient-records-vital-box">
                    <Activity className="patient-records-vital-display-icon patient-records-vital-activity" />
                    <p className="patient-records-vital-label">Blood Pressure</p>
                    <p className="patient-records-vital-value">125/80</p>
                  </div>
                  <div className="patient-records-vital-box">
                    <TrendingUp className="patient-records-vital-display-icon patient-records-vital-temp" />
                    <p className="patient-records-vital-label">Temperature</p>
                    <p className="patient-records-vital-value">98.6°F</p>
                  </div>
                  <div className="patient-records-vital-box">
                    <Activity className="patient-records-vital-display-icon patient-records-vital-spo2" />
                    <p className="patient-records-vital-label">SpO2</p>
                    <p className="patient-records-vital-value">98%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="patient-records-tab-content">
            <div className="patient-records-medications-header">
              <h3 className="patient-records-medications-title">Current Medications</h3>
              <Button className="patient-records-add-btn">
                <Plus className="patient-records-add-icon" />
                Add Medication
              </Button>
            </div>

            <div className="patient-records-medications-list">
              {selectedPatient.medications.map((medication, index) => (
                <Card key={index} className="patient-records-medication-card">
                  <CardContent className="patient-records-medication-content">
                    <div className="patient-records-medication-container">
                      <div className="patient-records-medication-info">
                        <div className="patient-records-medication-icon-container">
                          <Pill className="patient-records-medication-icon" />
                        </div>
                        <div>
                          <h4 className="patient-records-medication-name">{medication}</h4>
                          <p className="patient-records-medication-details">Daily • With food</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="patient-records-medication-edit-btn">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stethoscope" className="patient-records-tab-content">
            <Card className="patient-records-stethoscope-card">
              <CardHeader>
                <CardTitle className="patient-records-stethoscope-title">
                  <Stethoscope className="patient-records-stethoscope-icon" />
                  Kalafo Digital Stethoscope Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="patient-records-stethoscope-grid">
                  <div className="patient-records-stethoscope-analysis">
                    <div>
                      <h4 className="patient-records-stethoscope-subtitle">Heart Sound Analysis</h4>
                      <div className="patient-records-stethoscope-list">
                        <div className="patient-records-stethoscope-item">
                          <span className="patient-records-stethoscope-item-label">S1 Clarity</span>
                          <Badge className="patient-records-stethoscope-badge-success">Normal</Badge>
                        </div>
                        <div className="patient-records-stethoscope-item">
                          <span className="patient-records-stethoscope-item-label">S2 Clarity</span>
                          <Badge className="patient-records-stethoscope-badge-success">Normal</Badge>
                        </div>
                        <div className="patient-records-stethoscope-item">
                          <span className="patient-records-stethoscope-item-label">Murmur Detection</span>
                          <Badge variant="outline" className="patient-records-stethoscope-badge-outline">None</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="patient-records-stethoscope-subtitle">Lung Sound Analysis</h4>
                      <div className="patient-records-stethoscope-list">
                        <div className="patient-records-stethoscope-item">
                          <span className="patient-records-stethoscope-item-label">Breath Sounds</span>
                          <Badge className="patient-records-stethoscope-badge-success">Clear</Badge>
                        </div>
                        <div className="patient-records-stethoscope-item">
                          <span className="patient-records-stethoscope-item-label">Adventitious Sounds</span>
                          <Badge variant="outline" className="patient-records-stethoscope-badge-outline">None</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="patient-records-stethoscope-recordings">
                    <h4 className="patient-records-stethoscope-subtitle">Recent Recordings</h4>
                    <div className="patient-records-stethoscope-recordings-list">
                      <div className="patient-records-stethoscope-recording">
                        <div className="patient-records-stethoscope-recording-header">
                          <span className="patient-records-stethoscope-recording-name">Heart - Apex</span>
                          <span className="patient-records-stethoscope-recording-date">Jan 15, 2024</span>
                        </div>
                        <div className="patient-records-stethoscope-recording-actions">
                          <Button variant="outline" size="sm" className="patient-records-stethoscope-action-btn">
                            Play
                          </Button>
                          <Button variant="outline" size="sm" className="patient-records-stethoscope-action-btn">
                            Analyze
                          </Button>
                        </div>
                      </div>
                      
                      <div className="patient-records-stethoscope-recording">
                        <div className="patient-records-stethoscope-recording-header">
                          <span className="patient-records-stethoscope-recording-name">Lungs - Right Upper</span>
                          <span className="patient-records-stethoscope-recording-date">Jan 15, 2024</span>
                        </div>
                        <div className="patient-records-stethoscope-recording-actions">
                          <Button variant="outline" size="sm" className="patient-records-stethoscope-action-btn">
                            Play
                          </Button>
                          <Button variant="outline" size="sm" className="patient-records-stethoscope-action-btn">
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
    <div className="patient-records-container">
      {selectedPatient ? (
        renderPatientDetail()
      ) : (
        <>
          {/* Header */}
          <div className="patient-records-main-header">
            <div>
              <h2 className="patient-records-main-title">Patient Records</h2>
              <p className="patient-records-main-subtitle">Access and manage detailed patient medical records</p>
            </div>
            <Button className="patient-records-main-add-btn">
              <Plus className="patient-records-main-add-icon" />
              Add New Record
            </Button>
          </div>

          {/* Search */}
          <Card className="patient-records-search-card">
            <CardContent className="patient-records-search-content">
              <div className="patient-records-search-container">
                <Search className="patient-records-search-icon" />
                <Input
                  placeholder="Search by patient name, MRN, or condition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="patient-records-search-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Patient List */}
          <div className="patient-records-list">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="patient-records-list-card" onClick={() => setSelectedPatient(patient)}>
                <CardContent className="patient-records-list-content">
                  <div className="patient-records-list-item">
                    <div className="patient-records-list-info">
                      <Avatar className="patient-records-list-avatar">
                        <AvatarFallback className="patient-records-list-avatar-fallback">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="patient-records-list-name">{patient.name}</h3>
                        <div className="patient-records-list-meta">
                          <span>MRN: {patient.mrn}</span>
                          <span>{patient.age} years old</span>
                          <span>{patient.condition}</span>
                        </div>
                        <div className="patient-records-list-status">
                          <Badge className={`patient-records-list-badge ${getStatusColor(patient.status)}`}>
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </Badge>
                          <span className="patient-records-list-visit">
                            Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="patient-records-list-actions">
                      <div className="patient-records-list-consultations">
                        <p className="patient-records-list-consultations-label">Consultations</p>
                        <p className="patient-records-list-consultations-count">{patient.consultations.length}</p>
                      </div>
                      <ChevronRight className="patient-records-list-arrow" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <Card className="patient-records-empty">
              <CardContent className="patient-records-empty-content">
                <FileText className="patient-records-empty-icon" />
                <h3 className="patient-records-empty-title">No records found</h3>
                <p className="patient-records-empty-text">Try adjusting your search criteria.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PatientRecordsTab;