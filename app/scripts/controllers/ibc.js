'use strict';

/**
* @ngdoc function
* @name ssClienteApp.controller:IbcCtrl
* @description
* # IbcCtrl
* Controller of the ssClienteApp
*/
angular.module('ssClienteApp')
.controller('IbcCtrl', function ($scope, rulerservice, seguridadSocialService) {
  var self = this;
  var conceptos = [];
  var conceptosActivos = [];

  /*  Conceptos de IBC salud
  2,7,8,11,18,29,39,51,52,57,58,60,61,68,74,76,78,174,177,179,195,201,202,206,209,213,214,
  225,226,227,230,232, 239,240,242,245,248,249,250,251,252,253,254,257
  */

 var temporal =
 [
   {
       "Id": 986,
       "Nombre": "nombreRegla1240",
       "Descripcion": "AJUSTE P.ANTI.VAC.RETRO",
       "Estado": true
   },
   {
       "Id": 987,
       "Nombre": "nombreRegla1242",
       "Descripcion": "AJUSTE DOCE BONIF.VAC.RETRO",
       "Estado": true
   },
   {
       "Id": 988,
       "Nombre": "nombreRegla1245",
       "Descripcion": "AJUSTE SUEL.BAS.VACA RETRO",
       "Estado": true
   },
   {
       "Id": 989,
       "Nombre": "nombreRegla1248",
       "Descripcion": "AJUSTE ASIG.ADIC.DECRETO V.",
       "Estado": true
   },
   {
       "Id": 990,
       "Nombre": "nombreRegla1249",
       "Descripcion": "AJUSTE DOCE. BONI.SERVICIOS V.",
       "Estado": true
   },
   {
       "Id": 991,
       "Nombre": "nombreRegla1250",
       "Descripcion": "AJUSTE DOCE. PRIMA SERVICIOS V",
       "Estado": true
   },
   {
       "Id": 992,
       "Nombre": "nombreRegla1251",
       "Descripcion": "AJUSTE GASTOS REP.V",
       "Estado": true
   },
   {
       "Id": 994,
       "Nombre": "nombreRegla1253",
       "Descripcion": "AJUSTE PRIMA TECNICA V.",
       "Estado": true
   },
   {
       "Id": 995,
       "Nombre": "nombreRegla1254",
       "Descripcion": "AJUSTE SUELDO BASICO V",
       "Estado": false
   },
   {
       "Id": 996,
       "Nombre": "nombreRegla1257",
       "Descripcion": "AJUSTE ASIG.DECRETO",
       "Estado": false
   }
];

  seguridadSocialService.get('pago/ConceptosIbc', '').then(function(response) {
    console.log(response.data);
    
    angular.forEach(response.data, function(data){
      conceptosActivos.push(data)
    });
    //Se ejecuta despues de cargado el doom
    $scope.$$postDigest( function() {
      bloquearConceptos();
    });
    self.conceptosActivos = conceptosActivos;
    //self.conceptosActivos = temporal;
  });

  /*
  Le asigna el atributo checked a todos los objetos del arreglo conceptosActivos
  con el estado 1 para que aparezcan seleccionados al cargar la pagina
  */
  var bloquearConceptos = function() {
    for (var i = 0; i < conceptosActivos.length; i++) {
      document.getElementById(conceptosActivos[i].Id).disabled = true;
    }
  };

  self.select = function(item) {
    console.log(item);
    self.conceptosActivos.find(buscarConcepto)
    //console.log(self.conceptosActivos);
  };


  function buscarConcepto(item) {
    for(var i = 0; i < self.conceptosActivos.length; i++) {
      if (self.conceptosActivos[i].Id === item.Id) {
        self.conceptosActivos[i].Estado = !self.conceptosActivos[i].Estado;
      }
    }
  }

  self.guardar = function() {
    swal('Conceptos registrados exitosamente')
    seguridadSocialService.post('conceptos_ibc/ActualizarConceptos/', self.conceptosActivos).then(function(response) {
      console.log(response.data);
    })
  }

  self.habilitarEdicion = function() {
    swal('¿Continuar con la edición?')
    for (var i = 0; i < conceptosActivos.length; i++) {
      document.getElementById(conceptosActivos[i].Id).disabled = false;
    }
  }
});
