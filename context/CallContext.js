import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const CallContext = createContext();

// Dummy user data
const dummyUser = {
  userId: 'user_123',
  username: 'user_123',
  password: 'password123', // In a real app, never store passwords in plain text
  fullname: 'Robinson Honour',
  role: 'driver'
};

export const CallProvider = ({ children, navigation }) => {
  const [callStatus, setCallStatus] = useState("idle");
  const [currentCall, setCurrentCall] = useState(null);
  const [user, setUser] = useState(null);
  const ws = useRef(null);
  const [audioStatus, setAudioStatus] = useState(null);
  const audioRecording = useRef(null);
  const audioPlayer = useRef(null);

  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const initializeWebSocket = () => {
    ws.current = new WebSocket('ws://192.168.1.115:8080');
    
    ws.current.onopen = () => {
      console.log('WebSocket connected');
      login(dummyUser.username, dummyUser.password);
    };

    ws.current.onmessage = handleWebSocketMessage;

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      // Implement reconnection logic here
    };
  };

  const handleWebSocketMessage = async (event) => {
    const data = JSON.parse(event.data);
    console.log('Received WebSocket message:', data);

    switch (data.type) {
      case 'login-success':
        handleLoginSuccess(data);
        break;
      case 'login-failed':
        handleLoginFailed(data);
        break;
      case 'incoming-call':
        handleIncomingCall(data);
        break;
      case 'call-answer':
        handleCallAnswer(data);
        break;
      case 'call-end':
        handleCallEnd(data);
        break;
      case 'audio-data':
        await handleAudioData(data);
        break;
      case 'call-request':
        handleIncomingCall(data);
        break;
    }
  };

  const handleLoginSuccess = (data) => {
    setUser({
      userId: data.userId,
      username: data.username,
      fullname: data.fullname,
      role: data.role
    });
    console.log('Login successful:', data);
  };

  const handleLoginFailed = (data) => {
    console.error('Login failed:', data.message);
    // Implement error handling, e.g., show an alert to the user
  };

  const handleIncomingCall = (data) => {
    console.log('Incoming call:', data);
    setCurrentCall({
      from: data.from,
      username: data.username,
      fullname: data.fullname,
      role: data.role,
      status: 'incoming'
    });
    setCallStatus("incoming");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleCallAnswer = (data) => {
    if (data.answer) {
      setCallStatus("active");
    } else {
      handleHangUp();
    }
  };

  const handleCallEnd = () => {
    handleHangUp();
  };

  const login = useCallback((username, password) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'login',
        username,
        password
      }));
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  const sendCallRequest = useCallback((targetUserId) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log('Sending call request to:', targetUserId);
      ws.current.send(JSON.stringify({
        type: 'call-request',
        targetUserId,
        from: user.userId,
        username: user.username,
        fullname: user.fullname,
        role: user.role
      }));
      setCurrentCall({ targetUserId, status: 'calling' });
      setCallStatus('calling');
    } else {
      console.error('WebSocket is not connected');
    }
  }, [user]);

  const startCall = useCallback((targetUserId) => {
    sendCallRequest(targetUserId);
    const callData = {
      targetUserId,
      userId: user.userId,
      username: user.username,
      fullname: user.fullname,
      role: user.role
    };
    navigation.navigate('CallScreen', { callData });
  }, [user, navigation, sendCallRequest]);

  const acceptCall = useCallback(async () => {
    if (callStatus === "incoming" && currentCall) {
      ws.current.send(JSON.stringify({
        type: 'call-response',
        targetUserId: currentCall.from,
        answer: true
      }));
      setCallStatus("active");
      await startAudioRecording();
    }
  }, [callStatus, currentCall]);

  const declineCall = useCallback(() => {
    if (callStatus === "incoming") {
      ws.current.send(JSON.stringify({
        type: 'call-response',
        targetUserId: currentCall.from,
        answer: false
      }));
      setCallStatus("idle");
      setCurrentCall(null);
    }
  }, [callStatus, currentCall]);

  const handleHangUp = useCallback(async () => {
    if (currentCall) {
      ws.current.send(JSON.stringify({
        type: 'call-end',
        targetUserId: currentCall.from || currentCall.targetUserId
      }));
    }
    setCallStatus("idle");
    setCurrentCall(null);
    await stopAudioRecording();
    if (audioPlayer.current) {
      await audioPlayer.current.unloadAsync();
    }
  }, [currentCall]);

  const startAudioRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      audioRecording.current = recording;
      setAudioStatus('recording');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopAudioRecording = async () => {
    if (audioRecording.current) {
      await audioRecording.current.stopAndUnloadAsync();
      const uri = audioRecording.current.getURI();
      audioRecording.current = null;
      setAudioStatus('stopped');
      return uri;
    }
  };

  const sendAudioData = useCallback(async () => {
    if (audioStatus === 'recording' && currentCall) {
      const uri = await stopAudioRecording();
      const base64Audio = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      ws.current.send(JSON.stringify({
        type: 'audio-data',
        targetUserId: currentCall.from || currentCall.targetUserId,
        data: base64Audio
      }));
      await startAudioRecording();
    }
  }, [audioStatus, currentCall]);

  const handleAudioData = async (data) => {
    if (audioPlayer.current) {
      await audioPlayer.current.unloadAsync();
    }
    const { sound } = await Audio.Sound.createAsync({ uri: `data:audio/wav;base64,${data.data}` });
    audioPlayer.current = sound;
    await audioPlayer.current.playAsync();
  };

  const getUserCredentials = useCallback(() => {
    return user ? { userId: user.userId, username: user.username, password: dummyUser.password } : null;
  }, [user]);

  return (
    <CallContext.Provider
      value={{
        callStatus,
        currentCall,
        user,
        acceptCall,
        declineCall,
        handleHangUp,
        startCall,
        sendAudioData,
        sendCallRequest,
        getUserCredentials,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);

