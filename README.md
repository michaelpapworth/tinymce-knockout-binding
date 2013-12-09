tinymce-knockout-binding
========================

A KnockoutJS custom binding that applys a TinyMCE Editor to the bound HTML element

Usage
-----

A simple default editor

```html
<textarea data-bind="wysiwyg: myObservable"></textarea>
```

Design your own editor using http://www.tinymce.com/wiki.php/Configuration to build the `wysiwygConfig` object.

```html
<textarea data-bind="wysiwyg: myObservable, wysiwygConfig: { statusbar : true }"></textarea>
```

View-model got dirty tracking?  No problem.  Just add the `wysiwygDirty` binding to maintain your model's dirty tracking.  Not bothered about this?  We still record if the editor was touched, just inspect your viewModel or `bindingContext.$root` for the `isDirty` flag.
 
```html
<textarea data-bind="wysiwyg: myObservable, wysiwygDirty: myDirtyObservable"></textarea>
```
