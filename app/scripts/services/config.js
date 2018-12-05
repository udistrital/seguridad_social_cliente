"use strict";

/**
 * @ngdoc property
 * @name ssClienteApp.service:CONF.conf_cloud
 * @propertyOf ssClienteApp.service:CONF
 * @description
 * Variables de configuración de la nube
 */
 var conf_cloud = {
    AGORA_SERVICE: 'https://tuleap.udistrital.edu.co/go_api/administrativa_amazon_api/v1/',
    ARGO_SERVICE: "https://tuleap.udistrital.edu.co/go_api/administrativa_amazon_api/v1/'",
    TITAN_MID_SERVICE: "http://localhost:8082/v1/",
    TITAN_CRUD_SERVICE: "http://localhost:8080/v1/",
    RULER: "http://10.20.0.254/ruler/v1/",
    ADMINISTRATIVA_AMAZON_SERVICE: "http://10.20.0.254/administrativa_amazon_api/v1/",
    SS_CRUD_SERVICE: "http://localhost:8086/v1/",
    SS_MID_SERVCE: "http://localhost:8085/v1/",
    // SESIONES_SERVICE:"https://autenticacion.portaloas.udistrital.edu.co/apioas/sesiones_crud/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID:"X6MhgfZi_RhCPVIazI2aIrq6pWoa",
        REDIRECT_URL: "http://localhost:9102/",
        RESPONSE_TYPE: "id_token token",
        SCOPE: "openid email documento",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9102/",
        SIGN_OUT_APPEND_TOKEN: "true",
    }
    // AUTENTICATION_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/"
 };

 /**
 * @ngdoc property
 * @name ssClienteApp.service:CONF.conf_pruebas
 * @propertyOf ssClienteApp.service:CONF
 * @description
 * Variables de configuración de entorno de pruebas
 */
 var conf_pruebas = {
     // AGORA_SERVICE: "http://10.20.0.254/administrativa_amazon_api/v1/",
    AGORA_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/administrativa_amazon_api/v1/',
    ARGO_SERVICE: "http://10.20.0.254/administrativa_amazon_api/v1/",
    TITAN_MID_SERVICE: "http://10.20.0.254/titan_api_mid/v1/",
    TITAN_CRUD_SERVICE: "http://10.20.0.254/titan_api_crud/v1/",
    RULER: "http://10.20.0.254/ruler/v1/",
    ADMINISTRATIVA_AMAZON_SERVICE: "http://10.20.0.254/administrativa_amazon_api/v1/",
    TITAN_MID_SERVICE: "http://10.20.0.254/ss_mid_api/v1/",
    TITAN_CRUD_SERVICE: "http://10.20.0.254/ss_crud_api/v1/",
    SS_MID_SERVCE: "http://localhost:8085/v1/",
    // SESIONES_SERVICE:"https://autenticacion.portaloas.udistrital.edu.co/apioas/sesiones_crud/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID:"X6MhgfZi_RhCPVIazI2aIrq6pWoa",
        REDIRECT_URL: "http://localhost:9102/",
        RESPONSE_TYPE: "id_token token",
        SCOPE: "openid email documento",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9102/",
        SIGN_OUT_APPEND_TOKEN: "true",
    }
    // AUTENTICATION_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/"
};

 /**
 * @ngdoc property
 * @name ssClienteApp.service:CONF.conf_local
 * @propertyOf ssClienteApp.service:CONF
 * @description
 * Variables de configuración de entorno local
 */
var conf_local = {
    // AGORA_SERVICE: "http://10.20.0.254/administrativa_amazon_api/v1/",
    AGORA_SERVICE: 'https://tuleap.udistrital.edu.co/go_api/administrativa_amazon_api/v1/',
    ARGO_SERVICE: "https://tuleap.udistrital.edu.co/go_api/administrativa_amazon_api/v1/",
    TITAN_MID_SERVICE: "http://10.20.0.254/titan_api_mid/v1/",
    TITAN_CRUD_SERVICE: "http://10.20.0.254/titan_api_crud/v1/",
    RULER: "http://10.20.0.254/ruler/v1/",
    ADMINISTRATIVA_AMAZON_SERVICE: "https://tuleap.udistrital.edu.co/go_api/administrativa_amazon_api/v1/",
    SS_CRUD_SERVICE: "http://localhost:8086/v1/",
    SS_MID_SERVCE: "http://localhost:8085/v1/",
    // SESIONES_SERVICE:"https://autenticacion.portaloas.udistrital.edu.co/apioas/sesiones_crud/v1/",
    CONFIGURACION_SERVICE: "http://10.20.0.254/configuracion_api/v1/",
    TOKEN: {
        AUTORIZATION_URL: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize",
        URL_USER_INFO: "https://autenticacion.portaloas.udistrital.edu.co/oauth2/userinfo",
        CLIENTE_ID:"X6MhgfZi_RhCPVIazI2aIrq6pWoa",
        REDIRECT_URL: "http://localhost:9102/",
        RESPONSE_TYPE: "id_token token",
        SCOPE: "openid email documento",
        BUTTON_CLASS: "btn btn-warning btn-sm",
        SIGN_OUT_URL: "https://autenticacion.portaloas.udistrital.edu.co/oidc/logout",
        SIGN_OUT_REDIRECT_URL: "http://localhost:9102/",
        SIGN_OUT_APPEND_TOKEN: "true",
    }
    // AUTENTICATION_MID_SERVICE: "https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/"
};

/**
 * @ngdoc property
 * @name ssClienteApp.service:CONF.conf_local
 * @propertyOf ssClienteApp.service:CONF
 * @description
 * Variables de configuración de preproducción - pruebas en la nube
 */
var conf_cloud_preproduccion = {

};

/**
 * @ngdoc service
 * @name ssClienteApp.service:CONF
 * @description
 * Constante que retorna las direcciones en el servicio
 */
angular.module("ssClienteApp")
  .constant("CONF", {
      GENERAL: conf_pruebas
  });
