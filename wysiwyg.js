ko.bindingHandlers['wysiwyg'] = {
	'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		if (!ko.isObservable(valueAccessor())) throw 'value must be observable';

		element.value = valueAccessor()();

		$(element).tinymce({
			browser_spellcheck: $(element).prop('spellcheck'),
			plugins: ["link"],
			toolbar: "undo redo | bold italic | bullist numlist | link",
			menubar: false,
			statusbar: false,
			setup: function (editor) {
				var change = function (e) {
					if (!ko.isWriteableObservable(valueAccessor())) throw 'value must be writeable and observable';
					var content = editor.getContent();
					if (valueAccessor()() !== content) {
						valueAccessor()(content);						
					}
					if (allBindings.has('dirty')) {
						var accessor = allBindings.get('dirty');
						if (!ko.isWriteableObservable(accessor)) throw 'dirty must be writeable and observable';
						accessor(true);
					} else {
						bindingContext.$root.isDirty = true;
					}
				};
				editor.on('change', change).on('keyup', change);
			}
		});
		ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
			tinyMCE.remove('#' + element.id);
		});
	},
	'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		element.value = valueAccessor()();
	}
};
