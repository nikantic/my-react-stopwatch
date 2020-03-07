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
    isSaveRunning: false,
    savedResults: []
  };

  constructor(props) {
    super(props);
    this.timeInterval = null;
    this.TimeSvgCircleRef = React.createRef();
    this.TimeSvgCircleRef2 = React.createRef();
    this.TimeSmallCircle = React.createRef();
    this.TimeSvgCircleDashOffset = 756; // stroke dashoffset length
    this.TimeSvgCircleDashOffset2 = 629; // stroke dashoffset 2 length
    this.TimeSvgCircle2Rotate = 0;
    this.TimeSmallCircleRotate = 0;
  }

  reinitCircleSVG = () => {
    this.TimeSvgCircleDashOffset = 756; // stroke dashoffset length
    this.TimeSvgCircleRef.current.style.strokeDashoffset = this.TimeSvgCircleDashOffset;
  };

  reinitCircleSVG2 = () => {
    this.TimeSvgCircleDashOffset2 = 629; // stroke dashoffset 2 length
    this.TimeSvgCircleRef2.current.style.strokeDashoffset = this.TimeSvgCircleDashOffset2;
  };

  reinitSmallCircle = () => {
    this.TimeSmallCircleRotate = 0;
    this.TimeSmallCircle.current.style.transform =
      "rotateZ(" + this.TimeSmallCircleRotate + "deg)";
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
      this.TimeSvgCircle2Rotate += 0.098;

      if (this.TimeSvgCircleDashOffset2 < 0) {
        this.reinitCircleSVG2();
      }
      if (this.TimeSvgCircle2Rotate > 358) {
        this.TimeSvgCircle2Rotate = 0;
      }
      if (this.state.isSaveRunning) {
        this.TimeSvgCircleDashOffset2 -= 0.172;
        this.TimeSvgCircleRef2.current.style.strokeDashoffset = this.TimeSvgCircleDashOffset2;
      } else {
        this.TimeSvgCircleRef2.current.style.transform =
          "rotateZ(" + this.TimeSvgCircle2Rotate + "deg)";
      }

      this.TimeSmallCircleRotate += 1;

      if (this.TimeSmallCircleRotate > 358) {
        this.TimeSmallCircleRotate = 0;
      }
      this.TimeSmallCircle.current.style.transform =
        "rotateZ(" + this.TimeSmallCircleRotate + "deg)";

      this.setState(prevState => ({
        ...prevState,
        time: oldTimeState
      }));
    }, 1);
  };

  FormatTime = time => {
    return time < 10 ? "0" + time : time;
  };

  FormatMilisecondsToDate = ms => {
    return {
      minutes: Math.floor(ms / 3600000),
      seconds: Math.floor((ms % 3600000) / 60000),
      miliseconds: Math.floor(((ms % 360000) % 60000) / 1000)
    };
  };

  TimeToMiliseconds = time => {
    return time.minutes * 3600 + time.seconds * 60 + time.miliseconds;
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
    this.timeInterval = null;
    this.reinitCircleSVG();
    this.reinitCircleSVG2();
    this.reinitSmallCircle();
    this.TimeSvgCircle2Rotate = 0;
    this.TimeSvgCircleRef2.current.style.transform = "rotateZ(" + 0 + "deg)";
    this.setState(prevState => ({
      ...prevState,
      time: {
        minutes: 0,
        seconds: 0,
        miliseconds: 0
      },
      isRunning: false,
      isSaveRunning: false
    }));
  };

  SaveResult = () => {
    this.TimeSvgCircleRef2.current.style.transform =
      "rotateZ(" + this.TimeSvgCircle2Rotate + "deg)";
    this.reinitCircleSVG2();
    const savedResultString = this.FormatSavedResult(this.state.time);
    const saveResultMs = this.TimeToMiliseconds(this.state.time) * 1000;
    let timeDifference = saveResultMs;
    if (this.state.savedResults.length) {
      const prevItemMs = this.state.savedResults[
        this.state.savedResults.length - 1
      ].startTimeMs;
      timeDifference = timeDifference - prevItemMs;
    }
    const timeDifferenceFormated = this.FormatSavedResult(
      this.FormatMilisecondsToDate(timeDifference)
    );
    this.setState(prevState => ({
      ...prevState,
      savedResults: [
        ...prevState.savedResults,
        {
          startTimeMs: saveResultMs,
          startTimeFormated: savedResultString,
          totalMs: timeDifference,
          totalMsFormated: timeDifferenceFormated
        }
      ],
      isSaveRunning: true
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
              <circle ref={this.TimeSvgCircleRef2} cx="150" cy="150" r="100" />
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
          <div className="SmallClock">
            <span ref={this.TimeSmallCircle} />
            <div />
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
                <li key={i}>
                  <div>{item.startTimeFormated}</div>
                  <div>{item.totalMsFormated}</div>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Stopwatch;
