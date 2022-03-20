




export default class ProfileService{

    profileURL:string;
    constructor(profileURL:string){
        this.profileURL = profileURL;
    }

    //you will need a different profileservice for
    //friendica
    //mastodon
    //pleroma
    //generic
    async getProfileJSON(){
        let request = await fetch(this.profileURL,{
            headers:{
                'Accept': 'application/activity+json'
            }
        });
        let asdf = await request.json()
        console.log(asdf);
    }
}