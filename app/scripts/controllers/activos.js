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
    console.log(self.anio);
    var pagosNombre = [];
    seguridadSocialService.getServicio("desc_seguridad_social/CalcularSegSocial",self.nomina).then(function(response) {
      console.log(response.data);
      if (response.data != null) {
        var pagos = response.data;
        angular.forEach(pagos,function(data){
          titanCrudService.get('informacion_proveedor', 'limit=-1&fields=Id,NomProveedor&query=Id:' + data.Persona).then(function(response) {
              self.nombre = response.data[0].NomProveedor;
              pagosNombre.push({
                Persona: data.Persona,
                Nombre: self.nombre,
                PensionUd: data.PensionUd,
                SaludUd: data.SaludUd,
                SaludTotal: data.SaludTotal,
                PensionTotal: data.PensionTotal,
                Arl: data.Arl });
                self.gridOptions.data = pagosNombre;
            });
          });
        } else {
          self.gridOptions.data = pagosNombre;
        }
        });
      self.activosDiv = true;
    };

    titanCrudService.get('liquidacion','fields=Nomina,Id').then(function(response) {
      self.nominas = response.data;
    });

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
          headerCellTemplate: '<div align="center">ARL</div>',
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
