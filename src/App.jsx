import { useState } from "react";

import Canvas from "./Canvas";

function App({ numFaces }) {
  const [irrelevantValue, setIrrelevantValue] = useState();
  const handleClick = () => {
    setIrrelevantValue(Math.floor(Math.random() * 10));
  };
  return (
    <>
      <Canvas numFaces={numFaces} />
      Irrelevant value: {irrelevantValue}
      <button onClick={handleClick}>Force parent component to rerender</button>
    </>
  );
}

export default App;
