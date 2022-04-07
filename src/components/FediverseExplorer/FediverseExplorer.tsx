import "./FediverseExplorer.css";
import { Window, WindowActionsEvent } from "@progress/kendo-react-dialogs";
import React from "react";
import { Input, InputChangeEvent } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Splitter, SplitterOnChangeEvent } from "@progress/kendo-react-layout";
import { getSelectedState, Grid, GridColumn, GridSelectionChangeEvent } from "@progress/kendo-react-grid";
import WebfingerService from "../../service/WebfingerService";
import ProfileService from "../../service/ProfileService";
import OutboxService from "../../service/OutboxService";
import { OutboxItem } from "../../types/Common";
import { getter } from "@progress/kendo-react-common";

interface Props {
  onClose(event: WindowActionsEvent): void;
}

interface AppState {
  address: string;
  profileLink: string;
  panes: Array<any>;
  innerPanes: Array<any>;
  gridHeight: string;
  profileImage: string | null;
  summary: string | null;
  name: string | null;
  processedOutboxItems: Array<OutboxItem>;
  selectedState: {
    [id: string]: boolean | number[];
  };
}
const idGetter = getter('id');
class FediverseExplorer extends React.Component<Props, {}> {
  state: AppState = {
    address: 'kevin@friendgroup.social',
    profileLink: '',
    panes: [{ size: "20%", collapsible: true }, {}],
    innerPanes: [{}, {}],
    gridHeight: '321px',
    profileImage: null,
    summary: null,
    name: null,
    processedOutboxItems: [],
    selectedState: {},
  };

  onChange = (event: SplitterOnChangeEvent) => {
    this.setState({
      panes: event.newState,
    });
  };

  onChangeInner = (event: SplitterOnChangeEvent) => {
    this.setState({
      innerPanes: event.newState,
      gridHeight: event.newState[0].size
    });
  };

  onSearch = async () => {
    let basicInfo = new WebfingerService(this.state.address);
    await basicInfo.getBasicInfo();
    if (basicInfo.profileURL !== null && basicInfo.profileURL !== undefined) {
      let profileService = new ProfileService(basicInfo.profileURL);
      await profileService.getProfileJSON();
      this.setState({
        profileLink: basicInfo.profileURL,
        profileImage: profileService?.image,
        summary: profileService?.summary,
        name: profileService?.name
      });
      if (profileService.outbox !== null && basicInfo.software !== null) {
        let outboxService = new OutboxService(profileService.outbox, basicInfo.software);
        await outboxService.getOutbox();
        this.setState({
          processedOutboxItems: outboxService.processedOutboxItems
        })
      }
    }
  }


  onSelectionChange = (event: GridSelectionChangeEvent) => {
    const selectedState = getSelectedState({
      event,
      selectedState: this.state.selectedState,
      dataItemKey: 'id',
    });
    this.setState({ selectedState });
  };
  onAddressChange = (event: InputChangeEvent) => {
    this.setState({
      address: event.target.value
    });
  }

  render() {

    let title = "Fediverse Explorer";
    if (this.state.name) {
      title = title + " - " + this.state.name;
    }

    return (
      <Window title={title} onClose={this.props.onClose} initialHeight={768} initialWidth={1024}>
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
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: '0 5px' }}>
              {this.state.profileImage ? <img src={this.state.profileImage} alt={this.state.address} /> : <br />}
              {this.state.summary ? <div dangerouslySetInnerHTML={{ __html: this.state.summary }} /> : <br />}
            </div>
            <Splitter
              panes={this.state.innerPanes}
              orientation={"vertical"}
              onChange={this.onChangeInner}
            >
              <Grid 
              style={{height: this.state.gridHeight}} 
              data={this.state.processedOutboxItems.map((item) => ({
                ...item,
                selected: this.state.selectedState[idGetter(item)],
              }))}
              selectable={{mode: 'single'}}
              selectedField={"selected"}
              onSelectionChange={this.onSelectionChange}
              >
                <GridColumn field="contentText" title="Text" />
                <GridColumn field="published" title="Published" width="120px" />
                
              </Grid>
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
