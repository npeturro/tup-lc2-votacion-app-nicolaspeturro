const tipoEleccion = 0;
const anioSeleccionado = document.getElementById("anio");
const cargoSeleccionado = document.getElementById("cargo");
const IdDistrito = document.getElementById("distrito");
const seccionSeleccionada = document.getElementById("seccion");
var datosCompletos = {};


//---CONSULTA AÑO---//
async function consultaElectoral() {

    try {

        const response = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");

        if (response.ok) {

            const datos = await response.json();
            console.log(datos);

            const comboAnio = document.getElementById("anio");

            datos.forEach((anio) => {
                const opcion = document.createElement("option");
                opcion.value = anio;
                opcion.text = anio;
                comboAnio.appendChild(opcion);

            });

            comboAnio.addEventListener("change", async function () {

                const anioSeleccionado = comboAnio.value;

                if (anioSeleccionado !== "") {

                    const url = "https://resultados.mininterior.gob.ar/api/menu?año=" + anioSeleccionado;

                    const response = await fetch(url);
                    console.log(response);

                    if (response.ok) {

                        const datos2 = await response.json();

                        comboCargo = document.getElementById("cargo");
                        console.log(datos2);

                        comboCargo.innerHTML = "";

                        datos2[0].Cargos.forEach((cargo) => {
                            const opcion = document.createElement("option");
                            opcion.value = cargo.IdCargo;
                            opcion.text = cargo.Cargo;
                            comboCargo.appendChild(opcion);
                        });

                        const cargoSeleccionado = document.getElementById("cargo");

                        cargoSeleccionado.addEventListener("change", function () {

                            const IdCargo = cargoSeleccionado.value;

                            const distritos = datos2[tipoEleccion].Cargos[IdCargo].Distritos;
                            
                            const distritoSeleccionado = document.getElementById("distrito");

                            distritoSeleccionado.innerHTML = "";
                            console.log(distritos)
                            
                            distritos.forEach((distrito) => {
                                const opcion = document.createElement("option");
                                opcion.value = distrito.IdDistrito;
                                opcion.text = distrito.Distrito;
                                distritoSeleccionado.appendChild(opcion);
                            });
                        });

                        const distritoSeleccionado = document.getElementById("distrito");

                        distritoSeleccionado.addEventListener("change", function () {

                            const IdDistrito = distritoSeleccionado.value;
                            const IdCargo = cargoSeleccionado.value;
                            const secciones = datos2[tipoEleccion].Cargos[IdCargo].Distritos[IdDistrito].SeccionesProvinciales[0].Secciones;
                            console.log(secciones)

                            const seccionSeleccionada = document.getElementById("seccion");
                            seccionSeleccionada.innerHTML = "";

                            secciones.forEach((seccion) => {
                                const opcion = document.createElement("option");
                                opcion.value = seccion.IdSeccion;
                                opcion.text = seccion.Seccion;
                                seccionSeleccionada.appendChild(opcion);
                            });
                        });

                        seccionSeleccionada.addEventListener("change", function(){
                            
                            datosCompletos = {
                                anioEleccion: anioSeleccionado.value,
                                tipoRecuento: tipoRecuento,
                                tipoEleccion: tipoEleccion,
                                categoriaId: 2,
                                distritoId: IdDistrito.value,
                                seccionProvincialId: 0,
                                seccionId: seccionSeleccionada.value,
                                circuitoId: '',
                                mesaId: '',
                              };

                              console.log(datosCompletos);

                        });

                    }

                }

            });
        }

    } catch (error) {
        console.error("Error en la solicitud: " + error);
    }

}

window.addEventListener('DOMContentLoaded', (event) => {
    consultaElectoral();
});


async function filtrar(){

    try{
        console.log(datosCompletos);

        const objetoUrl = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${datosCompletos.anioEleccion}&tipoRecuento=${datosCompletos.tipoRecuento}&tipoEleccion=${datosCompletos.tipoEleccion}&categoriaId=${datosCompletos.categoriaId}&distritoId=${datosCompletos.distritoId}&seccionProvincialId=${datosCompletos.seccionProvincialId}&seccionId=${datosCompletos.seccionId}&circuitoId=${datosCompletos.circuitoId}&mesaId=${datosCompletos.mesaId}`;
        
        const response = await fetch(objetoUrl)
        
            if (response.ok) {
                
                const datosObjeto = await response.json();
                console.log(datosObjeto);
            }
    }

    catch (error) {
    console.error("Error en la solicitud: " + error);
}}