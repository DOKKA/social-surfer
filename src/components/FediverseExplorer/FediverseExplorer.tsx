import { Window, WindowActionsEvent } from "@progress/kendo-react-dialogs";
import React from "react";

import { Splitter, SplitterOnChangeEvent } from "@progress/kendo-react-layout";

interface Props {
  onClose(event: WindowActionsEvent): void;
}

interface AppState {
  panes: Array<any>;
  innerPanes: Array<any>;
}
class FediverseExplorer extends React.Component<Props, {}> {
  state: AppState = {
    panes: [{ size: "20%", collapsible: true }, {}],
    innerPanes: [{}, {}],
  };

  onChange = (event: SplitterOnChangeEvent) => {
    this.setState({
      panes: event.newState,
    });
  };

  onChangeInner = (event: SplitterOnChangeEvent) => {
    this.setState({
      innerPanes: event.newState,
    });
  };

  render() {
    return (
      <Window title="Fediverse Explorer" onClose={this.props.onClose} initialHeight={768} initialWidth={1024}>
        <Splitter
          style={{ height: "100%" }}
          panes={this.state.panes}
          onChange={this.onChange}
        >
          <div className="pane-content">
            <p>sidebar</p>
          </div>
          <Splitter
            panes={this.state.innerPanes}
            orientation={"vertical"}
            onChange={this.onChangeInner}
          >
            <div>
              <p>content1</p>
            </div>
            <div>
              <p>content2</p>
            </div>
          </Splitter>
        </Splitter>
      </Window>
    );
  }
}

export default FediverseExplorer;
