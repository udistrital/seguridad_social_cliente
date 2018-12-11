'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:CalculosCtrl
 * @description
 * # CalculosCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('CalculosCtrl', function (seguridadSocialService) {
    var self = this;
    self.nivelesArl = [{"clase": "CLASE "+romanize(1), "valor": 0}];

    seguridadSocialService.get('generador_reglas/ObtenerHechosCalculo', '').then(function (response) {
      if (Object.keys(response.data).length !== 0) {
        self.conceptosCalculo = response.data.Body;
        self.resolucion = self.conceptosCalculo[0].Resolucion.Resolucion;
        self.vigencia = self.conceptosCalculo[0].Resolucion.Vigencia;
        for (var i = 0; i < self.conceptosCalculo.length; i++) {
          switch (self.conceptosCalculo[i].NombreAporte) {
            case "salud":
               self.salud = self.conceptosCalculo[i].Porcentaje;
              break;
            case "pension":
              self.pension = self.conceptosCalculo[i].Porcentaje;
              break;
            case "arl":
              if (self.nivelesArl.length > 0) {
                self.nivelesArl[0].valor = self.conceptosCalculo[i].Porcentaje;
              }
            case "caja":
               self.caja = self.conceptosCalculo[i].Porcentaje;
              break;
            case "icbf":
               self.icbf = self.conceptosCalculo[i].Porcentaje;
              break;
            case "sena":
               self.sena = self.conceptosCalculo[i].Porcentaje;
              break;
            case "men":
              self.men = self.conceptosCalculo[i].Porcentaje;
            case "esap":
               self.esap = self.conceptosCalculo[i].Porcentaje;
          }
        }
      }
    });

    self.agrearNivelArl = function() {
      self.nivelesArl.push({"clase": "CLASE "+romanize(self.nivelesArl.length+1), "valor": 0});
    }

    self.eliminarNivelArl = function(clase) {
      var nuevoNivel = self.nivelesArl.length-1;
      if(nuevoNivel !== 0) {
        self.nivelesArl.pop();
      }
    }

    self.save = function() {
      var porcentaje = "0";
      for (var i = 0; i < self.conceptosCalculo.length; i++) {
        switch (self.conceptosCalculo[i].NombreAporte) {
          case "salud":
            porcentaje = self.salud;
            break;
          case "pension":
            porcentaje = self.pension;
            break;
          case "arl":
            if (self.nivelesArl.length > 0) {
              porcentaje = self.nivelesArl[0].valor;
            }
          case "caja":
            porcentaje = self.caja;
            break;
          case "icbf":
            porcentaje = self.icbf;
            break;
          case "sena":
            porcentaje = self.sena;
            break;
          case "men":
            porcentaje = self.men;
          case "esap":
            porcentaje = self.esap;
        }
        self.conceptosCalculo[i].Porcentaje = porcentaje;
        self.conceptosCalculo[i].Resolucion.Resolucion = self.resolucion; 
        self.conceptosCalculo[i].Resolucion.Vigencia = self.vigencia;
      }
      
      seguridadSocialService.post('generador_reglas/RegistrarNuevosHechos', self.conceptosCalculo).then(function(response) {
        if (Object.keys(response.data).length !== 0) {
          if (response.data.Type === 'success')
          swal(
            'Registro',
            'Información Guardada',
            'success'
          )
        } else {
          swal(
            'Error',
            '',
            'error'
          )
        }
      })

      
    }

    // tomado de: https://gist.github.com/cronos2/6207591
    function romanize(n) {
      var
        values = [1, 5, 10, 50, 100, 500, 1000],
        letras = ['I', 'V', 'X', 'L', 'C', 'D', 'M'],
        res = [],
        num, letra, val, pos, insert
    
      for(var i = 6; num = values[i], letra = letras[i]; i--) {
        if(n >= num) {
          var r = Math.floor(n / num); 
    
          n -= r * num; 
    
          if(r < 4){
            while(r--){
              res.push(letra);
            }
          } else {
            val = res.pop(); 
            pos = (val ? letras.indexOf(val) : i) + 1; 
            insert = letra + (letras[pos] || 'M'); 
    
            res.push(insert);
          }
        } else {
          res.push('');
        }
      }
    
      return res.join('');
    }
  });
