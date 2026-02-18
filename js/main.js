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
        document.getElementById("media").innerText = "La media es: " +prom.toFixed(2);
        document.getElementById("mediana").innerText = "La mediana es: " +mediana;
        document.getElementById("moda").innerText = "La moda es: " +moda;
        document.getElementById("rango").innerText = "El rango es: " +rango;
        document.getElementById("max").innerText = "El valor máximo es: " +valMax;
        document.getElementById("min").innerText = "El valor minimo es: " +valMin;
    }, 4000);
}
function skipdial(){
    document.getElementById("dialog").style.display = "none";
    document.getElementById("aboutdial").style.display = "none";
}
function showabout(){
    document.getElementById("aboutdial").style.display = "flex";
}
