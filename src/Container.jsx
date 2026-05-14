import { useState } from "react";
import App from "./App";
import AppExplanation from "./AppExplanation";
import Sidebar from "./Sidebar";
import Leaky from "./Leaky";
import AppWithSetInterval from "./AppWithSetInterval";
import AppWithoutMemo from "./AppWithoutMemo";

const Container = () => {
  const [visible, setVisible] = useState({ working: true, leaky: false });

  const handleClick = (e) => {
    e.preventDefault();
    setVisible({ [e.target.value]: true });
  };

  return (
    <>
      <div id="main">
        <div id="sidebar">
          <Sidebar handleClick={handleClick} />
        </div>
        <div id="app">
          {visible.working && (
            <>
              <App></App>
            </>
          )}
          {visible.leaky && <Leaky></Leaky>}
          {visible.interval && <AppWithSetInterval />}
          {visible.unmemoized && <AppWithoutMemo></AppWithoutMemo>}
        </div>
        <div id="explanation">
          <AppExplanation visible={visible}></AppExplanation>
        </div>
      </div>
    </>
  );
};

export default Container;
