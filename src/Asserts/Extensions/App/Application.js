(function() {
	var App = {
		Controls: {},
		Components: {},
		Listeners: {},
		actionsAfterExecuteSnippets: {},
		actionsOnAjax: {},
		actionsOnSuccess: {},
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

		$.each(App.Components, function (i, component) {
			if(typeof component.init === "function"){
				component.init(App);
			}
		});

		$.each(App.Controls, function (name, control) {
			App.Controls[name] = new control(App);
		});

		App.run(local.getControlName(), local.getActionName());

		// LISTENERS
		$.each(App.Listeners, function (name, listener) {
			if(typeof listener.init === "function"){
				listener.init(App);
			}
		});
	};

	/**
	 * @param name
	 * @param {object} listener
	 */
	App.addListener = function(name, listener){

		if(typeof App.Listeners[name] !== "undefined"){
			console.error("Extension "+name+" exist");
			return;
		}
		if(typeof listener !== "object"){
			console.error("TODO");
			return;
		}
		App.Listeners[name] = listener;
	};

	/**
	 * @param name
	 * @param component
	 */
	App.addComponent = function(name, component){

		if(typeof App.Components[name] !== "undefined"){
			console.error("Extension "+name+" exist");
			return;
		}
		if(typeof component !== "object"){
			console.error("TODO");
			return;
		}
		App.Components[name] = component;
	};

	/**
	 * @param name
	 * @param action
	 */
	App.addActionAfterExecuteSnippet = function(name, action){

		if(typeof App.actionsAfterExecuteSnippets[name] !== "undefined"){
			console.error("Action "+name+" exist");
			return;
		}
		if(typeof action !== "function"){
			console.error("TODO");
			return;
		}
		App.actionsAfterExecuteSnippets[name] = action;
	};

	/**
	 * @param name
	 * @param action
	 */
	App.addActionsOnAjax= function(name, action){

		if(typeof App.actionsOnAjax[name] !== "undefined"){
			console.error("Action "+name+" exist");
			return;
		}
		if(typeof action !== "function"){
			console.error("TODO");
			return;
		}
		App.actionsOnAjax[name] = action;
	};

	/**
	 * @param name
	 * @param action
	 */
	App.addActionsOnSuccess = function(name, action){

		if(typeof App.actionsOnSuccess[name] !== "undefined"){
			console.error("Action "+name+" exist");
			return;
		}
		if(typeof action !== "function"){
			console.error("TODO");
			return;
		}
		App.actionsOnSuccess[name] = action;
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

		if(typeof control[actionName] !== "function"){
			return;
		}

		control[actionName]();
	};

	/**
	 * @param {string} name
	 * @return {*}
	 */
	App.getComponent = function (name) {
		return App.Components[name];
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
