import { Window, WindowActionsEvent } from "@progress/kendo-react-dialogs";
import React from "react";
import { Input, InputChangeEvent } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Splitter, SplitterOnChangeEvent } from "@progress/kendo-react-layout";
import WebfingerService from "../../service/WebfingerService";
import ProfileService from "../../service/ProfileService";
import cors_fetch from "../../util/CorsFetch";

interface Props {
  onClose(event: WindowActionsEvent): void;
}

interface AppState {
  address: string;
  profileLink: string;
  panes: Array<any>;
  innerPanes: Array<any>;
  profileImage: string|null;
  summary: string|null;
}
class FediverseExplorer extends React.Component<Props, {}> {
  state: AppState = {
    address: 'kevin@friendgroup.social',
    profileLink: '',
    panes: [{ size: "20%", collapsible: true }, {}],
    innerPanes: [{}, {}],
    profileImage: null,
    summary: null,
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
      let profileService = new ProfileService(basicInfo.profileURL);
      await profileService.getProfileJSON();
      this.setState({
        profileLink: basicInfo.profileURL,
        profileImage: profileService?.image,
        summary: profileService?.summary
      });
    }
    
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
            <div style={{height: '100%', display: 'flex', flexDirection: 'column', margin: '0 5px'}}>
              {this.state.profileImage ? <img src={this.state.profileImage} alt={this.state.address}/>: <br/>}
              {this.state.summary ? <div dangerouslySetInnerHTML={{__html: this.state.summary}} /> : <br/> } 
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
