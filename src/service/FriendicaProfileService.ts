interface VcardHasAddress {
  "@type": string;
  "vcard:country-name": string;
  "vcard:region": string;
  "vcard:locality": string;
}

interface PublicKey {
  id: string;
  owner: string;
  publicKeyPem: string;
}

interface Endpoints {
  sharedInbox: string;
}

interface Icon {
  type: string;
  url: string;
  mediaType: string;
}

interface Attachment {
  type: string;
  name: string;
  value: string;
}

interface Generator {
  type: string;
  name: string;
  url: string;
}

interface ProfileJSON {
  "@context": any[];
  id: string;
  "diaspora:guid": string;
  type: string;
  following: string;
  followers: string;
  inbox: string;
  outbox: string;
  preferredUsername: string;
  name: string;
  "vcard:hasAddress": VcardHasAddress;
  summary: string;
  url: string;
  manuallyApprovesFollowers: boolean;
  discoverable: boolean;
  publicKey: PublicKey;
  endpoints: Endpoints;
  icon: Icon;
  attachment: Attachment[];
  generator: Generator;
}

export default class FriendicaProfileService {
  profileURL: string;
  constructor(profileURL: string) {
    this.profileURL = profileURL;
  }

  async getProfileJSON() {
    let request = await fetch(this.profileURL, {
      headers: {
        Accept: "application/activity+json",
      },
    });
    let asdf: ProfileJSON = await request.json();
  }
}
