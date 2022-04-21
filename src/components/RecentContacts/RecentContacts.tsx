import { Window, WindowActionsEvent } from "@progress/kendo-react-dialogs";
import React from "react";
import {
    ListBox,
    ListBoxToolbar,
    processListBoxData,
    ListBoxToolbarClickEvent,
    ListBoxItemClickEvent,
  } from "@progress/kendo-react-listbox";
import { Contact } from "../../types/Common";

interface Props {
  onClose(event: WindowActionsEvent): void;
  openFediverseExplorer(address:string): void;
}

interface AppState {
    contacts: Array<Contact>
}
class RecentContacts extends React.Component<Props, {}> {
  state: AppState = {
      contacts: [
        {name: 'dokka', address: 'dokka@mastodon.technology'},
        {name: 'Ash Furrow', address: 'ashfurrow@mastodon.technology'},
        {name: 'Nolan', address: 'nolan@toot.cafe'},
        {name: 'Xpil', address: 'xpil@fosstodon.org'},
        {name: 'Sean Tilley', address: 'sean@social.deadsuperhero.com'},
        {name: 'TILvids', address: 'tilvids@mstdn.social'}
      ]
};

onItemClick = (e: ListBoxItemClickEvent)=>{
  this.props.openFediverseExplorer(e.dataItem.address);
}

  render() {
    return (
      <Window title="Recent Contacts" onClose={this.props.onClose}>
          <ListBox onItemClick={this.onItemClick}
                style={{ height: '100%' ,width:'100%'}} textField={"name"} data={this.state.contacts}>

          </ListBox>
      </Window>
    );
  }
}

export default RecentContacts;
