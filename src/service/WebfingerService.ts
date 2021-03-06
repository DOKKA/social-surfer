import cors_fetch from "../util/CorsFetch";

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
    software: string | null;
    softwareVersion?: string;

    constructor(address:string){
        let arrAddress = address.trim().split('@');
        arrAddress = arrAddress.filter( (a)=> a.length > 0);
        this.domain = arrAddress[1];
        this.address = arrAddress.join('@');
        this.software = null;
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
        
        let json:Webfinger = await cors_fetch(url.toString());
        let links = json.links.filter(l => l.rel === 'self' || l.rel.includes('webfinger.net/rel/profile-page'));
        
        if(links.length > 0){
            this.profileURL = links.reverse()[0].href;
        }
    }

    async getNodeInfoURL(){
        let json:NodeInfo = await cors_fetch('https://'+this.domain+'/.well-known/nodeinfo');
        let links = json.links.filter(l => l.rel.includes('2.0'));
        if(links.length > 0){
            this.nodeInfoURL = links[0].href;
        }
    }

    async getNodeInfoJSON(){
        if(this.nodeInfoURL){
            let json:NodeInfoJSON = await cors_fetch(this.nodeInfoURL);
            this.software = json.software.name;
            this.softwareVersion = json.software.version;
        }
        
    }




}