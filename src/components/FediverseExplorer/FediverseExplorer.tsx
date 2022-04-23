import "./FediverseExplorer.css";
import { Window, WindowActionsEvent } from "@progress/kendo-react-dialogs";
import React, { RefObject } from "react";
import { Input, InputChangeEvent } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Splitter, SplitterOnChangeEvent } from "@progress/kendo-react-layout";
import { getSelectedState ,Grid, GridColumn, GridNavigationActionEvent, GridSelectionChangeEvent } from "@progress/kendo-react-grid";
import WebfingerService from "../../service/WebfingerService";
import ProfileService from "../../service/ProfileService";
import OutboxService from "../../service/OutboxService";
import { OutboxItem,Attachment } from "../../types/Common";
import { getter } from "@progress/kendo-react-common";



interface Props {
  onClose(event: WindowActionsEvent): void;
  address?:string;
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
  content: string|null;
  processedOutboxItems: Array<OutboxItem>;
  outboxService: OutboxService | null;
  selectedState: {
    [id: string]: boolean | number[];
  };
  attachments: Attachment[];
  yyy: null|number;
}
const idGetter = getter('id');
class FediverseExplorer extends React.Component<Props, {}> {
  contentRef: React.RefObject<HTMLDivElement>;
  
constructor(props:Props){
  super(props);
  this.contentRef = React.createRef();
}

  state: AppState = {
    address: this.props.address ?? '',
    profileLink: '',
    panes: [{ size: "20%", collapsible: true }, {}],
    innerPanes: [{}, {}],
    gridHeight: '321px',
    profileImage: null,
    summary: null,
    name: null,
    processedOutboxItems: [],
    selectedState: {},
    content: null,
    outboxService: null,
    attachments: [],
    yyy:null
  };



  onChange = (event: SplitterOnChangeEvent) => {
    this.setState({
      panes: event.newState,
    });
  };

  onChangeInner = (event: SplitterOnChangeEvent) => {
    let height = this.contentRef.current?.closest('.k-window-content')?.clientHeight;
    if(event.newState[0].size?.includes('px')){
      let asdf = event.newState[0].size.replace('px','')
      let zzz = parseInt(asdf);
      if(height){
        let aaa = height-zzz;
        this.setState({yyy:aaa});
      }
      
    }
    console.log(height);
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
        this.state.outboxService = outboxService;
        await outboxService.getOutbox();
        this.setState({
          processedOutboxItems: outboxService.processedOutboxItems
        });
      }
    }
  }


  onSelectionChange = async (event: GridSelectionChangeEvent) => {
    const selectedState = getSelectedState({
      event,
      selectedState: this.state.selectedState,
      dataItemKey: 'id',
    });
    let theKey = Object.keys( selectedState)[0];
    let theValue = this.getValue(theKey);
    
    this.setState({ 
      selectedState: selectedState,
      content: theValue?.content,
      attachments: theValue?.attachment ?? []
    });

    let index = event.endRowIndex;


    if(index === this.state.processedOutboxItems.length-1){
      await this.state.outboxService?.getOutbox();
      this.setState({
        processedOutboxItems: this.state.outboxService?.processedOutboxItems,
        selectedState,
        content: theValue?.content,
        attachments: theValue?.attachment ?? []
      });
    }
    
  };

  onNavigationAction = async (event: GridNavigationActionEvent) =>{
    
    let index = parseInt(event.focusElement.parentElement.getAttribute('data-grid-row-index'));
    if(index >= 0){
      let item = this.state.processedOutboxItems[index];
      let id = item.id;
      let selectedState:any = {};
      selectedState[id]=true;
      let theValue = this.getValue(id);
      this.setState({
        selectedState,
        content: theValue?.content,
        attachments: theValue?.attachment ?? []
      });

      if(index === this.state.processedOutboxItems.length-1){
        await this.state.outboxService?.getOutbox();
        this.setState({
          processedOutboxItems: this.state.outboxService?.processedOutboxItems,
          selectedState,
          content: theValue?.content,
          attachments: theValue?.attachment ?? []
        });
      }

    } else {
      this.setState({
        selectedState: {},
        content: null
      });
    }

  };

  getValue = (id: string) =>{
    let matches = this.state.processedOutboxItems.filter( (item)=>{
      return id === item.id;
    });
    if(matches.length > 0){
      return matches[0];
    } else {
      return null;
    }
  }

  onAddressChange = (event: InputChangeEvent) => {
    this.setState({
      address: event.target.value
    });
  }


  componentDidMount(){
    if(this.state.address.length > 0){
      this.onSearch();
    }
  }

  render() {

    let title = "Fediverse Explorer";
    let aaaaa = '20%';
    if(this.state.yyy){
      aaaaa = this.state.yyy-100 + 'px';
    }
    if (this.state.name) {
      title = title + " - " + this.state.name;
    }

  
      let arr = this.state.attachments;
      let renderedAttachments = arr.map( (a,i)=> {
        if(a.mediaType.includes('image')){
          return(
            <div key={i}>
            <img src={a.url} alt={a.name} style={{maxHeight: '50%',maxWidth:'50%'}} />
            </div>
          );
        } else if(a.mediaType.includes('video')){
          return(
            <div key={i}>
            <video controls style={{maxHeight: '50%',maxWidth:'50%'}}>
              <source src={a.url} type={a.mediaType} />
            </video>
            </div>
          );
        } else {
          return(<div key={i}></div>);
        }
      });
    

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
              navigatable={true}
              style={{height: this.state.gridHeight}} 
              data={this.state.processedOutboxItems.map((item) => ({
                ...item,
                selected: this.state.selectedState[idGetter(item)],
              }))}
              selectable={{mode: 'single'}}
              selectedField={"selected"}
              onSelectionChange={this.onSelectionChange}
              onNavigationAction={this.onNavigationAction}
              >
                <GridColumn field="contentText" title="Text" />
                <GridColumn field="published" title="Published" width="120px" />
                
              </Grid>
              <div ref={this.contentRef}  style={{height: '100px'}}>
              {this.state.content ? <div dangerouslySetInnerHTML={{ __html: this.state.content }} /> : <br />}
              
               {renderedAttachments} 

              </div>
            </Splitter>
          </Splitter>
        </div>

      </Window>
    );
  }
}

export default FediverseExplorer;
