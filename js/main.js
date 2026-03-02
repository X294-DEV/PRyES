//X294 -2026-
let chartHist, chartPoli, chartOjiva, chartPareto;
//Función de calculo principal
function calcular(){
    let calcmain = document.getElementById("calcdatos").value;
    let list = calcmain.split(",").map(num => parseInt(num.trim()));

    if (list.length < 20 || list.some(isNaN)){
        document.getElementById("dialog").style.display = "flex";
        document.getElementById("err1").innerText = "Ocurrió un problema...";
        document.getElementById("errsub1").innerText = "Debe insertar al menos 20 valores númericos para poder usar esta página";
        return;
    }

    document.getElementById("overlay").style.display = "flex";
    //Delay para la pantalla de carga
    setTimeout(() => {
        document.getElementById("overlay").style.display = "none";
        //MEDIA
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

    //HISTOGRAMA
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

    //POLÍGONO
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

    //OJIVA
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

    //PARETO
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
//Oculta el cuadro de dialogo
function skipdial(){
    document.getElementById("dialog").style.display = "none";
    document.getElementById("aboutdial").style.display = "none";
}
//Muestra la información de la página
function showabout(){
    document.getElementById("aboutdial").style.display = "flex";
}
//Funcion que rellena los valores con datos aleatorios
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
    document.getElementById("err1").innerText = "Ocurrió un problema...";
    document.getElementById("errsub1").innerText = "Esta función no se encuentra disponible por el momento ;)";
}
function operarConjuntos(){
    let conjA = document.getElementById("conjA").value.trim();
    let conjB = document.getElementById("conjB").value.trim();

    if (conjA === "" || conjB === "") {
        document.getElementById("dialog").style.display = "flex";
        document.getElementById("err1").innerText = "Ocurrió un problema...";
        document.getElementById("errsub1").innerText = "Debes insertar datos en ambos conjuntos para continuar!";
        return;
    }

    let A = conjA.split(",").map(x => x.trim());
    let B = conjB.split(",").map(x => x.trim());

    if (A.some(x => isNaN(x)) || B.some(x => isNaN(x))) {
        document.getElementById("dialog").style.display = "flex";
        document.getElementById("err1").innerText = "Ocurrió un problema...";
        document.getElementById("errsub1").innerText = "Los valores deben ser numéricos!";
        return;
    }
    document.getElementById("overlay").style.display = "flex";
    setTimeout(() => {
    document.getElementById("overlay").style.display = "none";
    let union = [...new Set([...A, ...B])];
    let inter = A.filter(x => B.includes(x));
    let difA = A.filter(x => !B.includes(x));
    let difB = B.filter(x => !A.includes(x));

    document.getElementById("resConj").innerHTML =
        `A ∪ B: ${union}<br>
         A ∩ B: ${inter}<br>
         A - B: ${difA}<br>
         B - A: ${difB}`;
 }, 200);
}
//calculador de  probabilidad
function calcProb(){
    let favInput = document.getElementById("fav").value;
    let totalInput = document.getElementById("total").value;
    if (favInput.trim() === "" || totalInput.trim() === "") {
        document.getElementById("dialog").style.display = "flex";
        document.getElementById("err1").innerText = "Ocurrió un problema...";
        document.getElementById("errsub1").innerText = "Debes insertar un valor numérico en los dos campos para continuar!";
        return;
    }
    document.getElementById("overlay").style.display = "flex";
    setTimeout(() => {
        document.getElementById("overlay").style.display = "none";
        let fav = parseFloat(favInput);
        let total = parseFloat(totalInput);

        let prob = fav / total;
        document.getElementById("resProb").innerText =
        `Probabilidad = ${prob.toFixed(4)} (${(prob*100).toFixed(2)}%)`;
}, 200);
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
//Calculador de Factorial
function calcFact(){
      let n = parseInt(document.getElementById("n").value);
      let r = parseInt(document.getElementById("r").value);

      if(isNaN(n) || isNaN(r)){
        document.getElementById("resfc").innerHTML = 
          "<b>Error:</b> Debe ingresar valores numéricos en ambos campos.";
        return;
      }

      if(r > n){
        document.getElementById("resfc").innerHTML = 
          "<b>Error:</b> r no puede ser mayor que n.";
        return;
      }
      document.getElementById("overlay").style.display = "flex";
    setTimeout(() => {
    document.getElementById("overlay").style.display = "none";
      let factN = factorial(n);
      let perm = permutacion(n,r);
      let comb = combinacion(n,r);

      document.getElementById("resfc").innerHTML = `
        <b>Resultados:</b><br>
        n! = ${factN}<br>
        P(${n},${r}) = ${perm}<br>
        C(${n},${r}) = ${comb}
      `;
    },200);
    }
//Generador aleatorio de probabilidad
function rndProb(){
    let rnd1 = Math.floor(Math.random() * 99) + 100;
    let rnd2 = Math.floor(Math.random() * 98) + 99;
    for(i=1; rnd2 > rnd1; i++){
        rnd2 = Math.floor(Math.random() * 98) + 99;
    }
    document.getElementById("fav").value = rnd2;
    document.getElementById("total").value = rnd1;
}
//Generador aleatorio de conjuntos
function rndCon(){
    let cantDat = Math.floor(Math.random() * 5) + 4;
    let lista = []
    let lista2 = []
    for (let i = 0; i < cantDat; i++){
        let nmr = Math.floor(Math.random() * 1000) +1;
        lista.push(nmr);
        let nmr2 = Math.floor(Math.random() * 1000) +1;
        lista2.push(nmr2);
    }
    document.getElementById("conjA").value = lista.join(", ");
    document.getElementById("conjB").value = lista2.join(", ");
}
function rndFact(){
    let rnd1 = Math.floor(Math.random() * 49) + 50;
    let rnd2 = Math.floor(Math.random() * 48) + 49;
    for(i=1; rnd2 > rnd1; i++){
        rnd2 = Math.floor(Math.random() * 48) + 49;
    }
    document.getElementById("r").value = rnd2;
    document.getElementById("n").value = rnd1;
}
//Calculador de diagrama de árbol y regla multiplicativa
function calcArb(){
      let paso1 = document.getElementById("paso1").value.trim();
      let paso2 = document.getElementById("paso2").value.trim();
      let paso3 = document.getElementById("paso3").value.trim();

      let opciones1 = document.getElementById("opciones1").value.split(",").map(x=>x.trim()).filter(x=>x!=="");
      let opciones2 = document.getElementById("opciones2").value.split(",").map(x=>x.trim()).filter(x=>x!=="");
      let opciones3 = document.getElementById("opciones3").value.split(",").map(x=>x.trim()).filter(x=>x!=="");

      if(opciones1.length === 0 || opciones2.length === 0){
        document.getElementById("resultado").innerText = "Error: Debe ingresar al menos dos pasos con opciones.";
        return;
      }

      document.getElementById("overlay").style.display = "flex";
    setTimeout(() => {
      let total = opciones1.length * opciones2.length * (opciones3.length > 0 ? opciones3.length : 1);

      let salida = `1) Pasos:\n- ${paso1}\n- ${paso2}`;
      if(paso3 !== "") salida += `\n- ${paso3}`;

      salida += `\n\n2) Opciones:\n- ${paso1}: ${opciones1.length}\n- ${paso2}: ${opciones2.length}`;
      if(opciones3.length > 0) salida += `\n- ${paso3}: ${opciones3.length}`;

      salida += `\n\n3) Total combinaciones = ${total}\n\nDiagrama de árbol:\nInicio`;

      for(let op1 of opciones1){
        salida += `\n├── ${op1}`;
        for(let op2 of opciones2){
          salida += `\n│   ├── ${op2}`;
          if(opciones3.length > 0){
            for(let op3 of opciones3){
              salida += `\n│   │   ├── ${op3}`;
            }
          }
        }
      }

      document.getElementById("overlay").style.display = "none";
      document.getElementById("resdiagar").innerText = salida;
    },200);
    }
    //Generador de valores aleatorios para regla multiplicativa y diagrama de árbol
    function rndArb(){
      let colores = ["Rojo","Azul","Verde","Amarillo","Negro"];
      let prendas = ["Jeans","Short","Falda","Pantalón"];
      let zapatos = ["Tenis","Botas","Sandalias","Zapatos"];

      let randColores = colores.sort(()=>0.5-Math.random()).slice(0,3);
      let randPrendas = prendas.sort(()=>0.5-Math.random()).slice(0,2);
      let randZapatos = zapatos.sort(()=>0.5-Math.random()).slice(0,2);

      document.getElementById("paso1").value = "Camiseta";
      document.getElementById("opciones1").value = randColores.join(", ");

      document.getElementById("paso2").value = "Pantalón";
      document.getElementById("opciones2").value = randPrendas.join(", ");

      document.getElementById("paso3").value = "Zapato";
      document.getElementById("opciones3").value = randZapatos.join(", ");

    }
