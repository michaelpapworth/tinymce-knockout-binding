(function( wysiwyg ) {

	wysiwyg.extensions['dirty'] = function( editor, args, allBindings, bindingContext ) {
		// When provided with the 'wysiwygDirty' binding, notify the accessor that the editor was touched
		if (allBindings.has( 'wysiwygDirty' )) {
			var accessor = allBindings.get( 'wysiwygDirty' );
			if ( !ko.isWriteableObservable( accessor ) ) {
				throw 'wysiwygDirty must be writeable and observable';
			}
			accessor( editor.isDirty() );
		} else {
			// ...otherwise make a sensible assumption to set the $root view-model's isDirty
			bindingContext['$root'].isDirty = editor.isDirty();
		}
	};

})( ko.bindingHandlers['wysiwyg'] );
