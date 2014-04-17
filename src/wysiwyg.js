(function( $, ko ) {

	var binding = {

		'after': [ 'attr', 'value' ],

		'defaults': {},

		'extensions': {},

		'init': function( element, valueAccessor, allBindings, viewModel, bindingContext ) {
			if ( !ko.isWriteableObservable( valueAccessor() ) ) {
				throw 'valueAccessor must be writeable and observable';
			}

			// Get custom configuration object from the 'wysiwygConfig' binding, more settings here... http://www.tinymce.com/wiki.php/Configuration
			var options = allBindings.has( 'wysiwygConfig' ) ? allBindings.get( 'wysiwygConfig' ) : null,

				// Get any extensions that have been enabled for this instance.
				ext = allBindings.has( 'wysiwygExtensions' ) ? allBindings.get( 'wysiwygExtensions' ) : [],

				settings = configure( binding['defaults'], ext, options, arguments );
			
			// Ensure the valueAccessor's value has been applied to the underlying element, before instanciating the tinymce plugin
			$( element ).text( valueAccessor()() );

			// Defer TinyMCE instantiation
			setTimeout( function() {
				$( element ).tinymce( settings );
			}, 0 );
			
			// To prevent a memory leak, ensure that the underlying element's disposal destroys it's associated editor.
			ko.utils['domNodeDisposal'].addDisposeCallback( element, function() {
				$( element ).tinymce().remove();
			});

			return { controlsDescendantBindings: true };
		},

		'update': function( element, valueAccessor, allBindings, viewModel, bindingContext ) {
			var tinymce = $( element ).tinymce(),
				value = valueAccessor()();

			if ( tinymce ) {
				if ( tinymce.getContent() !== value ) {
					tinymce.setContent( value );
					tinymce.execCommand( 'keyup' );
				}
			}
		}

	};
	
	var configure = function( defaults, extensions, options, args ) {

		// Apply global configuration over TinyMCE defaults
		var config = $.extend( true, {}, defaults );

		if ( options ) {
			// Concatenate element specific configuration
			ko.utils.objectForEach( options, function( property ) {
				if ( Object.prototype.toString.call( options[property] ) === '[object Array]' ) {
					if ( !config[property] ) {
						config[property] = [];
					}
					options[property] = ko.utils.arrayGetDistinctValues( config[property].concat( options[property] ) );
				}
			});

			$.extend( true, config, options );
		}

		// Ensure paste functionality
		if ( !config['plugins'] ) {
			config['plugins'] = [ 'paste' ];
		} else if ( $.inArray( 'paste', config['plugins'] ) === -1 ) {
			config['plugins'].push( 'paste' );
		}

		// Define change handler
		var applyChange = function( editor ) {
			// Ensure the valueAccessor state to achieve a realtime responsive UI.
			editor.on( 'change keyup nodechange', function( e ) {
				// Update the valueAccessor
				args[1]()( editor.getContent() );

				// Run all applied extensions
				for ( var name in extensions ) {
					if ( extensions.hasOwnProperty( name ) ) {
						binding['extensions'][extensions[name]]( editor, e, args[2], args[4] );
					}
				}
			});
		};

		if ( typeof( config['setup'] ) === 'function' ) {
			var setup = config['setup'];

			// Concatenate setup functionality with the change handler
			config['setup'] = function( editor ) {
				setup( editor );
				applyChange( editor );
			};
		} else {
			// Apply change handler
			config['setup'] = applyChange;
		}

		return config;
	};

	// Export the binding
	ko.bindingHandlers['wysiwyg'] = binding;

})( jQuery, ko );
