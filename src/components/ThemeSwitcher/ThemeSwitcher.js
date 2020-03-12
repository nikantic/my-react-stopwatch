import React, { Component } from "react";

class ThemeSwitcher extends Component {
  state = {
    activeTheme: "darkThemeColors",
    darkThemeColors: {
      "--bg-color": "#000",
      "--text-color": "#fff",
      "--grey-color": "#171717",
      "--grey-color-2": "#bdbdbd"
    },
    lightThemeColors: {
      "--bg-color": "#fff",
      "--text-color": "#333",
      "--grey-color": "#efefef",
      "--grey-color-2": "#e4e4e4"
    }
  };

  ChangeTheme = () => {
    let newActiveTheme =
      this.state.activeTheme === "darkThemeColors"
        ? "lightThemeColors"
        : "darkThemeColors";
    this.setState(prevState => ({
      ...prevState,
      activeTheme: newActiveTheme
    }));

    for (let key in this.state.newActiveTheme) {
      document.documentElement.style.setProperty(
        key,
        this.state.newActiveTheme[key]
      );
    }
  };

  render() {
    return <div className="ThemeSwitcher" onClick={this.ChangeTheme} />;
  }
}

export default ThemeSwitcher;
