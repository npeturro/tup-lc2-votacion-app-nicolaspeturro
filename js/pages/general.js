const tipoEleccion = 2;
const tipoRecuento = 1;
const anioSeleccionado = document.getElementById("anio");
const cargoSeleccionado = document.getElementById("cargo");
const distritoSeleccionado = document.getElementById("distrito");
const seccionSeleccionada = document.getElementById("seccion");
let cargo
let datos2 = null
let datosCompletos = {};


//---CONSULTA AÑO---//
async function consultaElectoral() {

    try {

        const response = await fetch("https://resultados.mininterior.gob.ar/api/menu/periodos");

        if (response.ok) {

            const datos = await response.json();
            //console.log(datos);

            //const comboAnio = document.getElementById("anio");

            datos.forEach((anio) => {
                const opcion = document.createElement("option");
                opcion.value = anio;
                opcion.text = anio;
                anioSeleccionado.appendChild(opcion);

            });

            anioSeleccionado.addEventListener("change", async function () {
            //comboAnio.addEventListener("change", async function () {

                //const anioSeleccionado = comboAnio.value;

                if (anioSeleccionado !== "") {

                    const url = "https://resultados.mininterior.gob.ar/api/menu?año=" + anioSeleccionado.value;

                    const response = await fetch(url);
                    console.log(response);

                    if (response.ok) {

                        datos2 = await response.json();

                        //comboCargo = document.getElementById("cargo");
                        console.log(datos2);

                        cargoSeleccionado.innerHTML = "";

                        //const cargos = datos2.find((elemento) => elemento.IdEleccion === tipoEleccion)
                        //console.log(cargos)
                        
                        datos2.forEach((elemento) => {
                            
                            if (elemento.IdEleccion == tipoEleccion){

                                let cargo = elemento
                                console.log(cargo)

                                cargo.Cargos.forEach((cargo) => {
                                    const opcion = document.createElement("option");
                                    opcion.value = cargo.IdCargo;
                                    opcion.text = cargo.Cargo;
                                    cargoSeleccionado.appendChild(opcion);

                                });
                            }

                                cargoSeleccionado.addEventListener("change", function () {

                                    const IdCargo = cargoSeleccionado.value;
                                    const distritosDelCargo = cargo.Cargos.find((elemento) => elemento.IdCargo === IdCargo);
                                    console.log(distritosDelCargo)
        
                                    distritoSeleccionado.innerHTML = "";
        
                                    distritosDelCargo.Distritos.forEach((distrito) => {
                                        const opcion = document.createElement("option");
                                        opcion.value = distrito.IdDistrito;
                                        opcion.text = distrito.Distrito;
                                        distritoSeleccionado.appendChild(opcion);
        
                                            });
                                        })

                                    distritoSeleccionado.addEventListener("change", function () {

                                        const IdDistrito = distritoSeleccionado.value;
                                        const seccionesDelDistrito = distritosDelCargo.Distritos.find((elemento) => elemento.IdDistrito === IdDistrito);
                                        console.log(seccionesDelDistrito)

                                        const seccionesProvinciales = seccionesDelDistrito.SeccionesProvinciales
                                        //const secciones = seccionProvincial.find((elemento) => elemento.IdSeccion === IdDistrito);

                                        seccionSeleccionada.innerHTML = "";

                                        seccionesDelDistrito.SeccionesProvinciales[0].Seccion.forEach((distrito) => {
                                            const opcion = document.createElement("option");
                                            opcion.value = distrito.IdDistrito;
                                            opcion.text = distrito.Distrito;
                                            distritoSeleccionado.appendChild(opcion);
            
                                                });
                                            
                                    })

                                

                            })
                        
                        
                        
                    
                    }
            
                }

            
                    

                })  

                    

                        

                        

                        
                            
                            /*


                        const distritoSeleccionado = document.getElementById("distrito");

                        

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
                                anioEleccion: anioSeleccionado,
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

                    }*/

                
                }

        
    } catch (error) {
        console.error("Error en la solicitud: " + error);
    }

}

consultaElectoral();

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