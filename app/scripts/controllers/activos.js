'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:ActivosCtrl
* @description
* # ActivosCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
  .controller('ActivosCtrl', function (seguridadSocialService, titanCrudService, seguridadSocialCrudService, $translate) {
    var self = this;
    var dataDescuentos = [];
    var nominaObj;   // Objeto json con la nómina seleccionada
    var personas = [];
    self.novedadesDiv = false;

    self.anioPeriodo = new Date().getFullYear();
    self.mesPeriodo = new Date().getMonth();

    self.anios = []; // Tiene todos los años desde 1900
    var concpSegSoc = []; // Tiene la información de los conceptos correspondientes a pagos

    self.meses = {
      1: $translate.instant("ENERO"), 2: $translate.instant("FEBRERO"), 3: $translate.instant("MARZO"),
      4: $translate.instant("ABRIL"), 5: $translate.instant("MAYO"), 6: $translate.instant("JUNIO"),
      7: $translate.instant("JULIO"), 8: $translate.instant("AGOSTO"), 9: $translate.instant("SEPTIEMBRE"),
      10: $translate.instant("OCTUBRE"), 11: $translate.instant("NOVIEMBRE"), 12: $translate.instant("DICIEMBRE")
    };

    //Crea un arreglo de objetos para tener los años desde el 1900 hasta el año actual con el metodo getFullYear()
    function calcularAnios() {
      for (var i = new Date().getFullYear(); i >= 2000; i--) {
        self.anios.push({ anio: i });
      }
    }
    calcularAnios();

    titanCrudService.get('concepto_nomina', 'limit=0&query=TipoConcepto.Nombre:pago_seguridad_social').then(function (response) {
      concpSegSoc = response.data;
    });

    //Trae las nóminas liquidadas de acuerdo al mes y año seleccionado
    self.buscarNomina = function () {
      self.novedadesDiv = false;
      self.gridPersonas = false;
      titanCrudService.get('preliquidacion', 'query=EstadoPreliquidacion.Activo:true,EstadoPreliquidacion.Nombre:Abierta,Mes:' + self.mesPeriodo + ',Ano:' + self.anioPeriodo)
        .then(function (response) {
          if (response.data !== null) {
            self.nominas = response.data;
            self.divNominas = true;
            self.divError = false;
          } else {
            self.divNominas = false;
            self.nominas = null;
            self.divError = true;
            self.errorMensajeParte1 = "No se encontrarón nóminas liquidadas para " + self.meses[self.mesPeriodo] + " de " + self.anioPeriodo;
          }
          self.cargando = false;
        }, function () {
          self.divNominas = false;
          self.nominas = null;
          self.divError = true;
          self.errorMensajeParte1 = "No se encontrarón nóminas liquidadas para " + self.meses[self.mesPeriodo] + " de " + self.anioPeriodo;
          self.cargando = false;
        });
    };

    self.nominaSeleccionada = function () {
      self.gridOptions.data = [];
      dataDescuentos = [];
      personas = [];
      nominaObj = JSON.parse(self.nomina);  // Conviente el string de self.nomina a un objetso json
      self.novedadesDiv = false;
      self.gridPersonas = true;

      seguridadSocialCrudService.get('periodo_pago', 'query=Mes:' + self.mesPeriodo +
        ',Anio:' + self.anioPeriodo + ',TipoLiquidacion:' + nominaObj.Nomina.TipoNomina.Nombre +
        ',EstadoSeguridadSocial.Nombre:Abierta').then(function (response) {
          if (Object.keys(response.data[0]).length !== 0) {
            self.divError = true;
          } else {
            self.divError = false;
          }
          self.errorMensajeParte1 = 'Parece que ya existen registros de seguridad social con la nómina';
          self.nominaErrorMensaje = nominaObj.Nomina.Descripcion;
          self.errorMensajeParte2 = 'de para el periodo: ' + self.meses[self.mesPeriodo] + ' del ' + self.anioPeriodo;
        });
        
      switch (nominaObj.Nomina.TipoNomina.Nombre) {
        case "HCH":
        case "CT":
          seguridadSocialService.get('pago/CalcularSegSocialHonorarios/' + nominaObj.Id, '').then(function (response) {
            agregarInformacionGrid(response.data);
          });
          break;

        default:
          seguridadSocialService.getServicio('pago/CalcularSegSocial', nominaObj.Id, '').then(function (response) {
            console.log("info calculada:", response);
            agregarInformacionGrid(response.data);
          });
          break;
      }
      self.cargando = false;
      // self.gridOptions.gridFooterTemplate = '<div class="ui-grid-bottom-panel" style="text-align: center">Total Personas: </div>';
    };

    /* 
    agregarInformacionGrid Función para agregar información al grid de acuerdo a los calculos de seguridad social
    En caso de que alguna persona tenga aparezca más de una vez (por tener varias vinculaciones, por ejemplo, dos vinculaciones
      de docente de honorarios) la función se encarga de agrupar los valores y sumarlos para tener un total correspondiente
    */
    function agregarInformacionGrid(data) {
      var proveedores = {};
      var resultadosProveedores = [];
      if (data !== null) {
        for (var i in data) {
          if (proveedores.hasOwnProperty(data[i].IdProveedor)) {
            proveedores[data[i].IdProveedor].SaludUd += data[i].SaludUd;
            proveedores[data[i].IdProveedor].SaludTotal += data[i].SaludTotal;
            proveedores[data[i].IdProveedor].PensionUd += data[i].PensionUd;
            proveedores[data[i].IdProveedor].PensionTotal += data[i].PensionTotal;
            proveedores[data[i].IdProveedor].FondoSolidaridad += data[i].FondoSolidaridad;
            proveedores[data[i].IdProveedor].Arl += data[i].Arl;
            proveedores[data[i].IdProveedor].Caja += data[i].Caja;
            proveedores[data[i].IdProveedor].Icbf += data[i].Icbf;
          } else {
            proveedores[data[i].IdProveedor] = data[i];
          }

          dataDescuentos.push(data[i]); // Es el arreglo que se utiliza para guardar la información
          personas.push(data[i].IdProveedor.toString());
        }
        for (var key in proveedores) {
          if (proveedores.hasOwnProperty(key)) {
            resultadosProveedores.push(proveedores[key]);
          }
        }

        self.gridOptions.data = resultadosProveedores;
        self.cargando = false;
      } else {
        self.gridOptions.data = null;
      }
    }


    //Función para registrar un nuevo periodo de pago
    self.guardar = function () {
      swal({
        title: $translate.instant('ALERTAS.CONTINUAR'),
        text: '',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: $translate.instant('ALERTAS.GUARDAR'),
        cancelButtonText: $translate.instant('ALERTAS.CANCELAR')
      }).then(function (result) {
        if (result.value) {
          var periodo_pago =
          {
            Mes: parseInt(self.mesPeriodo),
            Anio: parseInt(self.anioPeriodo),
            Liquidacion: nominaObj.Id,
            TipoLiquidacion: nominaObj.Nomina.TipoNomina.Nombre,
            EstadoSeguridadSocial: { Id: 1 }
          };

          var transaccion =
          {
            Personas: personas,
            PeriodoPago: periodo_pago,
            Pagos: []
          };

          var tipoPago = 0, valor = 0;
          for (var i in dataDescuentos) {
            for (var j in concpSegSoc) {
              var pago =
              {
                DetalleLiquidacion: dataDescuentos[i].IdDetallePreliquidacion,
                Valor: 0,
                TipoPago: 0,
                EntidadPago: 0,
                PeridodoPago: periodo_pago
              };
              switch (concpSegSoc[j].NombreConcepto) {
                case "arl":
                  tipoPago = concpSegSoc[j].Id;
                  valor = dataDescuentos[i].Arl;
                  break;
                case "pension_ud":
                  tipoPago = concpSegSoc[j].Id;
                  valor = dataDescuentos[i].PensionUd;
                  break;
                case "salud_ud":
                  tipoPago = concpSegSoc[j].Id;
                  valor = dataDescuentos[i].SaludUd;
                  break;
                case "icbf":
                  tipoPago = concpSegSoc[j].Id;
                  valor = dataDescuentos[i].Icbf;
                  break;
                //caja_compensacion
                case "caja_compensacion":
                  tipoPago = concpSegSoc[j].Id;
                  valor = dataDescuentos[i].Caja;
                  break;
              }
              pago.Valor = valor;
              pago.TipoPago = tipoPago;
              transaccion.Pagos.push(pago);
            }
          }

          seguridadSocialService.post('pago/RegistrarPagos', transaccion).then(function (response) {
            if (response.data.Code === "Ok") {
              swal(
                $translate.instant('ALERTAS.REGISTRADO'),
                $translate.instant('ACTIVOS.REGISTRO') + ' <b>' + self.meses["" + self.mesPeriodo + ""] + '</b>',
                'success'
              );
              self.gridOptions.data = null;
              self.divError = false;
            }
          });
        }
      });
      self.cargando = false;
    };

    self.gridOptions = {
      enableFiltering: true,
      enableSorting: false,
      enableRowHeaderSelection: false,
      enableRowSelection: true,
      multiSelect: false,
      treeRowHeaderAlwaysVisible: false,
      showTreeExpandNoChildren: false,
      showGridFooter: true,
      columnDefs: [
        { field: 'Persona', visible: false },
        { field: 'NombrePersona', name: "Nombre Completo", visible: true, width: '25%' },
        {
          field: 'SaludTotal', visible: true, displayName: $translate.instant('ACTIVOS.SALUD'),
          headerCellTemplate: '<div"><center> {{ \'ACTIVOS.SALUD\' | translate }} <center></div>',
          cellFilter: 'currency',
          cellTemplate: '<div align="right">{{row.entity.SaludTotal | currency}}</div>'
        },
        {
          field: 'PensionTotal', visible: true, displayName: $translate.instant('ACTIVOS.PENSION'),
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.PENSION\' | translate }} </div>',
          cellFilter: 'currency',
          cellTemplate: '<div align="right">{{row.entity.PensionTotal | currency}}</div>'
        },
        {
          field: 'FondoSolidaridad', visible: true, displayName: $translate.instant('ACTIVOS.PENSION'),
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.FONDO\' | translate }} </div>',
          cellFilter: 'currency',
          cellTemplate: '<div align="right">{{row.entity.FondoSolidaridad | currency}}</div>'
        },
        {
          field: 'Arl', visible: true, displayName: $translate.instant('ACTIVOS.ARL'),
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.ARL\' | translate }} </div>',
          cellFilter: 'currency',
          cellTemplate: '<div align="right">{{row.entity.Arl | currency}}</div>'
        },
        {
          field: 'Caja', visible: true, displayName: $translate.instant('ACTIVOS.CAJA'),
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.CAJA\' | translate }} </div>',
          cellFilter: 'currency',
          cellTemplate: '<div align="right">{{row.entity.Caja | currency}}</div>'
        },
        {
          field: 'Icbf', visible: true, displayName: $translate.instant('ACTIVOS.ICBF'),
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.ICBF\' | translate }} </div>',
          cellFilter: 'currency',
          cellTemplate: '<div align="right">{{row.entity.Icbf | currency}}</div>'
        },
        {
          field: 'Novedades',
          headerCellTemplate: '<div align="center"> {{ \'ACTIVOS.NOVEDADES\' | translate }} </div>',
          cellTemplate: '<center><button class="btn btn-success" ng-click="grid.appScope.activos.novedad(row)"> Ver Detalle </button></center>'
        }
      ]
    };

    self.novedad = function (row) {
      self.novedadesDiv = false;
      self.novedadesDiv = true;
      self.persona = row.entity;
    };

  });
