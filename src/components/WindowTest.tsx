import { Window, WindowActionsEvent } from "@progress/kendo-react-dialogs";
import React from "react";

import { Splitter, SplitterOnChangeEvent } from "@progress/kendo-react-layout";

interface Props {
  onClose(event: WindowActionsEvent): void;
}

interface AppState {
  panes: Array<any>;
}
class WindowTest extends React.Component<Props, {}> {
  state: AppState = {
    panes: [{ size: "20%", collapsible: true }, {}],
  };

  onChange = (event: SplitterOnChangeEvent) => {
    this.setState({
      panes: event.newState,
    });
  };

  render() {
    return (
      <Window title="WindowTest" onClose={this.props.onClose}>
        <Splitter
          style={{ height: "100%" }}
          panes={this.state.panes}
          onChange={this.onChange}
        >
          <div>
            <h3>Sidebar content</h3>
            <p>Collapsible pane</p>
          </div>
          <h3>Main content</h3>
        </Splitter>
      </Window>
    );
  }
}

export default WindowTest;
