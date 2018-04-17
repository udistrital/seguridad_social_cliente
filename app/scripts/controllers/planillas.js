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


  var contratistas = "0200001CC1013611972      0101                00 11001LEON                   SANCHEZ                    FABIAN                   DARIO                             0           EPS010      CCF04 30303030469204    000469204000469204000469204000469204000001600018140000000000000000000000000000000000000000000000012.5   000137600000000000               000000000              "+ "00000000000.00052200000000000000250000000040000188000000000000000000000000300001410000000000000000000000000000000000                  N14-23 1                                                                                                                                                       000000000240\n"+
  "0200002CC1018459927        0101              00 11001MARTINEZ                    AVEDAÑO                    MARIA                   FERNANDA                           0           EPS010      CCF04 303030301101609   001101609001101609001101609001101609000001600025720000000000000000000000000000000000000000000000012.5   000191400000000000               000000000              "+ "00000000000.00052200000000000000580000000040000441000000000000000000000000300003310000000000000000000000000000000000                  N14-23 1                                                                                                                                                       000000000240\n"+
  "0200003CC79777053        0101                00 11001DAZA                        CORREDOR                   ALEJANDRO               PAOLO                              0           EPS010      CCF04 30303030938408    000938408000938408000938408000938408000001600023770000000000000000000000000000000000000000000000012.5   000177500000000000               000000000              "+ "00000000000.00052200000000000000490000000040000376000000000000000000000000300002820000000000000000000000000000000000                  N14-23 1                                                                                                                                                       000000000240\n"+
  "0200004CC1071166654      0101                00 11001ALVAREZ                     CASAS                      VIVIANA                 ANDREA                             0           EPS010      CCF04 30303030367203    000367203000367203000367203000367203000001600016910000000000000000000000000000000000000000000000012.5   000129000000000000               000000000              "+ "00000000000.00052200000000000000200000000040000147000000000000000000000000300001110000000000000000000000000000000000                  N14-23 1                                                                                                                                                       000000000240\n"+
  "0200005CC86089071        0101                00 11001POLANCO                     LOPEZ                      MALCOM                  ANDRES                             0           EPS010      CCF04 30303030550805    000550805000550805000550805000550805000001600019110000000000000000000000000000000000000000000000012.5   000144600000000000               000000000              "+ "00000000000.00052200000000000000290000000040000221000000000000000000000000300001660000000000000000000000000000000000                  N14-23 1                                                                                                                                                       000000000240\n"+
  "0200006CC14265904        0101                00 11001MEJIA                       SUANCHA                    HUMBERTO                                                   0           EPS010      CCF04 30303030469204    000469204000469204000469204000469204000001600018140000000000000000000000000000000000000000000000012.5   000137600000000000               000000000              "+ "00000000000.00052200000000000000250000000040000188000000000000000000000000300001410000000000000000000000000000000000                  N14-23 1                                                                                                                                                       000000000240\n"+
  "0200007CC152896764       0101                00 11001AHUMADA                      QUITO                     DIANA                   SORAYA                             0           EPS010      CCF04 30303030469204    000469204000469204000469204000469204000001600018140000000000000000000000000000000000000000000000012.5   000137600000000000               000000000              "+ "00000000000.00052200000000000000250000000040000188000000000000000000000000300001410000000000000000000000000000000000                  N14-23 1                                                                                                                                                       000000000240\n"+
  "0200008CC1018453759      0101                00 11001CAMACHO                     REY                        MATEO                                                      0           EPS010      CCF04 30303030938408    000938408000938408000938408000938408000001600023770000000000000000000000000000000000000000000000012.5   000177500000000000               000000000              "+ "00000000000.00052200000000000000490000000040000376000000000000000000000000300002820000000000000000000000000000000000                  N14-23 1                                                                                                                                                       000000000240\n"+
  "0200009CC1031129583      0101                00 11001AREVALO                     HERNANDEZ                  YEIMY                   JOHANA                             0           EPS011      CCF04 30303030938408    000938408000938408000938408000938408000001600023770000000000000000000000000000000000000000000000012.5   000177500000000000               000000000              "+ "00000000000.00052200000000000000490000000040000376000000000000000000000000300002820000000000000000000000000000000000                  N14-23 1                                                                                                                                                       000000000240\n";

  self.anios = [];
  self.proveedores = [];

  titanCrudService.get('tipo_nomina', '').then(function(response) {
    self.tiposLiquidacion = response.data;
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
  self.buscarPagos = function() {
    csvContent = '';
    self.divError = false;
    if (comprobarDatosIngresados()) {
      seguridadSocialCrudService.get('periodo_pago','query=Mes:'+parseInt(self.mesPeriodo.value)+',Anio:'+parseInt(self.anioPeriodo)+',tipo_liquidacion:'+self.tipoLiquidacion+'&liimit=1').then(function(response) {
        periodoPago = null
        if (response.data == null) {
          self.divError = true;
          self.errorMensaje = 'El periodo ingresado no tiene información.';
        } else {
          periodoPago = response.data[0];
        }

        if (periodoPago === null) {
          self.divError = true;
          self.errorMensaje = 'El periodo ingresado no tiene información.';
        } else {
          seguridadSocialService.post('planillas/GenerarPlanillaActivos',periodoPago).then(function(response) {
            //console.log(response.data);
            crearCabecera(self.mesPeriodo.value, self.anioPeriodo);
            csvContent += '\n';
            console.log(self.tipoLiquidacion);
            if (self.tipoLiquidacion === "CT") {
              csvContent += contratistas;
            } else {
              csvContent += response.data;
            }
            csvContent = csvContent.replace(/([^\r])\n/g, "$1\r\n");
            var blob = new Blob([csvContent], {type: 'text/csv'});
            var filename =  'PlanillaTipoE.csv';
            if(window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, filename);
            }
            else{
                var elem = window.document.createElement('a');
                elem.href = window.URL.createObjectURL(blob);
                elem.download = filename;
                document.body.appendChild(elem);
                elem.click();
                document.body.removeChild(elem);
            }
          });
        }
      });
    }
  };

  /*  Modifica el arreglo self.anios para tener los años desde 2016 hasta el año actual
  *   con el metodo getFullYear()
  */
  function calcularAnios() {
    for (var i = new Date().getFullYear(); i >= 2016 ; i--) {
      self.anios.push({ anio: i });
    }
  }
  calcularAnios();

  //json para los meses
  self.meses = { Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
    Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12};

    /* Función para crear la cabecera del archivo plano
    */
    function crearCabecera(mes,anio) {
      escribirArchivo("0110001",7);
      escribirArchivo("UNIVERSIDAD DISTRITAL FRANCISCO JOSE DE CALDAS",200);
      escribirArchivo("NI899999230",18);
      escribirArchivo("7E",22);
      escribirArchivo("S01",51);
      escribirArchivo("14-23",6);

      seguridadSocialCrudService.get('periodo_pago','limit=1&query=Mes:'+mes+',Anio:'+anio).then(function(response) {
        if (response.data !== null && response.data.length !== 0) {
          self.divError = false;
          var anio = self.anioPeriodo;
          var mes = self.mesPeriodo.value;
          var mesSiguiente = parseInt(self.mesPeriodo.value) + 1;
          mes = (mes < 10 ? "0"+mes : ""+mes); //Si el mes es menor de 10, le agrega un 0 al inicio del número. ej: 5 -> 05
          mesSiguiente = (mesSiguiente < 10 ? "0"+mesSiguiente : ""+mesSiguiente);
          escribirArchivo(anio+"-"+mes+""+anio+"-"+mesSiguiente,94);
        } else {
          self.divError = true;
          self.errorMensaje = 'El periodo ingresado no tiene información.';
        }
      });
    }

    /* Función para escribir en el archivo, hace una iteración sobre la longitud del texto
    *  comenzado desde i (i = 0), y va comprobando si texto en la posición de i tiene algún valor
    *  si tiene algún valor le concatena el caracter correspondiente a la posición,
    *  sino concatena un espacio (" ")
    *  @Parámetro 1 texto: El texto que quiere ingresar
    *  @Parámetro 2 longitud: La longitud que debe ocupar esa información en el archivo
    */
    function escribirArchivo(texto,longitud) {
      for (var i = 0; i < longitud; i++) {
        if(texto[i]) {
          csvContent += texto[i];
        } else {
          csvContent += " ";
        }
      }
    }

    self.setSeleccionado = function(item, op) {
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
