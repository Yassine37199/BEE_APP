// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = { 
  production: false,
  apiUrl : 'https://dark.bee.net.tn:12443/bee_back',
  TestFactureUrl : 'http://localhost:8083',
  factureApiUrl : 'https://dark.bee.net.tn:12443/facturesApi',
  historiqueCnxApiUrl : 'http://localhost:8080/historique_api-0.0.1'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
