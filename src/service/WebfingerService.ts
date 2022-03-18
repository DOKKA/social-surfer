
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

export default class WebFingerService{

    static async getProfileURL(address: string){
        try{
            let arrAddress = address.split('@');
            arrAddress = arrAddress.filter( (a)=> a.length > 0);
    
            let domain = arrAddress[1];
    
            let newAddress = arrAddress.join('@');
    
            let url = new URL('https://'+domain+'/.well-known/webfinger')
            url.search =new URLSearchParams({resource: "acct:" + newAddress}).toString();
            
            let request = await fetch(url.toString());
            let json:Webfinger = await request.json();
            let links = json.links.filter(l => l.rel === 'self' || l.rel.includes('webfinger.net/rel/profile-page'))
            if(links.length > 0){
                return links.reverse()[0].href;
            } else {
                return '';
            }
        } catch(e){
            return '';
        }

    }

    static async getDomainURL(address: string){
        let arrAddress = address.split('@');
        arrAddress = arrAddress.filter( (a)=> a.length > 0);

        let domain = arrAddress[1];
        let response = await fetch('https://'+domain+'/api/v1/instance',{
             headers:{
                 Accept: 'application/activity+json'
             }
        });
        let asdf = await response.json();
        console.log(asdf);
        return asdf;

    }

    static async getProfileAll(profileURL: string){

        let response = await fetch(profileURL,{
             headers:{
                 Accept: 'application/activity+json'
             }
        });
        let asdf = await response.json();
        console.log(asdf);
        return asdf;

    }

}