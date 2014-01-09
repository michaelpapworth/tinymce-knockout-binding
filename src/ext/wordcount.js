(function( wysiwyg ) {

	wysiwyg.extensions['wordcount'] = function( editor, args, allBindings, bindingContext ) {
		var wordCountPlugin = editor.plugins['wordcount'];

		// Ensure wordcount plugin is enabled and respective binding was provided
		if (wordCountPlugin && allBindings.has( 'wysiwygWordCount' )) {
			var accessor = allBindings.get( 'wysiwygWordCount' );

			if ( !ko.isWriteableObservable( accessor ) ) {
				throw 'wysiwygWordCount must be writeable and observable';
			}

			// Pass the plugin's counter to the observable held by the accessor
			accessor( wordCountPlugin.getCount() );
		}
	};

})( ko.bindingHandlers['wysiwyg'] );
