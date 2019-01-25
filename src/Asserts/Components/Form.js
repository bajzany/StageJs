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
	}, local = {};

	Stage.Form = Form;
	Stage.addComponent('Form', Form);

	Form.init = function() {
		$("form").each(function() {
			$(this).find(':input').each(function () {
				var input = this;
				if ($.inArray($(this).prop('name'), Form.unusedField) < 0) {
					local.addInputListeners(input)
				}
			});

			Form.forms.push(this);
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
			var form = $(this).closest("form");
			if (local.hasHtmlErrors(form, $(this)[0].name)) {
				clearTimeout(timeout);
				timeout = setTimeout(function(){
					local.removeErrors(form, $(this)[0].name);
					local.validateForm(form, $(this)[0].name);
				},500);
			}
		});

		// OWN EVENTS
		$.each(Form.validateEvents ,function (i, event) {
			$(element).on(event, function () {
				var form = $(this).closest("form");
				local.removeErrors(form, $(this)[0].name);
				local.validateForm(form, $(this)[0].name);
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
	 * @param {string} fieldName
	 */
	local.validateForm = function (form, fieldName) {
		new Stage.Ajax({
			type: 'POST',
			url: form[0].action + '&validate=1',
			data: form.serialize(),
			onSuccess: function (data) {

				if (!data.formErrors) {
					return;
				}

				// VALIDATE ONLY ONE FIELD
				if (fieldName) {
					var errors = data.formErrors[fieldName];
					if (errors && errors.length) {
						local.validateField(form, fieldName, errors);
					}

				// VALIDATE ALL FIELDS
				} else {
					$.each(data.formErrors, function (field, errors) {
						local.validateField(form, field, errors);
					});
				}
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
			spanError.innerText = error;
			input.after($(spanError));
		});
	}

})();
