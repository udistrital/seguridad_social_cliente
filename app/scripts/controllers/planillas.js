'use strict';

/**
 * @ngdoc function
 * @name ssClienteApp.controller:PlanillasCtrl
 * @description
 * # PlanillasCtrl
 * Controller of the ssClienteApp
 */
angular.module('ssClienteApp')
    .controller('PlanillasCtrl', function(seguridadSocialCrudService, seguridadSocialService, titanCrudService, $q, $interval) {
        var self = this;
        var csvContent = ''; // variable para generar el archivo plano
        var periodoPago = {};

        var personasPlanilla = [];

        self.anios = [];
        self.proveedores = [];
        self.habilitarFormulario = true;

        titanCrudService.get('tipo_nomina', '').then(function(response) {
            self.tiposLiquidacion = response.data;
        });

        seguridadSocialService.get('utils/GetActualDate', '').then(function(response) {

            if (Object.keys(response.data.fecha_actual).length !== 0) {
                self.fechaActual = response.data.fecha_actual;
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

        function getPersonas(limit, offset) {
            personasPlanilla = [];
            var begin = 0;
            var numPeticiones = 0; // número de peticiones para las particiones
            for (var i = 0; i < limit; i += offset) {
                numPeticiones++;
            }

            var start = new Date().getTime();
            var tiempoPromesas = 0;
            
            return seguridadSocialService.post('planillas/GenerarPlanillaActivos/' + offset + '/' + begin, periodoPago).then(function(response) {
                var end = new Date().getTime();
                tiempoPromesas = end - start;
                return response.data;
            }).then(function(primerResponse) {
                personasPlanilla = personasPlanilla.concat(primerResponse);
                begin += offset;
                return $interval(function() {
                    seguridadSocialService.post('planillas/GenerarPlanillaActivos/' + offset + '/' + begin, periodoPago).then(function(response) {
                        personasPlanilla = personasPlanilla.concat(response.data);
                    });
                    begin += offset;
                }, tiempoPromesas + 2000, numPeticiones);
            });
        }

        // se encarga de generar el archivo
        self.buscarPagos = function() {
            self.habilitarFormulario = false;
            csvContent = '';
            self.divError = false;
            if (comprobarDatosIngresados()) {

                seguridadSocialCrudService.get('periodo_pago', 'query=Mes:' + parseInt(self.mesPeriodo.value) + ',Anio:' + parseInt(self.anioPeriodo) + ',tipo_liquidacion:' + self.tipoLiquidacion + '&liimit=1').then(function(response) {

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

                        titanCrudService.get('detalle_preliquidacion', 'limit=-1&query=Concepto.NombreConcepto:ibc_liquidado,Preliquidacion.Id:' + periodoPago.Liquidacion).then(function(response) {

                            var totalLiquidacion = response.data.length;
                            var particion = Math.trunc(totalLiquidacion * 0.3);

                            seguridadSocialService.get('pago/GetInfoCabecera/' + periodoPago.Liquidacion + '/' + self.tipoLiquidacion, '').then(function(responseCabecera) {
                                var informacionCabecera = responseCabecera.data;

                                Object.keys(informacionCabecera).forEach(function(key) {

                                    if (isNaN(informacionCabecera[key]["Valor"])) {
                                        escribirArchivo(informacionCabecera[key]["Valor"], informacionCabecera[key]["Longitud"]);
                                    } else {
                                        escribirArchivo(completarSecuenciaNumero(informacionCabecera[key]["Valor"], informacionCabecera[key]["Longitud"]), informacionCabecera[key]["Longitud"]);
                                    }
                                });

                                csvContent += '\n';

                            }).then(function() {

                                getPersonas(totalLiquidacion, particion).then(function() {
                                    var contadorSecuencia = 1; // secuencia del archivo plano
                                    Object.keys(personasPlanilla).forEach(function(key) {
                                        csvContent += '\n';
                                        Object.keys(personasPlanilla[key]).forEach(function(innerKey) {
                                            if (isNaN(personasPlanilla[key][innerKey]["Valor"])) {
                                                escribirArchivo(personasPlanilla[key][innerKey]["Valor"], personasPlanilla[key][innerKey]["Longitud"]);
                                            } else if (typeof personasPlanilla[key][innerKey]["Valor"] == "string") {
                                                escribirArchivo(personasPlanilla[key][innerKey]["Valor"], personasPlanilla[key][innerKey]["Longitud"]);
                                            } else {
                                                escribirArchivo(completarSecuenciaNumero(personasPlanilla[key][innerKey]["Valor"], personasPlanilla[key][innerKey]["Longitud"]), personasPlanilla[key][innerKey]["Longitud"]);
                                            }
                                            if (innerKey == "TipoRegistro") {
                                                escribirArchivo(completarSecuenciaNumero(contadorSecuencia, 5), 5);
                                            }
                                        });
                                        contadorSecuencia++;

                                    });

                                    csvContent = csvContent.replace(/([^\r])\n/g, "$1\r\n");
                                    var blob = new Blob([csvContent], { type: 'text/csv' });
                                    var filename = 'Planilla_' + self.tipoLiquidacion + '_' + self.fechaActual + '.txt';
                                    if (window.navigator.msSaveOrOpenBlob) {
                                        window.navigator.msSaveBlob(blob, filename);
                                    } else {
                                        var elem = window.document.createElement('a');
                                        elem.href = window.URL.createObjectURL(blob);
                                        elem.download = filename;
                                        document.body.appendChild(elem);
                                        elem.click();
                                        document.body.removeChild(elem);
                                    }

                                    csvContent = '';
                                    self.habilitarFormulario = true;
                                });

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
            Enero: 1,
            Febrero: 2,
            Marzo: 3,
            Abril: 4,
            Mayo: 5,
            Junio: 6,
            Julio: 7,
            Agosto: 8,
            Septiembre: 9,
            Octubre: 10,
            Noviembre: 11,
            Diciembre: 12
        };

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


        function completarSecuenciaNumero(numero, longitud) {
            var stringNumero = String(numero);
            var secuencia = '';
            for (var i = 0; i < longitud - stringNumero.length; i++) {
                secuencia += '0';
            }
            secuencia += String(stringNumero);
            return secuencia;
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