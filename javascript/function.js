//Declaración de clase Factura
class Factura {
    constructor(tipo, fecha, tipoFac, ptoVta, numero, nombre, neto, alicuota) {
        this.tipo = tipo;
        this.fecha = fecha;
        this.tipoFac = tipoFac;
        this.ptoVta = ptoVta;
        this.numero = numero;
        this.nombre = nombre;
        this.neto = neto;
        this.alicuota = alicuota;
        this.iva = this.calcularIVA();
        this.total = this.calcularTotal();
    }

    //Método de cálculo del total
    calcularTotal() {
        return this.neto * (1 + (this.alicuota / 100));
    }
    //Método de cálculo del IVA
    calcularIVA() {
        return this.neto * (this.alicuota / 100)
    }
}

//Guardar LS
const guardarLocalStorage = (data, key) => localStorage.setItem(key, JSON.stringify(data));
//Recuperar LS
const recuperarLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];


//Declaración de arrays
let facturaCompras = [];
let facturaVentas = [];

//Declaración de constantes
const keyCompras = "facturaCompras";
const keyVentas = "facturaVentas";

//Carga de facturas de compras y ventas de JS
facturaCompras = recuperarLocalStorage(keyCompras);
facturaVentas = recuperarLocalStorage(keyVentas);

const netoDom = document.getElementById("neto");
const alicuotaDom = document.getElementById("alicuota");
const ivaDom = document.getElementById("iva");
const totalDom = document.getElementById("total");

//Cálculo de IVA y Total en DOM
const calcularIvaTotal = () => {
    const neto = document.getElementById("neto").value;
    const alicuota = document.getElementById("alicuota").value;

    ivaDom.value = (neto * (alicuota / 100)).toFixed(2);
    totalDom.value = (neto * (1 + (alicuota / 100))).toFixed(2);
}

netoDom.addEventListener("change", calcularIvaTotal);
netoDom.addEventListener("keyup", calcularIvaTotal);
alicuotaDom.addEventListener("change", calcularIvaTotal);
alicuotaDom.addEventListener("keyup", calcularIvaTotal);


//Listar facturas en DOM

//Ordenar facturas por fecha de mayor a menor
const ordenarFac = (data) => {
    data.sort((b, a) => new Date(b.fecha) - new Date(a.fecha));
    return data;
}

//Ver facturas
const verFactura = (data) => {
    if (data.length == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay facturas cargadas',
        })
        return;
    } else {
        ordenarFac(data);
        let contenidoHTML = `<h3 style="color: ${data[0].tipo === 'ventas' ? 'green' : 'red'}">Listado de Facturas de ${data[0].tipo}</h3><table class="${data[0].tipo === 'ventas' ? 'table table-success table-hover' : 'table table-danger table-hover'}">
                                <thead>
                                    <tr>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Tipo</th>
                                        <th scope="col">Tipo Factura</th>
                                        <th scope="col">Pto. Venta</th>
                                        <th scope="col">N° Factura</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Neto</th>
                                        <th scope="col">IVA</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">
                                        <form id="filtro${data[0].tipo}" class="d-flex" role="search">
                                        <input class="form-control me-2" type="search" aria-label="Search"/>
                                        <button class="${data[0].tipo === 'ventas' ? 'btn btn-success' : 'btn btn-danger'}" type="submit">
                                        <i class="fas fa-search"></i>
                                        </button>
                                        </form>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>`;
        data.forEach(factura => {
            contenidoHTML += `<tr>
                                <td>${factura.fecha}</td>
                                <td>${factura.tipo}</td>
                                <td>${factura.tipoFac}</td>
                                <td>${factura.ptoVta}</td>
                                <td>${factura.numero}</td>
                                <td>${factura.nombre}</td>
                                <td>${factura.neto}</td>
                                <td>${factura.iva.toFixed(2)}</td>
                                <td>${factura.total.toFixed(2)}</td>
                                <td>
                                    <button class="btn" onclick="eliminarFacturaDom(
                                        ${factura.numero}, '${factura.tipo}'
                                    )">
                                    <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>`
        });

        contenidoHTML += `</table >`;
        document.getElementById("tablaFacturas" + data[0].tipo).innerHTML = contenidoHTML;

        //Evento para cuadro de búsqueda
        document.getElementById(`filtro${data[0].tipo}`).addEventListener('submit', (e) => {
            e.preventDefault();
            const filtro = document.querySelector(`#filtro${ data[0].tipo} input`).value.toLowerCase();
            const filas = document.querySelectorAll('tbody tr');

            filas.forEach((fila) => {
                let coincide = false;

                fila.querySelectorAll('td').forEach((celda) => {
                    if (celda.textContent.toLowerCase() === filtro) {
                        coincide = true;
                    }
                });
                fila.style.display = coincide ? '' : 'none';
            });
            // Si el filtro está vacío, mostrar todas las filas
            if (!filtro) {
                filas.forEach((fila) => {
                    fila.style.display = '';
                });
            }
            filtro.value = '';
        });
    }
}

