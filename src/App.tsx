import React from "react";
import "./App.css";
import { Menu, MenuItem, MenuSelectEvent } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import Windowtest from "./components/WindowTest";
import LicensePlate from "./util/LicensePlate";
type MyState = {
  windows: Array<string>,
};



class App extends React.Component {
  state: MyState = {
    windows: []
  };

  render() {
    let asdf = this.state.windows.map((win) => {
      return (
        <Windowtest key={win} onClose={() => this.closeWindow(win)}>
          {win}
        </Windowtest>
      );
    });
    return (
      <div className="outer">
        <Menu  style={{ backgroundColor: "#f0f0f0" }} onSelect={this.handleSelect}>
      <MenuItem text="Menu Tests">
        <MenuItem text="Child item" />
      </MenuItem>
      <MenuItem text="Window Test" data="window-test" />
    </Menu>
        <div className="main">
          {asdf}
        </div>
        <footer style={{ textAlign: "center" }}>
          Social Surfer ©2022 Created by DOKKA {LicensePlate()}
        </footer>
      </div>
    );
  }

  handleSelect = (e: MenuSelectEvent) => {
    if(e.item.data ==='window-test'){
      this.openWindow();
    }
  };


  closeWindow = (win: string) => {
    let allWindows = this.state.windows;
    let windows: Array<string> = [];
    allWindows.forEach((element) => {
      if (element === win) {
      } else {
        windows.push(element);
      }
    });
    console.log("closing " + win);
    this.setState((state) => ({
      windows: windows,
    }));
  };

  openWindow = () => {
    // like this
    this.setState((state) => ({
      windows: [
        ...this.state.windows,
        LicensePlate(),
      ],
    }));
  };


}

export default App;
