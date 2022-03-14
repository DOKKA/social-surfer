import React from "react";
import "./App.css";
import { Menu, MenuItem, MenuSelectEvent } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import Windowtest from "./components/WindowTest";
import LicensePlate from "./util/LicensePlate";
import FediverseExplorer from "./components/FediverseExplorer/FediverseExplorer";

type Window = {
  windowType: string;
  id: string;
};

type MyState = {
  windows: Array<Window>;
};

class App extends React.Component {
  state: MyState = {
    windows: [],
  };

  render() {
    let asdf = this.state.windows.map((win) => {
      if (win.windowType === "fediverse-explorer") {
        return (
          <FediverseExplorer key={win.id} onClose={() => this.closeWindow(win.id)} />
        );
      } else {
        return (
          <Windowtest key={win.id} onClose={() => this.closeWindow(win.id)} />
        );
      }
    });
    return (
      <div className="outer">
        <Menu
          style={{ backgroundColor: "#f0f0f0" }}
          onSelect={this.handleSelect}
        >
          <MenuItem text="Menu Tests">
            <MenuItem text="Child item" />
          </MenuItem>
          <MenuItem text="Window Test" data="window-test" />
          <MenuItem text="Fediverse Explorer" data="fediverse-explorer" />
        </Menu>
        <div className="main">{asdf}</div>
        <footer style={{ textAlign: "center" }}>
          Social Surfer ©2022 Created by DOKKA {LicensePlate()}
        </footer>
      </div>
    );
  }

  handleSelect = (e: MenuSelectEvent) => {
    if (e.item.data === "window-test" || e.item.data === "fediverse-explorer") {
      this.openWindow(e.item.data);
    }
  };

  closeWindow = (win: string) => {
    let allWindows = this.state.windows;
    let windows: Array<Window> = [];
    allWindows.forEach((element) => {
      if (element.id === win) {
      } else {
        windows.push(element);
      }
    });
    console.log("closing " + win);
    this.setState((state) => ({
      windows: windows,
    }));
  };

  openWindow = (windowType: string) => {
    // like this
    this.setState((state) => ({
      windows: [
        ...this.state.windows,
        { id: LicensePlate(), windowType: windowType },
      ],
    }));
  };
}

export default App;
