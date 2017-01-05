import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AxAreaHelper } from 'laxar-types';

@Directive( {
   selector: '[axWidgetArea]'
} )
export class AxWidgetArea {

   @Input() axWidgetArea: string;

   constructor( private element: ElementRef, private areaHelper: AxAreaHelper ) {}

   ngOnInit(): void {
      this.areaHelper.register( this.axWidgetArea, this.element.nativeElement );
   }

}
