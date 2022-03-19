interface WebfingerLink {
    rel: string;
    href: string;
    type: string;
    template: string;
}

 interface Webfinger {
    subject: string;
    aliases: string[];
    links: WebfingerLink[];
}


interface NodeInfoLink {
    href: string;
    rel: string;
}

interface NodeInfo {
    links: NodeInfoLink[];
}

export default class BasicInfoService{
    address: string;
    domain: string;
    profileURL?: string;
    nodeInfoURL?: string;

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

    async getNodeInfoURL(){
        let url = new URL('https://'+this.domain+'/.well-known/nodeinfo');
        let request1 = await fetch(url.toString());
        let json1: NodeInfo = await request1.json();
        let links = json1.links.filter(l => l.rel.includes('2.0'))
        if(links.length > 0){
            this.nodeInfoURL = links[0].href;
        }
    }



}