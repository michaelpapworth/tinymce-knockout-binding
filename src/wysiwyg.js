/* !
 * tinymce-knockout-binding v1.0.1
 * https://github.com/michaelpapworth/tinymce-knockout-binding
 *
 * Copyright 2014 Michael Papworth
 * Released under the MIT license
 */
(function ($) {
	ko.bindingHandlers['wysiwyg'] = {
		'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			if (!ko.isWriteableObservable(valueAccessor())) throw 'valueAccessor must be writeable and observable';

			// Retrieve custom configuration object from the 'wysiwygConfig' binding, more settings here... http://www.tinymce.com/wiki.php/Configuration
			var options = allBindings.has('wysiwygConfig') ? allBindings.get('wysiwygConfig') : {};

			// Set up a minimal default configuration
			var defaults = {
				'browser_spellcheck': $(element).prop('spellcheck'),
				'plugins': ['link', 'paste'],
				'toolbar': 'undo redo | bold italic | bullist numlist | link',
				'menubar': false,
				'statusbar': false,
				'setup': function (editor) {
					// Ensure the valueAccessor state to achieve a realtime responsive UI.
					editor.on('change keyup nodechange', function (args) {
						// Update the valueAccessor
						valueAccessor()(editor.getContent());

						// When provided with the 'wysiwygDirty' binding, notify the accessor that the editor was touched
						if (allBindings.has('wysiwygDirty')) {
							var accessor = allBindings.get('wysiwygDirty');
							if (!ko.isWriteableObservable(accessor)) throw 'wysiwygDirty must be writeable and observable';
							accessor(editor.isDirty());
						}
							// ...otherwise make a sensible assumption to set the $root view-model's isDirty
						else {
							bindingContext['$root'].isDirty = editor.isDirty();
						}
					});
				}
			};

			// Apply custom configuration over the defaults
			defaults = $.extend(defaults, options);

			// Ensure the valueAccessor's value has been applied to the underlying element, before instanciating the tinymce plugin
			$(element).text(valueAccessor()()).tinymce(defaults);

			// To prevent a memory leak, ensure that the underlying element's disposal destroys it's associated editor.
			ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
				tinyMCE.remove('#' + element.id);
			});
		},
		'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			// Implement the 'value' binding
			return ko.bindingHandlers['value'].update(element, valueAccessor, allBindings, viewModel, bindingContext);
		}
	};
}(jQuery));