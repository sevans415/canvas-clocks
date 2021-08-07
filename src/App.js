import React, { useState, useRef } from "react";
import Canvas from "./Canvas";
import { drawClock, CANVAS_WIDTH, CANVAS_HEIGHT } from "./drawClock";
import { drawDali } from "./dali/drawPersistenceOfMemory";
import { useStopwatch } from "./timingLogic/useStopwatch";
import { useClockTime } from "./timingLogic/useClockTime";
import { animateTransition } from "./timingLogic/animateTransition";
import "./index.css";

const MODES = {
  clock: "Clock",
  stopwatch: "Stopwatch",
  dali: "🦹🏾‍♀️ Secret mode 🦹‍♂️"
};

const resetStopwatchTime = {
  sec: 0,
  min: 0,
  hr: 0
};

function App() {
  const startTransition = (t1, t2, isClockRunning) => {
    drawFunction.current = animateTransition(t1, t2, isClockRunning, () => {
      drawFunction.current = drawClock;
    });
  };

  const { stopwatchTime, resetStopwatch, isPaused, togglePause } = useStopwatch(
    t1 => startTransition(t1, resetStopwatchTime, false)
  );

  const clockTime = useClockTime();

  const [currentMode, setCurrentMode] = useState(MODES.clock);

  const drawFunction = useRef(drawClock);

  const toggleMode = nextMode => {
    if (currentMode === MODES.dali) {
      // in this case, we don't want to animate a transition
      setCurrentMode(nextMode);
      drawFunction.current = drawClock;
    } else {
      if (nextMode === MODES.clock) {
        startTransition(stopwatchTime, clockTime, true);
        setCurrentMode(MODES.clock);
      } else if (nextMode === MODES.stopwatch) {
        startTransition(clockTime, stopwatchTime, !isPaused);
        setCurrentMode(MODES.stopwatch);
      } else if (nextMode === MODES.dali) {
        setCurrentMode(MODES.dali);
        drawFunction.current = drawDali;
      }
    }
  };

  return (
    <div className="main">
      <div className="buttons">
        {currentMode !== MODES.stopwatch && (
          <button onClick={() => toggleMode(MODES.stopwatch)}>
            {MODES.stopwatch}
          </button>
        )}
        {currentMode !== MODES.dali && (
          <button onClick={() => toggleMode(MODES.dali)}>{MODES.dali}</button>
        )}
        {currentMode !== MODES.clock && (
          <button onClick={() => toggleMode(MODES.clock)}>{MODES.clock}</button>
        )}
        {currentMode === MODES.stopwatch && (
          <React.Fragment>
            <button onClick={resetStopwatch}>Reset</button>
            <button onClick={togglePause}>{isPaused ? "Play" : "Pause"}</button>
          </React.Fragment>
        )}
      </div>
      <Canvas
        draw={drawFunction.current}
        config={currentMode === MODES.stopwatch ? stopwatchTime : clockTime}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    </div>
  );
}

export default App;
