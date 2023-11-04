/*const tipoEleccion = 2;
window.addEventListener("load", consultaElectoral);
let cargosData


//---CONSULTA AÑO---//
async function consultaElectoral(){
    let anio = document.getElementById("anio").value;

    if (anio != ""){

        try{

            const response = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")

            if (response.ok){

                const periodosData = await response.json();
                console.log(periodosData)
                const comboAnio = document.getElementById("anio");
                comboAnio.innerHTML = "";

                for (const periodo of periodosData){

                    const opcion = document.createElement("option");
                    opcion.value = periodo;
                    opcion.text = periodo;
                    comboAnio.appendChild(opcion);
                }

            } else{
                console.error("Error al cargar los periodos");
            }

        } catch (error){
            console.error("Error en la solicitud: " + error);
        }
    }
}

//---CONSULTA CARGO---//
const comboCargo = document.getElementById("cargo");

document.getElementById("anio").addEventListener("change", async() => {

    const anio = document.getElementById("anio").value; // Obtiene opcion seleccionada de año

    if (anio){

        try{

            const url = `https://resultados.mininterior.gob.ar/api/menu?año=${anio}`;
            const response = await fetch(url);

            if (response.ok){

                const cargosData = await response.json();
                console.log(cargosData); // Ver los datos que traigo del json
                const eleccion2 = cargosData.find(item => item.IdEleccion === tipoEleccion);
                comboCargo.innerHTML = "";

                eleccion2.Cargos.forEach(cargo => {
                    const opcion = document.createElement("option");
                    opcion.value = cargo.IdCargo;
                    opcion.text = cargo.Cargo;
                    comboCargo.appendChild(opcion);
                });

            } else{
                console.error("Error al cargar los datos");
            }

        } catch (error){
            console.error("Error en la solicitud: " + error);
        }
    }
});

//---CONSULTA DISTRITO---//
const comboDistrito = document.getElementById("distrito");

document.getElementById("cargo").addEventListener("change", async() => {
    const cargoSeleccionado = document.getElementById("cargo").value; // Obtiene opcion seleccionada de año // Obtiene opcion seleccionada de cargo

    if (cargoSeleccionado){

        // Obtener los distritos del cargo seleccionado
        const distritosData = await cargosData.json();
        console.log(distritosData);
        const distritos = distritosData.find(cargo => cargo.IdCargo === cargoSeleccionado);

        comboDistrito.innerHTML = "";

        distritos.forEach(distrito => {
            const opcion = document.createElement("option");
            opcion.value = distrito.IdDistrito;
            opcion.text = distrito.Distrito;
            comboDistrito.appendChild(opcion);
        });
    
    } else{
        console.log("Ningún cargo seleccionado");
    }
        
});
*/

const tipoEleccion = 0;
const tipoRecuento = 1;
const añoSelect = document.getElementById("anio");
const idCargo = document.getElementById("cargo");
const idDistrito = document.getElementById("distrito");
const seccionSelect = document.getElementById("seccion");
var datos = {};

fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error al obtener los datos');
        }
    })
    .then((data) => {
        const select = document.getElementById("anio");

        data.forEach((year) => {
            const option = document.createElement("option");
            option.value = year;
            option.text = year;
            select.appendChild(option);
        });


        select.addEventListener("change", function () {
            const añoSeleccionado = select.value;

            if (añoSeleccionado !== "") {
                const apiUrl = "https://resultados.mininterior.gob.ar/api/menu?año=" + añoSeleccionado;

                fetch(apiUrl)
                    .then((response) => {
                        console.log(response);
                        if (response.ok) {
                            return response.json();

                        } else {
                            throw new Error('Error al obtener los datos');
                        }
                    })
                    .then((data) => {
                        const select = document.getElementById("cargo");
                        console.log(data);
                        select.innerHTML = "";

                        data[0].Cargos.forEach((cargo) => {
                            const option = document.createElement("option");
                            option.value = cargo.IdCargo;
                            option.text = cargo.Cargo;
                            select.appendChild(option);
                        });

                        const cargoSelect = document.getElementById("cargo");

                        cargoSelect.addEventListener("change", function () {
                            const idCargo = cargoSelect.value;

                            const distritos = data[tipoEleccion].Cargos[idCargo].Distritos;

                            const distritoSelect = document.getElementById("distrito");
                            distritoSelect.innerHTML = "";
                            console.log(distritos)
                            distritos.forEach((distrito) => {
                                const option = document.createElement("option");
                                option.value = distrito.IdDistrito;
                                option.text = distrito.Distrito;
                                distritoSelect.appendChild(option);
                            });
                        });

                        const distritoSelect = document.getElementById("distrito");

                        distritoSelect.addEventListener("change", function () {
                            const IdDistrito = distritoSelect.value;
                            const idCargo = cargoSelect.value;
                            const secciones = data[tipoEleccion].Cargos[idCargo].Distritos[IdDistrito].SeccionesProvinciales[0].Secciones;
                            console.log(secciones)
                            const seccionSelect = document.getElementById("seccion");
                            seccionSelect.innerHTML = "";

                            secciones.forEach((distrito) => {
                                const option = document.createElement("option");
                                option.value = distrito.IdSeccion;
                                option.text = distrito.Seccion;
                                seccionSelect.appendChild(option);
                            });
                        });

                        seccionSelect.addEventListener("change", function(){
                            datos = {
                                anioEleccion: añoSelect.value,
                                tipoRecuento: tipoRecuento,
                                tipoEleccion: tipoEleccion,
                                categoriaId: 2,
                                distritoId: idDistrito.value,
                                seccionProvincialId: 0,
                                seccionId: seccionSelect.value,
                                circuitoId: '',
                                mesaId: '',
                              };
                              console.log(datos);
                        });
                        
                        

                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    })
    .catch((error) => {
        console.log(error);
    });



    function filtrarDatos() {

        console.log(datos);

        const fetchUrl = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${datos.anioEleccion}&tipoRecuento=${datos.tipoRecuento}&tipoEleccion=${datos.tipoEleccion}&categoriaId=${datos.categoriaId}&distritoId=${datos.distritoId}&seccionProvincialId=${datos.seccionProvincialId}&seccionId=${datos.seccionId}&circuitoId=${datos.circuitoId}&mesaId=${datos.mesaId}`;
      
        fetch(fetchUrl)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Error al obtener los datos');
            }
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      
