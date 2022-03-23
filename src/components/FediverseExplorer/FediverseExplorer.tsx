import { Window, WindowActionsEvent } from "@progress/kendo-react-dialogs";
import React from "react";
import { Input, InputChangeEvent } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Splitter, SplitterOnChangeEvent } from "@progress/kendo-react-layout";
import WebfingerService from "../../service/WebfingerService";
import FriendicaProfileService from "../../service/FriendicaProfileService";
import MastodonProfileService from "../../service/MastodonProfileService";
import PleromaProfileService from "../../service/PleromaProfileService";
import {ProfileInterface} from '../../types/common';

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
    let basicInfo = new WebfingerService(this.state.address);
    await basicInfo.getBasicInfo();
    if(basicInfo.profileURL !== null && basicInfo.profileURL !== undefined){
      let profileService:ProfileInterface | null = null;
      if(basicInfo.software === 'friendica'){
        let profileService = new FriendicaProfileService(basicInfo.profileURL);
        await profileService.getProfileJSON();
      } else if(basicInfo.software === 'mastodon'){
        let profileService = new MastodonProfileService(basicInfo.profileURL);
        await profileService.getProfileJSON();
      } else if(basicInfo.software === 'pleroma'){
        let profileService = new PleromaProfileService(basicInfo.profileURL);
        await profileService.getProfileJSON();
      }
      //generic profile service?
      //diaspora profile service?

    }
    
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
