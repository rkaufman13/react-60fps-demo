import { useState } from "react";

import Canvas from "./Canvas";

function App() {
  const [irrelevantValue, setIrrelevantValue] = useState();
  const handleClick = () => {
    setIrrelevantValue(Math.floor(Math.random() * 10));
  };
  return (
    <>
      <h1>Final working example</h1>
      <Canvas />
      Irrelevant value: {irrelevantValue}
      <button onClick={handleClick}>Force parent component to rerender</button>
    </>
  );
}

export default App;
