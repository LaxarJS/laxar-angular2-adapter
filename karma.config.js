/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/* eslint-env node */
const laxarInfrastructure = require( 'laxar-infrastructure' );

module.exports = function( config ) {
   const specPattern = process.argv.pop();
   // eslint-disable-next-line
   console.log( 'Running with karma:', specPattern );
   config.set( karmaConfig( specPattern ) );
};


function karmaConfig( specPattern ) {
   const baseConfig = require( './webpack.config' )[ 0 ];
   return laxarInfrastructure.karma( [ specPattern ], {
      context: __dirname,
      module: baseConfig.module,
      resolve: baseConfig.resolve
   } );
}
