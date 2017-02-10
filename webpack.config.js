/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
/* eslint-env node */

const path = require( 'path' );

const nodeEnv = process.env.NODE_ENV;
const isBrowserSpec = nodeEnv === 'browser-spec';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const config = {
   context: __dirname,
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules\/(?!laxar)/,
            loader: 'babel-loader'
         },
         {
            test: /\.tsx?$/,
            loader: 'ts-loader'
         }
      ]
   },
   resolve: {
      extensions: [ '.js', '.jsx', '.ts', '.tsx' ]
   },
   entry: {
      'laxar-angular2-adapter': './laxar-angular2-adapter.ts'
   }
};


if( isBrowserSpec ) {
   const WebpackJasmineHtmlRunnerPlugin = require( 'webpack-jasmine-html-runner-plugin' );
   config.entry = WebpackJasmineHtmlRunnerPlugin.entry(
      './spec/spec-runner.js',
      './lib/*/spec/spec-runner.js'
   );
   config.plugins = [ new WebpackJasmineHtmlRunnerPlugin() ];
   config.output = {
      path: path.resolve( path.join( process.cwd(), 'spec-output' ) ),
      publicPath: '/spec-output/',
      filename: '[name].bundle.js'
   };
}

module.exports = config;
