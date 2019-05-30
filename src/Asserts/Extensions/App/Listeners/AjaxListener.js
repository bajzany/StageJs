(function () {
	var AjaxListener = {};
	var the = this;
	this.timeout = "undefined";
	Stage.App.addListener('AjaxListener', AjaxListener);

	/**
	 * @param App
	 */
	AjaxListener.init = function (App) {
		var defaultOption = {
			onAjax: [
				function (Ajax) {
					$.each(App.actionsOnAjax, function (name, action) {
						action(Ajax);
					});
				}
			],
			actionsOnSuccess: [
				function (data) {
					$.each(App.actionsOnSuccess, function (name, action) {
						action(data);
					});
				}
			],
			actionsAfterExecuteSnippets: [
				function (Ajax) {
					$.each(App.actionsAfterExecuteSnippets, function (name, action) {
						$.each(Ajax.executedSnippets, function (name, el) {
							action(Ajax, el);
						});
					});
				}
			]
		};

		$(document).on('click', 'a.ajax,button.ajax', function (e) {
			if ($(this).hasClass("confirm") || ($(this).attr("type") == "submit" && $(this).is("button"))) {
				return
			}
			e.preventDefault();
			clearTimeout(the.timeout);
			var element = $(this);
			the.timeout = setTimeout(function () {
				the.runAjaxFromElement(element, defaultOption, e);
			}, 50)
		});
	};

	/**
	 * @param {jQuery} el
	 * @param {*} option
	 * @param {Event} e
	 */
	this.runAjaxFromElement = function (el, option, e) {
		e.preventDefault();
		var url = the.createUrlFromElement(el);
		option.url = url.toString();
		return new Stage.Ajax(option, el);
	};

	/**
	 * @param element
	 * @return {URL|void}
	 */
	this.createUrlFromElement = function (element) {
		var url_string = '';
		if (element instanceof jQuery) {
			if (element.length > 0 && element.is('a')) {
				url_string = element.attr('href');
			} else {
				return console.error('jquery object is empty or not select <A> link');
			}
		} else if (!element) {
			url_string = document.URL;
		}

		url_string = Stage.validateUrl(url_string);

		return new URL(url_string);
	};
})();
