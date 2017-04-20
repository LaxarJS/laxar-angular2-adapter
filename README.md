# LaxarJS Angular 2 Adapter

> Write LaxarJS widgets and controls using Angular 2

This technology adapter integrates widgets and controls created using Angular 2 into [LaxarJS](https://laxarjs.org) applications, by implementing the integration technology `"angular2"` (skip to the end for a short discussion of the technology identifier).


## Installation

Note: These instructions only work for LaxarJS v2.

```sh
npm install --save laxar-angular2-adapter
```

This will automatically install Angular 2 and all necessary peer dependencies (libraries and shims).
Load the Angular adapter module (`laxar-angular2-adapter`) into your project and pass it to `laxar.create`:

```js
import { create } from 'laxar';
import * as angular2Adapter from 'laxar-angular2-adapter';
import artifacts from 'laxar-loader/artifacts?flow=main&theme=default';
const configuration = { /* ... */ };
create( [ angular2Adapter /* , ... */ ], artifacts, configuration )
   .flow( /* ... name, element ... */ )
   .bootstrap();
```

The Angular 2 adapter is not available as pre-built version, which means that Typescript support will need to be added to your project.
Since `"angular2"` widgets most probably will need a Typescript compiler anyways, additional setup steps are necessary.
First of all you'll need a `tsconfig.json` in your project that configures the Typescript compiler.
Below is a basic version we used to implement this adapter, but feel free to change settings if you are more comfortable with Typescript and its compiler options.

```json
{
   "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "moduleResolution": "node",
      "sourceMap": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "lib": [ "es2015", "dom" ],
      "noImplicitAny": false,
      "suppressImplicitAnyIndexErrors": true,
      "baseUrl": "./",
      "typeRoots": [
         "./node_modules/@types/"
      ]
   },
   "compileOnSave": false,
   "exclude": [
      "**/bower_components/*",
      "**/node_modules/*",
      "**/*-aot.ts"
   ]
}
```

Then you need to add webpack support for Typescript.
This means you'll need the actual compiler as well as a Typescript loader for webpack.
There some different flavors of compilers and loaders for Typescript available, but we chose to go with the common ones.
Add these to your project:

```console
npm install --save-dev typescript ts-loader
```

Finally include support for Typescript in your `webpack.config.js`.
Below is a very simple example, showing only the modified parts:
```js
config = {

   resolve: {
      // Here we add support for Typescript file extensions
      extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
   },

   module: {
      rules: [
         // And here we add the loader rule for these extensions
         {
            test: /\.tsx?$/,
            loader: 'ts-loader'
         }
      ]
   }
};
```

That's it.


## Usage

With the adapter in place, you can now write widgets and controls using Angular 2.
The [LaxarJS Yeoman generator](https://laxarjs.org/docs/generator-laxarjs2-v2-latest/) can create simple widgets and controls for the integration technology _"angular2"_.


## Creating an Angular 2 Widget

You can use the LaxarJS generator for Yeoman to create an _Angular 2_ widget by selecting _"angular2"_ as _integration technology_.
The new widget has a `.ts` file with a simple widget component and a module declaring that component.

This will basically look like this (assuming the widget was named `example-widget`):
```typescript
import { Component, NgModule } from '@angular/core';

@Component( {
   templateUrl: 'ax-widget:template:example-widget'
} )
export class ExampleWidget {

   constructor() {

   }

}

@NgModule( {
   declarations: [ ExampleWidget ]
} )
export class ExampleWidgetModule {}
```

The most basic LaxarJS widget using Angular 2 as technology is a standard Angular component, that belongs to a module declaring the component.
The only important thing is the naming of the module and the component, as the adapter will reference them under these names.

Additionally there is one thing that's completely specific to LaxarJS in this basic setup:
The `templateUrl` property of the component does not directly point to a real file, but rather is an identifier for which template file to load by the LaxarJS Angular 2 adapter.
This string will be automatically generated for you when using the yeoman generator and in general should never be changed.
If this template url is present, the HTML file under the correct theme folder will be loaded for the widget instance, just as it is the case for any other widget technology.
Feel free to provide a "real" path here or even use an embedded template string, if you don't want to use this mechanism.


### Creating and using an Angular 2 Control

Control support for Angular 2 in LaxarJS is limited to loading the correctly themed stylesheet of the control for you.
To be able to use a control (an Angular module and all assets defined for that module) in a widget, you need to import its implementation in the widget and add the corresponding dependencies to the Angular module definition of the widget.
For simplicity, we recommend to define and export a module from your control source file and add that as an import to your widget module.

So let's assume the following exemplary control, only defining a directive that modifies the text color of element it is used on:

```typescript
import { Directive, ElementRef, NgModule } from '@angular/core';

@Directive( {
   selector: '[veryImportant]'
} )
class VeryImportant {
   constructor( element: ElementRef ) {
      element.nativeElement.style.color = 'red';
   }
}

@NgModule( {
   declarations: [ VeryImportant ],
   exports: [ VeryImportant ]
} )
export class VeryImportantControlModule {}
```

The widget that wants to use this control just needs to import the ES module and import the Angular 2 module:
```typescript
import { VeryImportantControlModule } from 'very-important-control';

// ...

@NgModule( {
   imports: [ VeryImportantControlModule ],
   declarations: [ ExampleWidget ]
} )
export class ExampleWidgetModule {}
```

Within its template the directive defined by the control can now be used just as any other Angular 2 directive:
```html
<h1 veryImportant>This is a very important information!</h1>
```


### Testing with LaxarJS Mocks

Mostly, testing with LaxarJS Mocks works just as for any other technology.
The only thing that needs to be loaded are testing shims for _zone.js_ and some new JavaScript APIs (see [Browser Support](#browser-support))
These shims are already composed in `test-support.ts` in the angular2 adapter.
So a basic setup would look like this:

```js
import 'laxar-angular2-adapter/test-support';
import * as axMocks from 'laxar-mocks';

describe( 'An ng2-test-widget', () => {

   let widgetDom;

   beforeEach( axMocks.setupForWidget() );

   beforeEach( () => {
      axMocks.widget.configure( {
         // Features configuration of the widget
      } );
   } );
   beforeEach( axMocks.widget.load );
   beforeEach( () => {
      widgetDom = axMocks.widget.render();
   } );

   afterEach( axMocks.tearDown );

   it( 'does something useful' ) {
      // your tests here
   }

} );
```

## Browser Support

Angular 2 makes heavy use of bleeding edge browser features that are no standard yet or are just being implemented in browsers.
This may make it necessary to include some shims.
For example Internet Explorer 10 will need the `core-js` shim in the application.
Add the dependency to your project (we tested with version 2.4.1) and include it at the top of your projects main file (by default this is the file `init.js`):

```js
import 'core-js/client/shim.min.js';
```

For widget specs, the `test-support.ts` file of the adapter already includes this shim.


## Why the technology identifier `angular2` (and not `angular` or `angularx` or whatever)?

One goal of LaxarJS is to give developers the choice of the framework or library used for the rendering part of a widget.
Starting from AngularJS 1, LaxarJS now supports many more technologies like Vue.js or React.
With the announcement of Angular 2 we very early decided to try to support this new version alongside of the former Angular 1.x releases.

So how should we name this technology when referenced in the widget descriptor file?
If we would have chosen `angular`, than the installed version of the adapter would have made the difference of the supported version.
Major changes in the adapter API would have not been possible since the major version number would have been tied to the major version of AngularJS.
Additionally only one version of Angular could be used at a time.
So this would be no option.

Building the support for both versions into one adapter under one version (if at all possible) would have lead to very unmaintainable code and bloated applications.
Since the current AngularJS version is widely known as Angular 2 and was developed under that name, we just decided to go with `angular2`.
