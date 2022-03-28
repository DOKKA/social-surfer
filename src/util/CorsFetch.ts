

export default async function cors_fetch(url: string,headers: any){
    return new Promise(function(resolve, reject){
        var x = new XMLHttpRequest();
        x.open('GET', 'https://nope.social/'+url);
        // I put "XMLHttpRequest" here, but you can use anything you want.
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        Object.keys(headers).forEach((key)=>{
            x.setRequestHeader(key, headers[key]);
        });
        x.onload = function() {
            resolve(x.response);
        };
        x.onerror = function(){
            reject()
        }
        x.send();
    });

}