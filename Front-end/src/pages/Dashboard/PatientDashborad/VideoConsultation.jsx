import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users } from 'lucide-react';
import './Patient.css';

function VideoConsultation({ consultationId, patientId, doctorId, doctorName, onEndCall }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);
  const callTimerRef = useRef(null);

  useEffect(() => {
    // Initialize video call
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
      endCall();
    };
  }, [consultationId]);

  const initializeCall = async () => {
    try {
      // In a real application, this would connect to your video call service
      console.log(`Initializing call for consultation ${consultationId}`);
      
      // Get user media (camera and microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      
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
      alert('Could not access your camera or microphone. Please check your permissions.');
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        // Handle when the user stops screen sharing
        screenStream.getVideoTracks()[0].onended = () => {
          if (localVideoRef.current && streamRef.current) {
            localVideoRef.current.srcObject = streamRef.current;
          }
          setIsScreenSharing(false);
        };
        
        setIsScreenSharing(true);
      } else {
        if (localVideoRef.current && streamRef.current) {
          localVideoRef.current.srcObject = streamRef.current;
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const endCall = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
    }
    
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    onEndCall();
  };

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-consultation-container">
      {/* Header */}
      <div className="video-header">
        <div>
          <h2>Video Consultation with {doctorName}</h2>
          <p>Consultation ID: {consultationId} • {isConnected ? 'Connected' : 'Connecting...'} • {formatCallTime(callTime)}</p>
        </div>
        <button onClick={endCall} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>

      {/* Video Content */}
      <div className="video-content">
        {/* Main Video (Remote) */}
        <div className="video-main">
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#1e293b' }}
          />
          
          {/* Local Video (Picture-in-Picture) */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            width: '200px',
            height: '150px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '2px solid white'
          }}>
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
          </div>
          
          {/* Connection Status Overlay */}
          {!isConnected && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontSize: '1.2rem'
            }}>
              Connecting to {doctorName}...
            </div>
          )}
        </div>

        {/* Sidebar (Chat, Participants, etc.) */}
        <div className="video-sidebar">
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Consultation Details</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <p><strong>Doctor:</strong> {doctorName}</p>
            <p><strong>Duration:</strong> {formatCallTime(callTime)}</p>
            <p><strong>Status:</strong> {isConnected ? 'Active' : 'Connecting'}</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f1f5f9', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#475569' }}>Consultation Notes</h4>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {isConnected ? 
                'Discuss your symptoms and concerns with the doctor.' : 
                'Waiting for doctor to join the call...'}
            </p>
          </div>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            width: '100%',
            cursor: 'pointer',
            marginBottom: '0.5rem'
          }}>
            <MessageSquare size={16} />
            <span>Open Chat</span>
          </button>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            width: '100%',
            cursor: 'pointer'
          }}>
            <Users size={16} />
            <span>Participants (1)</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="video-controls">
        <button 
          className={`control-button ${isMuted ? 'control-button-muted' : ''}`}
          onClick={toggleMute}
          style={{ backgroundColor: isMuted ? '#ef4444' : 'white' }}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        
        <button 
          className={`control-button ${isVideoOff ? 'control-button-video-off' : ''}`}
          onClick={toggleVideo}
          style={{ backgroundColor: isVideoOff ? '#ef4444' : 'white' }}
        >
          {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>
        
        <button 
          className="control-button end-call"
          onClick={endCall}
        >
          <Phone size={20} style={{ transform: 'rotate(135deg)' }} />
        </button>
        
        <button 
          className={`control-button ${isScreenSharing ? 'control-button-sharing' : ''}`}
          onClick={toggleScreenShare}
          style={{ backgroundColor: isScreenSharing ? '#3b82f6' : 'white' }}
        >
          <Video size={20} />
        </button>
      </div>
    </div>
  );
}

export default VideoConsultation;