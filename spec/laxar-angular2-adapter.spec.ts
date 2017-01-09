/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { bootstrap, technology } from '../laxar-angular2-adapter';
import * as widgetData from './widget_data';
import { create as createArtifactProviderMock, MOCK_THEME } from 'laxar/lib/testing/artifact_provider_mock';
import {enableProdMode} from '@angular/core';

// prevent console output during test runs
enableProdMode();

describe( 'An Angular 2 widget adapter module', () => {

   it( 'advertises "angular2" as its technology', () => {
      expect( technology ).toEqual( 'angular2' );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'provides a `bootstrap` method', () => {
      expect( bootstrap ).toEqual( jasmine.any( Function ) );
   } );

} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'An Angular 2 widget adapter factory', () => {

   let anchorElement;
   let artifactProviderMock;
   let artifacts;
   let environment;
   let factory;
   let heartbeatMock;
   let onBeforeControllerCreation;

   beforeEach( () => {
      heartbeatMock = jasmine.createSpyObj( 'heartbeatMock', [ 'registerHeartbeatListener' ] );
      artifactProviderMock = createArtifactProviderMock();
      artifactProviderMock.forWidget.mock( widgetData.descriptor.name, {
         assets: {
            [ MOCK_THEME ]: {
               [ `${widgetData.descriptor.name}.html` ]: { content: '<h1>Test</h1>' }
            }
         },
         module: widgetData.module
      } );

      const context = {
         eventBus: { fake: 'I am a mock event bus!' },
         features: widgetData.configuration.features
      };
      artifacts = { widgets: [ widgetData ], controls: [] };
      factory = bootstrap(
         artifacts,
         { artifactProvider: artifactProviderMock, heartbeat: heartbeatMock },
         document.createElement( 'div' )
      );
      anchorElement = document.createElement( 'div' );
      onBeforeControllerCreation = jasmine.createSpy( 'onBeforeControllerCreation' );
      environment = {
         widgetName: widgetData.descriptor.name,
         anchorElement,
         onBeforeControllerCreation,
         services: {
            axContext: context,
            axEventBus: context.eventBus,
            axFeatures: context.features
         }
      };
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'asked to create a widget adapter instance', () => {

      let adapter;

      beforeEach( done => {
         adapter = factory.create( environment )
            .then( _ => { adapter = _; } )
            .then( done, done.fail );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'called the constructor of the component', () => {
         expect( widgetData.widgetSpies.constructor ).toHaveBeenCalled();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'called the onBeforeControllerCreation hook with the injected widget services', () => {
         expect( onBeforeControllerCreation ).toHaveBeenCalledWith( environment.services );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns an adapter API', () => {
         expect( adapter ).toEqual( {
            domAttachTo: jasmine.any( Function ),
            domDetach: jasmine.any( Function ),
            destroy: jasmine.any( Function ),
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'passes requested injections directly to the constructor', () => {
         expect( widgetData.widgetSpies.constructor ).toHaveBeenCalledWith( environment.services.axEventBus );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when asked to attach the widget instance to the DOM', () => {

         let areaElement;

         beforeEach( () => {
            areaElement = document.createElement( 'div' );
            adapter.domAttachTo( areaElement );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'attaches the widget node with the rendered themed template to the anchorElement', () => {
            expect( anchorElement.querySelector( 'h1' ).innerText ).toEqual( 'Test' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'attaches the anchorElement to the provided areaElement', () => {
            expect( areaElement.firstChild ).toBe( anchorElement );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when asked to detach the widget DOM again', () => {

            beforeEach( () => {
               adapter.domDetach();
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'removes the anchorElement again as child of the areaElement', () => {
               expect( areaElement.firstChild ).not.toBe( anchorElement );
            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when asked to destroy the adapter instance again', () => {

            beforeEach( () => {
               adapter.destroy();
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'triggers the angular OnDestroy lifecycle interface method', () => {
               expect( widgetData.widgetSpies.ngOnDestroy ).toHaveBeenCalled();
            } );

         } );

      } );

   } );

} );
