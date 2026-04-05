import React from "react";

const Sidebar = ({ handleClick, numFaces, handleToggle }) => {
  return (
    <>
      <label htmlFor="toggle">One face</label>
      <input
        type="range"
        step="1"
        min="0"
        max="1"
        className="toggle-slider"
        value={numFaces}
        onChange={handleToggle}
        id="toggle"
      />
      <label htmlFor="toggle">many faces</label>
      <button value="working" onClick={handleClick}>
        Final working example
      </button>
      <button value="leaky" onClick={handleClick}>
        Memory leak version (don't do this!)
      </button>
      <button value="interval" onClick={handleClick}>
        Using setInterval instead of requestAnimationFrame
      </button>
      <button value="unmemoized" onClick={handleClick}>
        Without React.memo()
      </button>
    </>
  );
};

export default React.memo(Sidebar);
