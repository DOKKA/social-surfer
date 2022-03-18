import { Window, WindowActionsEvent } from "@progress/kendo-react-dialogs";
import React from "react";
import { Input, InputChangeEvent } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Splitter, SplitterOnChangeEvent } from "@progress/kendo-react-layout";
import WebFingerService from "../../service/WebfingerService";
import BasicInfoService from "../../service/BasicInfoService";

interface Props {
  onClose(event: WindowActionsEvent): void;
}

interface AppState {
  address: string;
  profileLink: string;
  panes: Array<any>;
  innerPanes: Array<any>;
}
class FediverseExplorer extends React.Component<Props, {}> {
  state: AppState = {
    address: 'kevin@friendgroup.social',
    profileLink: '',
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

  onSearch = async () => {
    //let profileLink = await WebFingerService.getProfileURL(this.state.address);
    let basicInfo = new BasicInfoService(this.state.address);
    await basicInfo.getBasicInfo();
    this.setState({
      profileLink: basicInfo.profileURL
    });
  }

  onAddressChange = (event: InputChangeEvent) => {
    this.setState({
      address: event.target.value
    });
  }

  render() {
    return (
      <Window title="Fediverse Explorer" onClose={this.props.onClose} initialHeight={768} initialWidth={1024}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ margin: '5px 0', display: 'flex' }}>
            <Input style={{ width: '50%' }} value={this.state.address} onChange={this.onAddressChange} />
            <Button style={{ margin: '0 5px' }} onClick={this.onSearch}>Search</Button>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
              <a href={this.state.profileLink} target="_blank" rel="noopener noreferrer">{this.state.profileLink}</a>
            </div>
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
