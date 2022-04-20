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
}

interface AppState {
    contacts: Array<Contact>
}
class RecentContacts extends React.Component<Props, {}> {
  state: AppState = {
      contacts: [{name: 'dokka', address: 'dokka@mastodon.technology'}]
};



  render() {
    return (
      <Window title="Recent Contacts" onClose={this.props.onClose}>
          <ListBox 
                style={{ height: '100%' ,width:'100%'}} textField={"name"} data={this.state.contacts}>

          </ListBox>
      </Window>
    );
  }
}

export default RecentContacts;
