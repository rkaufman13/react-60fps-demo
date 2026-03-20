import { useState, useReducer,useEffect } from 'react'
import useWebSocket, {ReadyState} from 'react-use-websocket-lite'
import { useDebouncedCallback } from 'use-debounce';
import { WS_URL } from './Consts';
import './App.css'

import Canvas from './Canvas';




function App() {
  const [cameras, setCameras] = useState();


  const handleJsonMessage = (event) => {
    try {     
      const message = JSON.parse(event.data);
        if (Object.hasOwn(message, 'cameras')) {
          setCameras(message.cameras.map(camera=>{delete camera.faces; return camera}))
        }
        if (Object.hasOwn(message, 'matches')) {
          if (!Object.values(message.matches).some(match => match == "null")) {
            //todo this makes me itchy, we shouldn't be directly mutating state here
            state.matches = Object.values(message.matches);
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
    (1000 ), { leading: true, maxWait: (1000 ) }
  );



  const reducer = (state, event) => {
    switch (event.type) {

      case 'INITIATE': {
        if (event.event) {
          console.log(event.event)
        }
        delete state.stream;
        return { ...state, appState: 'ATTRACT', timeoutLengthInMs: 0, timeoutStart: 0 }
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
       
          return { ...state, appState: 'ATTRACT',  cameraHeight: 1080, cameraWidth: 640 }
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
      
      dispatch({ type: 'INITIATE' })
    }

  }, [readyState, sendMessage])


  return (
    <>

      {cameras &&
        <Canvas state={state} dispatch={dispatch} />}

    </>
  )


}

export default App
