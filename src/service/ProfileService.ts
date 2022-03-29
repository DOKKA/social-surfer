import cors_fetch from "../util/CorsFetch";





export default class ProfileService{

    profileURL:string;
    image: string|null;
    summary: string | null;
    constructor(profileURL:string){
        this.profileURL = profileURL;
        this.image = null;
        this.summary = null;
    }

    async getProfileJSON(){
        let json = await cors_fetch(this.profileURL,{
            'Accept': 'application/activity+json'
        });

        this.image = json.icon.url;
        this.summary = json.summary;
    }
}