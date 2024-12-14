import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics'; // Import Haptics for vibration

const CallContext = createContext();
export const useCall = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
  const [callStatus, setCallStatus] = useState('idle');
  const [callDuration, setCallDuration] = useState(0);
  const soundRef = useRef(null);
  const timerRef = useRef(null);
  const incomingCallTimerRef = useRef(null);

  const cleanupCall = useCallback(() => {
    // Vibrate on hangup
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (incomingCallTimerRef.current) {
      clearTimeout(incomingCallTimerRef.current);
      incomingCallTimerRef.current = null;
    }
    if (soundRef.current) {
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setCallDuration(0);
    setCallStatus('idle');
  }, []);

  const initiateCall = useCallback(async () => {
    // Clean up any existing call
    
    if(callStatus != incoming){
      cleanupCall();
      setCallStatus('ringing');
    }
    
 
    setCallDuration(0);
    
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/outbound.mp3')
      );
      soundRef.current = sound;
      await sound.playAsync();
      
      // Simulate ringing for 5 seconds
      setTimeout(() => {
        setCallStatus('connecting');
        sound.stopAsync();
        
        // Simulate connecting for 2 seconds
        setTimeout(() => {
          setCallStatus('active');
          // Start the call duration timer
          timerRef.current = setInterval(() => {
            setCallDuration(prevDuration => prevDuration + 1);
          }, 1000);
        }, 2000);
      }, 5000);
    } catch (error) {
      console.error('Error initiating call:', error);
      cleanupCall();
    }
  }, [cleanupCall]);

  const simulateIncomingCall = useCallback(async () => {
    // Clean up any existing call
    cleanupCall();
    
    // Set status to incoming after 5 seconds
    incomingCallTimerRef.current = setTimeout(() => {
      setCallStatus('incoming');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Play incoming call sound
      Audio.Sound.createAsync(
        require('../assets/audio/incoming.mp3')
      ).then(({ sound }) => {
        soundRef.current = sound;
        sound.playAsync();
      });
    }, 500);
  }, [cleanupCall]);

  const acceptCall = useCallback(async () => {
    if (callStatus === 'incoming') {
      // Stop incoming call sound
      if (soundRef.current) {
        await soundRef.current.stopAsync();
      }

      // Set status to active and start call duration timer
      setCallStatus('active');
      
      timerRef.current = setInterval(() => {
        setCallDuration(prevDuration => prevDuration + 1);
      }, 1000);
    }
  }, [callStatus]);

  const handleHangUp = useCallback(() => {
    cleanupCall();
  }, [cleanupCall]);
   
  useEffect(() => {
    if (callStatus !== 'active') {
      setCallDuration(0);
    }
  }, [callStatus]);
  
  useEffect(() => {
    // Cleanup on unmount
    return () => {
      cleanupCall();
    };
  }, [cleanupCall]);
  
  return (
    <CallContext.Provider
      value={{
        callStatus,
        setCallStatus,
        callDuration,
        setCallDuration,
        initiateCall,
        handleHangUp,
        simulateIncomingCall,
        acceptCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};