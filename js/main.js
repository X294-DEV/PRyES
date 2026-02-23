//X294 -2026-
let chartHist, chartPoli, chartOjiva, chartPareto;

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
        let moda;
        if (maxFreq == 1){
            moda = "No existe moda";
        }
        else{
            moda = Object.keys(freq)
                .filter(num => freq[num] == maxFreq)
                .join(", ");
        }
        
        //MAX, MIN, RANGO
        let valMax = Math.max(...list);
        let valMin = Math.min(...list);
        let rango = (valMax - valMin);

        //AMPLITUD
        let sqrTDat = Math.sqrt(list.length);
        let ampClase = (rango/sqrTDat.toFixed(2));
        let ampClaseRedo = parseFloat(document.getElementById("ampClass").value) || ampClase;
        ampClaseRedo = Math.ceil(ampClaseRedo);


        //Tabla de frecuencias
        let total = list.length;
        let numClases = Math.ceil(rango / ampClase);
        let outputTF = "<table class='group-table' id='resTF' border=2><tr><th>Intervalo</th><th>Frecuencia</th><th>Frecuencia Relativa</th><th>Frecuencia Acumulada</th><th>Frecuencia Relativa Acumulada</th></tr>";

        let acumulada = 0;
        let acumuladaRel = 0;

        for (let i = 0; i < numClases; i++) {
            let limiteInferior = valMin + i * ampClaseRedo;
            let limiteSuperior = limiteInferior + ampClaseRedo - 1;

            let f = list.filter(num => num >= limiteInferior && num <= limiteSuperior).length;
            acumulada += f;
            let relativa = f / total;
            acumuladaRel += relativa;

            outputTF += `<tr>
                             <td>${limiteInferior} - ${limiteSuperior}</td>
                             <td>${f}</td>
                             <td>${(relativa*100).toFixed(2)}%</td>
                             <td>${acumulada}</td>
                             <td>${(acumuladaRel*100).toFixed(2)}%</td>
                           </tr>`;
        }
        outputTF += "</table>";

        // Diagrama T/H
        let diagTH = {};

        list.forEach(num => {
        let tallo = Math.floor(num / 10);
        let hoja = num % 10;
        if (!Array.isArray(diagTH[tallo])) {
        diagTH[tallo] = [];
        }
        diagTH[tallo].push(hoja);
        });

        for (let tallo in diagTH) {
        diagTH[tallo].sort((a, b) => a - b);
        }

        let outputTH = "<table class='group-table' id='resTH' border=2><tr><th>Tallo</th><th>Hojas</th></tr>";
        for (let tallo of Object.keys(diagTH).sort((a, b) => a - b)) {
        outputTH += `<tr><td>${tallo}</td><td>${diagTH[tallo].join(" ")}</td></tr>`;
        }
        outputTH += "</table>";

        //Graficas
        let labels = [];
        let frecuencias = [];
        let frecAcum = [];

        acumulada = 0;

        for (let i = 0; i < numClases; i++) {
            let li = valMin + i * ampClaseRedo;
            let ls = li + ampClaseRedo - 1;
            let f = list.filter(num => num >= li && num <= ls).length;

        acumulada += f;

        labels.push(`${li}-${ls}`);
        frecuencias.push(f);
        frecAcum.push(acumulada);
    }


    if(chartHist) chartHist.destroy();
    if(chartPoli) chartPoli.destroy();
    if(chartOjiva) chartOjiva.destroy();
    if(chartPareto) chartPareto.destroy();

    // HISTOGRAMA
    chartHist = new Chart(document.getElementById("histograma"), {
      type: 'bar',
      data: {
         labels: labels,
          datasets: [{
            label: 'Frecuencia',
            data: frecuencias
        }]
    }
    });

// POLÍGONO
    chartPoli = new Chart(document.getElementById("poligono"), {
        type: 'line',
        data: {
           labels: labels,
           datasets: [{
                label: 'Polígono de Frecuencia',
             data: frecuencias,
             fill: false
         }]
     }
    });

// OJIVA
chartOjiva = new Chart(document.getElementById("ojiva"), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Ojiva',
            data: frecAcum,
            fill: false
        }]
    }
});

// PARETO
let sorted = [...frecuencias].sort((a,b)=>b-a);
chartPareto = new Chart(document.getElementById("pareto"), {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Pareto',
            data: sorted
        }]
    }
});

        //RESULTADOS
        document.getElementById("media").innerText = prom.toFixed(2);
        document.getElementById("mediana").innerText = mediana;
        document.getElementById("moda").innerText = moda;
        document.getElementById("rango").innerText = rango;
        document.getElementById("max").innerText = valMax;
        document.getElementById("min").innerText = valMin;
        document.getElementById("muesdial").innerHTML = `<b>Muestra: </b> Los ${list.length}  datos capturados por el usuario`;
        document.getElementById("maxmindial").innerHTML = `Tus datos varian del ${valMin}  al ${valMax}.`;
        document.getElementById("ampClass").value = ampClaseRedo;
        document.getElementById("muestreo").innerText = `Aquí normalmente es muestreo (muestra de ${list.length}).`;
        document.getElementById("resTH").innerHTML = outputTH;
        document.getElementById("resTF").innerHTML = outputTF;
    }, 4000);
}
function skipdial(){
    document.getElementById("dialog").style.display = "none";
    document.getElementById("aboutdial").style.display = "none";
}
function showabout(){
    document.getElementById("aboutdial").style.display = "flex";
}
function randomVal(){
    let cantDat = Math.floor(Math.random() * 21) + 20;
    let lista = []
    for (let i = 0; i < cantDat; i++){
        let nmr = Math.floor(Math.random() * 1000) +1;
        lista.push(nmr);
    }
    document.getElementById("calcdatos").value = lista.join(", ");
    document.getElementById("ampClass").value = null;
}
function errNA(){
    document.getElementById("dialog").style.display = "flex";
    document.getElementById("err1").innerText = "Ocurrio un problema...";
    document.getElementById("errsub1").innerText = "Esta función no se encuentra disponible por el momento ;)";
}
function operarConjuntos(){
    let A = document.getElementById("conjA").value.split(",").map(x=>x.trim());
    let B = document.getElementById("conjB").value.split(",").map(x=>x.trim());

    let union = [...new Set([...A,...B])];
    let inter = A.filter(x=>B.includes(x));
    let difA = A.filter(x=>!B.includes(x));
    let difB = B.filter(x=>!A.includes(x));

    document.getElementById("resConj").innerHTML =
    `Unión: ${union}<br>
     Intersección: ${inter}<br>
     A - B: ${difA}<br>
     B - A: ${difB}`;
}
function calcProb(){
    let fav = parseFloat(document.getElementById("fav").value);
    let total = parseFloat(document.getElementById("total").value);

    let prob = fav/total;
    document.getElementById("resProb").innerText =
        `Probabilidad = ${prob.toFixed(4)} (${(prob*100).toFixed(2)}%)`;
}
function reglaMultiplicativa(pA, pB){
    return pA * pB;
}
function diagramaArbol(){
    let pA = 0.5;
    let pB = 0.3;

    let resultado = `
    A (0.5)
       ├── B (0.3) → ${(pA*pB).toFixed(2)}
       └── B' (0.7) → ${(pA*(1-pB)).toFixed(2)}
    `;

    alert(resultado);
}
function factorial(n){
    if(n==0 || n==1) return 1;
    return n * factorial(n-1);
}

function permutacion(n,r){
    return factorial(n)/factorial(n-r);
}

function combinacion(n,r){
    return factorial(n)/(factorial(r)*factorial(n-r));
}