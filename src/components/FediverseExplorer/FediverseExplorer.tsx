import { Window, WindowActionsEvent } from "@progress/kendo-react-dialogs";
import React from "react";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
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
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

          <div style={{ margin: '5px 0', display: 'flex' }}>
            <Input style={{ width: '50%' }} />
            <Button style={{ margin: '0 5px' }}>Search</Button>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}><span>User not found</span></div>
          </div>
          <Splitter
            style={{ flexGrow: 1 }}
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
        </div>

      </Window>
    );
  }
}

export default FediverseExplorer;
