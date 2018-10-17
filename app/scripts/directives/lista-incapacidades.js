'use strict';

/**
 * @ngdoc directive
 * @name ssClienteApp.directive:listaIncapacidades
 * @description
 * # listaIncapacidades
 */
angular.module('ssClienteApp')
  .directive('listaIncapacidades', function () {
    return {
      restrict: 'E',
      scope:{
        contrato:'=?'
      },
      
      templateUrl: 'views/directives/lista-incapacidades.html',
      controller:function($scope, $q, titanCrudService, seguridadSocialService){
        var self = this;

        self.gridOptions = {
          enableRowHeaderSelection: false,
          enableRowSelection: true,
          columnDefs: 
          [
            { field: 'Concepto.AliasConcepto', name: 'Tipo de Incapacidad'},
            { field: 'FechaDesde', name: 'Fecha de inicio', cellTemplate: '<div align="center">{{row.entity.FechaDesde | date:"dd-MM-yyyy"}}</div>' },
            { field: 'FechaHasta', name: 'Fecha de fin', cellTemplate: '<div align="center">{{row.entity.FechaHasta | date:"dd-MM-yyyy"}}</div>' },
            { field: 'FechaRegistro', name: 'Fecha de registro', cellTemplate: '<div align="center">{{row.entity.FechaRegistro | date:"dd-MM-yyyy"}}</div>' },
            { filed: 'NumeroContrato', name: 'NumeroContrato' },
            { field: 'VigenciaContrato', name: 'Vigencia' },
            { field :'Codigo', name: 'Codigo'},
            { name: 'Seleccionar', cellTemplate: '<div align="center"><span class="glyphicon glyphicon-ok" ng-click="grid.appScope.d_listaIncapacidades.select(row.entity)"></span></div>'}
          ]
        };

        self.select = function(row) {
          console.log(row);
        }


        seguridadSocialService.get('incapacidades/incapacidadesPersona/'+$scope.contrato.numContrato+'/'+$scope.contrato.vigContrato, '').then(function(response) {
          console.log(response.data);
          self.gridOptions.data = response.data;
        });

        // var getIncapacidades = function (tipoIncapacidad) {
        //   var deferred = $q.defer();
        //   titanCrudService.get('concepto_nomina_por_persona', 'query=Concepto.Nombreconcepto:'+tipoIncapacidad+',NumeroContrato:'+$scope.contrato.numContrato+',VigenciaContrato:'+$scope.contrato.vigContrato+',Activo:true').then(function(response) {
        //     deferred.resolve(response.data);
        //   });
        //   return deferred.promise;
        // }

        // var gerCodigoIncacidad = function(idIncapcidad) {
        //   var deferred = $q.defer();
        //   seguridadSocialCrudService.get('detalle_novedad_seguridad_social', 'query=ConceptoNominaPorPersona:'+idIncapcidad).then(function(response) {
        //     deferred.resolve(response.data);
        //   });
        //   return deferred.promise;
        // }

        // var promesas = [];
        // self.incapcidadesT= [];
        // promesas.push(getIncapacidades('incapacidad_general'));
        // promesas.push(getIncapacidades('incapacidad_laboral'));
        // $q.all(promesas).then(function(response) {
        //   for (var i = 0; i < response.length; i++) {
        //     if (response[i] != null) {              
        //       self.incapcidadesT = self.incapcidadesT.concat(response[i]);
        //     }
        //   }
        //   var promesasCodigo = [];

        //   for(var i = 0; i < self.incapcidadesT.length; i++) {
        //     promesasCodigo.push(gerCodigoIncacidad(self.incapcidadesT[i].Id));    
        //   }

        //   self.codigos = [];
        //   $q.all(promesasCodigo).then(function(response) {
        //     for (var i = 0; i < response.length; i++) {
        //       self.codigos = self.codigos.concat(response[i]);
        //     }
        //     console.log("incapicadesT: ", self.incapcidadesT);
        //     console.log("codigos: ", self.codigos);
            
        //   });
          // self.gridOptions.data = self.incapcidadesT;
          // $q.all(getIncapacidades)
          
        // });

      },
      controllerAs:'d_listaIncapacidades'
    };
  });
