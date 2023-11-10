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

  const mesasEscrutadas = data.estadoRecuento.mesasTotalizadas;
  const electores = data.estadoRecuento.cantidadElectores;
  const participacion = data.estadoRecuento.participacionPorcentaje;

  const m_escrutadas = document.getElementById("m_escrutadas");
  m_escrutadas.innerHTML = `Mesas Escrutadas<br>${mesasEscrutadas}`;
  const m_electores = document.getElementById("electores");
  m_electores.innerHTML = `Electores<br>${electores}`;
  const m_participacion = document.getElementById("participacion");
  m_participacion.innerHTML = `Participación sobre escrutados<br>${participacion}%`;
  
  //TENEMOS Q IMPORTAR EL MODULO MAPAS.JS Y AUN NO PUDE Y ES POR PROBLEMAS DE SEGURIDAD, TE BLOQUEA LA PAGINA PORQ CREE Q ES UN VIRUS
  /*try{
    const response = await fetch('mapas.json')

    if (response.ok){

      let mapas = await response.json();
      console.log(mapas);

      let mapa_principal = document.getElementById("mapa_principal");
      let mapaPrincipal = datosCompletos.distritoId;
      mapa_principal.innerHTML = `${mapas[7]}`

    }
     
  } catch (error) {
    console.error("Error en la solicitud: " + error);
  }*/
  
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