import React from "react";
import "./Button.css";
import svgIcons from "../../svgIcons";

const Button = props => {
  return (
    <button
      className={"Button " + props.buttonClasses}
      onClick={props.clicked}
      dangerouslySetInnerHTML={{ __html: svgIcons["svgIcons"][props.svgIcon] }}
    />
  );
};

export default Button;
