/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { AxAreaHelper } from 'laxar-types';
import { AxWidgetArea } from '../widget_area';

@Component( {
   template: `
      <div axWidgetArea="staticArea1"></div>
      <div axWidgetArea="staticArea2"></div>
      <div [axWidgetArea]="areaBinding1"></div>
      <div [axWidgetArea]="areaBinding2"></div>
   `
} )
class TestComponent {
   areaBinding1 = 'dynamicArea1';
   areaBinding2 = 'dynamicArea2';
}

describe( 'A widget area directive', () => {

   let fixture;
   let areaHelperMock;

   beforeAll( () => {
      TestBed.initTestEnvironment( BrowserDynamicTestingModule, platformBrowserDynamicTesting() );
   } );

   beforeEach( () => {
      areaHelperMock = jasmine.createSpyObj( 'AxAreaHelper', [ 'register' ] );
      fixture = TestBed
         .configureTestingModule( {
            declarations: [ AxWidgetArea, TestComponent ],
            providers: [ { provide: AxAreaHelper, useValue: areaHelperMock } ]
         } )
         .createComponent( TestComponent );
      fixture.detectChanges();
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'registers all static widget areas of a widget', () => {
      expect( areaHelperMock.register ).toHaveBeenCalledWith( 'staticArea1', element( 0 ) );
      expect( areaHelperMock.register ).toHaveBeenCalledWith( 'staticArea2', element( 1 ) );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'registers all widget areas with binding of a widget', () => {
      expect( areaHelperMock.register ).toHaveBeenCalledWith( 'dynamicArea1', element( 2 ) );
      expect( areaHelperMock.register ).toHaveBeenCalledWith( 'dynamicArea2', element( 3 ) );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function element( index ) {
      return fixture.debugElement.queryAll( By.directive( AxWidgetArea ) )[ index ].nativeElement;
   }

} );
