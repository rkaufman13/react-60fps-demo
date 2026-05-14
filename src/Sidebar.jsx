import React from "react";

const Sidebar = ({ handleClick }) => {
  return (
    <div id="sidebar">
      <button value="working" onClick={handleClick}>
        Final working example
      </button>
      <button value="interval" onClick={handleClick}>
        Using setInterval instead of requestAnimationFrame
      </button>
      <button value="unmemoized" onClick={handleClick}>
        Without React.memo()
      </button>
    </div>
  );
};

export default React.memo(Sidebar);
