import React, { Component } from "react";
import utils from "../../utils/utils";
import Button from "../Button/Button";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import TitleArea from "../TitleArea/TitleArea";
import SavedResults from "../SavedResults/SavedResults";
import "./Stopwatch.css";

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
    this.timeIntervalValue = 1000 / 60;
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
    this.TimeSvgCircleDashOffset = 756;
    this.TimeSvgCircleRef.current.style.strokeDashoffset = this.TimeSvgCircleDashOffset;
  };

  reinitCircleSVG2 = () => {
    this.TimeSvgCircleDashOffset2 = 629;
    this.TimeSvgCircleRef2.current.style.strokeDashoffset = this.TimeSvgCircleDashOffset2;
  };

  reinitSmallCircle = () => {
    this.TimeSmallCircleRotate = 0;
    this.TimeSmallCircle.current.style.transform =
      "rotateZ(" + this.TimeSmallCircleRotate + "deg)";
  };

  UpdateSaveTime = () => {
    if (this.state.isRunning && this.state.isSaveRunning) {
      this.saveTimeInterval = setInterval(() => {
        let newSaveTimeState = utils.calcTime(this.state.saveTime);
        this.setState(prevState => ({
          ...prevState,
          saveTime: newSaveTimeState
        }));
      }, this.timeIntervalValue);
    }
  };

  UpdateTime = () => {
    this.timeInterval = setInterval(() => {
      let oldTimeState = utils.calcTime(this.state.time);

      // Update main circle position
      this.TimeSvgCircleDashOffset -= 0.207;
      this.TimeSvgCircleRef.current.style.strokeDashoffset = this.TimeSvgCircleDashOffset;
      this.TimeSvgCircle2Rotate += 0.0983;

      if (this.TimeSvgCircleDashOffset < 0) {
        this.reinitCircleSVG();
      }
      if (this.TimeSvgCircleDashOffset2 < 0) {
        this.reinitCircleSVG2();
      }
      if (this.TimeSvgCircle2Rotate > 359) {
        this.TimeSvgCircle2Rotate = 0;
      }

      // Update inner circle position
      if (this.state.isSaveRunning) {
        this.TimeSvgCircleDashOffset2 -= 0.172;
        this.TimeSvgCircleRef2.current.style.strokeDashoffset = this.TimeSvgCircleDashOffset2;
      } else {
        this.TimeSvgCircleRef2.current.style.transform =
          "rotateZ(" + this.TimeSvgCircle2Rotate + "deg)";
      }

      // Update small circle position
      this.TimeSmallCircleRotate += 5.9;
      if (this.TimeSmallCircleRotate > 359) {
        this.TimeSmallCircleRotate = 0;
      }
      this.TimeSmallCircle.current.style.transform =
        "rotateZ(" + this.TimeSmallCircleRotate + "deg)";

      this.setState(prevState => ({
        ...prevState,
        time: oldTimeState
      }));
    }, this.timeIntervalValue);
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
          this.TimeSvgCircleRef.current.style.opacity = "1";
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
    clearInterval(this.saveTimeInterval);
    this.timeInterval = null;
    this.saveTimeInterval = null;
    this.reinitCircleSVG();
    this.reinitCircleSVG2();
    this.reinitSmallCircle();
    this.TimeSvgCircle2Rotate = 0;
    this.TimeSvgCircleRef2.current.style.transform = "rotateZ(" + 0 + "deg)";
    this.TimeSvgCircleRef.current.style.transition = ".5s";
    this.TimeSvgCircleRef2.current.style.transition = ".5s";

    setTimeout(() => {
      this.TimeSvgCircleRef.current.style.transition = "";
      this.TimeSvgCircleRef2.current.style.transition = "";
      this.TimeSvgCircleRef.current.style.opacity = "0";
      this.TimeSvgCircleRef2.current.style.opacity = "0";
    }, 500);

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
    this.TimeSvgCircleRef2.current.style.opacity = "1";
    this.TimeSvgCircleRef2.current.style.transform =
      "rotateZ(" + this.TimeSvgCircle2Rotate + "deg)";
    this.reinitCircleSVG2();

    const saveResultMs = utils.timeToMiliseconds(this.state.saveTime) * 1000;
    const endTimeFormated = utils.formatSavedResult(this.state.time);
    let savedResultFormated = utils.formatSavedResult(this.state.saveTime);
    let startTimeFormated;

    if (this.state.savedResults.length) {
      startTimeFormated = this.state.savedResults[
        this.state.savedResults.length - 1
      ].endTimeFormated;
    } else {
      savedResultFormated = endTimeFormated;
      startTimeFormated = utils.formatSavedResult({
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

  render() {
    return (
      <div className="App">
        <TitleArea />
        <div className="MainHolder">
          <div className="TimeHolder">
            <div className="ThemeSwitcherHolder">
              <ThemeSwitcher />
            </div>
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
                <div>{utils.formatNumber(this.state.saveTime.minutes)}</div>
                <span>:</span>
                <div>{utils.formatNumber(this.state.saveTime.seconds)}</div>
                <span>:</span>
                <div>{utils.formatNumber(this.state.saveTime.miliseconds)}</div>
              </div>
            ) : null}
            <div className="TimeItem">
              {utils.formatNumber(this.state.time.minutes)}
            </div>
            <span>:</span>
            <div className="TimeItem">
              {utils.formatNumber(this.state.time.seconds)}
            </div>
            <span>:</span>
            <div className="TimeItem">
              {utils.formatNumber(this.state.time.miliseconds)}
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
          <SavedResults savedResults={this.state.savedResults} />
        ) : null}
      </div>
    );
  }
}

export default Stopwatch;
