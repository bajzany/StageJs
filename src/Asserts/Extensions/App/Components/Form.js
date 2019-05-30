(function () {
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

	Stage.App.addComponent('Form', Form);


	Form.init = function (App, el) {
		$(el ? el : document).find("form").not(".novalidate").each(function () {
			var form = this;

			// INPUT LISTENER ON EVENTS
			$(form).find(':input').each(function () {
				var input = this;
				if ($.inArray($(this).prop('name'), Form.unusedField) < 0) {
					local.addInputListeners(input)
				}
			});

			// AJAX CHECK SUBMIT IF VALID SEND CLASSIC SUBMIT
			$(form).find(':button[type=submit].ajax').each(function () {
				var timeout;
				$(this).on('click', function (e) {
					var target = this;

					e.preventDefault();
					local.removeErrors($(form));
					local.validateForm($(form));
					clearTimeout(timeout);

					timeout = setTimeout(function () {
						if (!local.hasHtmlErrors($(form))) {
							var formData = new FormData($(form)[0]);
							formData.append(target.getAttribute('name'),'');
							new Stage.Ajax({
								type: 'POST',
								url: $(form)[0].action,
								contentType: false,
								processData : false,
								data: formData,
								onSuccess: function (data, ajax) {
									var modalComponent = Stage.App.getComponent('Modal');
									modalComponent.onSuccess(data, ajax)
								},
								actionsAfterExecuteSnippets: [
									function (Ajax) {
										$.each(Stage.App.actionsAfterExecuteSnippets, function (name, action) {
											if (name !== 'Modal') {
												$.each(Ajax.executedSnippets, function (name, el) {
													action(Ajax, el);
												});
											}
										});
									}
								]
							});
						}
					},200);
				});
			});

			Form.forms.push(form);
		});
	};

	Stage.App.addActionAfterExecuteSnippet('Form', Form.init);

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
				timeout = setTimeout(function () {
					// FOR ONLY ONE FIELD IN VALIDATION
					local.removeErrors(form, fieldName);
					local.validateForm(form, fieldName);

					local.state.validated = true;
				},1000);
			}
		});

		// OWN EVENTS
		$.each(Form.validateEvents ,function (i, event) {
			$(element).on(event, function () {
				var form = $(this).closest("form");

				// FOR ONLY ONE FIELD IN VALIDATION
				var fieldName = $(this)[0].name;
				local.removeErrors(form, fieldName);
				local.validateForm(form, fieldName);

				local.state.validated = true;
			})
		})
	};

	/**
	 * @param {jQuery} form
	 * @param {string} fieldName
	 */
	local.hasHtmlErrors = function (form, fieldName) {
		if (fieldName) {
			var input = form.find('input[name=' + fieldName + ']');
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
			var input = form.find('input[name=' + fieldName + ']');
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
					var htmlForm = $('form[id = ' + form.id + ']');

					// RENDER FORM ERRORS
					htmlForm.find(".alert.alert-danger").remove();
					if (typeof form.errors !== "undefined") {
						$.each(form.errors, function (i, error) {
							var errHtml = $("<div>").addClass("alert alert-danger").attr("role", "alert").html(error);
							htmlForm.prepend(errHtml);
						});
					}

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
		var input = form.find('input[name=' + field + '], select[name=' + field + ']').not('input[type="checkbox"]');
		var div = input.closest("div");

		div.addClass(Form.divErrorClass);
		$.each(errors, function (i, error) {
			var spanError = document.createElement('span');
			spanError.setAttribute('class', Form.spanErrorClass);
			spanError.innerHTML = error;
			var exist = false;
			$.each(input.parent().find('.help-block'), function (i, block) {
				if ($(block).html() == $(spanError).html()) {
					exist = true;
				}
			});

			if (!exist) {
				input.after($(spanError));
			}
		});
	}

})();
