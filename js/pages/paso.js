const tipoEleccion = 1;
const tipoRecuento = 1;
const anioSeleccionado = document.getElementById("anio");
const cargoSeleccionado = document.getElementById("cargo");
const distritoSeleccionado = document.getElementById("distrito");
const seccionProvincial = document.getElementById("hdSeccionProvincial");
const seccionSeleccionada = document.getElementById("seccion");
let datos_json;
let datosCompletos = {};
let distritosDelCargo;
let seccionesProvinciales;
let IdCargo;

//---CONSULTA AÑO---//
async function consultaElectoral() {
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

      anioSeleccionado.addEventListener("change", async function () {
        if (anioSeleccionado !== "") {
          const url = "https://resultados.mininterior.gob.ar/api/menu?año=" + anioSeleccionado.value;
          const response = await fetch(url);
          console.log(response);

          if (response.ok) {
            datos_json = await response.json();
            cargoSeleccionado.innerHTML = "";

            datos_json.forEach((elemento) => {
              if (elemento.IdEleccion == tipoEleccion) {
                console.log(elemento);

                elemento.Cargos.forEach((cargo) => {
                  const opcion = document.createElement("option");
                  opcion.value = cargo.IdCargo;
                  opcion.text = cargo.Cargo;
                  cargoSeleccionado.appendChild(opcion);
                });
              }
            });

            cargoSeleccionado.addEventListener("change", function () {
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

            distritoSeleccionado.addEventListener("change", function () {

              console.log(distritoSeleccionado.value)
              datos_json.forEach(eleccion => {
                if (eleccion.IdEleccion == tipoEleccion) {
                  eleccion.Cargos.forEach((cargo) => {
                    console.log(IdCargo)
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
                          })
                          seccionSeleccionada.addEventListener("change", function(){
                            
                                datosCompletos = {
                                    anioEleccion: anioSeleccionado.value,
                                    tipoRecuento: tipoRecuento,
                                    tipoEleccion: tipoEleccion,
                                    categoriaId: cargoSeleccionado.value,
                                    distritoId: distritoSeleccionado.value,
                                    seccionProvincialId: 2,
                                    seccionId: seccionSeleccionada.value,
                                    circuitoId: '',
                                    mesaId: '',
                                  };
                              
                                  console.log(datosCompletos);
                                });
                        }
                      });
                    }
                  });
                }
              })




            }
            );
          }
        }
      });
    }
  } catch (error) {
    console.error("Error en la solicitud: " + error);
  }
}

consultaElectoral();

async function filtrar() {
  try {
    console.log(datosCompletos);

    const objetoUrl = `https://resultados.mininterior.gob.ar/resultados/${datosCompletos.anioEleccion}/${datosCompletos.tipoEleccion}/${datosCompletos.categoriaId}/${datosCompletos.seccionProvincialId}/0/${datosCompletos.seccionId}/${datosCompletos.circuitoId}/${datosCompletos.mesaId}`;
    console.log(objetoUrl)
    const response = await fetch(objetoUrl);

    if (response.ok) {
      const datosObjeto = await response.json();
      console.log(datosObjeto);
    }
  } catch (error) {
    console.error("Error en la solicitud: " + error);
  }
}

function limpiarAño() {
  añoSelect = document.getElementById("año");
  añoSelect.innerHTML = `<option disabled selected>Año</option>`;
}
function limpiarCargo() {
  idCargo = document.getElementById("cargo");
  idCargo.innerHTML = `<option disabled selected>Cargo</option>`;
}
function limpiarDistrito() {
  idDistritoOpt = document.getElementById("distrito");
  idDistritoOpt.innerHTML = `<option disabled selected>Distrito</option>`;
}
function limpiarSeccion() {
  seccionSelect = document.getElementById("seccion");
  seccionSelect.innerHTML = `<option disabled selected>Seccion</option>`;
}
