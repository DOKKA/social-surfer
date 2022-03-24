import {ProfileInterface} from '../types/common';

interface PublicKey {
  id: string;
  owner: string;
  publicKeyPem: string;
}

interface Attachment {
  type: string;
  name: string;
  value: string;
}

interface Endpoints {
  sharedInbox: string;
}

interface Icon {
  type: string;
  mediaType: string;
  url: string;
}

interface Image {
  type: string;
  mediaType: string;
  url: string;
}

interface ProfileJSON {
  "@context": any[];
  id: string;
  type: string;
  following: string;
  followers: string;
  inbox: string;
  outbox: string;
  featured: string;
  featuredTags: string;
  preferredUsername: string;
  name: string;
  summary: string;
  url: string;
  manuallyApprovesFollowers: boolean;
  discoverable: boolean;
  published: Date;
  devices: string;
  alsoKnownAs: string[];
  publicKey: PublicKey;
  tag: any[];
  attachment: Attachment[];
  endpoints: Endpoints;
  icon: Icon;
  image: Image;
}

export default class MastodonProfileService implements ProfileInterface{
  profileURL: string;
  image: string|null;
  summary: string | null;
  constructor(profileURL: string) {
    this.profileURL = profileURL;
    this.image = null;
    this.summary = null;
  }

  async getProfileJSON() {
    let request = await fetch(this.profileURL, {
      headers: {
        Accept: "application/activity+json",
      },
    });
    let asdf:ProfileJSON = await request.json();
    console.log(asdf);
    this.image = asdf.icon.url;
    this.summary = asdf.summary;
  }
}
