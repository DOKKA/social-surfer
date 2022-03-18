interface Link {
    rel: string;
    href: string;
    type: string;
    template: string;
}

 interface Webfinger {
    subject: string;
    aliases: string[];
    links: Link[];
}


export default class BasicInfoService{
    address: string;
    domain: string;
    profileURL?: string;

    constructor(address:string){
        let arrAddress = address.trim().split('@');
        arrAddress = arrAddress.filter( (a)=> a.length > 0);
        this.domain = arrAddress[1];
        this.address = arrAddress.join('@');
    }

    async getBasicInfo(){
        await this.getProfileURL();
    }

    async getProfileURL(){
        let url = new URL('https://'+this.domain+'/.well-known/webfinger')
        url.search =new URLSearchParams({resource: "acct:" + this.address}).toString();
        
        let request = await fetch(url.toString());
        let json: Webfinger = await request.json();
        let links = json.links.filter(l => l.rel === 'self' || l.rel.includes('webfinger.net/rel/profile-page'));
        
        if(links.length > 0){
            this.profileURL = links.reverse()[0].href;
        }
    }



}