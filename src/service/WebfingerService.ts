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

 interface Software {
    name: string;
    version: string;
}

 interface Services {
    inbound: string[];
    outbound: string[];
}

 interface Usage {
}

 interface Metadata {
    nodeName: string;
    explicitContent: boolean;
}

 interface NodeInfoJSON {
    version: string;
    software: Software;
    protocols: string[];
    services: Services;
    usage: Usage;
    openRegistrations: boolean;
    metadata: Metadata;
}

export default class WebfingerService{
    address: string;
    domain: string;
    profileURL?: string;
    nodeInfoURL?: string;
    software?: string;
    softwareVersion?: string;

    constructor(address:string){
        let arrAddress = address.trim().split('@');
        arrAddress = arrAddress.filter( (a)=> a.length > 0);
        this.domain = arrAddress[1];
        this.address = arrAddress.join('@');
    }

    async getBasicInfo(){
        try{
            await this.getProfileURL();
            await this.getNodeInfoURL();
            await this.getNodeInfoJSON();
        } catch(e){
            console.error(e);
        }
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
        let request1 = await fetch('https://api.allorigins.win/get?url='+encodeURIComponent( url.toString()));
        let asdf = await request1.json();
        let json2 = asdf.contents;
        let json3:NodeInfo = JSON.parse(json2);
        let links = json3.links.filter(l => l.rel.includes('2.0'))
        if(links.length > 0){
            this.nodeInfoURL = links[0].href;
        }
    }

    async getNodeInfoJSON(){
        let url = new URL(this.nodeInfoURL!);
        let request1 = await fetch('https://api.allorigins.win/get?url='+encodeURIComponent( url.toString()));
        let asdf = await request1.json();
        let json2 = asdf.contents;
        let json3: NodeInfoJSON = JSON.parse( json2);
        this.software = json3.software.name;
        this.softwareVersion = json3.software.name;
    }




}