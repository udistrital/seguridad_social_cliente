'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:ActivosCtrl
* @description
* # ActivosCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('ActivosCtrl', function (seguridadSocialService, titanCrudService, seguridadSocialCrudService, agoraService, argoService, $scope, $translate) {
  var self = this;
  var dataDescuentos = [];
  var nominaObj;   // Objeto json con la nómina seleccionada

  var contratistas = []; // Guarda la información del servicio de contrato_general
  var personasNaturales = []; // Guarda la información del servicio de informacion_persona_natural

  self.novedadesDiv = false;
  self.activosDiv = false;

  self.anioPeriodo = new Date().getFullYear();
  self.mesPeriodo = new Date().getMonth();

  self.anios = []; // Tiene todos los años desde 1900
  self.concpSegSoc = []; // Tiene la información de los conceptos correspondientes a pagos

  var fechaActual = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
  self.meses = { 1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio",
  7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre" };

  //Crea un arreglo de objetos para tener los años desde el 1900 hasta el año actual con el metodo getFullYear()
  function calcularAnios() {
    for (var i = new Date().getFullYear(); i >= 2000 ; i--) {
      self.anios.push({ anio: i });
    }
  }
  calcularAnios();

  titanCrudService.get('concepto_nomina','limit=0&query=NaturalezaConcepto.Nombre:seguridad_social').then(function (response) {
    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].AliasConcepto.includes("Pago") || response.data[i].AliasConcepto.includes("pago")) {
        self.concpSegSoc.push(response.data[i]);
      }
    }
    /*for (let data of response.data) {
      if (data.AliasConcepto.includes("Pago") || data.AliasConcepto.includes("pago")) {
        self.concpSegSoc.push(data);
      }
    }*/
  });

  //Trae las nóminas liquidadas de acuerdo al mes y año seleccionado
  self.buscarNomina = function() {
    // Devuelve el número de días que tiene el mes
    function daysInMonth(humanMonth, year) {
      return new Date(year || new Date().getFullYear(), humanMonth, 0).getDate();
    }
    var maxDias = daysInMonth(self.mesPeriodo, self.anioPeriodo).toString();
    titanCrudService.get('preliquidacion', 'query=EstadoPreliquidacion.Activo:true,EstadoPreliquidacion.Nombre:EnOrdenPago,Mes:'+self.mesPeriodo+',Ano:'+self.anioPeriodo)
    .then(function(response) {
      if (response.data !== null) {
        self.nominas = response.data;
        self.divNominas = true;
        self.divError = false;
      } else {
        self.divNominas = false;
        self.nominas = null;
        self.divError = true;
        self.errorMensaje = "No se encontrarón nóminas liquidadas para " + self.meses[self.mesPeriodo] + " de " + self.anioPeriodo;
      }
    });
  };

  argoService.get('contrato_general','limit=-1').then(function(response) {
    self.contratistas = response.data;
  });

  agoraService.get('informacion_persona_natural','limit=-1').then(function(response) {
    self.personasNaturales = response.data;
  });

  self.idPreliquidacion = 0;

  self.nominaSeleccionada = function() {
    var pagosNombre = [];
    dataDescuentos = [];
    nominaObj = JSON.parse(self.nomina);  // Conviente el string de self.nomina a un objetso json
    seguridadSocialService.getServicio("pago/CalcularSegSocial",nominaObj.Id).then(function(response) {
      console.log("Informacion de la persona");
      console.log(response.data);
      if (response.data !== null) {
        var pagos = response.data;
        //Aquí se va llenando el ui-grid con la información que viene en el arreglo pagos
        angular.forEach(pagos,function(data){
          argoService.getOne('contrato_general', data.NumeroContrato).then(function (response) {
            agoraService.getServicio('informacion_persona_natural', response.data.Contratista).then(function (response) {
              pagosNombre.push({
                Persona: data.NumeroContrato,
                Nombre: response.data.PrimerNombre + " " + response.data.SegundoNombre + " " + response.data.PrimerApellido + " " + response.data.SegundoApellido,
                PensionUd: data.PensionUd,
                SaludUd: data.SaludUd,
                SaludTotal: data.SaludTotal,
                PensionTotal: data.PensionTotal,
                Arl: data.Arl,
                Caja: data.Caja,
                Icbf: data.Icbf });
                self.gridOptions.data = pagosNombre;
                self.idPreliquidacion = data.IdPreliquidacion;
                dataDescuentos.push(data);
              });
            });
          });
        } else {
          self.gridOptions.data = null;
        }
      });
      self.activosDiv = true;
    };


    //Función para registrar un nuevo periodo de pago
    self.guardar = function() {
      swal({
        title: $translate.instant('ALERTAS.CONTINUAR'),
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: $translate.instant('ALERTAS.GUARDAR'),
        cancelButtonText: $translate.instant('ALERTAS.CANCELAR')
      }).then(function(result) {
        if (result.value) {
          var periodo_pago =
          {
            Mes: parseInt(self.mesPeriodo),
            Anio: parseInt(self.anioPeriodo),
            Liquidacion: self.idPreliquidacion,
            TipoLiquidacion: '',
            EstadoSeguridadSocial: { Id: 1 }
          };

          var pagos = [];

          for (var i in dataDescuentos) {
            for (var j in self.concpSegSoc) {
              var pago =
              {
                DetalleLiquidacion: dataDescuentos[i].IdDetallePreliquidacion,
                Valor: 0,
                TipoPago: 0,
                EntidadPago: 0,
                PeridodoPago: periodo_pago
              };
              var tipoPago = 0, valor = 0;
              switch(dataDescuentos[i].NombreConcepto) {
                case "arl":
                var tipoPago = self.concpSegSoc[j].Id;
                var valor = dataDescuentos[i].Arl;
                break;
                case "pension_ud":
                var tipoPago = self.concpSegSoc[j].Id;
                var valor = dataDescuentos[i].PensionUd;
                break;
                case "salud_ud":
                var tipoPago = self.concpSegSoc[j].Id;
                var valor = dataDescuentos[i].SaludUd;
                break;
                case "icbf":
                var tipoPago = self.concpSegSoc[j].Id;
                var valor = dataDescuentos[i].Icbf;
                break;
                //caja_compensacion
                default:
                var tipoPago = self.concpSegSoc[j].Id;
                var valor = dataDescuentos[i].Caja;
                break;
              }
              pago["Valor"] = valor;
              pago["TipoPago"] = tipoPago;
              pagos.push(pago);
            }
          }

          var transaccion =
          {
            PeriodoPago: periodo_pago,
            Pagos: pagos
          };

          seguridadSocialCrudService.post('tr_periodo_pago', transaccion).then(function(response) {
            if (response.data[0] = "Ok") {
              swal(
                $translate.instant('ALERTAS.REGISTRADO'),
                $translate.instant('ACTIVOS.REGISTRO')+' <b>'+self.meses[""+self.mesPeriodo+""]+'</b>',
                'success'
              )
            }
          });

          /*
          seguridadSocialService.post('pago/RegistrarPagos', transaccion).then(function(response) {
            if (response.data[0] = "Ok") {
              swal(
                $translate.instant('ALERTAS.REGISTRADO'),
                $translate.instant('ACTIVOS.REGISTRO')+' <b>'+self.meses[""+self.mesPeriodo+""]+'</b>',
                'success'
              )
            }
          });
        }*/

      }
    });
  };

    self.gridOptions = {
      enableFiltering : true,
      enableSorting : false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      treeRowHeaderAlwaysVisible : false,
      showTreeExpandNoChildren : false,

      columnDefs : [
        {field: 'Persona', visible : false},
        {field: 'Nombre', visible: true, width: '30%', headerCellTemplate: '<div align="center">Nombre</div>'},
        {
          field: 'SaludTotal', visible: true, displayName : $translate.instant('ACTIVOS.SALUD'),
          headerCellTemplate: '<div"><center> {{ \'ACTIVOS.SALUD\' | translate }} <center></div>',
          cellFilter : 'currency',
          cellTemplate: '<div align="right">{{row.entity.SaludTotal | currency}}</div>'
        },
        {
          field: 'PensionTotal', visible: true, displayName : $translate.instant('ACTIVOS.PENSION'),
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.PENSION\' | translate }} </div>',
          cellFilter : 'currency',
          cellTemplate: '<div align="right">{{row.entity.PensionTotal | currency}}</div>'
        },
        {
          field: 'Arl', visible: true, displayName : $translate.instant('ACTIVOS.ARL'),
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.ARL\' | translate }} </div>',
          cellFilter : 'currency',
          cellTemplate: '<div align="right">{{row.entity.Arl | currency}}</div>'
        },
        {
          field: 'Novedades',
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.NOVEDADES\' | translate }} </div>',
          cellTemplate: '<center><button class="btn btn-success" ng-click="grid.appScope.activos.novedad(row)"> Ver Detalle </button></center>' }
        ]
      };

      self.novedad = function(row) {
        self.novedadesDiv = false;
        self.novedadesDiv = true;
        self.persona = row.entity;
      };

    });
