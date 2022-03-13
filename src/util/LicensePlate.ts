


function getRandomInt(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  

function LicensePlate():string{
    let plate = '';
    let chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for(let x = 0; x<6; x++){
        let rand = getRandomInt(0,chars.length);
        plate = plate + chars[rand];
    }
    return plate;
}

export default LicensePlate;