import React, { Component } from "react";
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
        <h1>React Stopwatch</h1>
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
              <button className="Button" onClick={this.StartStopwatch}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 511.999 511.999"
                >
                  <path d="M443.86,196.919L141.46,10.514C119.582-2.955,93.131-3.515,70.702,9.016c-22.429,12.529-35.819,35.35-35.819,61.041    v371.112c0,38.846,31.3,70.619,69.77,70.829c0.105,0,0.21,0.001,0.313,0.001c12.022-0.001,24.55-3.769,36.251-10.909    c9.413-5.743,12.388-18.029,6.645-27.441c-5.743-9.414-18.031-12.388-27.441-6.645c-5.473,3.338-10.818,5.065-15.553,5.064    c-14.515-0.079-30.056-12.513-30.056-30.898V70.058c0-11.021,5.744-20.808,15.364-26.183c9.621-5.375,20.966-5.135,30.339,0.636    l302.401,186.405c9.089,5.596,14.29,14.927,14.268,25.601c-0.022,10.673-5.261,19.983-14.4,25.56L204.147,415.945    c-9.404,5.758-12.36,18.049-6.602,27.452c5.757,9.404,18.048,12.36,27.452,6.602l218.611-133.852    c20.931-12.769,33.457-35.029,33.507-59.55C477.165,232.079,464.729,209.767,443.86,196.919z" />
                </svg>
              </button>
            ) : (
              <button className="Button" onClick={this.StartStopwatch}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M124.5,0h-35c-44.112,0-80,35.888-80,80v352c0,44.112,35.888,80,80,80h35c44.112,0,80-35.888,80-80V80    C204.5,35.888,168.612,0,124.5,0z M164.5,432c0,22.056-17.944,40-40,40h-35c-22.056,0-40-17.944-40-40V80    c0-22.056,17.944-40,40-40h35c22.056,0,40,17.944,40,40V432z" />
                  <path d="M482.5,352c11.046,0,20-8.954,20-20V80c0-44.112-35.888-80-80-80h-34c-44.112,0-80,35.888-80,80v352    c0,44.112,35.888,80,80,80h34c44.112,0,80-35.888,80-80c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20    c0,22.056-17.944,40-40,40h-34c-22.056,0-40-17.944-40-40V80c0-22.056,17.944-40,40-40h34c22.056,0,40,17.944,40,40v252    C462.5,343.046,471.454,352,482.5,352z" />
                </svg>
              </button>
            )}

            {this.timeInterval !== null ? (
              !this.state.isRunning ? (
                <button className="Button" onClick={this.ResetStopwatch}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 511.999 511.999"
                  >
                    <path d="M408.735,143.264C367.938,102.467,313.696,79.999,256,79.999h-73.261l45.473-45.928c7.771-7.85,7.708-20.513-0.141-28.284    c-7.85-7.771-20.512-7.708-28.284,0.141l-51.4,51.915c-22.961,23.191-23.094,61.058-0.296,84.411l50.487,51.717    c3.919,4.015,9.113,6.029,14.313,6.029c5.037,0,10.08-1.892,13.97-5.688c7.904-7.716,8.056-20.378,0.34-28.282l-44.934-46.031H256    c97.047,0,176,78.953,176,176c0,30.425-7.881,60.403-22.792,86.691c-5.45,9.608-2.079,21.814,7.529,27.264    c3.116,1.768,6.505,2.607,9.849,2.607c6.966,0,13.733-3.645,17.415-10.136C462.318,370.13,472,333.329,472,295.999    C472,238.303,449.532,184.061,408.735,143.264z" />
                    <path d="M367.585,458.394c-5.307-9.686-17.462-13.236-27.149-7.929c-25.712,14.088-54.909,21.534-84.436,21.534    c-97.047,0-176-78.953-176-176.004c0-11.046-8.954-19.998-20-19.998s-20,8.956-20,20.002c0,57.696,22.468,111.938,63.265,152.735    S198.304,511.999,256,511.999c36.226,0,72.07-9.148,103.656-26.455C369.343,480.236,372.893,468.081,367.585,458.394z" />
                  </svg>
                </button>
              ) : (
                <button className="Button" onClick={this.SaveResult}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 511.999 511.999"
                  >
                    <path d="M495.097,262.582l-101.479-89.955l100.67-84.508c0.046-0.039,0.093-0.078,0.139-0.118    c16.084-13.754,21.739-35.467,14.408-55.32c-7.33-19.851-25.741-32.678-46.902-32.678H79.999C35.887,0.003,0,35.891,0,80.002    v411.994c0,11.046,8.954,20,20,20s20-8.954,20-20V80.002c0-22.056,17.944-39.999,39.999-39.999h381.934    c6.288,0,8.654,4.571,9.381,6.536c0.723,1.958,1.889,6.941-2.83,11.02l-118.338,99.34c-4.454,3.739-7.061,9.233-7.139,15.049    c-0.079,5.815,2.378,11.377,6.731,15.235l118.828,105.332c4.661,4.132,3.452,9.091,2.717,11.031    c-0.737,1.94-3.122,6.453-9.351,6.453H119.998c-11.046,0-20,8.954-20,20c0,11.046,8.954,20,20,20h341.933    c20.963,0,39.311-12.664,46.748-32.262C516.115,298.136,510.784,276.487,495.097,262.582z" />
                  </svg>
                </button>
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
