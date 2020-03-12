import React, { Component } from "react";
import "./Stopwatch.css";
import Button from "../Button/Button";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

class Stopwatch extends Component {
  state = {
    time: {
      minutes: 0,
      seconds: 0,
      miliseconds: 0
    },
    saveTime: {
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
    this.saveTimeInterval = null;
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

  timeFunc = time => {
    let oldTimeState = time;
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
    }
    // Minutes
    if (oldTimeState.minutes > 59) {
      oldTimeState.minutes = 0;
    }

    return oldTimeState;
  };

  UpdateSaveTime = () => {
    if (this.state.isRunning && this.state.isSaveRunning) {
      this.saveTimeInterval = setInterval(() => {
        let newSaveTimeState = this.timeFunc(this.state.saveTime);
        this.setState(prevState => ({
          ...prevState,
          saveTime: newSaveTimeState
        }));
      }, 1);
    }
  };

  UpdateTime = () => {
    this.timeInterval = setInterval(() => {
      let oldTimeState = this.timeFunc(this.state.time);

      this.TimeSvgCircleDashOffset -= 0.207;
      this.TimeSvgCircleRef.current.style.strokeDashoffset = this.TimeSvgCircleDashOffset;
      this.TimeSvgCircle2Rotate += 0.098;

      if (this.TimeSvgCircleDashOffset < 0) {
        this.reinitCircleSVG();
      }
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

  FormatNumber = number => {
    return number < 10 ? "0" + number : number;
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
          this.UpdateSaveTime();
        } else {
          // Pause Stopwatch
          clearInterval(this.timeInterval);
          clearInterval(this.saveTimeInterval);
        }
      }
    );
  };

  ResetStopwatch = () => {
    clearInterval(this.timeInterval);
    this.timeInterval = null;
    clearInterval(this.saveTimeInterval);
    this.saveTimeInterval = null;
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
      saveTime: {
        minutes: 0,
        seconds: 0,
        miliseconds: 0
      },
      savedResults: [],
      isRunning: false,
      isSaveRunning: false
    }));
  };

  SaveResult = () => {
    clearInterval(this.saveTimeInterval);
    this.TimeSvgCircleRef2.current.style.transform =
      "rotateZ(" + this.TimeSvgCircle2Rotate + "deg)";
    this.reinitCircleSVG2();

    const saveResultMs = this.TimeToMiliseconds(this.state.saveTime) * 1000;
    const endTimeFormated = this.FormatSavedResult(this.state.time);
    let savedResultFormated = this.FormatSavedResult(this.state.saveTime);
    let startTimeFormated;

    if (this.state.savedResults.length) {
      startTimeFormated = this.state.savedResults[
        this.state.savedResults.length - 1
      ].endTimeFormated;
    } else {
      savedResultFormated = endTimeFormated;
      startTimeFormated = this.FormatSavedResult({
        minutes: 0,
        seconds: 0,
        miliseconds: 0
      });
    }

    this.setState(
      prevState => ({
        ...prevState,
        savedResults: [
          ...prevState.savedResults,
          {
            startTimeFormated: startTimeFormated,
            endTimeFormated: endTimeFormated,
            totalMs: saveResultMs,
            totalMsFormated: savedResultFormated
          }
        ],
        saveTime: {
          minutes: 0,
          seconds: 0,
          miliseconds: 0
        },
        isSaveRunning: true
      }),
      this.UpdateSaveTime
    );
  };

  FormatSavedResult = savedResult => {
    let newSave = "";
    const keys = Object.keys(savedResult);
    const lastKey = keys[keys.length - 1];
    for (var k in savedResult) {
      newSave += this.FormatNumber(savedResult[k]);
      if (k !== lastKey) {
        newSave += ":";
      }
    }
    return newSave;
  };

  render() {
    return (
      <div className="App">
        <div className="TitleArea">
          <h1>React Stopwatch</h1>
          <a
            href="https://nikantic.github.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            by Nikola Antic{" "}
            <Button buttonClasses="GithubButton" svgIcon="github" />
          </a>
          <ThemeSwitcher />
        </div>
        <div className="MainHolder">
          <div className="TimeHolder">
            <div className="TimeSvgHolder">
              <svg width="300" height="300">
                <circle cx="150" cy="150" r="120" />
                <circle ref={this.TimeSvgCircleRef} cx="150" cy="150" r="120" />
                <circle cx="150" cy="150" r="110" />
                <circle
                  ref={this.TimeSvgCircleRef2}
                  cx="150"
                  cy="150"
                  r="100"
                />
              </svg>
            </div>
            {this.state.isSaveRunning ? (
              <div className="SaveTimeHolder">
                <div>{this.FormatNumber(this.state.saveTime.minutes)}</div>
                <span>:</span>
                <div>{this.FormatNumber(this.state.saveTime.seconds)}</div>
                <span>:</span>
                <div>{this.FormatNumber(this.state.saveTime.miliseconds)}</div>
              </div>
            ) : null}
            <div className="TimeItem">
              {this.FormatNumber(this.state.time.minutes)}
            </div>
            <span>:</span>
            <div className="TimeItem">
              {this.FormatNumber(this.state.time.seconds)}
            </div>
            <span>:</span>
            <div className="TimeItem">
              {this.FormatNumber(this.state.time.miliseconds)}
            </div>
            <div className="SmallClock">
              <span ref={this.TimeSmallCircle} />
              <div />
            </div>
          </div>
          <div className="ButtonsHolder">
            {!this.state.isRunning ? (
              <Button
                buttonClasses="StartButton"
                clicked={this.StartStopwatch}
                svgIcon="play"
              />
            ) : (
              <Button
                buttonClasses="PauseButton"
                clicked={this.StartStopwatch}
                svgIcon="pause"
              />
            )}

            {this.timeInterval !== null ? (
              !this.state.isRunning ? (
                <Button
                  buttonClasses="ResetButton"
                  clicked={this.ResetStopwatch}
                  svgIcon="reset"
                />
              ) : (
                <Button
                  buttonClasses="SaveButton"
                  clicked={this.SaveResult}
                  svgIcon="save"
                />
              )
            ) : null}
          </div>
        </div>
        {this.state.savedResults.length ? (
          <div className="SavedResultsHolder">
            <h2>Saved Results</h2>
            <table>
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Start</th>
                  <th>Finish</th>
                  <th>Total Time</th>
                </tr>
              </thead>
              <tbody>
                {this.state.savedResults.map((item, i) => (
                  <tr key={i}>
                    <td>{this.FormatNumber(i + 1)}</td>
                    <td>{item.startTimeFormated}</td>
                    <td>{item.endTimeFormated}</td>
                    <td>{item.totalMsFormated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Stopwatch;
