import React from "react";
import utils from "../../utils/utils";
import "./SavedResults.css";

const SavedResults = props => {
  return (
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
          {props.savedResults.map((item, i) => (
            <tr key={i}>
              <td>{utils.formatNumber(i + 1)}</td>
              <td>{item.startTimeFormated}</td>
              <td>{item.endTimeFormated}</td>
              <td>{item.totalMsFormated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedResults;
