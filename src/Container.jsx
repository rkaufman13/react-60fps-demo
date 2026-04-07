import { useState } from "react";
import App from "./App";
import AppExplanation from "./AppExplanation";
import Sidebar from "./Sidebar";
import Leaky from "./Leaky";
import CanvasWithSetInterval from "./CanvasWithSetInterval";
import AppWithoutMemo from "./AppWithoutMemo";

const Container = () => {
  const [visible, setVisible] = useState({ working: true, leaky: false });
  const [numFaces, setNumFaces] = useState(0);

  const handleClick = (e) => {
    e.preventDefault();
    setVisible({ [e.target.value]: true });
  };

  const handleToggle = (e) => {
    e.preventDefault();
    setNumFaces((prev) => {
      if (prev > 0) {
        return 0;
      } else {
        return 1;
      }
    });
  };

  return (
    <>
      <div id="main">
        <div id="sidebar">
          <Sidebar
            handleClick={handleClick}
            numFaces={numFaces}
            handleToggle={handleToggle}
          />
        </div>
        <div id="app">
          {visible.working && (
            <>
              <App numFaces={numFaces}></App>
            </>
          )}
          {visible.leaky && <Leaky></Leaky>}
          {visible.interval && (
            <CanvasWithSetInterval numFaces={numFaces}></CanvasWithSetInterval>
          )}
          {visible.unmemoized && (
            <AppWithoutMemo numFaces={numFaces}></AppWithoutMemo>
          )}
        </div>
        <div id="explanation">
          <AppExplanation visible={visible}></AppExplanation>
        </div>
      </div>
    </>
  );
};

export default Container;
