// Para las paso
// const tipoEleccion = 1;

// Para las generales
// const tipoEleccion = 2;

// Se utilizarán solo recuentos definitivos
// const tipoRecuento = 1;

// API MINISTERIO DEL INTERIOR
// falta sumar boton de generales/paso para filtrar
const url = "https://resultados.mininterior.gob.ar/api/menu"
const urlPeriodos = "https://resultados.mininterior.gob.ar/api/menu/periodos"
const urlCargos =  "https://resultados.mininterior.gob.ar/api/menu?año="

const periodosSelect = document.getElementById('select-aa'); // ID del boton del HTML


//Combo periodo, devuelve el dato del periodo
fetch (urlPeriodos)
.then (response => response.json() )
.then (data => {
    data.forEach(periodo => {
        const option = document.createElement('option');
        option.text = periodo;
        option.value = periodo;
        periodosSelect.add(option);   
        
});
    console.log(data)
})
.catch(error => consolog.log(error))

//llamar a una función para toma rel valor del select-aa
function seleccionarAnio() {
    if (periodosSelect.value) {
        fetch(urlCargos + periodosSelect.value) //periodosSelect = eleccion del año por el usuario
            .then(response => response.json())
            .then(data => {
                console.log(data); // por alguna cierta razón no estoy trayendo los datos del periodo
                const cargosSelect = document.getElementById('select-cargo'); // ID del botón de HTML
                
                while (cargosSelect.firstChild) {
                    cargosSelect.removeChild(cargosSelect.firstChild);
                }
                
                data.forEach(eleccion => {
                    eleccion.Cargos.forEach(cargo => {
                        const option = document.createElement('option');
                        option.text = cargo.Cargo;
                        option.value = cargo.IdCargo;
                        cargosSelect.add(option);
                    });
                });
            })
            .catch(error => console.log(error));
    } else {
        console.log("No se ha seleccionado un período.");
    }
}