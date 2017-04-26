'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:ActivosCtrl
* @description
* # ActivosCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('ActivosCtrl', function (seguridadSocialService, titanCrudService, $q) {
  var self = this;

  self.novedadesDiv = false;
  self.activosDiv = false;
  self.nomina = 0;

  self.anioPeriodo = new Date().getFullYear();
  self.mesPeriodo = new Date().getMonth();

  self.anios = []

  //Crea un arreglo de objetos para tener los años desde 1900 hasta el año actual con el metodo getFullYear()
  function calcularAnios() {
    for (var i = new Date().getFullYear(); i >= 1900 ; i--) {
      self.anios.push({ anio: i });
    }
  }
  calcularAnios();

  var fechaActual = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate()
  self.meses = { Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
    Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12};

  self.nominaSeleccionada = function() {
    seguridadSocialService.getServicio("seg_social/CalcularSegSocial",self.nomina).then(function(response) {
      var pagos = response.data;
      console.log('pagos: ' + pagos);
      angular.forEach(pagos,function(data){
        titanCrudService.get('informacion_proveedor', 'limit=-1&fields=Id,NomProveedor&query=Id:' + data.Persona).then(function(response) {
            self.nombre = response.data[0].NomProveedor;
            self.gridOptions.data.push({
              Persona: data.Persona,
              Nombre: self.nombre,
              PensionUd: data.PensionUd,
              SaludUd: data.SaludUd,
              SaludTotal: data.SaludTotal,
              PensionTotal: data.PensionTotal,
              Arl: data.Arl });
          });
        });
      });
      self.activosDiv = true;
    };

    titanCrudService.get('liquidacion','fields=Nomina,Id').then(function(response) {
      self.nominas = response.data;
      console.log(response.data);
    });

    self.gridOptions = {
      enableFiltering : false,
      enableSorting : true,
      treeRowHeaderAlwaysVisible : false,
      showTreeExpandNoChildren : false,

      columnDefs : [
        {field: 'Persona', visible : false},
        {field: 'Nombre', visible: true, width: '30%', headerCellTemplate: '<div align="center">Nombre</div>'},
        {
          field: 'SaludTotal', visible: true, displayName : 'Salud' ,
          headerCellTemplate: '<div"><center>Salud<center></div>',
          cellFilter : 'currency',
          cellTemplate: '<div align="right">{{row.entity.SaludTotal | currency}}</div>'
        },
        {
          field: 'PensionTotal', visible: true, displayName : 'Pensión',
          headerCellTemplate: '<div align="center">Pensión</div>',
          cellFilter : 'currency',
          cellTemplate: '<div align="right">{{row.entity.PensionTotal | currency}}</div>'
        },
        {
          field: 'Arl', visible: true, displayName : 'ARL',
          headerCellTemplate: '<div align="center">Arl</div>',
          cellFilter : 'currency',
          cellTemplate: '<div align="right">{{row.entity.Arl | currency}}</div>'
        },
        {
          field: 'Novedades',
          headerCellTemplate: '<div align="center">Novedades</div>',
          cellTemplate: '<center><button class="btn btn-success" ng-click="grid.appScope.activos.novedad(row)"> Ver Detalle </button></center>' }
      ]
    };

    self.novedad = function(row) {
      self.novedadesDiv = false;
      self.novedadesDiv = true;
      self.persona = row.entity;
    };

  });
