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
     this.processedOutboxItems = this.processedOutboxItems.concat( await this.processOutboxItems());
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
    if (this.currentOutboxPage !== null && this.currentOutboxPage !== undefined) {
      let json = await cors_fetch(this.currentOutboxPage, {
        Accept: "application/activity+json",
      });
      this.currentOutboxPage = json.next;
      this.outboxItems = json.orderedItems;
    }
  }


  async processOutboxItems(): Promise<Array<OutboxItem>> {
    let list = [];
    for(let x = 0; x<this.outboxItems.length; x++){
      let item = this.outboxItems[x];
      if(this.software === 'friendica'){
        list.push({
          published: moment(item.published).fromNow(),
          contentText: this.htmlDecode(item.content)??'',
          content: item.content,
          inReplyTo: item.inReplyTo,
          selected: false,
          id: LicensePlate(),
          url: item.id
        });
      } else {
        if(typeof item.object === 'string' ){
          try{
            let json = await cors_fetch(item.object,{
              Accept: "application/activity+json",
            })
            let content = json.content || '';
            list.push({
              published: moment(json.published).fromNow(),
              contentText: 'BOOST: '+this.htmlDecode(content) ?? '',
              content: content,
              //boosts cant be replies
              inReplyTo: null,
              id: LicensePlate(),
              url: json.id,
              selected: false,
            });
          } catch(e){
            console.error(e);
          }


        } else{
          let content = item.object.content || '';
          list.push({
            published: moment(item.published).fromNow(),
            contentText: this.htmlDecode(content) ?? '',
            content: content,
            inReplyTo: item.object.inReplyTo,
            id: LicensePlate(),
            url: item.object.id || item.object,
            selected: false,
          })
        }
      }
    }
  
    return list.filter((item)=>{    
      return item.inReplyTo === null || item.inReplyTo === undefined
    });
  
  }

}
