(function() {
	var App = {
		Controls: {}
	}, local = {
		state: {
			customAjax: false
		}
	}, config = {
		actionPrefix : 'action',
		parameterName : '@application',
	};

	Stage.App = App;
	Stage.addExtension('App', App);

	/**
	 * @param Stage Stage
	 */
	App.init = function (Stage) {
		$.each(App.Controls, function (name, control) {
			App.Controls[name] = new control(App);
		});

		App.run(local.getControlName(), local.getActionName());

		if (local.state.customAjax === false){
			App.loadAjaxElements(undefined, {});
		}
	};

	/**
	 * @param el
	 * @param option
	 * @return {*|Window.App.Ajax|Window.App.Ajax}
	 */
	App.loadAjaxElements = function (el, option) {
		var defaultOption = {};

		$.extend(defaultOption, option);
		var ajax = new Stage.Ajax();

		var ajaxClass = ajax.getConfig().ajax_class;

		$(el ? el :document).find('a.'+ajaxClass+', button.'+ajaxClass).not('.confirm').on('click', function(e){
			ajax.runAjaxFromElement($(this), defaultOption, e);
		});

		var types = [
			'input[type=submit].'+ajaxClass,
			'input[type=button].'+ajaxClass,
			'button.'+ajaxClass
		];

		$(el ? el :document).find(types).not('.confirm').on('click', function(e){
			ajax.runAjaxFromElement($(this), defaultOption, e);
		});

		return ajax;

	};

	/**
	 * RUN CONTROL ACTION
	 * @param controlName
	 * @param action
	 */
	App.run = function (controlName, action) {

		var control = App.Controls[controlName];
		var actionName = local.getActionFullName(action);


		if(typeof control === "undefined"){
			return;
		}

		if(typeof control.startup === "function"){
			control.startup();
		}

		if(typeof control.onAjax === "function"){
			local.state.customAjax = true;
			var option = {
				onAjax: control.onAjax
			};

			App.loadAjaxElements(undefined, option);
		}

		if(typeof control[actionName] !== "function"){
			return;
		}

		control[actionName]();
	};

	/**
	 * GET NAME WITH PREFIX
	 * @param action
	 * @return {string}
	 */
	local.getActionFullName = function (action) {
		return config.actionPrefix + action.charAt(0).toUpperCase() + action.slice(1);
	};

	/**
	 * GET ACTION NAME
	 * @return {string}
	 */
	local.getActionName = function () {
		return Stage.Parameters[config.parameterName].action;
	};

	/**
	 * GET CONTROL NAME
	 * @return {string}
	 */
	local.getControlName = function () {
		return Stage.Parameters[config.parameterName].control;
	};

})();
