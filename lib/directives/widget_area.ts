/**
 * Copyright 2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AxAreaHelper } from '../types';

@Directive( {
   selector: '[axWidgetArea]'
} )
export class AxWidgetArea implements OnInit {

   @Input() axWidgetArea: string;

   constructor( private element: ElementRef, private areaHelper: AxAreaHelper ) {}

   ngOnInit(): void {
      this.areaHelper.register( this.axWidgetArea, this.element.nativeElement );
   }

}
