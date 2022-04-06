import cors_fetch from "../util/CorsFetch";
import { OutboxItem } from "../types/Common";

export default class OutboxService {

  outbox: string | null;
  name: string | null;
  currentOutboxPage: string | null;
  outboxItems: any;
  software: string;
  processedOutboxItems: Array<OutboxItem>;
  constructor(outbox: string, software: string) {
    this.outbox = outbox;
    this.software = software;
    this.name = null;
    this.currentOutboxPage = null;
    this.outboxItems = [];
    this.processedOutboxItems = [];
  }



  async getOutbox() {
    if (this.outbox === null || this.currentOutboxPage === null) {
      await this.getOutboxJSON();
      await this.getOutboxPage();
    } else {
      await this.getOutboxPage();
    }
    this.processOutboxItems();
  }

  async getOutboxJSON() {
    if (this.outbox !== null) {
      let json = await cors_fetch(this.outbox, {
        Accept: "application/activity+json",
      });
      this.currentOutboxPage = json.first;
    }
  }

  async getOutboxPage() {
    if (this.currentOutboxPage !== null) {
      let json = await cors_fetch(this.currentOutboxPage, {
        Accept: "application/activity+json",
      });
      this.currentOutboxPage = json.next;
      this.outboxItems = json.orderedItems;
    }
  }

processOutboxItems(){
  this.processedOutboxItems = this.outboxItems.map((item: any)=>{
    if(this.software ==='friendica'){
      return {
        published: new Date(item.published),
        contentText: item.content.replace(/<\/?[^>]+(>|$)/g, ""),
        content: item.content,
        inReplyTo: item.inReplyTo,
        id: item.id
      }
    } else {
      let content = item.object.content || '';
      return {
        published: new Date(item.published),
        contentText: content.replace(/<\/?[^>]+(>|$)/g, ""),
        content: content,
        inReplyTo: item.object.inReplyTo,
        id: item.object.id
      }
    }
  });
  console.log(this.processedOutboxItems);
}

}
