(function() {
	var Form = {
		forms: [],
		unusedField: [
			'send',
			'_do'
		],
		events: [],
		validateEvents: [
			'focusout',
		],
		spanErrorClass: 'help-block',
		divErrorClass: 'has-error',
	}, local = {
		state: {
			validated: false
		}
	};

	Stage.Form = Form;
	Stage.addComponent('Form', Form);

	Form.init = function() {
		$("form").each(function() {
			var form = this;

			// INPUT LISTENER ON EVENTS
			$(this).find(':input').each(function () {
				var input = this;
				if ($.inArray($(this).prop('name'), Form.unusedField) < 0) {
					local.addInputListeners(input)
				}
			});

			// AJAX CHECK SUBMIT IF VALID SEND CLASSIC SUBMIT
			$(this).find(':button[type=submit].ajaxValidation').each(function () {
				var timeout;
				$(this).on('click', function(e){
					e.preventDefault();
					local.removeErrors($(form));
					local.validateForm($(form));
					clearTimeout(timeout);
					timeout = setTimeout(function(){
						if (!local.hasHtmlErrors($(form))) {
							$(form).submit();
						}
					},200);
				});
			});


			Form.forms.push(form);
		});
	};

	/**
	 * @param {jQuery} element
	 */
	local.addInputListeners = function (element) {
		// VALIDATE EVENTS
		// DEFAULT EVENT
		var timeout;
		$(element).on('keydown', function () {
			if (local.state.validated) {
				local.state.validated = false;
				return;
			}
			var fieldName = $(this)[0].name;

			var form = $(this).closest("form");
			if (local.hasHtmlErrors(form, fieldName)) {
				clearTimeout(timeout);
				timeout = setTimeout(function(){

					// FOR ONLY ONE FIELD IN VALIDATION
					// local.removeErrors(form, fieldName);
					// local.validateForm(form, fieldName);

					local.removeErrors(form);
					local.validateForm(form);

					local.state.validated = true;
				},1000);
			}
		});

		// OWN EVENTS
		$.each(Form.validateEvents ,function (i, event) {
			$(element).on(event, function () {
				if (local.state.validated) {
					return;
				}


				var form = $(this).closest("form");

				// FOR ONLY ONE FIELD IN VALIDATION
				// var fieldName = $(this)[0].name;
				// local.removeErrors(form, fieldName);
				// local.validateForm(form, fieldName);

				local.removeErrors(form);
				local.validateForm(form);

				local.state.validated = true;
			})
		})
	};

	/**
	 * @param {jQuery} form
	 * @param {string} fieldName
	 */
	local.hasHtmlErrors = function(form, fieldName) {
		if (fieldName) {
			var input = form.find('input[name='+ fieldName +']');
			var div = input.closest('.' + Form.divErrorClass);
			return div.length > 0;
		}
		var divs = form.find('.' + Form.divErrorClass);
		return divs.length > 0;
	};

	/**
	 * @param {jQuery} form
	 * @param {string} fieldName
	 */
	local.removeErrors = function (form, fieldName) {

		if (fieldName) {
			var input = form.find('input[name='+ fieldName +']');
			var div = input.closest('.' + Form.divErrorClass);
			var span = div.find('span.' + Form.spanErrorClass);
			$(div).removeClass(Form.divErrorClass);
			$(span).remove();
			return;
		}
		var divs = form.find('.' + Form.divErrorClass);
		var spans = form.find('span.' + Form.spanErrorClass);

		$.each(divs, function (i, div) {
			$(div).removeClass(Form.divErrorClass);
		});

		$.each(spans, function (i, span) {
			$(span).remove();
		});
	};

	/**
	 * @param {jQuery} form
	 * @param {string} selectedFieldName
	 */
	local.validateForm = function (form, selectedFieldName) {
		new Stage.Ajax({
			type: 'POST',
			url: form[0].action ,
			data: form.serialize() + '&_validate=1',
			onSuccess: function (data) {
				var forms = data.formsValidation;
				if (!forms) {
					return;
				}

				$.each(forms, function (i, form) {

					var htmlForm = $('form[id = '+form.id+']');

					// VALIDATE ALL FIELDS
					$.each(form.fields, function (i, field) {

						var fieldName = field.htmlName;
						var errors = field.errors;

						// VALIDATE ONLY ONE FIELD
						if (selectedFieldName) {
							if (selectedFieldName === fieldName) {
								local.validateField(htmlForm, fieldName, errors);
							}
						} else {
							// VALIDATE ALL FIELDS
							local.validateField(htmlForm, fieldName, errors);
						}
					})
				});
			}
		});
	};

	/**
	 * @param {jQuery} form
	 * @param {string} field
	 * @param {[]} errors
	 */
	local.validateField = function (form, field, errors) {
		var input = form.find('input[name='+ field +']');
		var div = input.closest("div");
		div.addClass(Form.divErrorClass);
		$.each(errors, function (i, error) {
			var spanError = document.createElement('span');
			spanError.setAttribute('class', Form.spanErrorClass);
			spanError.innerHTML = error;
			input.after($(spanError));
		});
	}

})();
