import cors_fetch from "../util/CorsFetch";

//type NullableString = string|null;

export default class ProfileService {
  profileURL: string;
  image: string | null;
  summary: string | null;
  followers: string | null;
  following: string | null;
  inbox: string | null;
  outbox: string | null;
  name: string | null;
  currentOutboxPage: string | null;
  outboxItems: any;
  constructor(profileURL: string) {
    this.profileURL = profileURL;
    this.image = null;
    this.summary = null;
    this.followers = null;
    this.following = null;
    this.inbox = null;
    this.outbox = null;
    this.name = null;
    this.currentOutboxPage = null;
    this.outboxItems = [];
  }

  async getProfileJSON() {
    let json = await cors_fetch(this.profileURL, {
      Accept: "application/activity+json",
    });

    this.image = json.icon.url;
    this.summary = json.summary;
    this.followers = json.followers;
    this.following = json.following;
    this.inbox = json.inbox;
    this.outbox = json.outbox;
    this.name = json.name || json.preferredUsername;
  }

  async getOutbox() {
    if (this.outbox === null || this.currentOutboxPage === null) {
      await this.getOutboxJSON();
      await this.getOutboxPage();
    } else {
      await this.getOutboxPage();
    }
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
}
