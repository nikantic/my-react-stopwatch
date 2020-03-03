import React, { Component } from "react";
import "./Stopwatch.css";

class Stopwatch extends Component {
  state = {
    time: {
      minutes: 0,
      seconds: 0,
      miliseconds: 0
    },
    isRunning: false,
    savedResults: []
  };

  constructor(props) {
    super(props);
    this.timeInterval = null;
    this.TimeSvgCircleRef = React.createRef();
    this.TimeSvgCircleDashOffset = 756; // stroke dashoffset lenght
  }

  reinitCircleSVG = () => {
    this.TimeSvgCircleDashOffset = 756; // stroke dashoffset lenght
    this.TimeSvgCircleRef.current.style.strokeDashoffset = this.TimeSvgCircleDashOffset;
  };

  UpdateTime = () => {
    this.timeInterval = setInterval(() => {
      let oldTimeState = this.state.time;
      // Miliseconds
      if (oldTimeState.miliseconds > 59) {
        oldTimeState.miliseconds = 0;
        oldTimeState.seconds += 1;
      } else {
        oldTimeState.miliseconds += 1;
      }
      // Seconds
      if (oldTimeState.seconds > 59) {
        oldTimeState.seconds = 0;
        oldTimeState.minutes += 1;
        this.reinitCircleSVG();
      }
      // Minutes and Hours
      if (oldTimeState.minutes > 59) {
        oldTimeState.minutes = 0;
      }
      this.TimeSvgCircleDashOffset -= 0.207;
      this.TimeSvgCircleRef.current.style.strokeDashoffset = this.TimeSvgCircleDashOffset;
      this.setState(prevState => ({
        ...prevState,
        time: oldTimeState
      }));
    }, 1);
  };

  FormatTime = time => {
    return time < 10 ? "0" + time : time;
  };

  StartStopwatch = () => {
    this.setState(
      prevState => ({
        ...prevState,
        isRunning: !prevState.isRunning
      }),
      () => {
        if (this.state.isRunning) {
          // Start Stopwatch
          this.UpdateTime();
        } else {
          // Pause Stopwatch
          clearInterval(this.timeInterval);
        }
      }
    );
  };

  ResetStopwatch = () => {
    clearInterval(this.timeInterval);
    this.reinitCircleSVG();
    this.setState(prevState => ({
      ...prevState,
      time: {
        minutes: 0,
        seconds: 0,
        miliseconds: 0
      },
      isRunning: false
    }));
  };

  SaveResult = () => {
    const savedResult = this.FormatSavedResult(this.state.time);
    this.setState(prevState => ({
      ...prevState,
      savedResults: [...prevState.savedResults, savedResult]
    }));
  };

  FormatSavedResult = savedResult => {
    let newSave = "";
    const keys = Object.keys(savedResult);
    const lastKey = keys[keys.length - 1];
    for (var k in savedResult) {
      newSave += this.FormatTime(savedResult[k]);
      if (k !== lastKey) {
        newSave += ":";
      }
    }
    return newSave;
  };

  render() {
    return (
      <div className="App">
        <h1>React Stopwatch</h1>
        <div className="TimeHolder">
          <div className="TimeSvgHolder">
            <svg width="300" height="300">
              <circle cx="150" cy="150" r="120" />
              <circle ref={this.TimeSvgCircleRef} cx="150" cy="150" r="120" />
              <circle cx="150" cy="150" r="110" />
            </svg>
          </div>
          <div className="TimeItem">
            {this.FormatTime(this.state.time.minutes)}
          </div>
          <span>:</span>
          <div className="TimeItem">
            {this.FormatTime(this.state.time.seconds)}
          </div>
          <span>:</span>
          <div className="TimeItem">
            {this.FormatTime(this.state.time.miliseconds)}
          </div>
        </div>
        <button className="Button StartButton" onClick={this.StartStopwatch}>
          {!this.state.isRunning ? "Start" : "Pause"}
        </button>
        <div>
          <button className="Button SaveButton" onClick={this.SaveResult}>
            Save
          </button>
          <button className="Button ResetButton" onClick={this.ResetStopwatch}>
            Reset
          </button>
        </div>
        {this.state.savedResults.length ? (
          <div className="SavedResultsHolder">
            <h2>Saved Results</h2>
            <ol>
              {this.state.savedResults.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Stopwatch;
