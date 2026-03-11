import { useState, useReducer,useEffect } from 'react'
import useWebSocket, {ReadyState} from 'react-use-websocket-lite'
import { useDebouncedCallback } from 'use-debounce';
import { WS_URL } from './Consts';
import './App.css'


const convertRawCameraDataToCameraType = (cameras) => {
  const cameraEntries = Object.entries(cameras);
  return cameraEntries.map((camera) => {
    delete camera.faces;
  });
};

function App() {
  const [cameras, setCameras] = useState();


  const handleJsonMessage = (event) => {
    try {
      const message = JSON.parse(event.data);

      if (Object.hasOwn(message, 'status') && message.status == 'running') {
        if (Object.hasOwn(message, 'cameras')) {
          setCameras(convertRawCameraDataToCameraType(message.cameras))
        }
        if (Object.hasOwn(message, 'matches')) {
          if (!Object.values(message.matches).some(match => match == "null")) {
            //todo this makes me itchy, we shouldn't be directly mutating state here
            state.matches = Object.values(message.matches);
          }
        }
        
      }
    } catch (e) {
      console.log(`Bad JSON message received from SpyFR_BE: ${e}, ${event.data}`, e)
    };
    debouncedGetWS();

  }

  const { sendMessage, readyState } = useWebSocket({
    url: WS_URL,
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 1000,
    onMessage: handleJsonMessage,
    connect: true,
  });

    const debouncedGetWS = useDebouncedCallback(
    () => {
      sendMessage("{ 'any': 'json' }", false);
    },
    // delay in ms
    (1000 / 10.0), { leading: true, maxWait: (1000 / 10.0) }
  );



  const reducer = (state, event) => {
    switch (event.type) {

      case 'INITIATE': {
        if (event.event) {
          console.log(event.event)
        }
        delete state.stream;
        return { ...state, appState: 'ATTRACT', cameraId: event.cameraId, timeoutLengthInMs: 0, timeoutStart: 0 }
      }
      case 'CAMERA_CHANGE': {
        const timeout = window.setTimeout(() => { dispatch({ type: 'CAMERA_RESET', event: 'camera switch timed out' }) }, CAMERA_SET_DELAY_MILLISECS);
        delete state.stream;
        return { ...state, cameraId: event.cameraId, cameraHeight: event.cameraHeight, cameraWidth: event.cameraWidth, timeoutId: timeout }
      }
      case "PAUSING": {
        window.setTimeout(() => dispatch({ type: "PAUSE", event: "fully pausing" }), 50);
        return { ...state, appState: "PAUSING" };
      }
      case 'PAUSE': {
        const timeout = window.setTimeout(() => { dispatch({ type: 'TIMEOUT', event: 'pause timed out' }) }, PAUSE_DELAY_MILLISECS);
        if (state.stream) {
          state.stream.getVideoTracks()[0].enabled = false;
        }
        return { ...state, appState: 'PAUSED', timeoutId: timeout };
      }

      
      
      case 'CAMERA_RESET': {
        if (state.appState === 'ATTRACT' || state.appState === 'MANUAL_CAMERA') {
          if (!cameras) {
            return state;
          }
          delete state.stream;
       
          return { ...state, appState: 'ATTRACT', cameraId: "camera0", cameraHeight: 1080, cameraWidth: 640 }
        }
        return state;
      }
      
    }
    return state;
  };

  const [state, dispatch] = useReducer(reducer, { appState: 'ATTRACT'});


    //connect to websocket
  useEffect(() => {
    console.log(`WS_URL is ${WS_URL}, connection is ${readyState}`)

    sendMessage("{ 'any': 'json' }");
    if (readyState == 0) {
      
      dispatch({ type: 'INITIATE', cameraId: 'camera0' })
    }

  }, [readyState, sendMessage])


  // //actually check that cameras are up
  // useEffect(() => {
  //   let intervalId;
  //   if (!state.cameraId) {
  //     console.warn("Cameras not ready yet. Waiting...")
  //     intervalId = window.setInterval(() => sendMessage("{ 'wake up': 'please' }"), 1000);

  //   }
  //   return () => clearInterval(intervalId);
  // }, [state.cameraId, sendMessage])


  //set camera dimensions on first setup
  useEffect(() => {
    if (state.cameraWidth == null) {
      if (cameras !== undefined && cameras.length > 0) {
        const camera = cameras[0]; //hardcoded for first camera, this should be ok
        dispatch({ type: 'CAMERA_CHANGE', cameraId: camera.id, cameraHeight: camera.height, cameraWidth: camera.width })
      }
    } 
  }    , [state.cameraWidth, cameras, state.cameraId, state.appState, state])



  return (
    <>

      {cameras &&
        <Canvas state={state} dispatch={dispatch} />}

    </>
  )


}

export default App
