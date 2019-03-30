'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:PlanillasCtrl
* @description
* # PlanillasCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
  .controller('PlanillasCtrl', function (seguridadSocialCrudService, seguridadSocialService, titanCrudService) {
    var self = this;
    var csvContent = '';     // variable para generar el archivo plano
    var periodoPago = {};

    self.anios = [];
    self.proveedores = [];

    titanCrudService.get('tipo_nomina', '').then(function (response) {
      self.tiposLiquidacion = response.data;
    });

    seguridadSocialService.get('utils/GetActualDate', '').then(function (response) {
      if (Object.keys(response.data[0]).length !== 0) {
        self.fechaActual = new Date(response.data);
      }
    });

    /*  Función para validar los datos ingresados en el formulario
    *   validando que anioPeriodo y mesPeriodo tengan un valor
    */
    function comprobarDatosIngresados() {
      var mensaje = '';
      var estado = false;
      var alerta = false;

      if (self.tipoLiquidacion === undefined) {
        alerta = true;
        mensaje = 'Por favor selecciona un tipo de nómina';
      } else if (self.anioPeriodo === undefined) {
        alerta = true;
        mensaje = 'Por favor selecciona un año';
      } else if (self.mesPeriodo === undefined) {
        alerta = true;
        mensaje = 'Por favor selecciona un mes';
      } else {
        estado = true;
      }
      self.divAlerta = alerta;
      self.errorAlerta = mensaje;
      return estado;
    }

    // se encarga de generar el archivo
    self.buscarPagos = function () {
      csvContent = '';
      self.divError = false;
      if (comprobarDatosIngresados()) {
        seguridadSocialCrudService.get('periodo_pago', 'query=Mes:' + parseInt(self.mesPeriodo.value) + ',Anio:' + parseInt(self.anioPeriodo) + ',tipo_liquidacion:' + self.tipoLiquidacion + '&liimit=1').then(function (response) {

          periodoPago = null
          if (Object.keys(response.data[0]).length === 0) {
            self.divError = true;
            self.errorMensaje = 'El periodo ingresado no tiene información.';
          } else {
            periodoPago = response.data[0];
          }

          if (periodoPago === null) {
            self.divError = true;
            self.errorMensaje = 'El periodo ingresado no tiene información.';
          } else {

            seguridadSocialService.post('planillas/GenerarPlanillaActivos', periodoPago).then(function (response) {

              seguridadSocialService.get('pago/GetInfoCabecera/' + periodoPago.Liquidacion, '').then(function (responseCabecera) {
                self.infoAdicionalCabecera = responseCabecera.data
                console.log(self.infoAdicionalCabecera);
                
                crearCabecera(self.mesPeriodo.value, self.anioPeriodo);
                escribirArchivo(completarSecuenciaNum(self.infoAdicionalCabecera.TotalPersonas, 5), 5);
                escribirArchivo(completarSecuenciaNum(self.infoAdicionalCabecera.TotalNomina, 12), 12);
                escribirArchivo(self.infoAdicionalCabecera.CodigoUD, 2);
                escribirArchivo(self.infoAdicionalCabecera.CodigoOperador, 2);
                // escribirArchivo(self.totalIbc.toString(), 21);

                csvContent += '\n';

                if (self.tipoLiquidacion === "CT") {
                  csvContent += contratistas;
                } else {
                  csvContent += response.data;
                }
                csvContent = csvContent.replace(/([^\r])\n/g, "$1\r\n");
                var blob = new Blob([csvContent], { type: 'text/csv' });
                var filename = 'PlanillaTipoE.csv';
                if (window.navigator.msSaveOrOpenBlob) {
                  window.navigator.msSaveBlob(blob, filename);
                }
                else {
                  var elem = window.document.createElement('a');
                  elem.href = window.URL.createObjectURL(blob);
                  elem.download = filename;
                  document.body.appendChild(elem);
                  elem.click();
                  document.body.removeChild(elem);
                }
              });

            });
          }
        });
      }
    };

    /*  Modifica el arreglo self.anios para tener los años desde 2016 hasta el año actual
    *   con el metodo getFullYear()
    */
    function calcularAnios() {
      for (var i = new Date().getFullYear(); i >= 2016; i--) {
        self.anios.push({ anio: i });
      }
    }
    calcularAnios();

    //json para los meses
    self.meses = {
      Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
      Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12
    };


    /* Función para crear la cabecera del archivo plano
    */
    function crearCabecera(mes, anio) {
      escribirArchivo('0100000', 7);
      escribirArchivo("UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS", 200);
      escribirArchivo("NI899999230", 18);
      escribirArchivo("7E", 22);
      escribirArchivo("S01", 51);
      escribirArchivo("14-23", 6);
      var mesPensionTemp = mes;
      if (mes === 12) {
        mes = 1
        var mesPlanilla = (mes < 10 ? "0" + mes : "" + mes);
        escribirArchivo(anio + "-" + mesPlanilla, 7);
      } else {
        var mesPlanilla = (mes < 10 ? "0" + (mes - 1) : "" + (mes - 1));
        escribirArchivo(anio + "-" + mesPlanilla, 7);
      }

      var mesPlanilla = (mesPensionTemp < 10 ? "0" + mesPensionTemp : "" + mesPensionTemp)
      escribirArchivo(anio + "-" + mesPlanilla, 27);
    }

    function completarSecuenciaNum(numero, longitud) {
      var longFaltante = longitud - numero.toString().length;
      var secuenciaCompletada = "";

      for (var i = 0; i < longFaltante; i++) {
        secuenciaCompletada += "0";
      }
      
      
      secuenciaCompletada += numero;
      
      return secuenciaCompletada;
    }

    /* Función para escribir en el archivo, hace una iteración sobre la longitud del texto
    *  comenzado desde i (i = 0), y va comprobando si texto en la posición de i tiene algún valor
    *  si tiene algún valor le concatena el caracter correspondiente a la posición,
    *  sino concatena un espacio (" ")
    *  @Parámetro 1 texto: El texto que quiere ingresar
    *  @Parámetro 2 longitud: La longitud que debe ocupar esa información en el archivo
    */
    function escribirArchivo(texto, longitud) {
      for (var i = 0; i < longitud; i++) {
        if (texto[i]) {
          csvContent += texto[i];
        } else {
          csvContent += " ";
        }
      }
    }

    self.setSeleccionado = function (item, op) {
      switch (op) {
        case 1:
          self.anioPeriodo = item;
          break;
        case 2:
          self.mesPeriodo = item;
          break;
        default:
          self.anioPeriodo = null;
          self.mesPeriodo = null;
          break;
      }
    };
  });
