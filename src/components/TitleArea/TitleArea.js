import React from "react";
import Button from "../Button/Button";
import "./TitleArea.css";

const TitleArea = () => {
  return (
    <div className="TitleArea">
      <h1>React Stopwatch</h1>
      <a
        href="https://github.com/nikantic/my-react-stopwatch"
        target="_blank"
        rel="noopener noreferrer"
      >
        by Nikola Antic <Button buttonClasses="GithubButton" svgIcon="github" />
      </a>
    </div>
  );
};

export default TitleArea;
