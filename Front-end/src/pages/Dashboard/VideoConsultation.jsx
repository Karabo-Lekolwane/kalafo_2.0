import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './VideoConsultation.css';
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

function VideoConsultation({ consultationId, patientId, doctorId, onEndCall }) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [healthData, setHealthData] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    oxygenSaturation: 98,
    temperature: 98.6,
    respiratoryRate: 16
  });
  const [heartRateHistory, setHeartRateHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('disconnected'); // disconnected, connecting, connected
  const [selectedBodyPart, setSelectedBodyPart] = useState('heart');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [sessionDuration, setSessionDuration] = useState(0);

  const { user } = useAuth();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
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

  // Simulate real-time health data updates
  useEffect(() => {
    if (isCallActive && isRecording) {
      const interval = setInterval(() => {
        // Simulate real-time health data based on selected body part
        const newHealthData = generateHealthData(selectedBodyPart);
        setHealthData(newHealthData);
        
        // Update heart rate history for chart
        setHeartRateHistory(prev => {
          const newHistory = [...prev, {
            time: new Date().toLocaleTimeString(),
            value: newHealthData.heartRate,
            bodyPart: selectedBodyPart
          }];
          return newHistory.slice(-20); // Keep last 20 readings
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCallActive, isRecording, selectedBodyPart]);

  const generateHealthData = (bodyPart) => {
    const baseData = {
      heartRate: 72 + Math.floor(Math.random() * 20) - 10,
      bloodPressure: '120/80',
      oxygenSaturation: 97 + Math.floor(Math.random() * 3),
      temperature: 98.6 + (Math.random() * 2 - 1),
      respiratoryRate: 16 + Math.floor(Math.random() * 8) - 4
    };

    // Adjust values based on body part being examined
    switch (bodyPart) {
      case 'heart':
        baseData.heartRate = 70 + Math.floor(Math.random() * 30);
        break;
      case 'lungs':
        baseData.respiratoryRate = 14 + Math.floor(Math.random() * 10);
        baseData.oxygenSaturation = 96 + Math.floor(Math.random() * 4);
        break;
      case 'throat':
        baseData.temperature = 99 + Math.random() * 2;
        break;
      default:
        break;
    }

    return baseData;
  };

  const startCall = async (patient = null) => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });

      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      setIsCallActive(true);
      setDeviceStatus('connected');
      
      if (patient) {
        setSelectedPatient(patient);
        setConsultationNotes(`Video consultation with ${patient.name}\nCondition: ${patient.condition}\nStarted: ${new Date().toLocaleString()}\n\nNotes:\n`);
      }
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
      
      console.log('Video call started');
    } catch (error) {
      console.error('Error starting video call:', error);
      alert('Error accessing camera/microphone. Please check permissions.');
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    setIsCallActive(false);
    setIsRecording(false);
    setDeviceStatus('disconnected');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (onEndCall) {
      onEndCall();
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const startHealthMonitoring = () => {
    setIsRecording(true);
    console.log('Started health monitoring for:', selectedBodyPart);
  };

  const stopHealthMonitoring = () => {
    setIsRecording(false);
    console.log('Stopped health monitoring');
  };

  const getHeartRateStatus = (rate) => {
    if (rate < 60) return { status: 'low', color: '#3498db' };
    if (rate > 100) return { status: 'high', color: '#e74c3c' };
    return { status: 'normal', color: '#27ae60' };
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveConsultation = () => {
    const consultationData = {
      patientId: selectedPatient ? selectedPatient.id : patientId,
      patientName: selectedPatient ? selectedPatient.name : "Unknown Patient",
      date: new Date().toISOString(),
      duration: sessionDuration,
      notes: consultationNotes,
      diagnosis,
      prescription,
      vitals: healthData
    };
    
    console.log('Saving consultation:', consultationData);
    alert('Consultation record saved successfully!');
    
    // Reset form
    endCall();
    setSelectedPatient(null);
    setConsultationNotes("");
    setDiagnosis("");
    setPrescription("");
    setHealthData({
      heartRate: 72,
      bloodPressure: '120/80',
      oxygenSaturation: 98,
      temperature: 98.6,
      respiratoryRate: 16
    });
  };

  const heartRateStatus = getHeartRateStatus(healthData.heartRate);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // If we have patient selection UI (for doctors)
  if (user?.role === 'doctor' && !isCallActive) {
    return (
      <div className="video-consultation">
        <div className="consultation-header">
          <h2>🩺 Live Consultation</h2>
          <div className="consultation-info">
            <span>Select a patient to begin consultation</span>
          </div>
        </div>

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
                        <p className="video-consultation-patient-meta">Age: {patient.age}</p>
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
                        onClick={() => startCall(patient)}
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
        </div>
      </div>
    );
  }

  // Main consultation UI
  return (
    <div className="video-consultation">
      <div className="consultation-header">
        <h2>🩺 Live Consultation</h2>
        <div className="consultation-info">
          <span>Patient ID: {selectedPatient ? selectedPatient.id : patientId}</span>
          <span>Session: {consultationId}</span>
          {isCallActive && (
            <span>Duration: {formatDuration(sessionDuration)}</span>
          )}
          <div className={`device-status ${deviceStatus}`}>
            <span className="status-indicator"></span>
            {deviceStatus === 'connected' ? 'Devices Connected' : 'Devices Disconnected'}
          </div>
        </div>
      </div>

      <div className="consultation-main">
        {/* Video Section */}
        <div className="video-section">
          <div className="video-container">
            <div className="remote-video">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="video-element"
              />
              <div className="video-label">
                {user?.role === 'doctor' ? (selectedPatient ? selectedPatient.name : 'Patient') : 'Doctor'}
              </div>
            </div>
            
            <div className="local-video">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="video-element"
              />
              <div className="video-label">You</div>
            </div>
          </div>

          <div className="video-controls">
            {!isCallActive ? (
              <button className="control-btn start-call" onClick={() => startCall()}>
                📹 {user?.role === 'doctor' ? 'Start Consultation' : 'Join Call'}
              </button>
            ) : (
              <>
                <button 
                  className={`control-btn ${isMuted ? 'muted' : ''}`}
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                
                <button 
                  className={`control-btn ${!isVideoOn ? 'video-off' : ''}`}
                  onClick={toggleVideo}
                >
                  {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
                
                <button className="control-btn end-call" onClick={endCall}>
                  <PhoneOff size={20} /> End Call
                </button>
              </>
            )}
          </div>
        </div>

        {/* Health Monitoring Section */}
        <div className="health-monitoring-section">
          <div className="monitoring-header">
            <h3>🫀 Real-time Health Monitoring</h3>
            <div className="body-part-selector">
              <label>Examination Area:</label>
              <select 
                value={selectedBodyPart} 
                onChange={(e) => setSelectedBodyPart(e.target.value)}
                disabled={!isCallActive}
              >
                <option value="heart">❤️ Heart</option>
                <option value="lungs">🫁 Lungs</option>
                <option value="throat">🗣️ Throat</option>
                <option value="abdomen">🤰 Abdomen</option>
              </select>
            </div>
          </div>

          {/* Current Vitals */}
          <div className="current-vitals">
            <div className="vital-card primary">
              <div className="vital-icon">💓</div>
              <div className="vital-info">
                <div className="vital-label">Heart Rate</div>
                <div 
                  className="vital-value"
                  style={{ color: heartRateStatus.color }}
                >
                  {healthData.heartRate} BPM
                </div>
                <div className="vital-status">{heartRateStatus.status}</div>
              </div>
            </div>

            <div className="vital-card">
              <div className="vital-icon">🩸</div>
              <div className="vital-info">
                <div className="vital-label">Blood Pressure</div>
                <div className="vital-value">{healthData.bloodPressure}</div>
              </div>
            </div>

            <div className="vital-card">
              <div className="vital-icon">💨</div>
              <div className="vital-info">
                <div className="vital-label">Oxygen Sat</div>
                <div className="vital-value">{healthData.oxygenSaturation}%</div>
              </div>
            </div>

            <div className="vital-card">
              <div className="vital-icon">🌡️</div>
              <div className="vital-info">
                <div className="vital-label">Temperature</div>
                <div className="vital-value">{healthData.temperature.toFixed(1)}°F</div>
              </div>
            </div>
          </div>

          {/* Real-time Chart */}
          <div className="real-time-chart">
            <div className="chart-header">
              <h4>📈 Live Heart Rate Monitor</h4>
              <div className="recording-controls">
                {!isRecording ? (
                  <button 
                    className="record-btn start"
                    onClick={startHealthMonitoring}
                    disabled={!isCallActive}
                  >
                    🔴 Start Monitoring
                  </button>
                ) : (
                  <button className="record-btn stop" onClick={stopHealthMonitoring}>
                    ⏹️ Stop Monitoring
                  </button>
                )}
              </div>
            </div>
            
            <div className="chart-container">
              {isRecording ? (
                <div className="heart-rate-chart">
                  <div className="chart-grid">
                    {heartRateHistory.map((reading, index) => (
                      <div 
                        key={index}
                        className="chart-bar"
                        style={{
                          height: `${(reading.value / 120) * 100}%`,
                          backgroundColor: getHeartRateStatus(reading.value).color
                        }}
                      >
                        <span className="bar-value">{reading.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="chart-labels">
                    <span>Time: {new Date().toLocaleTimeString()}</span>
                    <span>Area: {selectedBodyPart}</span>
                  </div>
                </div>
              ) : (
                <div className="chart-placeholder">
                  <p>📊 Start monitoring to see real-time data</p>
                  <small>Place stethoscope on patient's {selectedBodyPart} area</small>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="monitoring-instructions">
            <h4>📋 Instructions</h4>
            <div className="instruction-steps">
              <div className="step">
                <span className="step-number">1</span>
                <span>Ensure stethoscope is connected and positioned on {selectedBodyPart}</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span>Click "Start Monitoring" to begin real-time data collection</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span>Monitor live readings and communicate findings with patient</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Notes */}
      <div className="consultation-notes">
        <h3>📝 Consultation Notes</h3>
        <Textarea
          value={consultationNotes}
          onChange={(e) => setConsultationNotes(e.target.value)}
          placeholder="Record your observations and notes here..."
          rows={6}
        />
      </div>

      {/* Emergency Controls */}
      {user?.role === 'doctor' && (
        <div className="emergency-controls">
          <button className="emergency-btn">
            🚨 Emergency Protocol
          </button>
          <button className="emergency-btn" onClick={handleSaveConsultation}>
            📝 Save Session Notes
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoConsultation;