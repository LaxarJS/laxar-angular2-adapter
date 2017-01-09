/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/* eslint-env node */
/* eslint no-var:0 */
var path = require( 'path' );

module.exports = {
   context: __dirname,
   entry: {
      'laxar-angular2-adapter': './laxar-angular2-adapter.ts'
   },
   module: {
      loaders: [
         {
            test: /\.js$/,
            exclude: /node_modules\/(?!laxar)/,
            loader: 'babel-loader'
         },
         {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: 'ts-loader'
         }
      ]
   },
   resolve: {
      extensions: [ '', '.js', '.jsx', '.ts', '.tsx' ],
      alias: {
         'laxar-types': path.join( __dirname, './types' )
      }
   }
};