//eliminar factura
const eliminarFacturaDom = (numero, tipoFac) => {
    if (tipoFac == "compras") {
        facturaComprasEliminar = facturaCompras.filter(factura => factura.numero != numero);
        //sweet alert con confirmación
        Swal.fire({
            title: '¿Está seguro?',
            text: "No podrá revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Eliminado',
                    'La factura ha sido eliminada',
                    'success'
                )
                facturaCompras = facturaComprasEliminar;
                guardarLocalStorage(facturaCompras, keyCompras);
                if (facturaCompras.length == 0) {
                    document.getElementById("tablaFacturas" + tipoFac).innerHTML = "";
                } else {
                    verFactura(facturaCompras);
                }
            }
        })
    } else {
        facturaVentasEliminar = facturaVentas.filter(factura => factura.numero != numero);
        //sweet alert con confirmación
        Swal.fire({
            title: '¿Está seguro?',
            text: "No podrá revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Eliminado',
                    'La factura ha sido eliminada',
                    'success'
                )
                facturaVentas = facturaVentasEliminar;
                guardarLocalStorage(facturaVentas, keyVentas);
                if (facturaVentas.length == 0) {
                    document.getElementById("tablaFacturas" + tipoFac).innerHTML = "";
                } else {
                    verFactura(facturaVentas);
                }
            }
        })
    }
}


//Ver Alta de Facturas
const btnCagarFac = document.getElementById("cagarFac");

btnCagarFac.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("prueba2").classList.remove("show");
    document.getElementById("prueba3").classList.remove("show");
})

//Ver ventas
const btnVentas = document.getElementById("btnVentas");

btnVentas.addEventListener("click", (e) => {
    e.preventDefault();
    //collapse compras
    document.getElementById("prueba1").classList.remove("show");
    document.getElementById("prueba2").classList.remove("show");
    verFactura(facturaVentas);
});

//Ver compras
const btnCompras = document.getElementById("btnCompras");

btnCompras.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("prueba1").classList.remove("show");
    document.getElementById("prueba3").classList.remove("show");
    verFactura(facturaCompras);
});


//Ver saldo
const verSaldoIVA = () => {
    let IvaCF = facturaCompras.reduce((acum, fac) => acum + fac.iva, 0);
    let IvaDF = facturaVentas.reduce((acum, fac) => acum + fac.iva, 0);
    let saldoIVA = IvaDF - IvaCF;

    let mensaje =
        saldoIVA > 0 ? `El saldo de IVA a pagar es de $${saldoIVA.toFixed(2)}` :
            saldoIVA < 0 ? `El saldo de IVA a favor es de $${(saldoIVA * -1).toFixed(2)}` :
                `El saldo de IVA es de ${saldoIVA.toFixed(2)}`;

    Swal.fire(mensaje);
}

const btnSaldoIVA = document.getElementById("btnSaldoIVA");

btnSaldoIVA.addEventListener("click", (e) => {
    e.preventDefault();
    verSaldoIVA();
})

//Cargar facturas DOM
const cargarFacturaDom = () => {
    const tipo = document.getElementById("tipo").value;
    const fecha = document.getElementById("fecha").value;
    const tipoFac = document.getElementById("tipoFac").value;
    const ptoVta = document.getElementById("ptoVta").value;
    const numFac = document.getElementById("numFac").value;
    const nombreEntidad = document.getElementById("nombreEntidad").value;
    const neto = document.getElementById("neto").value;
    const alicuota = document.getElementById("alicuota").value;

    //validar campos requeridos
    if (tipo == "" || fecha == "" || tipoFac == "" || ptoVta == "" || numFac == "" || nombreEntidad == "" || neto == "" || alicuota == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe completar todos los campos',
        })
        return false;
    }

    //Declarar e inicializar con constructor de obj factura para DOM
    const facDom = new Factura(tipo, fecha, tipoFac, ptoVta, numFac, nombreEntidad, neto, alicuota);

    if (tipoFac !== "FA" && tipoFac !== "FB" && tipoFac !== "FC" && tipoFac !== "NDA" && tipoFac !== "NDB" && tipoFac !== "NDC") {
        facDom.iva = facDom.iva * (-1);
    }

    if (facDom.tipo == "compras") {
        facturaCompras.push(facDom);
        guardarLocalStorage(facturaCompras, keyCompras);
        verFactura(facturaCompras);
    } else {
        facturaVentas.push(facDom);
        guardarLocalStorage(facturaVentas, keyVentas);
        verFactura(facturaVentas);
    }
    return true;
}

const btnConfirm = document.getElementById("btnConfirm")

btnConfirm.addEventListener("click", (e) => {
    e.preventDefault();
    //Cargar Factura
    if (!cargarFacturaDom()) {
        return;
    }

    //Sweet Alert. Librería JS
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Factura cargada con éxito',
        showConfirmButton: false,
        timer: 1500
    })
    document.getElementById("formFactura").reset();
})