import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Calendar } from "../../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Video, ArrowLeft, Mic, MicOff, VideoOff } from "lucide-react";
import { cn } from "../../../components/lib/utils";
import { useState, useRef, useEffect } from "react";

export const ScheduleTab = ({ onStartVideoConsultation }) => {
  const [viewMode, setViewMode] = useState('schedule'); // 'schedule', 'scheduler', 'video'
  const [schedulerMode, setSchedulerMode] = useState('new'); // 'new' or 'reschedule'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  
  // Enhanced video call states
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
  
  // Scheduler form states
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
      date: "2024-08-19", // Monday
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
      date: "2024-08-20", // Tuesday
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
      date: "2024-08-21", // Wednesday
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

  // Get current week dates
  const getWeekDates = (date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    return eachDayOfInterval({ start, end });
  };

  const weekDates = getWeekDates(selectedWeek);

  // Filter appointments by selected week
  const weekAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return weekDates.some(date => 
      format(date, 'yyyy-MM-dd') === format(aptDate, 'yyyy-MM-dd')
    );
  });

  // Group appointments by weekday
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
    
    // Update appointment status
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

  // Enhanced Video Consultation View
  if (viewMode === 'video' && selectedAppointment) {
    return (
      <div className="space-y-4 h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setViewMode('schedule')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Video Consultation</h2>
              <p className="text-sm text-muted-foreground">{selectedAppointment.patient} - {selectedAppointment.type}</p>
              <div className="flex items-center gap-4 mt-1">
                <span className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  isCallActive ? "bg-medical-success text-white" : "bg-gray-100 text-gray-700"
                )}>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isCallActive ? "bg-white animate-pulse" : "bg-gray-400"
                  )} />
                  {isCallActive ? "Live" : "Not Connected"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Duration: {formatDuration(sessionDuration)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!isCallActive ? (
              <Button onClick={handleStartCall} className="bg-medical-success hover:bg-medical-success/90">
                Start Call
              </Button>
            ) : (
              <Button variant="destructive" onClick={handleEndCall}>
                End Call
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 h-[calc(100vh-200px)]">
          {/* Video Call Area */}
          <Card className="lg:col-span-2 relative overflow-hidden shadow-card">
            <CardContent className="p-0 h-full">
              {!isCallActive ? (
                <div className="w-full h-full bg-gradient-to-br from-medical-primary to-medical-accent flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="h-16 w-16 mx-auto mb-4 opacity-60" />
                    <h3 className="text-lg font-semibold mb-2">Ready to start consultation</h3>
                    <p className="text-sm opacity-80">Click "Start Call" to begin video consultation</p>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className={cn(
                      "w-full h-full object-cover bg-black",
                      !isVideoOn && "hidden"
                    )}
                  />
                  {!isVideoOn && (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="text-center text-white">
                        <VideoOff className="h-16 w-16 mx-auto mb-4" />
                        <p>Camera is off</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Video Controls */}
              {isCallActive && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <Button
                    size="sm"
                    variant={isAudioOn ? "secondary" : "destructive"}
                    onClick={toggleAudio}
                    className="rounded-full w-12 h-12"
                  >
                    {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant={isVideoOn ? "secondary" : "destructive"}
                    onClick={toggleVideo}
                    className="rounded-full w-12 h-12"
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consultation Data Panel */}
          <div className="space-y-4 overflow-y-auto">
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
                  className="min-h-[120px] text-sm"
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
                  className="min-h-[80px] text-sm"
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
                  className="min-h-[80px] text-sm"
                />
              </CardContent>
            </Card>

            {/* Vitals */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Vital Signs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Blood Pressure</Label>
                    <Input
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals(prev => ({...prev, bloodPressure: e.target.value}))}
                      placeholder="120/80"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Heart Rate</Label>
                    <Input
                      value={vitals.heartRate}
                      onChange={(e) => setVitals(prev => ({...prev, heartRate: e.target.value}))}
                      placeholder="72 bpm"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Temperature</Label>
                    <Input
                      value={vitals.temperature}
                      onChange={(e) => setVitals(prev => ({...prev, temperature: e.target.value}))}
                      placeholder="98.6°F"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">O2 Saturation</Label>
                    <Input
                      value={vitals.oxygenSaturation}
                      onChange={(e) => setVitals(prev => ({...prev, oxygenSaturation: e.target.value}))}
                      placeholder="98%"
                      className="text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button 
              onClick={handleSaveConsultation}
              className="w-full bg-medical-primary hover:bg-medical-primary/90"
              disabled={!consultationNotes.trim()}
            >
              Save Consultation Record
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Appointment Scheduler View
  if (viewMode === 'scheduler') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setViewMode('schedule')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold text-foreground">
            {schedulerMode === 'new' ? 'Schedule New Appointment' : 'Reschedule Appointment'}
          </h2>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentType">Appointment Type</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or special instructions..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setViewMode('schedule')}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-medical-primary hover:bg-medical-primary/90">
                  {schedulerMode === 'new' ? 'Schedule Appointment' : 'Update Appointment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Schedule View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Weekly Schedule</h2>
        <Button className="gap-2 bg-medical-primary hover:bg-medical-primary/90" onClick={() => handleAddAppointment()}>
          <CalendarIcon className="h-4 w-4" />
          Add Appointment
        </Button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigateWeek('prev')} className="border-medical-primary text-medical-primary hover:bg-medical-primary hover:text-white">
          ← Previous Week
        </Button>
        <h3 className="text-lg font-medium">
          {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
        </h3>
        <Button variant="outline" onClick={() => navigateWeek('next')} className="border-medical-primary text-medical-primary hover:bg-medical-primary hover:text-white">
          Next Week →
        </Button>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {weekDates.map((date, index) => {
          const dayName = weekdays[date.getDay()];
          const dayAppointments = appointmentsByDay[dayName] || [];
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <Card key={index} className={cn(
              "min-h-[300px] shadow-card",
              isToday && "border-medical-primary border-2"
            )}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium">{dayName}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {format(date, 'MMM d')}
                      {isToday && <span className="text-medical-primary ml-1">(Today)</span>}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleAddAppointment(dayName)}
                    className="text-medical-primary hover:bg-medical-primary hover:text-white"
                  >
                    +
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {dayAppointments.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No appointments
                  </p>
                ) : (
                  dayAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-2 bg-medical-card rounded-md border border-border hover:bg-medical-card-hover transition-colors">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-medical-primary" />
                          <p className="text-xs font-medium truncate">{appointment.patient}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-medical-primary" />
                          <span className="text-xs">{appointment.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{appointment.type}</p>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-6 px-2 border-medical-secondary text-medical-secondary hover:bg-medical-secondary hover:text-white"
                          onClick={() => handleReschedule(appointment)}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          size="sm" 
                          className="text-xs h-6 px-2 bg-medical-success hover:bg-medical-success/90"
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

      {/* Today's Appointments Summary */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {appointmentsByDay[weekdays[new Date().getDay()]]?.length > 0 ? (
              appointmentsByDay[weekdays[new Date().getDay()]].map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-medical-card rounded-lg border border-border hover:bg-medical-card-hover transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-medical-primary rounded-full">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{appointment.patient}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-medical-primary">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{appointment.time}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReschedule(appointment)}
                      className="border-medical-secondary text-medical-secondary hover:bg-medical-secondary hover:text-white"
                    >
                      Reschedule
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-medical-success hover:bg-medical-success/90"
                      onClick={() => handleStartConsultation(appointment)}
                    >
                      Start Consultation
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No appointments scheduled for today</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleTab;