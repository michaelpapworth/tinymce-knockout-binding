tinymce-knockout-binding
========================

A KnockoutJS custom binding that applies a TinyMCE Editor to the bound HTML element

[![Build Status](https://travis-ci.org/michaelpapworth/tinymce-knockout-binding.png?branch=master)](https://travis-ci.org/michaelpapworth/tinymce-knockout-binding)

Setup & Dependencies
--------------------

  1.  jQuery 1.7.2 or later
  2.  KnockoutJS 3.0.0 or later
  3.  TinyMCE 4.0.0 or later
  4.  jQuery plugin for TinyMCE

```html
<script type="text/javascript" src="/scripts/jquery-1.7.2.min.js"> </script>
<script type="text/javascript" src="/scripts/knockout-3.0.0.js"> </script>
<script type="text/javascript" src="/scripts/tinymce.min.js"> </script>
<script type="text/javascript" src="/scripts/jquery.tinymce.min.js"> </script>
<script type="text/javascript" src="/scripts/wysiwyg.min.js"> </script>
```

Usage
-----

A simple default editor

```html
<textarea data-bind="wysiwyg : myObservable"></textarea>
```

Design your own editor using http://www.tinymce.com/wiki.php/Configuration to build the `wysiwygConfig` object.

```html
<textarea data-bind="wysiwyg: myObservable, wysiwygConfig: { statusbar: true }"></textarea>
```

**Customisable default configuration NEW to v1.1.0**

tinymce-knockout-binding no longer assumes a default configuration for the editor.  Configuration is applied to all editor instances by setting the binding's `defaults` property.

```js
    ko.bindingHandlers['wysiwyg'].defaults = {
        'plugins': [ 'link' ],
        'toolbar': 'undo redo | bold italic | bullist numlist | link',
        'menubar': false,
        'statusbar': false,
        'setup': function( editor ) {
            editor.on( 'init', function( e ) {
                console.log('wysiwyg initialised');
            });
        }
    };
```

Using this in conjuction with the `wysiwygConfig` binding allows specific editors to **extend** these settings.

Working with Extensions
-----------------------

View-model got dirty tracking?  No problem.  Just add the `wysiwygDirty` binding to maintain your model's dirty tracking.  Not bothered about this?  We still record if the editor was touched, just inspect your viewModel or `bindingContext.$root` for the `isDirty` flag.
 
```html
<textarea data-bind="wysiwyg: myObservable, wysiwygDirty: myDirtyObservable, wysiwygExtensions: [ 'dirty' ]"></textarea>
```

Using the `wordcount plugin`?  Need to extract the counter value?  Simple.

```html
<textarea data-bind="wysiwyg: myObservable,
                     wysiwygConfig: { plugins: [ 'wordcount' ] },
                     wysiwygExtensions: [ 'wordcount' ],
                     wysiwygWordCount: myCounter">
</textarea>
```

**Write your own custom extensions**

Since v1.0.2 extensions are functions called when the editor changes.  To create a custom exetension simply add the following code to your script.

```js
(function( wysiwyg ) {

	wysiwyg.extensions['mycustomextension'] = function( editor, args, allBindings, bindingContext ) {
		// your logic goes here
	};

})( ko.bindingHandlers['wysiwyg'] );
```

To consume your new extension;
```html
<textarea data-bind="wysiwyg : myObservable, wysiwygExtensions: [ 'mycustomextension' ]"></textarea>
```

See a working example http://jsfiddle.net/michaelpapworth/rU3aE/16/

Want to roll your own or contribute?
----------------------

  1. Fork this repository and create a new branch if you intend to contribute your work.
  2. Clone the branch to your computer.
  3. In the console `cd tinymce-knockout-binding && npm run-script build`.
  4. Enable the build as you save your work `npm start`.
