

export default async function cors_fetch(url: string,headers?: any) : Promise<any>{
    return new Promise(function(resolve, reject){
        var x = new XMLHttpRequest();
        x.open('GET', 'https://nope.social/'+url);
        // I put "XMLHttpRequest" here, but you can use anything you want.
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        if(typeof(headers)=== "object"){
            Object.keys(headers).forEach((key)=>{
                x.setRequestHeader(key, headers[key]);
            });
        }
        x.onload = function() {
            try{
                let json = JSON.parse(x.responseText);
                resolve(json);
            } catch(e){
                reject(e);
            }
        };
        x.onerror = function(){
            reject()
        }
        x.send();
    });

}