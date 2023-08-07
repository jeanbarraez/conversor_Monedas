const formula = document.querySelector("#conversor");
const chart = document.querySelector("#myChart");
let myChart;

const getDatosMonedas = async (moneda) => {
  try {
    const valores = await fetch(`https://mindicador.cl/api/${moneda}`);
    const resultados = await valores.json();
    //console.log(resultados);
    return resultados.serie;
  } catch (error) {
    alert(error + " " + "error");
  }
};
//obtenerDatosMonedas("euro");

const totalenmoneda = (valor, datos) => {
  const valorMoneda = datos[0].valor; // tasa actual de la moneda en la posicion [0]
  const total = valor / valorMoneda; // valor(pesos chilenos)/ tasa actual= valorMoneda
  return Math.round(total * 100) / 100;
};

const mostrarTotalvalorenPantalla = (total) => {
  document.getElementById("total-total").innerText = total;
};

const obtenerValores = (datos) => {
  //obtener valores
  return datos.map((valor) => valor.valor);
};

//obtener fechas amaricana
const obtenerFechas = (datos) => {
  
  return datos.map((item) =>
    new Date(item.fecha).toLocaleDateString("US-en")
    
  );
 
};


//borrar los graficos para que no se junten todos al cambiar de moneda
//usando metodo(DESTROY DE LA LIBRERIA CHART)
const borrarGraficoanterior = () => {
  if (myChart) {
    myChart.destroy();
  }
};

const calcularValorEnMoneda = async (valor, moneda) => {
  const datos = await getDatosMonedas(moneda);
  mostrarGrafico(datos, valor);
};

const mostrarGrafico = (datos, valor) => {
  const total = totalenmoneda(valor, datos);
  mostrarTotalvalorenPantalla(total);

  const labels = obtenerFechas(datos).splice(0, 10); 
  //console.log(labels)// se obtiene el array de fechas
  const values = obtenerValores(datos).splice(0, 10); // se obtiene el array de valores

  //configurar la grafica segun la documentacion de grafica chrast.js
  const datasets = [
    {
      label: "Moneda", //titulo del grafico
      borderColor: "blue",
      data: values, //array con los valores
    },
  ];
  const config = {
    type: "line",
    data: { labels, datasets },
  };
  borrarGraficoanterior();
  myChart = new Chart(chart, config);
};

formula.addEventListener("submit", async (event) => {
  event.preventDefault(); //evita recargar pagina, solo si utiliza form(etiqueta)

  const valor = formula.elements["valor"].value; //input
  const moneda = formula.elements["moneda"].value; //selet

  if (!valor) {
    alert("Ingrese un valor");
    return;
  }
  if (!moneda) {
    alert("Seleccione una Moneda");
    return;
  }
  await calcularValorEnMoneda(valor, moneda);
});
