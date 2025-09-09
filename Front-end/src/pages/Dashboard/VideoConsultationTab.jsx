import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  Clock,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  MonitorSpeaker,
  User,
  Calendar,
  FileText,
  Save
} from 'lucide-react';
import { cn } from "../../components/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const VideoConsultationTab = () => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [vitals, setVitals] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    oxygenSaturation: "",
    respiratoryRate: ""
  });

  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  // Mock patient data for consultation
  const availablePatients = [
    {
      id: 1,
      name: "Emily Carter",
      age: 28,
      appointmentTime: "10:00 AM",
      condition: "Hypertension Follow-up",
      lastVitals: {
        bloodPressure: "130/85",
        heartRate: "72",
        temperature: "98.6°F",
        oxygenSaturation: "98%"
      }
    },
    {
      id: 2,
      name: "Michael Rodriguez", 
      age: 45,
      appointmentTime: "11:30 AM",
      condition: "Diabetes Consultation",
      lastVitals: {
        bloodPressure: "125/80",
        heartRate: "68",
        temperature: "98.4°F",
        oxygenSaturation: "97%"
      }
    },
    {
      id: 3,
      name: "Jennifer Liu",
      age: 32,
      appointmentTime: "2:15 PM",
      condition: "Asthma Check-up",
      lastVitals: {
        bloodPressure: "118/75",
        heartRate: "75",
        temperature: "98.7°F",
        oxygenSaturation: "96%"
      }
    }
  ];

  // Mock heart rate data for chart
  const heartRateData = [
    { time: '0s', rate: 72 },
    { time: '30s', rate: 75 },
    { time: '1m', rate: 73 },
    { time: '1.5m', rate: 77 },
    { time: '2m', rate: 74 },
    { time: '2.5m', rate: 76 },
    { time: '3m', rate: 72 }
  ];

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async (patient) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setSelectedPatient(patient);
      setIsCallActive(true);
      setIsVideoOn(true);
      setIsAudioOn(true);
      setSessionDuration(0);
      setConsultationNotes(`Video consultation with ${patient.name}\nCondition: ${patient.condition}\nStarted: ${new Date().toLocaleString()}\n\nNotes:\n`);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const handleEndCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    setIsCallActive(false);
    setIsVideoOn(false);
    setIsAudioOn(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTrack = videoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
  };

  const handleSaveConsultation = () => {
    const consultationData = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      date: new Date().toISOString(),
      duration: sessionDuration,
      notes: consultationNotes,
      diagnosis,
      prescription,
      vitals
    };
    
    console.log('Saving consultation:', consultationData);
    alert('Consultation record saved successfully!');
    
    // Reset form
    handleEndCall();
    setSelectedPatient(null);
    setConsultationNotes("");
    setDiagnosis("");
    setPrescription("");
    setVitals({
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: "",
      respiratoryRate: ""
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="video-consultation-container">
      {/* Header */}
      <div className="video-consultation-header">
        <div className="video-consultation-header-info">
          <h2 className="video-consultation-title">Video Consultation</h2>
          <p className="video-consultation-subtitle">Conduct virtual consultations with patients</p>
        </div>
        {isCallActive && selectedPatient && (
          <div className="video-consultation-status">
            <Badge className="video-consultation-live-badge">
              <div className="video-consultation-live-indicator" />
              Live with {selectedPatient.name}
            </Badge>
            <span className="video-consultation-duration">
              Duration: {formatDuration(sessionDuration)}
            </span>
          </div>
        )}
      </div>

      {!isCallActive ? (
        // Waiting Room - Patient Selection
        <div className="video-consultation-waiting-room">
          <Card className="video-consultation-card">
            <CardHeader>
              <CardTitle className="video-consultation-card-title">
                <Users className="video-consultation-card-icon" />
                Scheduled Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="video-consultation-patient-list">
                {availablePatients.map((patient) => (
                  <div 
                    key={patient.id}
                    className="video-consultation-patient-item"
                  >
                    <div className="video-consultation-patient-info">
                      <Avatar className="video-consultation-patient-avatar">
                        <AvatarFallback className="video-consultation-patient-avatar-fallback">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="video-consultation-patient-details">
                        <h3 className="video-consultation-patient-name">{patient.name}</h3>
                        <p className="video-consultation-patient-meta">Age: {patient.age} • {patient.condition}</p>
                        <div className="video-consultation-patient-time">
                          <Clock className="video-consultation-time-icon" />
                          <span className="video-consultation-time-text">Scheduled: {patient.appointmentTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="video-consultation-patient-actions">
                      <div className="video-consultation-patient-vitals">
                        <p className="video-consultation-vitals-label">Last Vitals:</p>
                        <div className="video-consultation-vitals-details">
                          <div className="video-consultation-vital-item">
                            <Heart className="video-consultation-vital-icon" />
                            {patient.lastVitals.heartRate} bpm
                          </div>
                          <div className="video-consultation-vital-item">
                            <Activity className="video-consultation-vital-icon" />
                            {patient.lastVitals.bloodPressure}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleStartCall(patient)}
                        className="video-consultation-start-btn"
                      >
                        <Video className="video-consultation-btn-icon" />
                        Start Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Card className="video-consultation-card">
            <CardHeader>
              <CardTitle className="video-consultation-card-title">Quick Start Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="video-consultation-quickstart-text">Start an unscheduled consultation or test your video setup</p>
              <Button 
                variant="outline" 
                className="video-consultation-test-btn"
                onClick={() => handleStartCall({ 
                  id: 'test', 
                  name: 'Test Patient', 
                  condition: 'Equipment Test',
                  age: 'N/A'
                })}
              >
                <Video className="video-consultation-btn-icon" />
                Test Video Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Active Consultation Interface
        <div className="video-consultation-active">
          {/* Video Call Area */}
          <Card className="video-consultation-main">
            <CardContent className="video-consultation-main-content">
              <div className="video-consultation-video-container">
                {isVideoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="video-consultation-video-feed"
                  />
                ) : (
                  <div className="video-consultation-video-off">
                    <div className="video-consultation-video-off-content">
                      <VideoOff className="video-consultation-video-off-icon" />
                      <h3 className="video-consultation-video-off-title">Camera is off</h3>
                      <p className="video-consultation-video-off-text">Click the camera button to turn on video</p>
                    </div>
                  </div>
                )}
                
                {/* Patient Info Overlay */}
                {selectedPatient && (
                  <div className="video-consultation-patient-overlay">
                    <h4 className="video-consultation-patient-overlay-name">{selectedPatient.name}</h4>
                    <p className="video-consultation-patient-overlay-condition">{selectedPatient.condition}</p>
                  </div>
                )}
                
                {/* Video Controls */}
                <div className="video-consultation-controls">
                  <Button
                    size="lg"
                    variant={isAudioOn ? "secondary" : "destructive"}
                    onClick={toggleAudio}
                    className="video-consultation-control-btn"
                  >
                    {isAudioOn ? <Mic className="video-consultation-control-icon" /> : <MicOff className="video-consultation-control-icon" />}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleEndCall}
                    className="video-consultation-end-btn"
                  >
                    <PhoneOff className="video-consultation-control-icon" />
                  </Button>
                  
                  <Button
                    size="lg"
                    variant={isVideoOn ? "secondary" : "destructive"}
                    onClick={toggleVideo}
                    className="video-consultation-control-btn"
                  >
                    {isVideoOn ? <Video className="video-consultation-control-icon" /> : <VideoOff className="video-consultation-control-icon" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Data Panel */}
          <div className="video-consultation-sidebar">
            {/* Patient Info */}
            <Card className="video-consultation-sidebar-card">
              <CardHeader className="video-consultation-sidebar-card-header">
                <CardTitle className="video-consultation-sidebar-card-title">
                  <User className="video-consultation-sidebar-card-icon" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPatient && (
                  <div className="video-consultation-patient-sidebar-info">
                    <p className="video-consultation-patient-sidebar-name">{selectedPatient.name}</p>
                    <p className="video-consultation-patient-sidebar-meta">Age: {selectedPatient.age}</p>
                    <p className="video-consultation-patient-sidebar-meta">{selectedPatient.condition}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Vitals */}
            <Card className="video-consultation-sidebar-card">
              <CardHeader className="video-consultation-sidebar-card-header">
                <CardTitle className="video-consultation-sidebar-card-title">
                  <MonitorSpeaker className="video-consultation-sidebar-card-icon" />
                  Live Vitals from Stethoscope
                </CardTitle>
              </CardHeader>
              <CardContent className="video-consultation-vitals-content">
                <div className="video-consultation-vitals-grid">
                  <div className="video-consultation-vital-display">
                    <Heart className="video-consultation-vital-display-icon" />
                    <div>
                      <p className="video-consultation-vital-label">Heart Rate</p>
                      <p className="video-consultation-vital-value">74 bpm</p>
                    </div>
                  </div>
                  <div className="video-consultation-vital-display">
                    <Activity className="video-consultation-vital-display-icon" />
                    <div>
                      <p className="video-consultation-vital-label">Blood Pressure</p>
                      <p className="video-consultation-vital-value">120/80</p>
                    </div>
                  </div>
                  <div className="video-consultation-vital-display">
                    <Thermometer className="video-consultation-vital-display-icon" />
                    <div>
                      <p className="video-consultation-vital-label">Temperature</p>
                      <p className="video-consultation-vital-value">98.6°F</p>
                    </div>
                  </div>
                  <div className="video-consultation-vital-display">
                    <Droplets className="video-consultation-vital-display-icon" />
                    <div>
                      <p className="video-consultation-vital-label">SpO2</p>
                      <p className="video-consultation-vital-value">98%</p>
                    </div>
                  </div>
                </div>
                
                {/* Heart Rate Chart */}
                <div className="video-consultation-chart-container">
                  <p className="video-consultation-chart-label">Heart Rate Trend</p>
                  <div className="video-consultation-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={heartRateData}>
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis domain={[60, 85]} tick={{ fontSize: 10 }} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <Tooltip />
                        <Line type="monotone" dataKey="rate" stroke="hsl(197, 89%, 48%)" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manual Vitals Input */}
            <Card className="video-consultation-sidebar-card">
              <CardHeader className="video-consultation-sidebar-card-header">
                <CardTitle className="video-consultation-sidebar-card-title">Manual Vitals Entry</CardTitle>
              </CardHeader>
              <CardContent className="video-consultation-vitals-input-content">
                <div className="video-consultation-vitals-input-grid">
                  <div className="video-consultation-vitals-input-group">
                    <Label className="video-consultation-vitals-input-label">Blood Pressure</Label>
                    <Input
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals(prev => ({...prev, bloodPressure: e.target.value}))}
                      placeholder="120/80"
                      className="video-consultation-vitals-input"
                    />
                  </div>
                  <div className="video-consultation-vitals-input-group">
                    <Label className="video-consultation-vitals-input-label">Heart Rate</Label>
                    <Input
                      value={vitals.heartRate}
                      onChange={(e) => setVitals(prev => ({...prev, heartRate: e.target.value}))}
                      placeholder="72 bpm"
                      className="video-consultation-vitals-input"
                    />
                  </div>
                  <div className="video-consultation-vitals-input-group">
                    <Label className="video-consultation-vitals-input-label">Temperature</Label>
                    <Input
                      value={vitals.temperature}
                      onChange={(e) => setVitals(prev => ({...prev, temperature: e.target.value}))}
                      placeholder="98.6°F"
                      className="video-consultation-vitals-input"
                    />
                  </div>
                  <div className="video-consultation-vitals-input-group">
                    <Label className="video-consultation-vitals-input-label">O2 Saturation</Label>
                    <Input
                      value={vitals.oxygenSaturation}
                      onChange={(e) => setVitals(prev => ({...prev, oxygenSaturation: e.target.value}))}
                      placeholder="98%"
                      className="video-consultation-vitals-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="video-consultation-sidebar-card">
              <CardHeader className="video-consultation-sidebar-card-header">
                <CardTitle className="video-consultation-sidebar-card-title">Consultation Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Take notes during consultation..."
                  className="video-consultation-notes-textarea"
                />
              </CardContent>
            </Card>

            {/* Diagnosis */}
            <Card className="video-consultation-sidebar-card">
              <CardHeader className="video-consultation-sidebar-card-header">
                <CardTitle className="video-consultation-sidebar-card-title">Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis..."
                  className="video-consultation-diagnosis-textarea"
                />
              </CardContent>
            </Card>

            {/* Prescription */}
            <Card className="video-consultation-sidebar-card">
              <CardHeader className="video-consultation-sidebar-card-header">
                <CardTitle className="video-consultation-sidebar-card-title">Prescription</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Enter prescription details..."
                  className="video-consultation-prescription-textarea"
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button 
              onClick={handleSaveConsultation}
              className="video-consultation-save-btn"
              disabled={!consultationNotes.trim()}
            >
              <Save className="video-consultation-save-icon" />
              Save Consultation Record
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultationTab;