//X294 -2026-
function calcular(){
    let calcmain = document.getElementById("calcdatos").value;
    let list = calcmain.split(",").map(num => parseInt(num.trim()));

    if (list.length < 20 || list.some(isNaN)){
        document.getElementById("dialog").style.display = "flex";
        document.getElementById("err1").innerText = "Ocurrio un problema...";
        document.getElementById("errsub1").innerText = "Debe insertar al menos 20 valores númericos para poder usar esta página";
        return;
    }

    document.getElementById("overlay").style.display = "flex";
    setTimeout(() => {
        //MEDIA
        document.getElementById("overlay").style.display = "none";
        let suma = list.reduce((acum, num) => acum + num, 0);
        let prom = suma / list.length;

        //MEDIANA
        let orden = [...list].sort((a, b)=> a - b);
        let mitad = Math.floor(orden.length/2);
        if(orden.length % 2 == 0){
            mediana = (orden[mitad - 1] + orden[mitad])/2;
        }
        else{
            mediana = orden[mitad];
        };
        
        //MODA
        let freq = {};
        orden.forEach(num =>{
            freq[num] = (freq[num] || 0) + 1;
        });
        let maxFreq = Math.max(...Object.values(freq));
        let moda = Object.keys(freq)
                .filter(num => freq[num] == maxFreq)
                .join(", ");
        
        //MAX, MIN, RANGO
        let valMax = Math.max(...list);
        let valMin = Math.min(...list);
        let rango = (valMax - valMin);

        //RESULTADOS
        document.getElementById("media").innerText = prom.toFixed(2);
        document.getElementById("mediana").innerText = mediana;
        document.getElementById("moda").innerText = moda;
        document.getElementById("rango").innerText = rango;
        document.getElementById("max").innerText = valMax;
        document.getElementById("min").innerText = valMin;
        document.getElementById("muesdial").innerHTML = `<b>Muestra: </b> Los ${list.length}  datos capturados por el usuario`;
        document.getElementById("maxmindial").innerHTML = `Tus datos varian del ${valMin}  al ${valMax}.`;
    }, 4000);
}
function skipdial(){
    document.getElementById("dialog").style.display = "none";
    document.getElementById("aboutdial").style.display = "none";
}
function showabout(){
    document.getElementById("aboutdial").style.display = "flex";
}
function randomInt(min,max){

}
function errNA(){
    document.getElementById("dialog").style.display = "flex";
    document.getElementById("err1").innerText = "Ocurrio un problema...";
    document.getElementById("errsub1").innerText = "Esta función no se encuentra disponible por el momento ;)";
}
