import { useState } from "react";

import CanvasWithoutMemo from "./CanvasWithoutMemo";

function AppWithoutMemo({ numFaces }) {
  const [irrelevantValue, setIrrelevantValue] = useState();
  const handleClick = () => {
    setIrrelevantValue(Math.floor(Math.random() * 10));
  };
  return (
    <>
      <h1>
        Without <code>Memo</code>
      </h1>
      <CanvasWithoutMemo numFaces={numFaces} />
      Irrelevant value: {irrelevantValue}
      <button onClick={handleClick}>Force parent to rerender</button>
    </>
  );
}

export default AppWithoutMemo;
