import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
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
import { cn } from "../../../components/lib/utils";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Video Consultation</h2>
          <p className="text-muted-foreground">Conduct virtual consultations with patients</p>
        </div>
        {isCallActive && selectedPatient && (
          <div className="flex items-center gap-4">
            <Badge className="bg-medical-success text-white">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
              Live with {selectedPatient.name}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Duration: {formatDuration(sessionDuration)}
            </span>
          </div>
        )}
      </div>

      {!isCallActive ? (
        // Waiting Room - Patient Selection
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-medical-primary" />
                Scheduled Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {availablePatients.map((patient) => (
                  <div 
                    key={patient.id}
                    className="flex items-center justify-between p-4 bg-medical-card rounded-lg border border-border hover:bg-medical-card-hover transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-medical-primary text-white">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold text-foreground">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">Age: {patient.age} • {patient.condition}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-medical-primary" />
                          <span className="text-xs text-medical-primary">Scheduled: {patient.appointmentTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Last Vitals:</p>
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-medical-error" />
                            {patient.lastVitals.heartRate} bpm
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3 text-medical-primary" />
                            {patient.lastVitals.bloodPressure}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleStartCall(patient)}
                        className="bg-medical-success hover:bg-medical-success/90"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Start Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Start Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Start an unscheduled consultation or test your video setup</p>
              <Button 
                variant="outline" 
                className="border-medical-primary text-medical-primary hover:bg-medical-primary hover:text-white"
                onClick={() => handleStartCall({ 
                  id: 'test', 
                  name: 'Test Patient', 
                  condition: 'Equipment Test',
                  age: 'N/A'
                })}
              >
                <Video className="h-4 w-4 mr-2" />
                Test Video Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Active Consultation Interface
        <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-250px)]">
          {/* Video Call Area */}
          <Card className="lg:col-span-2 relative overflow-hidden shadow-elevated">
            <CardContent className="p-0 h-full">
              <div className="relative h-full">
                {isVideoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover bg-black"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-medical-primary to-medical-accent flex items-center justify-center">
                    <div className="text-center text-white">
                      <VideoOff className="h-20 w-20 mx-auto mb-4 opacity-60" />
                      <h3 className="text-xl font-semibold mb-2">Camera is off</h3>
                      <p className="text-sm opacity-80">Click the camera button to turn on video</p>
                    </div>
                  </div>
                )}
                
                {/* Patient Info Overlay */}
                {selectedPatient && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg">
                    <h4 className="font-semibold">{selectedPatient.name}</h4>
                    <p className="text-xs opacity-80">{selectedPatient.condition}</p>
                  </div>
                )}
                
                {/* Video Controls */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <Button
                    size="lg"
                    variant={isAudioOn ? "secondary" : "destructive"}
                    onClick={toggleAudio}
                    className="rounded-full w-14 h-14"
                  >
                    {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleEndCall}
                    className="rounded-full w-14 h-14 bg-medical-error hover:bg-medical-error/90"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    size="lg"
                    variant={isVideoOn ? "secondary" : "destructive"}
                    onClick={toggleVideo}
                    className="rounded-full w-14 h-14"
                  >
                    {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Data Panel */}
          <div className="space-y-4 overflow-y-auto">
            {/* Patient Info */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-medical-primary" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPatient && (
                  <div className="space-y-2">
                    <p className="font-medium">{selectedPatient.name}</p>
                    <p className="text-sm text-muted-foreground">Age: {selectedPatient.age}</p>
                    <p className="text-sm text-muted-foreground">{selectedPatient.condition}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Vitals */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MonitorSpeaker className="h-4 w-4 text-medical-primary" />
                  Live Vitals from Stethoscope
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-medical-error" />
                    <div>
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="font-semibold">74 bpm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-medical-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="font-semibold">120/80</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-status-pending" />
                    <div>
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-semibold">98.6°F</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-medical-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">SpO2</p>
                      <p className="font-semibold">98%</p>
                    </div>
                  </div>
                </div>
                
                {/* Heart Rate Chart */}
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Heart Rate Trend</p>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={heartRateData}>
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis domain={[60, 85]} tick={{ fontSize: 10 }} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <Tooltip />
                        <Line type="monotone" dataKey="rate" stroke="hsl(var(--medical-primary))" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manual Vitals Input */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Manual Vitals Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Blood Pressure</Label>
                    <Input
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals(prev => ({...prev, bloodPressure: e.target.value}))}
                      placeholder="120/80"
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Heart Rate</Label>
                    <Input
                      value={vitals.heartRate}
                      onChange={(e) => setVitals(prev => ({...prev, heartRate: e.target.value}))}
                      placeholder="72 bpm"
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Temperature</Label>
                    <Input
                      value={vitals.temperature}
                      onChange={(e) => setVitals(prev => ({...prev, temperature: e.target.value}))}
                      placeholder="98.6°F"
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">O2 Saturation</Label>
                    <Input
                      value={vitals.oxygenSaturation}
                      onChange={(e) => setVitals(prev => ({...prev, oxygenSaturation: e.target.value}))}
                      placeholder="98%"
                      className="text-xs h-8"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Consultation Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Take notes during consultation..."
                  className="min-h-[100px] text-xs"
                />
              </CardContent>
            </Card>

            {/* Diagnosis */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis..."
                  className="min-h-[60px] text-xs"
                />
              </CardContent>
            </Card>

            {/* Prescription */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Prescription</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Enter prescription details..."
                  className="min-h-[60px] text-xs"
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button 
              onClick={handleSaveConsultation}
              className="w-full bg-medical-primary hover:bg-medical-primary/90"
              disabled={!consultationNotes.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Consultation Record
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultationTab;