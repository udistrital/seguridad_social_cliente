'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:CalculosCtrl
 * @description
 * # CalculosCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
  .controller('CalculosCtrl', function (rulerservice) {
    var self = this;
    self.nivelesArl = [];

    rulerservice.get('predicado', 'query=Nombre__startswith:nivel_arl').then(function (response) {
      console.log(typeof(response.data));
      if(typeof(response.data) === "object") {
        self.nivelesArl = response.data;
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
      console.log("resolución: ", self.resolucion);
      console.log("% pensión: ", self.pension);
      console.log("% salud: ", self.salud);
      console.log("% ARL: ", self.arl);
      console.log("% comisión: ", self.comision);
      console.log("% licencia no remunerada: ", self.licencia);
      console.log("% caja: ", self.caja);
      console.log("% icbf: ", self.icbf);
      
      // swal(
      //   'Registro',
      //   'Información Guardada',
      //   'success'
      // )
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
