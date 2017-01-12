# LaxarJS Angular 2 Adapter

> Write LaxarJS widgets and controls using Angular 2


## Installation

Note: These instructions only work for LaxarJS v2.


```sh
npm install --save laxar-angular2-adapter
```

**TODO: Get this section right.**
- What is the main file to include?
- From where to include the types?
- webpack bundle stuff ...

This will automatically install Angular 2 and all necessary peer dependencies (libraries and shims).
Load the Angular adapter module (`laxar-angular2-adapter.ts`) into your project and pass it to `laxar.bootstrap`.

Make sure to have the following mappings in your module loader configuration (e.g. `resolve.alias` for webpack, `path` for RequireJS):

```js
'laxar-types': path.resolve( 'laxar-angular2-adapter/types.ts' )
```

## Usage

With the adapter in place, you can now write widgets and controls using Angular 2.
The LaxarJS Yeoman generator can create simple widgets and controls with the integration technology _"angular2"_.
Continue reading for details.

## Creating an Angular 2 widget

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
The only thing that is important here, is the naming of the module and the component, as the adapter will reference them under these names.

There is just one thing specific to LaxarJS in this basic setup:
The `templateUrl` property of the component does not directly point to a specific file, but rather is an identifier for which HTML file to load by the LaxarJS Angular 2 adapter.
This string will be automatically generated for you when using the yeoman generator.
If this is present, the HTML file under the correct theme folder will be loaded for the widget instance, just as it is the case for any other widget technology.
Feel free to provide a "real" path here, if you don't want to use this mechanism.


### Creating an Angular 2 control

### Testing with LaxarJS Mocks

## Why Angular 2 (and not Angular or Angular X)?

That's a good question!
