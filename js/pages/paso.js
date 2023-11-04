


const tipoEleccion = 1;
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
      
