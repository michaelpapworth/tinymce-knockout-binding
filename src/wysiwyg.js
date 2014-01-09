
(function ($, ko) {

	ko.bindingHandlers['wysiwyg'] = {
		'extensions': {},
		'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			if (!ko.isWriteableObservable(valueAccessor())) throw 'valueAccessor must be writeable and observable';

			// Get custom configuration object from the 'wysiwygConfig' binding, more settings here... http://www.tinymce.com/wiki.php/Configuration
			var options = allBindings.has('wysiwygConfig') ? allBindings.get('wysiwygConfig') : {},
				// Get any extensions that have been enabled for this instance.
				ext = allBindings.has('wysiwygExtensions') ? allBindings.get('wysiwygExtensions') : [],
				// Set up a minimal default configuration
				defaults = {
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

							for (var name in ext) {
								ko.bindingHandlers['wysiwyg'].extensions[ext[name]](editor, args, allBindings, bindingContext);
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
				$(element).tinymce().remove();
			});
		},
		'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			// Implement the 'value' binding
			return ko.bindingHandlers['value'].update(element, valueAccessor, allBindings, viewModel, bindingContext);
		}
	};

})(jQuery, ko);