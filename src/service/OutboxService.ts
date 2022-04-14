import cors_fetch from "../util/CorsFetch";
import { OutboxItem } from "../types/Common";
import moment from "moment";
import LicensePlate from "../util/LicensePlate";

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

   htmlDecode(input:string) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }



  async getOutbox() {
    if (this.outbox === null || this.currentOutboxPage === null) {
      await this.getOutboxJSON();
      await this.getOutboxPage();
    } else {
      await this.getOutboxPage();
    }
     this.processedOutboxItems = this.processedOutboxItems.concat( this.processOutboxItems());
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
  return this.outboxItems.map((item: any)=>{
    if(this.software ==='friendica'){
      return {
        published: moment(item.published).fromNow(),
        //contentText: item.content.replace(/<\/?[^>]+(>|$)/g, ""),
        contentText: this.htmlDecode(item.content),
        content: item.content,
        inReplyTo: item.inReplyTo,
        id: LicensePlate(),
        url: item.id
      }
    } else {
      let content = item.object.content || '';
      return {
        published: moment(item.published).fromNow(),
        //contentText: content.replace(/<\/?[^>]+(>|$)/g, ""),
        contentText: this.htmlDecode(content),
        content: content,
        inReplyTo: item.object.inReplyTo,
        id: LicensePlate(),
        url: item.object.id || item.object
      }
    }
  }).filter((item:OutboxItem)=>{    
    return item.inReplyTo === null || item.inReplyTo === undefined
  });

}

}
