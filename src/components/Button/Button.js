import React, { Component } from "react";
import "./Button.css";
import svgIcons from "../../svgIcons";

class Button extends Component {
  constructor(props) {
    super(props);
    this.ButtonWrapperRef = React.createRef();
  }

  ButtonClickAnimation = () => {
    if (this.ButtonWrapperRef.current) {
      this.ButtonWrapperRef.current.style.transform = "scale(.98)";
    }

    setTimeout(() => {
      if (this.ButtonWrapperRef.current) {
        this.ButtonWrapperRef.current.style.transform = "scale(1)";
      }
    }, 200);
  };

  render() {
    return (
      <div
        className="ButtonWrapper"
        onClick={this.ButtonClickAnimation}
        ref={this.ButtonWrapperRef}
      >
        <button
          className={"Button " + this.props.buttonClasses}
          onClick={this.props.clicked}
          dangerouslySetInnerHTML={{
            __html: svgIcons["svgIcons"][this.props.svgIcon]
          }}
        />
      </div>
    );
  }
}

export default Button;
