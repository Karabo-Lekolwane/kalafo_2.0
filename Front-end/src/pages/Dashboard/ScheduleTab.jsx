import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Video, ArrowLeft, Mic, MicOff, VideoOff } from "lucide-react";
import { cn } from "../../components/lib/utils";
import { useState, useRef, useEffect } from "react";

export const ScheduleTab = ({ onStartVideoConsultation }) => {
  const [viewMode, setViewMode] = useState('schedule');
  const [schedulerMode, setSchedulerMode] = useState('new');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [vitals, setVitals] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    oxygenSaturation: ""
  });
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("30");

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "Jane Doe",
      patientId: 1,
      time: "09:00 AM",
      date: "2024-08-19",
      weekday: "Monday",
      type: "Regular checkup",
      notes: "Patient reports feeling well",
      status: "scheduled",
      duration: 30
    },
    {
      id: 2,
      patient: "John Smith", 
      patientId: 2,
      time: "02:30 PM",
      date: "2024-08-20",
      weekday: "Tuesday",
      type: "Follow-up",
      notes: "Blood pressure monitoring",
      status: "scheduled",
      duration: 30
    },
    {
      id: 3,
      patient: "Mary Johnson",
      patientId: 3,
      time: "11:15 AM", 
      date: "2024-08-21",
      weekday: "Wednesday",
      type: "Consultation",
      notes: "Headache complaints",
      status: "scheduled",
      duration: 45
    }
  ]);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
    "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM"
  ];

  const appointmentTypes = [
    "Regular checkup",
    "Follow-up", 
    "Consultation",
    "Emergency",
    "Specialist referral"
  ];

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const getWeekDates = (date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return eachDayOfInterval({ start, end });
  };

  const weekDates = getWeekDates(selectedWeek);

  const weekAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return weekDates.some(date => 
      format(date, 'yyyy-MM-dd') === format(aptDate, 'yyyy-MM-dd')
    );
  });

  const appointmentsByDay = weekdays.reduce((acc, day) => {
    acc[day] = weekAppointments.filter(apt => apt.weekday === day);
    return acc;
  }, {});

  const handleAddAppointment = (weekday = null) => {
    setSchedulerMode('new');
    setSelectedAppointment(null);
    if (weekday) {
      const dayDate = weekDates.find(date => 
        weekdays[date.getDay()] === weekday
      );
      setSelectedDate(dayDate || new Date());
    }
    setPatientName("");
    setAppointmentType("");
    setNotes("");
    setSelectedTime("");
    setDuration("30");
    setViewMode('scheduler');
  };

  const handleReschedule = (appointment) => {
    setSchedulerMode('reschedule');
    setSelectedAppointment(appointment);
    setSelectedDate(new Date(appointment.date));
    setSelectedTime(appointment.time);
    setPatientName(appointment.patient);
    setAppointmentType(appointment.type);
    setNotes(appointment.notes);
    setDuration(appointment.duration.toString());
    setViewMode('scheduler');
  };

  const handleStartConsultation = (appointment) => {
    setSelectedAppointment(appointment);
    setConsultationNotes(`Consultation with ${appointment.patient}\nType: ${appointment.type}\nScheduled: ${appointment.date} at ${appointment.time}\n\nNotes:\n`);
    setDiagnosis("");
    setPrescription("");
    setVitals({
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: ""
    });
    setViewMode('video');
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCallActive(true);
      setSessionDuration(0);
      
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
      patientId: selectedAppointment.patientId,
      appointmentId: selectedAppointment.id,
      date: new Date().toISOString(),
      duration: sessionDuration,
      notes: consultationNotes,
      diagnosis,
      prescription,
      vitals
    };
    
    console.log('Saving consultation:', consultationData);
    
    setAppointments(prev => prev.map(apt => 
      apt.id === selectedAppointment.id 
        ? { 
            ...apt, 
            status: 'completed', 
            consultationData,
            completedAt: new Date().toISOString()
          }
        : apt
    ));
    
    handleEndCall();
    setViewMode('schedule');
    setSelectedAppointment(null);
    setConsultationNotes("");
    setDiagnosis("");
    setPrescription("");
    setVitals({
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      oxygenSaturation: ""
    });
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    
    const selectedWeekday = weekdays[selectedDate.getDay()];
    
    const appointmentData = {
      patient: patientName,
      patientId: selectedAppointment?.patientId || Date.now(),
      time: selectedTime,
      date: format(selectedDate, "yyyy-MM-dd"),
      weekday: selectedWeekday,
      type: appointmentType,
      notes,
      duration: parseInt(duration),
      status: 'scheduled'
    };

    if (schedulerMode === 'new') {
      const newAppointment = {
        id: Date.now(),
        ...appointmentData
      };
      setAppointments([...appointments, newAppointment]);
    } else {
      setAppointments(appointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, ...appointmentData }
          : apt
      ));
    }
    
    setViewMode('schedule');
  };

  const navigateWeek = (direction) => {
    setSelectedWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  if (viewMode === 'video' && selectedAppointment) {
    return (
      <div className="video-container">
        <div className="video-header">
          <div className="video-header-left">
            <Button variant="ghost" size="sm" onClick={() => setViewMode('schedule')} className="video-back-btn">
              <ArrowLeft className="video-back-icon" />
            </Button>
            <div className="video-header-info">
              <h2 className="video-title">Video Consultation</h2>
              <p className="video-subtitle">{selectedAppointment.patient} - {selectedAppointment.type}</p>
              <div className="video-status-container">
                <span className={`video-status ${isCallActive ? 'video-status-live' : 'video-status-offline'}`}>
                  <div className={`video-status-indicator ${isCallActive ? 'video-status-indicator-live' : 'video-status-indicator-offline'}`} />
                  {isCallActive ? "Live" : "Not Connected"}
                </span>
                <span className="video-duration">
                  Duration: {formatDuration(sessionDuration)}
                </span>
              </div>
            </div>
          </div>
          <div className="video-header-actions">
            {!isCallActive ? (
              <Button onClick={handleStartCall} className="video-start-btn">
                Start Call
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleEndCall} className="video-end-btn">
                End Call
              </Button>
            )}
          </div>
        </div>

        <div className="video-grid">
          <Card className="video-main">
            <CardContent className="video-main-content">
              {!isCallActive ? (
                <div className="video-placeholder">
                  <div className="video-placeholder-content">
                    <Video className="video-placeholder-icon" />
                    <h3 className="video-placeholder-title">Ready to start consultation</h3>
                    <p className="video-placeholder-text">Click "Start Call" to begin video consultation</p>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className={`video-feed ${!isVideoOn ? 'video-feed-hidden' : ''}`}
                  />
                  {!isVideoOn && (
                    <div className="video-off-overlay">
                      <div className="video-off-content">
                        <VideoOff className="video-off-icon" />
                        <p className="video-off-text">Camera is off</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {isCallActive && (
                <div className="video-controls">
                  <Button
                    size="sm"
                    variant={isAudioOn ? "secondary" : "destructive"}
                    onClick={toggleAudio}
                    className={`video-control-btn ${isAudioOn ? 'video-control-btn-secondary' : 'video-control-btn-destructive'}`}
                  >
                    {isAudioOn ? <Mic className="video-control-icon" /> : <MicOff className="video-control-icon" />}
                  </Button>
                  <Button
                    size="sm"
                    variant={isVideoOn ? "secondary" : "destructive"}
                    onClick={toggleVideo}
                    className={`video-control-btn ${isVideoOn ? 'video-control-btn-secondary' : 'video-control-btn-destructive'}`}
                  >
                    {isVideoOn ? <Video className="video-control-icon" /> : <VideoOff className="video-control-icon" />}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="video-sidebar">
            <Card className="video-section">
              <CardHeader className="video-section-header">
                <CardTitle className="video-section-title">Consultation Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Take notes during consultation..."
                  className="video-textarea"
                />
              </CardContent>
            </Card>

            <Card className="video-section">
              <CardHeader className="video-section-header">
                <CardTitle className="video-section-title">Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis..."
                  className="video-textarea"
                />
              </CardContent>
            </Card>

            <Card className="video-section">
              <CardHeader className="video-section-header">
                <CardTitle className="video-section-title">Prescription</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Enter prescription details..."
                  className="video-textarea"
                />
              </CardContent>
            </Card>

            <Card className="video-section">
              <CardHeader className="video-section-header">
                <CardTitle className="video-section-title">Vital Signs</CardTitle>
              </CardHeader>
              <CardContent className="video-vitals-content">
                <div className="video-vitals-grid">
                  <div className="vital-input-group">
                    <Label className="vital-label">Blood Pressure</Label>
                    <Input
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals(prev => ({...prev, bloodPressure: e.target.value}))}
                      placeholder="120/80"
                      className="vital-input"
                    />
                  </div>
                  <div className="vital-input-group">
                    <Label className="vital-label">Heart Rate</Label>
                    <Input
                      value={vitals.heartRate}
                      onChange={(e) => setVitals(prev => ({...prev, heartRate: e.target.value}))}
                      placeholder="72 bpm"
                      className="vital-input"
                    />
                  </div>
                  <div className="vital-input-group">
                    <Label className="vital-label">Temperature</Label>
                    <Input
                      value={vitals.temperature}
                      onChange={(e) => setVitals(prev => ({...prev, temperature: e.target.value}))}
                      placeholder="98.6°F"
                      className="vital-input"
                    />
                  </div>
                  <div className="vital-input-group">
                    <Label className="vital-label">O2 Saturation</Label>
                    <Input
                      value={vitals.oxygenSaturation}
                      onChange={(e) => setVitals(prev => ({...prev, oxygenSaturation: e.target.value}))}
                      placeholder="98%"
                      className="vital-input"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleSaveConsultation}
              className="video-save-btn"
              disabled={!consultationNotes.trim()}
            >
              Save Consultation Record
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'scheduler') {
    return (
      <div className="scheduler-container">
        <div className="scheduler-header">
          <Button variant="ghost" size="sm" onClick={() => setViewMode('schedule')} className="scheduler-back-btn">
            <ArrowLeft className="scheduler-back-icon" />
          </Button>
          <h2 className="scheduler-title">
            {schedulerMode === 'new' ? 'Schedule New Appointment' : 'Reschedule Appointment'}
          </h2>
        </div>

        <Card className="scheduler-card">
          <CardHeader>
            <CardTitle className="scheduler-card-title">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScheduleSubmit} className="scheduler-form">
              <div className="scheduler-grid">
                <div className="scheduler-field">
                  <Label htmlFor="patientName" className="scheduler-label">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    required
                    className="scheduler-input"
                  />
                </div>

                <div className="scheduler-field">
                  <Label htmlFor="appointmentType" className="scheduler-label">Appointment Type</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger className="scheduler-select-trigger">
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="scheduler-field">
                  <Label className="scheduler-label">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="scheduler-date-btn"
                      >
                        <CalendarIcon className="scheduler-date-icon" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="scheduler-date-popover" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="scheduler-calendar"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="scheduler-field">
                  <Label htmlFor="time" className="scheduler-label">Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="scheduler-select-trigger">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="scheduler-time-option">
                            <Clock className="scheduler-time-icon" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="scheduler-field">
                  <Label htmlFor="duration" className="scheduler-label">Duration (minutes)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="scheduler-select-trigger">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="scheduler-field">
                <Label htmlFor="notes" className="scheduler-label">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or special instructions..."
                  rows={3}
                  className="scheduler-textarea"
                />
              </div>

              <div className="scheduler-actions">
                <Button type="button" variant="outline" onClick={() => setViewMode('schedule')} className="scheduler-cancel-btn">
                  Cancel
                </Button>
                <Button type="submit" className="scheduler-submit-btn">
                  {schedulerMode === 'new' ? 'Schedule Appointment' : 'Update Appointment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2 className="schedule-title">Weekly Schedule</h2>
        <Button className="schedule-add-appointment-btn" onClick={() => handleAddAppointment()}>
          <CalendarIcon className="schedule-add-icon" />
          Add Appointment
        </Button>
      </div>

      <div className="schedule-week-nav">
        <Button variant="outline" onClick={() => navigateWeek('prev')} className="schedule-nav-btn schedule-nav-prev">
          ← Previous Week
        </Button>
        <h3 className="schedule-week-title">
          {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
        </h3>
        <Button variant="outline" onClick={() => navigateWeek('next')} className="schedule-nav-btn schedule-nav-next">
          Next Week →
        </Button>
      </div>

      <div className="schedule-week-grid">
        {weekDates.map((date, index) => {
          const dayName = weekdays[date.getDay()];
          const dayAppointments = appointmentsByDay[dayName] || [];
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <Card key={index} className={`schedule-day-card ${isToday ? 'schedule-day-card-today' : ''}`}>
              <CardHeader className="schedule-day-header">
                <div className="schedule-day-header-info">
                  <CardTitle className="schedule-day-title">{dayName}</CardTitle>
                  <p className="schedule-day-date">
                    {format(date, 'MMM d')}
                    {isToday && <span className="schedule-day-today">(Today)</span>}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => handleAddAppointment(dayName)}
                  className="schedule-add-day-btn"
                >
                  +
                </Button>
              </CardHeader>
              <CardContent className="schedule-day-content">
                {dayAppointments.length === 0 ? (
                  <p className="schedule-no-appointments">
                    No appointments
                  </p>
                ) : (
                  dayAppointments.map((appointment) => (
                    <div key={appointment.id} className="schedule-appointment">
                      <div className="schedule-appointment-header">
                        <div className="schedule-patient">
                          <User className="schedule-patient-icon" />
                          <p className="schedule-patient-name">{appointment.patient}</p>
                        </div>
                        <div className="schedule-time">
                          <Clock className="schedule-time-icon" />
                          <span className="schedule-time-text">{appointment.time}</span>
                        </div>
                      </div>
                      <p className="schedule-type">{appointment.type}</p>
                      <div className="schedule-actions">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="schedule-reschedule-btn"
                          onClick={() => handleReschedule(appointment)}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          size="sm" 
                          className="schedule-start-btn"
                          onClick={() => handleStartConsultation(appointment)}
                        >
                          Start
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="schedule-today-card">
        <CardHeader>
          <CardTitle className="schedule-today-title">Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="schedule-today-list">
            {appointmentsByDay[weekdays[new Date().getDay()]]?.length > 0 ? (
              appointmentsByDay[weekdays[new Date().getDay()]].map((appointment) => (
                <div key={appointment.id} className="schedule-today-appointment">
                  <div className="schedule-today-appointment-info">
                    <div className="schedule-today-avatar">
                      <User className="schedule-today-avatar-icon" />
                    </div>
                    <div className="schedule-today-details">
                      <h3 className="schedule-today-patient">{appointment.patient}</h3>
                      <p className="schedule-today-type">{appointment.type}</p>
                      <p className="schedule-today-notes">{appointment.notes}</p>
                    </div>
                  </div>
                  
                  <div className="schedule-today-appointment-actions">
                    <div className="schedule-today-time">
                      <Clock className="schedule-today-time-icon" />
                      <span className="schedule-today-time-text">{appointment.time}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReschedule(appointment)}
                      className="schedule-today-reschedule-btn"
                    >
                      Reschedule
                    </Button>
                    <Button 
                      size="sm" 
                      className="schedule-today-start-btn"
                      onClick={() => handleStartConsultation(appointment)}
                    >
                      Start Consultation
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="schedule-today-empty">No appointments scheduled for today</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleTab;