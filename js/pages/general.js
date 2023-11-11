consultaElectoral();

const tipoEleccion = 2;
const tipoRecuento = 1;
let anioSeleccionado = document.getElementById("anio");
let cargoSeleccionado = document.getElementById("cargo");
let distritoSeleccionado = document.getElementById("distrito");
let seccionProvincial = document.getElementById("hdSeccionProvincial");
let seccionSeleccionada = document.getElementById("seccion");
let datos_json;
let datosCompletos = {};
let IdCargo;
let data; //Ultimo JSON de boton Filtrar()
let mesasEscrutadas;
let electores;
let participacion;
let vTotalizadosPositivos;

//---CONSULTA AÑO---//
async function consultaElectoral() {

  cartelAmarillo();

  try {

    const response = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");

    if (response.ok) {
      const datos = await response.json();

      datos.forEach((anio) => {
        const opcion = document.createElement("option");
        opcion.value = anio;
        opcion.text = anio;
        anioSeleccionado.appendChild(opcion);
      });
    }
  } catch (error) {
    console.error("Error en la solicitud: " + error);
  }
}

function comboAnio() {

  limpiarCargo()
  limpiarDistrito();
  limpiarSeccion();

  anioSeleccionado.addEventListener("change", async function () {

    try {
      if (anioSeleccionado !== "") {
        const url = "https://resultados.mininterior.gob.ar/api/menu?año=" + anioSeleccionado.value;
        const response = await fetch(url);
        console.log(response);

        if (response.ok) {
          datos_json = await response.json();

          datos_json.forEach((elemento) => {
            if (elemento.IdEleccion == tipoEleccion) {
              //console.log(elemento);

              elemento.Cargos.forEach((cargo) => {
                const opcion = document.createElement("option");
                opcion.value = cargo.IdCargo;
                opcion.text = cargo.Cargo;
                cargoSeleccionado.appendChild(opcion);
              });
            }
          });
        }
      }
    } catch (error) {
      console.error("Error en la solicitud: " + error);
    }
  });
}

function comboCargo() {
  
  cargoSeleccionado.addEventListener("change", function () {

    limpiarDistrito()
    limpiarSeccion()

    IdCargo = cargoSeleccionado.value;

    datos_json.forEach(eleccion => {
      if (eleccion.IdEleccion == tipoEleccion) {
        eleccion.Cargos.forEach((cargo) => {
          if (cargo.IdCargo == IdCargo) {
            cargo.Distritos.forEach((distrito) => {
              const opcion = document.createElement("option");
              opcion.value = distrito.IdDistrito;
              opcion.text = distrito.Distrito;
              distritoSeleccionado.appendChild(opcion);
            });
          }
        });
      }
    });
  });
}

function comboDistrito() {
  
  distritoSeleccionado.addEventListener("change", function () {

    limpiarSeccion();
    
    //console.log(distritoSeleccionado.value)
    datos_json.forEach(eleccion => {
      if (eleccion.IdEleccion == tipoEleccion) {
        eleccion.Cargos.forEach((cargo) => {
          //console.log(IdCargo)
          if (cargo.IdCargo == IdCargo) {
            cargo.Distritos.forEach((distrito) => {
              if (distrito.IdDistrito == distritoSeleccionado.value) {
                distrito.SeccionesProvinciales.forEach((seccion) => {
                  seccionProvincial.value = distrito.SeccionesProvinciales.IDSeccionProvincial;
                  seccion.Secciones.forEach((secciones) => {
                    const opcion = document.createElement("option");
                    opcion.value = secciones.IdSeccion;
                    opcion.text = secciones.Seccion;
                    seccionSeleccionada.appendChild(opcion);
                  });
                });
              }
            });
          }
        });
      }
    });
  });
}
                          
function comboSeccion() {

  seccionSeleccionada.addEventListener("change", function () {

  datosCompletos = {
    anioEleccion: anioSeleccionado.value,
    tipoRecuento: tipoRecuento,
    tipoEleccion: tipoEleccion,
    categoriaId: cargoSeleccionado.value,
    distritoId: distritoSeleccionado.value,
    seccionProvincialId: '',
    seccionId: seccionSeleccionada.value,
    circuitoId: '',
    mesaId: '',
  };

  //console.log(datosCompletos);

});
}
                    

async function filtrar() {

  try{

    console.log(datos_json);
    console.log(datosCompletos);
    

    if (datosCompletos.anioEleccion == 0) {
      cartelAmarillo();
    } else {

      if (datosCompletos.seccionProvincialId == null){
        datosCompletos.seccionProvincialId = 0;
      }
      //YA CAMBIÉ TODO A ASYNC-TRY-CATCH
      const fetchUrl = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${datosCompletos.anioEleccion}&tipoRecuento=${datosCompletos.tipoRecuento}&tipoEleccion=${datosCompletos.tipoEleccion}&categoriaId=${datosCompletos.categoriaId}&distritoId=${datosCompletos.distritoId}&seccionProvincialId=${datosCompletos.seccionProvincialId}&seccionId=${datosCompletos.seccionId}&circuitoId=${datosCompletos.circuitoId}&mesaId=${datosCompletos.mesaId}`;
      const response = await fetch(fetchUrl);

      if (response.ok) {
        data = await response.json();
        console.log(data);
      }
      
    }} catch (error) {
      console.error("Error en la solicitud: " + error);
      
    }

  //--Llenado de cuadros pequeños--//
  mesasEscrutadas = data.estadoRecuento.mesasTotalizadas;
  electores = data.estadoRecuento.cantidadElectores;
  participacion = data.estadoRecuento.participacionPorcentaje;

  vTotalizadosPositivos = data.valoresTotalizadosPositivos;

  const m_escrutadas = document.getElementById("m_escrutadas");
  m_escrutadas.innerHTML = `Mesas Escrutadas<br>${mesasEscrutadas}`;
  const m_electores = document.getElementById("electores");
  m_electores.innerHTML = `Electores<br>${electores}`;
  const m_participacion = document.getElementById("participacion");
  m_participacion.innerHTML = `Participación sobre escrutados<br>${participacion}%`;
  let titulo = document.getElementById("titulo");
  let subtitulo = document.getElementById("subtitulo");
  titulo.innerHTML = `Elecciones ${datosCompletos.anioEleccion} | Generales`;
  subtitulo.innerHTML = `${datosCompletos.anioEleccion} > ${cargoSeleccionado.options[cargoSeleccionado.selectedIndex].text} > ${distritoSeleccionado.options[distritoSeleccionado.selectedIndex].text} > ${seccionSeleccionada.options[seccionSeleccionada.selectedIndex].text}`;
  agrupacionPolitica()
  agregarMapa()
  resumenVotos()

  //--Llenado de cuadros grandes--//

  //--Cuadro agrupaciones politicas--//
  


  
}

function agregarInforme(){

  const vAnio = datosCompletos.anioEleccion;
  const vTipoRecuento = datosCompletos.tipoRecuento;
  const vTipoEleccion = datosCompletos.tipoEleccion;
  const vCategoriaId = datosCompletos.categoriaId;
  const vDistrito = datosCompletos.distritoId;
  const vSeccionProvincial = datosCompletos.seccionProvincialId;
  const vSeccionID = datosCompletos.seccionId;
  const vCircuitoID = datosCompletos.circuitoId;
  const vMesaID = datosCompletos.mesaId;


  //Creando el Array para agregarlo al LocalStorage
  let informe = [vAnio, vTipoRecuento, vTipoEleccion, vCategoriaId, vDistrito, vSeccionProvincial, vSeccionID, vCircuitoID, vMesaID, mesasEscrutadas, electores, participacion, vTotalizadosPositivos];

  //Obteniendo el Array actual de localStorage o inicializando uno nuevo
  let informesArray = JSON.parse(localStorage.getItem('INFORMES')) || [];

  //Comprobando q la busqueda ya no exista en el localStorage
  if (!informesArray.includes(informe)){
    
    //Agregando el nuevo array al Array general
    informesArray.push(informe);

    //Almacenando el Array actualizado en localStorage
    localStorage.setItem('INFORMES', JSON.stringify(informesArray));
    console.log('Nuevo informe agregado con éxito.');

  } else {
    console.log('El informe ya existe en el array.');
  }
}
//--Funcion Agrupacion Politica--//
function agrupacionPolitica(){
  const cuadroAgrupacion = document.getElementById("ag-politica");
  cuadroAgrupacion.innerHTML = ``
  let indice = 0;
  data.valoresTotalizadosPositivos.forEach((agrupaciones) => {

    //ACORDARSE DE ARMARLO CON LA LISTA EN PASO

    //agrupaciones.listas.forEach((lista) => { 
    //const valorCalculado = agrupaciones.votos * 100 / valoresTotalizadosPositivos.votos;   
    const datosAgrupacion = `<p><b>${agrupaciones.nombreAgrupacion}</b></p>
    <hr>
    <p>${agrupaciones.votosPorcentaje}% ${agrupaciones.votos} VOTOS</p>
    <div class="progress" style="background: ${colores[indice].colorLiviano}">
        <div class="progress-bar" style="width:${agrupaciones.votosPorcentaje}%; background: ${colores[indice].colorPleno}">
            <span class="progress-bar-text">${agrupaciones.votosPorcentaje}%</span>
        </div>
    </div>`
    cuadroAgrupacion.innerHTML += datosAgrupacion;
    indice ++;
  });
  
}

function agregarMapa(){
  //agregar a funcion y cambiar nombre
  let titulo_mapas = document.getElementById("mapas_titulo");
  let mapa_principal = document.getElementById("mapa_principal");
  let idMapas = datosCompletos.distritoId;
  //ver si se puede cambiar la forma en la qe trae el nombre
  titulo_mapas.innerHTML = `${distritoSeleccionado.options[distritoSeleccionado.selectedIndex].text}`
  mapa_principal.innerHTML = `${provincias[idMapas]}`
}

function resumenVotos(){
  const resumenVotos = document.getElementById("resumen-votos");
  resumenVotos.innerHTML = ``
  let indice = 0;
  data.valoresTotalizadosPositivos.forEach((agrupaciones) => {

    const datosAgrupacion = `<div class="bar" style="--bar-value:${agrupaciones.votosPorcentaje}%; background: ${colores[indice].colorPleno}" data-name="" title="${agrupaciones.nombreAgrupacion} 
    ${agrupaciones.votosPorcentaje}%" ></div>`
    resumenVotos.innerHTML += datosAgrupacion;
    indice ++;
  });
  
}









//--Funciones de limpieza--//
function limpiarAnio() {
  anioSeleccionado = document.getElementById("anio");
  anioSeleccionado.innerHTML = `<option disabled selected>Año</option>`;
}
function limpiarCargo() {
  cargoSeleccionado = document.getElementById("cargo");
  cargoSeleccionado.innerHTML = `<option disabled selected>Cargo</option>`;
}
function limpiarDistrito() {
  distritoSeleccionado = document.getElementById("distrito");
  distritoSeleccionado.innerHTML = `<option disabled selected>Distrito</option>`;
}
function limpiarSeccion() {
  seccionSeleccionada = document.getElementById("seccion");
  seccionSeleccionada.innerHTML = `<option disabled selected>Seccion</option>`;
}


//--Funciones Mensajes--//
function cartelRojo(){
  const mensajeError = document.getElementById("mensaje-error");
  mensajeError.style.display = "flex";
  setTimeout(cartelRojo_sacar,3000)
}
function cartelVerde(){
  const mensajeError = document.getElementById("mensaje-exito");
  mensajeError.style.display = "flex";
  setTimeout(cartelVerde_sacar,3000)
}
function cartelAmarillo(){
  const mensajeError = document.getElementById("mensaje-no-completo");
  mensajeError.style.display = "flex";
  mensajeError.innerHTML = "Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR"
  setTimeout(cartelAmarillo_sacar,5000)
}
function cartelRojo_sacar(){
  const mensajeError = document.getElementById("mensaje-error");
  mensajeError.style.display = "none";
}
function cartelVerde_sacar(){
  const mensajeError = document.getElementById("mensaje-exito");
  mensajeError.style.display = "none";
}
function cartelAmarillo_sacar(){
  const mensajeError = document.getElementById("mensaje-no-completo");
  mensajeError.style.display = "none";
}
function errorCartel(){
  const mensajeError = document.getElementById("mensaje-error");
  mensajeError.style.display = "flex";
  mensajeError.innerHTML = `Elecciones ${datosCompletos.anioEleccion} | Generales <br> ${datosCompletos.anioEleccion} > ${cargoSeleccionado.options[cargoSeleccionado.selectedIndex].text} > ${distritoSeleccionado.options[distritoSeleccionado.selectedIndex].text} > ${seccionSeleccionada.options[seccionSeleccionada.selectedIndex].text}`;
}