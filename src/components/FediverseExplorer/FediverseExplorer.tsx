import { Window, WindowActionsEvent } from "@progress/kendo-react-dialogs";
import React from "react";

import { Splitter, SplitterOnChangeEvent } from "@progress/kendo-react-layout";

interface Props {
  onClose(event: WindowActionsEvent): void;
}

interface AppState {
  panes: Array<any>;
}
class FediverseExplorer extends React.Component<Props, {}> {
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
      <Window title="Fediverse Explorer" onClose={this.props.onClose}>
        <Splitter
          style={{ height: "100%" }}
          panes={this.state.panes}
          onChange={this.onChange}
        >
            <div className="pane-content">
                <p>sidebar</p>
            </div>
            <div className="pane-content">
                <p>main content</p>
            </div>
        </Splitter>
      </Window>
    );
  }
}

export default FediverseExplorer;
