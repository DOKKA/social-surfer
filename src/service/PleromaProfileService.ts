
 interface ProfileJSON {
    "@context": [string, string, Context]
    alsoKnownAs: any[]
    attachment: Attachment[]
    capabilities: Capabilities
    discoverable: boolean
    endpoints: Endpoints
    featured: string
    followers: string
    following: string
    icon: Icon
    id: string
    image: Image
    inbox: string
    manuallyApprovesFollowers: boolean
    name: string
    outbox: string
    preferredUsername: string
    publicKey: PublicKey
    summary: string
    tag: any[]
    type: string
    url: string
  }
  
   interface Context {
    "@language": string
  }
  
   interface Attachment {
    name: string
    type: string
    value: string
  }
  
   interface Capabilities {
    acceptsChatMessages: boolean
  }
  
   interface Endpoints {
    oauthAuthorizationEndpoint: string
    oauthRegistrationEndpoint: string
    oauthTokenEndpoint: string
    sharedInbox: string
    uploadMedia: string
  }
  
   interface Icon {
    type: string
    url: string
  }
  
   interface Image {
    type: string
    url: string
  }
  
   interface PublicKey {
    id: string
    owner: string
    publicKeyPem: string
  }
  



export default class PleromaProfileService{

    profileURL:string;
    constructor(profileURL:string){
        this.profileURL = profileURL;
    }

    async getProfileJSON(){
        let request = await fetch(this.profileURL,{
            headers:{
                'Accept': 'application/activity+json'
            }
        });
        let asdf:ProfileJSON = await request.json()
        console.log(asdf);
    }
}