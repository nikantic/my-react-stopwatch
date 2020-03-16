const utils = {
  formatNumber: number => {
    return number < 10 ? "0" + number : number;
  },
  timeToMiliseconds: time => {
    return time.minutes * 3600 + time.seconds * 60 + time.miliseconds;
  },
  calcTime: time => {
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
  },
  formatSavedResult: savedResult => {
    let newSave = "";
    const keys = Object.keys(savedResult);
    const lastKey = keys[keys.length - 1];
    for (var k in savedResult) {
      newSave += utils.formatNumber(savedResult[k]);
      if (k !== lastKey) {
        newSave += ":";
      }
    }
    return newSave;
  }
};

export default utils;
