(function() {
	var AjaxListener = {};
	var the = this;

	Stage.App.addListener('AjaxListener', AjaxListener);

	/**
	 * @param App
	 * @param element
	 */
	AjaxListener.init = function (App, element) {

		the.loadAjaxElements(element, {
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
				function (Ajax){
					$.each(App.actionsAfterExecuteSnippets, function (name, action) {
						$.each(Ajax.executedSnippets, function (name, el) {
							action(Ajax, el);
						});
					});
					// AjaxListener.init(App, Ajax.executedSnippets)
					$.each(Ajax.executedSnippets, function (name, el) {
						AjaxListener.init(App, el)
					});

				},
			],

		});
	};

	/**
	 * @param el
	 * @param option
	 * @return {*|Window.App.Ajax|Window.App.Ajax}
	 */
	this.loadAjaxElements = function (el, option) {

		var defaultOption = {};

		$.extend(defaultOption, option);
		var ajax = new Stage.Ajax();

		var ajaxClass = ajax.getConfig().ajax_class;

		$(el ? el :document).find('a.'+ajaxClass+', button.'+ajaxClass).not('.confirm').not(":button[type=submit]").on('click', function(e){
			the.runAjaxFromElement($(this), defaultOption, e);
		});

		return ajax;

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
		if( element instanceof jQuery){
			if(element.length > 0 && element.is('a')){
				url_string = element.attr('href');
			}else{
				return console.error('jquery object is emty or not select <A> link');
			}
		}else if(!element){
			url_string = document.URL;
		}

		url_string = Stage.validateUrl(url_string);

		return new URL(url_string);
	};



})();
