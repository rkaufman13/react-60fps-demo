import { useState } from "react";

import CanvasWithoutMemo from "./CanvasWithoutMemo";

function AppWithoutMemo({ numFaces }) {
  const [irrelevantValue, setIrrelevantValue] = useState();
  const handleClick = () => {
    setIrrelevantValue(Math.floor(Math.random() * 10));
  };
  return (
    <>
      <CanvasWithoutMemo numFaces={numFaces} />
      Irrelevant value: {irrelevantValue}
      <button onClick={handleClick}>
        Change an irrelevant-to-the-animation value
      </button>
    </>
  );
}

export default AppWithoutMemo;
