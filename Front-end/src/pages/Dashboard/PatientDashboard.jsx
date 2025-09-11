import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  Video, 
  FileText, 
  Heart,
  Activity,
  Clock,
  Search,
  Bell,
  Settings,
  LogOut,
  Plus,
  Eye,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  ScreenShare,
  X
} from 'lucide-react';
import './Patient.css';

// VideoConsultation Component (defined inline)
const VideoConsultation = ({ consultationId, patientId, doctorId, doctorName, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  const localVideoRef = useRef(null);
  const callTimerRef = useRef(null);

  useEffect(() => {
    // Initialize video call simulation
    initializeCall();
    
    // Start call timer
    callTimerRef.current = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    
    // Cleanup on component unmount
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [consultationId]);

  const initializeCall = async () => {
    try {
      console.log(`Initializing call for consultation ${consultationId}`);
      
      // Get user media (camera and microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Simulate connection after a brief delay
      setTimeout(() => {
        setIsConnected(true);
        console.log('Call connected successfully');
      }, 1500);
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      // Fallback to simulated video for demo purposes
      setTimeout(() => {
        setIsConnected(true);
        console.log('Using simulated video call');
      }, 1500);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-consultation-container">
      {/* Header */}
      <div className="video-consultation-header">
        <div>
          <h2>Video Consultation with {doctorName}</h2>
          <p>Consultation ID: {consultationId} • {isConnected ? 'Connected' : 'Connecting...'} • {formatCallTime(callTime)}</p>
        </div>
        <button onClick={onEndCall} className="video-consultation-close">
          <X size={24} />
        </button>
      </div>

      {/* Video Content */}
      <div className="video-consultation-content">
        {/* Main Video Area */}
        <div className="video-main">
          <div className="video-feed">
            {isConnected ? (
              <div className="video-connected">
                <div className="doctor-video">
                  <div className="video-placeholder">
                    <VideoIcon size={48} />
                    <p>Dr. {doctorName}</p>
                  </div>
                </div>
                <div className="patient-video-preview">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className={isVideoOff ? 'video-disabled' : ''}
                  />
                  {isVideoOff && (
                    <div className="video-off-overlay">
                      <VideoOff size={24} />
                      <p>Video is off</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="video-connecting">
                <div className="loading-spinner">Connecting...</div>
                <p>Setting up your consultation with Dr. {doctorName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="video-controls">
          <button 
            className={`control-button ${isMuted ? 'control-button-muted' : ''}`}
            onClick={toggleMute}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
          
          <button 
            className={`control-button ${isVideoOff ? 'control-button-video-off' : ''}`}
            onClick={toggleVideo}
          >
            {isVideoOff ? <VideoOff size={20} /> : <VideoIcon size={20} />}
            <span>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
          </button>
          
          <button 
            className="control-button control-button-end"
            onClick={onEndCall}
          >
            <Phone size={20} style={{ transform: 'rotate(135deg)' }} />
            <span>End Call</span>
          </button>
        </div>

        {/* Consultation Info */}
        <div className="consultation-info">
          <h3>Consultation Notes</h3>
          <div className="consultation-notes">
            <p>Discuss your symptoms and concerns with the doctor.</p>
            <p>Please describe:</p>
            <ul>
              <li>Your main symptoms</li>
              <li>When they started</li>
              <li>Any medications you're taking</li>
              <li>Other health concerns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main PatientDashboard Component
function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInVideoTest, setIsInVideoTest] = useState(false);
  const [videoTestSettings, setVideoTestSettings] = useState({
    audio: true,
    video: true,
    screenShare: false
  });
  
  // Video consultation state
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [isInConsultation, setIsInConsultation] = useState(false);

  const { logout, user, apiCall } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiCall('/dashboard/patient');
        const data = await response.json();
        
        if (response.ok) {
          setDashboardData(data);
        } else {
          // Create mock data if API endpoint doesn't exist yet
          setError('Using demo data - patient API endpoint not available yet');
          const mockData = {
            upcoming_consultations: [
              {
                id: 1,
                doctor_id: 2,
                doctor_name: 'Dr. John Smith',
                doctor_specialty: 'Cardiologist',
                doctor_avatar: null,
                scheduled_time: new Date(Date.now() + 86400000).toISOString(),
                status: 'scheduled',
                notes: 'Follow-up consultation for blood pressure monitoring'
              },
              {
                id: 2,
                doctor_id: 3,
                doctor_name: 'Dr. Tebogo Tebogo',
                doctor_specialty: 'General Physician',
                doctor_avatar: null,
                scheduled_time: new Date(Date.now() + 2 * 86400000).toISOString(),
                status: 'scheduled',
                notes: 'Regular health checkup'
              }
            ],
            past_consultations: [
              {
                id: 3,
                doctor_id: 2,
                doctor_name: 'Dr. John Smith',
                doctor_specialty: 'Cardiologist',
                scheduled_time: new Date(Date.now() - 7 * 86400000).toISOString(),
                status: 'completed',
                diagnosis: 'Hypertension - Stage 1',
                notes: 'Blood pressure elevated. Prescribed lifestyle changes and monitoring.',
                prescription: 'Low sodium diet, regular exercise, blood pressure monitoring'
              }
            ],
            health_vitals: {
              latest_readings: {
                blood_pressure: '128/82',
                heart_rate: 72,
                weight: '75 kg',
                temperature: '98.6°F',
                last_updated: new Date(Date.now() - 2 * 86400000).toISOString()
              },
              trends: {
                blood_pressure_trend: 'improving',
                weight_trend: 'stable',
                heart_rate_trend: 'normal'
              }
            },
            doctors: [
              {
                id: 1,
                name: 'Dr. Sarah Johnson',
                specialty: 'General Physician',
                rating: 4.8,
                reviews: 124,
                avatar: null,
                next_available: 'Tomorrow, 10:00 AM'
              },
              {
                id: 2,
                name: 'Dr. John Smith',
                specialty: 'Cardiologist',
                rating: 4.9,
                reviews: 89,
                avatar: null,
                next_available: 'Today, 3:00 PM'
              },
              {
                id: 3,
                name: 'Dr. Tebogo Tebogo',
                specialty: 'Pediatrician',
                rating: 4.7,
                reviews: 67,
                avatar: null,
                next_available: 'Friday, 11:30 AM'
              }
            ]
          };
          setDashboardData(mockData);
        }
      } catch (err) {
        // Use mock data as fallback and set error message
        const mockData = {
          upcoming_consultations: [
            {
              id: 1,
              doctor_id: 2,
              doctor_name: 'Dr. John Smith',
              doctor_specialty: 'Cardiologist',
              scheduled_time: new Date().toISOString(),
              status: 'scheduled',
              notes: 'Demo consultation - click Join Call to test'
            }
          ],
          past_consultations: [],
          health_vitals: {
            latest_readings: {
              blood_pressure: '120/80',
              heart_rate: 72,
              weight: 'Not recorded',
              temperature: 'Not recorded',
              last_updated: null
            }
          },
          doctors: [
            {
              id: 1,
              name: 'Dr. Sarah Johnson',
              specialty: 'General Physician',
              rating: 4.8,
              reviews: 124,
              avatar: null,
              next_available: 'Tomorrow, 10:00 AM'
            }
          ]
        };
        setDashboardData(mockData);
        setError('Using demo data - connect to backend for real data');
        console.log('Using mock data for patient dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiCall]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Video consultation handlers
  const joinConsultation = (consultation) => {
    console.log('🎥 Joining consultation:', consultation);
    setActiveConsultation({
      id: consultation.id,
      patientId: user.id,
      doctorId: consultation.doctor_id,
      doctorName: consultation.doctor_name,
      scheduledTime: consultation.scheduled_time
    });
    setIsInConsultation(true);
  };

  const endConsultation = () => {
    setIsInConsultation(false);
    setActiveConsultation(null);
  };

  // If in video consultation, show the video interface
  if (isInConsultation && activeConsultation) {
    return (
      <VideoConsultation
        consultationId={activeConsultation.id}
        patientId={activeConsultation.patientId}
        doctorId={activeConsultation.doctorId}
        doctorName={activeConsultation.doctorName}
        onEndCall={endConsultation}
      />
    );
  }

  const handleBookAppointment = () => {
    alert('Appointment booking feature will be implemented here');
  };

  const handleVideoTest = () => {
    setIsInVideoTest(true);
  };

  if (loading) {
    return (
      <div className="dashboard patient-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard patient-dashboard">
        <div className="error-container">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const upcomingConsultations = dashboardData?.upcoming_consultations || [];
  const pastConsultations = dashboardData?.past_consultations || [];
  const healthVitals = dashboardData?.health_vitals || {};
  const latestReadings = healthVitals.latest_readings || {};
  const doctors = dashboardData?.doctors || [];

  const todayConsultations = upcomingConsultations.filter(c => 
    new Date(c.scheduled_time).toDateString() === new Date().toDateString()
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'doctors':
        return renderDoctorsTab();
      case 'records':
        return renderRecordsTab();
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="overview-container">
      {/* Dashboard Stats */}
      <div className="overview-stats-grid">
        <div className="overview-stat-card overview-stat-card-primary">
          <div className="overview-stat-card-content">
            <div>
              <p className="overview-stat-label">Today's Appointments</p>
              <p className="overview-stat-value">{todayConsultations.length}</p>
            </div>
            <Calendar className="overview-stat-icon" />
          </div>
        </div>

        <div className="overview-stat-card overview-stat-card-secondary">
          <div className="overview-stat-card-content">
            <div>
              <p className="overview-stat-label">Upcoming Appointments</p>
              <p className="overview-stat-value">{upcomingConsultations.length}</p>
            </div>
            <Clock className="overview-stat-icon" />
          </div>
        </div>

        <div className="overview-stat-card overview-stat-card-active">
          <div className="overview-stat-card-content">
            <div>
              <p className="overview-stat-label">Heart Rate</p>
              <p className="overview-stat-value">{latestReadings.heart_rate || '--'}</p>
            </div>
            <Heart className="overview-stat-icon" />
          </div>
        </div>

        <div className="overview-stat-card overview-stat-card-pending">
          <div className="overview-stat-card-content">
            <div>
              <p className="overview-stat-label">Blood Pressure</p>
              <p className="overview-stat-value">{latestReadings.blood_pressure || '--/--'}</p>
            </div>
            <Activity className="overview-stat-icon" />
          </div>
        </div>
      </div>

      <div className="overview-content-grid">
        {/* Today's Appointments */}
        {todayConsultations.length > 0 && (
          <div className="overview-appointments-card">
            <div className="overview-card-header">
              <h3 className="overview-card-title">Today's Appointments</h3>
            </div>
            <div className="overview-card-content">
              <div className="overview-appointments-list">
                {todayConsultations
                  .sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time))
                  .map((appointment) => (
                    <div key={appointment.id} className="overview-appointment-item">
                      <div className="overview-appointment-left">
                        <div className="overview-appointment-icon">
                          <Clock style={{ width: '1rem', height: '1rem' }} />
                        </div>
                        <div>
                          <h4 className="overview-appointment-patient">{appointment.doctor_name}</h4>
                          <p className="overview-appointment-type">{appointment.notes}</p>
                        </div>
                      </div>
                      <div className="overview-appointment-right">
                        <p className="overview-appointment-time">
                          {new Date(appointment.scheduled_time).toLocaleTimeString([], {
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </p>
                        <button 
                          className="overview-action-btn overview-action-btn-primary"
                          onClick={() => joinConsultation(appointment)}
                        >
                          <Video style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                          Join Call
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="overview-quick-actions-card">
          <div className="overview-card-header">
            <h3 className="overview-card-title">Quick Actions</h3>
          </div>
          <div className="overview-quick-actions-content">
            <button 
              className="overview-action-btn overview-action-btn-primary"
              onClick={() => setActiveTab('doctors')}
            >
              <Users style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Find Doctors
            </button>
            <button 
              className="overview-action-btn overview-action-btn-outline overview-action-btn-secondary"
              onClick={handleBookAppointment}
            >
              <Calendar style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              Book Appointment
            </button>
            <button 
              className="overview-action-btn overview-action-btn-outline overview-action-btn-accent"
              onClick={() => setActiveTab('records')}
            >
              <FileText style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
              My Records
            </button>
          </div>
        </div>
      </div>

      {/* Health Vitals */}
      <div className="overview-recent-patients-card">
        <div className="overview-card-header">
          <h3 className="overview-card-title">Health Vitals</h3>
        </div>
        <div className="overview-card-content">
          <div className="overview-recent-patients-grid">
            <div className="overview-patient-item">
              <div className="overview-patient-avatar">
                <Heart style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              <div className="overview-patient-info">
                <h4 className="overview-patient-name">Heart Rate</h4>
                <p className="overview-patient-age">{latestReadings.heart_rate || '--'} BPM</p>
              </div>
            </div>
            
            <div className="overview-patient-item">
              <div className="overview-patient-avatar">
                <Activity style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              <div className="overview-patient-info">
                <h4 className="overview-patient-name">Blood Pressure</h4>
                <p className="overview-patient-age">{latestReadings.blood_pressure || '--/--'}</p>
              </div>
            </div>
            
            <div className="overview-patient-item">
              <div className="overview-patient-avatar">
                <Activity style={{ width: '1.5rem', height: '1.5rem' }} />
              </div>
              <div className="overview-patient-info">
                <h4 className="overview-patient-name">Weight</h4>
                <p className="overview-patient-age">{latestReadings.weight || '--'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      {upcomingConsultations.length > 0 && (
        <div className="overview-recent-patients-card">
          <div className="overview-card-header">
            <h3 className="overview-card-title">Upcoming Appointments</h3>
          </div>
          <div className="overview-card-content">
            <div className="overview-appointments-list">
              {upcomingConsultations.map((appointment) => (
                <div key={appointment.id} className="overview-appointment-item">
                  <div className="overview-appointment-left">
                    <div className="overview-appointment-icon">
                      <Clock style={{ width: '1rem', height: '1rem' }} />
                    </div>
                    <div>
                      <h4 className="overview-appointment-patient">{appointment.doctor_name}</h4>
                      <p className="overview-appointment-type">{appointment.notes}</p>
                    </div>
                  </div>
                  <div className="overview-appointment-right">
                    <p className="overview-appointment-time">
                      {new Date(appointment.scheduled_time).toLocaleDateString()}
                    </p>
                    <p className="overview-appointment-duration">
                      {new Date(appointment.scheduled_time).toLocaleTimeString([], {
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDoctorsTab = () => (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <div>
          <h2 className="patient-list-title">Our Doctors</h2>
          <p className="patient-list-subtitle">Find and connect with healthcare professionals</p>
        </div>
        <div className="dashboard-search-container">
          <Search className="dashboard-search-icon" />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dashboard-search-input"
          />
        </div>
      </div>

      <div className="patient-list-grid">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="patient-card">
            <div className="patient-card-content">
              <div className="patient-card-header">
                <div className="patient-card-main-info">
                  <div className="patient-avatar patient-avatar-fallback">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="patient-details">
                    <div className="patient-name-container">
                      <h3 className="patient-name">{doctor.name}</h3>
                      <span className="patient-status patient-status-stable">
                        {doctor.specialty}
                      </span>
                    </div>
                    <div className="patient-demographics">
                      ⭐ {doctor.rating} • {doctor.reviews} reviews
                    </div>
                    <div className="patient-info-grid">
                      <div className="patient-info-section">
                        <p className="patient-info-title">Next Available</p>
                        <p className="patient-info-text">{doctor.next_available}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="patient-actions">
                <button className="patient-action-view">
                  <Eye className="patient-action-icon" />
                  View Profile
                </button>
                <button className="patient-action-schedule" onClick={handleBookAppointment}>
                  <Calendar className="patient-action-icon" />
                  Book Appointment
                </button>
                <button className="patient-action-contact">
                  <Video className="patient-action-icon" />
                  Video Consult
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecordsTab = () => (
    <div className="patient-records-container">
      <div className="patient-records-main-header">
        <div>
          <h2 className="patient-records-main-title">Medical Records</h2>
          <p className="patient-records-main-subtitle">Your complete health history</p>
        </div>
      </div>

      <div className="overview-content-grid">
        {/* Personal Information */}
        <div className="overview-appointments-card">
          <div className="overview-card-header">
            <h3 className="overview-card-title">Personal Information</h3>
          </div>
          <div className="overview-card-content">
            <div className="patient-info-grid">
              <div className="patient-info-section">
                <p className="patient-info-title">Full Name</p>
                <p className="patient-info-text">{user?.first_name} {user?.last_name}</p>
              </div>
              <div className="patient-info-section">
                <p className="patient-info-title">Date of Birth</p>
                <p className="patient-info-text">January 15, 1985</p>
              </div>            
            </div>
          </div>
        </div>

        {/* Health Summary */}
        <div className="overview-quick-actions-card">
          <div className="overview-card-header">
            <h3 className="overview-card-title">Health Summary</h3>
          </div>
          <div className="overview-card-content">
            <div className="patient-info-list">
              <div className="patient-info-item">
                <span className="patient-info-label">Last Consultation:</span>
                <span>January 15, 2024</span>
              </div>
              <div className="patient-info-item">
                <span className="patient-info-label">Primary Doctor:</span>
                <span>Dr. Sarah Johnson</span>
              </div>              
              <div className="patient-info-item">
                <span className="patient-info-label">Last Updated:</span>
                <span>January 20, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation History */}
      <div className="overview-recent-patients-card">
        <div className="overview-card-header">
          <h3 className="overview-card-title">Consultation History</h3>
        </div>
        <div className="overview-card-content">
          {pastConsultations.length > 0 ? (
            <div className="overview-appointments-list">
              {pastConsultations.map((consultation) => (
                <div key={consultation.id} className="overview-appointment-item">
                  <div className="overview-appointment-left">
                    <div className="overview-appointment-icon">
                      <FileText style={{ width: '1rem', height: '1rem' }} />
                    </div>
                    <div>
                      <h4 className="overview-appointment-patient">{consultation.doctor_name}</h4>
                      <p className="overview-appointment-type">{consultation.diagnosis}</p>
                    </div>
                  </div>
                  <div className="overview-appointment-right">
                    <p className="overview-appointment-time">
                      {new Date(consultation.scheduled_time).toLocaleDateString()}
                    </p>
                    <p className="overview-appointment-duration">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No past consultations found.</p>
          )}
        </div>
      </div>
    </div>
  );

  const VideoTestModal = () => (
    <div className="video-test-modal-overlay">
      <div className="video-test-modal">
        <div className="video-test-header">
          <h3>Video Call Test</h3>
          <button onClick={() => setIsInVideoTest(false)} className="video-test-close">
            <X size={20} />
          </button>
        </div>
        
        <div className="video-test-content">
          <div className="video-preview">
            <div className="video-feed">
              <div className="video-placeholder">
                <VideoIcon size={48} />
                <p>Video preview</p>
              </div>
            </div>
            
            <div className="video-controls-panel">
              <button 
                className={`control-btn ${videoTestSettings.audio ? 'active' : ''}`}
                onClick={() => setVideoTestSettings({...videoTestSettings, audio: !videoTestSettings.audio})}
              >
                {videoTestSettings.audio ? <Mic size={20} /> : <MicOff size={20} />}
                <span>{videoTestSettings.audio ? 'Mute' : 'Unmute'}</span>
              </button>
              
              <button 
                className={`control-btn ${videoTestSettings.video ? 'active' : ''}`}
                onClick={() => setVideoTestSettings({...videoTestSettings, video: !videoTestSettings.video})}
              >
                {videoTestSettings.video ? <VideoIcon size={20} /> : <VideoOff size={20} />}
                <span>{videoTestSettings.video ? 'Stop Video' : 'Start Video'}</span>
              </button>
              
              <button 
                className={`control-btn ${videoTestSettings.screenShare ? 'active' : ''}`}
                onClick={() => setVideoTestSettings({...videoTestSettings, screenShare: !videoTestSettings.screenShare})}
              >
                <ScreenShare size={20} />
                <span>{videoTestSettings.screenShare ? 'Stop Sharing' : 'Share Screen'}</span>
              </button>
            </div>
          </div>
          
          <div className="video-test-info">
            <h4>Test your audio and video</h4>
            <p>Make sure your microphone, camera, and speakers are working properly before joining a consultation.</p>
            
            <div className="device-settings">
              <div className="device-setting">
                <label>Microphone</label>
                <select defaultValue="default">
                  <option value="default">Default Microphone</option>
                  <option value="mic2">External Microphone</option>
                </select>
              </div>
              
              <div className="device-setting">
                <label>Camera</label>
                <select defaultValue="default">
                  <option value="default">Default Camera</option>
                  <option value="camera2">External Camera</option>
                </select>
              </div>
              
              <div className="device-setting">
                <label>Speakers</label>
                <select defaultValue="default">
                  <option value="default">Default Speakers</option>
                  <option value="speakers2">External Speakers</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="video-test-actions">
          <button className="btn-primary" onClick={() => setIsInVideoTest(false)}>
            Complete Test
          </button>
          <button className="btn-outline" onClick={() => setVideoTestSettings({ audio: true, video: true, screenShare: false })}>
            Reset Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-min-height">
      {/* Enhanced Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <div className="dashboard-header-logo">
              <div className="dashboard-logo-icon">
                <Stethoscope style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
              </div>
              <div>
                <h1 className="dashboard-title">Kalafo Medical</h1>
                <p className="dashboard-subtitle">Digital Stethoscope Platform</p>
              </div>
            </div>
            
            {/* Welcome Message */}
            <div className="dashboard-welcome">
              <p className="dashboard-welcome-text">Welcome, <span style={{ fontWeight: '600' }}>{user?.first_name} {user?.last_name}</span></p>
              <p className="dashboard-welcome-subtext">Your health is our priority</p>
            </div>
          </div>

          <div className="dashboard-header-right">
            {/* Enhanced Search */}
            <div className="dashboard-search-container">
              <Search className="dashboard-search-icon" />
              <input
                type="text"
                placeholder="Search doctors, appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dashboard-search-input"
              />
            </div>

            {/* Notifications with Badge */}
            <button className="dashboard-notification-btn">
              <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
              <span className="dashboard-notification-badge">3</span>
            </button>

            {/* Enhanced Patient Profile */}
            <div className="dashboard-profile-section">
              <div className="dashboard-profile-info">
                <p className="dashboard-profile-name">{user?.first_name} {user?.last_name}</p>
                <p className="dashboard-profile-status">Patient • Online</p>
              </div>
              <div className="dashboard-avatar">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <button className="dashboard-settings-btn" onClick={handleLogout}>
                <LogOut style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-flex-container">
        {/* Enhanced Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-content">
            <div className="dashboard-sidebar-header">
              <h2 className="dashboard-sidebar-title">Patient Portal</h2>
              <div className="dashboard-sidebar-header-underline"></div>
            </div>

            <nav className="dashboard-sidebar-nav">
              <button 
                className={`dashboard-sidebar-item ${activeTab === 'overview' ? 'dashboard-sidebar-item-active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <div className="dashboard-sidebar-item-content">
                  <div className={`dashboard-sidebar-icon-container ${activeTab === 'overview' ? 'dashboard-sidebar-icon-active' : ''}`}>
                    <Activity className="dashboard-sidebar-icon" />
                  </div>
                  <div className="dashboard-sidebar-text">
                    <p className={`dashboard-sidebar-label ${activeTab === 'overview' ? 'dashboard-sidebar-label-active' : ''}`}>
                      Overview
                    </p>
                    <p className={`dashboard-sidebar-description ${activeTab === 'overview' ? 'dashboard-sidebar-description-active' : ''}`}>
                      Dashboard summary
                    </p>
                  </div>
                </div>
              </button>

              <button 
                className={`dashboard-sidebar-item ${activeTab === 'doctors' ? 'dashboard-sidebar-item-active' : ''}`}
                onClick={() => setActiveTab('doctors')}
              >
                <div className="dashboard-sidebar-item-content">
                  <div className={`dashboard-sidebar-icon-container ${activeTab === 'doctors' ? 'dashboard-sidebar-icon-active' : ''}`}>
                    <Users className="dashboard-sidebar-icon" />
                  </div>
                  <div className="dashboard-sidebar-text">
                    <p className={`dashboard-sidebar-label ${activeTab === 'doctors' ? 'dashboard-sidebar-label-active' : ''}`}>
                      Doctors
                    </p>
                    <p className={`dashboard-sidebar-description ${activeTab === 'doctors' ? 'dashboard-sidebar-description-active' : ''}`}>
                      Find healthcare providers
                    </p>
                  </div>
                </div>
              </button>

              <button 
                className={`dashboard-sidebar-item ${activeTab === 'records' ? 'dashboard-sidebar-item-active' : ''}`}
                onClick={() => setActiveTab('records')}
              >
                <div className="dashboard-sidebar-item-content">
                  <div className={`dashboard-sidebar-icon-container ${activeTab === 'records' ? 'dashboard-sidebar-icon-active' : ''}`}>
                    <FileText className="dashboard-sidebar-icon" />
                  </div>
                  <div className="dashboard-sidebar-text">
                    <p className={`dashboard-sidebar-label ${activeTab === 'records' ? 'dashboard-sidebar-label-active' : ''}`}>
                      Medical Records
                    </p>
                    <p className={`dashboard-sidebar-description ${activeTab === 'records' ? 'dashboard-sidebar-description-active' : ''}`}>
                      Your health history
                    </p>
                  </div>
                </div>
              </button>

              <button 
                className={`dashboard-sidebar-item ${activeTab === 'appointments' ? 'dashboard-sidebar-item-active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                <div className="dashboard-sidebar-item-content">
                  <div className={`dashboard-sidebar-icon-container ${activeTab === 'appointments' ? 'dashboard-sidebar-icon-active' : ''}`}>
                    <Calendar className="dashboard-sidebar-icon" />
                  </div>
                  <div className="dashboard-sidebar-text">
                    <p className={`dashboard-sidebar-label ${activeTab === 'appointments' ? 'dashboard-sidebar-label-active' : ''}`}>
                      Appointments
                    </p>
                    <p className={`dashboard-sidebar-description ${activeTab === 'appointments' ? 'dashboard-sidebar-description-active' : ''}`}>
                      Schedule and manage
                    </p>
                  </div>
                </div>
              </button>

              <button 
                className={`dashboard-sidebar-item`}
                onClick={handleVideoTest}
              >
                <div className="dashboard-sidebar-item-content">
                  <div className={`dashboard-sidebar-icon-container`}>
                    <Video className="dashboard-sidebar-icon" />
                  </div>
                  <div className="dashboard-sidebar-text">
                    <p className={`dashboard-sidebar-label`}>
                      Video Test
                    </p>
                    <p className={`dashboard-sidebar-description`}>
                      Test your audio and video
                    </p>
                  </div>
                </div>
              </button>
            </nav>

            <div className="dashboard-sidebar-bottom">
              <button className="dashboard-sidebar-bottom-button dashboard-sidebar-logout-button" onClick={handleLogout}>
                <div className="dashboard-sidebar-bottom-icon-container dashboard-sidebar-logout-icon-container">
                  <LogOut className="dashboard-sidebar-bottom-icon" />
                </div>
                <span className="dashboard-sidebar-bottom-text">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main-content">
          <div className="dashboard-content-wrapper">
            {/* Page Header */}
            <div className="dashboard-page-header">
              <div className="dashboard-page-header-content">
                <div>
                  <h2 className="dashboard-page-title">
                    {activeTab === 'overview' ? 'Dashboard Overview' : 
                     activeTab === 'doctors' ? 'Find Doctors' :
                     activeTab === 'records' ? 'Medical Records' :
                     activeTab === 'appointments' ? 'Appointments' : activeTab}
                  </h2>
                  <p className="dashboard-page-description">
                    {activeTab === 'overview' && "Monitor your health and upcoming appointments"}
                    {activeTab === 'doctors' && "Find and connect with healthcare professionals"}
                    {activeTab === 'records' && "Access your complete medical history and records"}
                    {activeTab === 'appointments' && "Schedule and manage your appointments"}
                  </p>
                </div>
                
                {/* Quick Stats */}
                <div className="dashboard-quick-stats">
                  <div className="dashboard-quick-stat">
                    <p className="dashboard-quick-stat-value dashboard-quick-stat-primary">{todayConsultations.length}</p>
                    <p className="dashboard-quick-stat-label">Today</p>
                  </div>
                  <div className="dashboard-quick-stat">
                    <p className="dashboard-quick-stat-value dashboard-quick-stat-secondary">{upcomingConsultations.length}</p>
                    <p className="dashboard-quick-stat-label">Upcoming</p>
                  </div>
                  <div className="dashboard-quick-stat">
                    <p className="dashboard-quick-stat-value dashboard-quick-stat-active">{doctors.length}</p>
                    <p className="dashboard-quick-stat-label">Doctors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="dashboard-content-area">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>

      {isInVideoTest && <VideoTestModal />}
    </div>
  );
}

export default PatientDashboard;