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
			actionsAfterExecuteSnippets: [
				function (Ajax){
					$.each(App.actionsAfterExecuteSnippets, function (name, action) {
						action(Ajax);
					});
				},
				function(Ajax) {
					$.each(Ajax.executedSnippets, function (name, element) {
						AjaxListener.init(App, element)
					});
				},
			],
			onAjax: [
				function (Ajax) {
					$.each(App.actionsOnAjax, function (name, action) {
						action(Ajax);
					});
				}
			]
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

		$(el ? el :document).find('a.'+ajaxClass+', button.'+ajaxClass).not('.confirm').on('click', function(e){
			the.runAjaxFromElement($(this), defaultOption, e);
		});

		var types = [
			'input[type=submit].'+ajaxClass,
			'input[type=button].'+ajaxClass,
			'button.'+ajaxClass
		];

		$(el ? el :document).find(types).not('.confirm').on('click', function(e){
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

		url_string = the.validateUrl(url_string);

		return new URL(url_string);
	};

	/**
	 * @param {string} url_string
	 * @return {*}
	 */
	this.validateUrl = function (url_string) {
		var pat = /^https?:\/\//i;
		if (!pat.test(url_string))
		{
			var a = document.createElement('a');
			a.href = url_string;
			url_string = a.href;
		}

		return url_string;
	}

})();
