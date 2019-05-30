(function () {
	Stage.Ajax = function (options, _call_el) {
		this.Config = {
			ajax_class: 'ajax',
			ajax_load_timeout: 300,
		};

		this.snippets = {
			TYPE_DEFAULT: {
				snippetPrefix: undefined,
				snippets: {}
			},
			TYPE_MODAL: {
				snippetPrefix: 'modal',
				snippets: {}
			},
			TYPE_ADD: {
				snippetPrefix: 'add',
				snippets: {}
			},
		};

		this.executedSnippets = {};

		var the = this;
		var local = {};
		local.state = {
			inProgress: false
		};

		var defaults = {};

		/**
		 * @param state
		 */
		local.inProcess = function (state) {
			// var body = $("body");
			// var loader = body.find('#loader');
			//
			// if (loader.length === 0) {
			// 	loader = document.createElement('div');
			// 	loader.setAttribute('id','loader');
			// 	loader.setAttribute('class','hidden');
			// 	loader = $(loader);
			// 	body.prepend(loader);
			// }
			//
			// if (state.inProgress) {
			// 	loader.removeClass('hidden');
			// } else {
			// 	loader.addClass('hidden');
			// }

		};

		/**
		 * @param data
		 * @param message
		 * @param request
		 */
		local.success = function (data, message, request) {
			if (data.redirect) {
				document.location = data.redirect;
			}

			var ajax = this;
			defaults.onSuccess(data, ajax);
			// ACTIONS ON SUCCESS
			$.each(defaults.actionsOnSuccess, function (name, action) {
				action(data, ajax);
			});

			if (data.snippets) {
				defaults.beforeRedraw(data.snippets);
				$.each(data.snippets, function (name, data) {
					var find = false;
					$.each(the.snippets, function (type, config) {
						var search = name.search('snippet--' + config.snippetPrefix);
						if (search > -1) {
							find = true;
							the.snippets[type].snippets[name] = data
						}
					});

					// NASTAVI SNIPPET JAKO DEFAULT POKUD NENAJDE PREFIX
					if (!find) {
						the.snippets.TYPE_DEFAULT.snippets[name] = data
					}
				});

				defaults.beforeExecuteSnippets(the.snippets);
				local.executeSnippets();

				// ACTIONS AFTER EXECUTE SNIPPETS
				$.each(defaults.actionsAfterExecuteSnippets, function (name, action) {
					action(the);
				});

				defaults.afterExecuteSnippets(the.executedSnippets);
			}

			local.state.inProgress = false;
			defaults.inProcess(local.state);

		};

		/**
		 * EXECUTE SNIPPETS (RENDER)
		 */
		local.executeSnippets = function () {
			//TYPE DEFAULT
			$.each(the.snippets.TYPE_DEFAULT.snippets, function (name, data) {
				var res = $(document).find('#' + name).html(data);
				local.addExecutedSnippet(name, res);
			});

			//TYPE MODAL
			$.each(the.snippets.TYPE_MODAL.snippets, function (name, data) {
				local.addExecutedSnippet(name, $(data));
			});

			//TYPE ADD
			$.each(the.snippets.TYPE_ADD.snippets, function (name, data) {
				var res = $(document).find('#' + name).append(data);
				local.addExecutedSnippet(name, res);
			});
		};

		/**
		 * @param {string} name
		 * @param {jQuery} data
		 */
		local.addExecutedSnippet = function (name, data) {
			the.executedSnippets[name] = data
		};

		/**
		 * @param request
		 * @param ajaxOptions
		 * @param thrownError
		 */
		local.error = function (request, ajaxOptions, thrownError) {
			defaults.onError(request, ajaxOptions, thrownError);
			console.error('AJAX - Element ', _call_el, ' has: ', ajaxOptions);
			local.state.inProgress = false;
			defaults.inProcess(local.state);
		};

		(function (options) {
			defaults.type = 'GET';
			defaults.dataType = 'json';
			defaults.handle = '';
			defaults.url = '';
			// defaults.form = true;
			// defaults.contentType= false;
			// defaults.processData= false;
			defaults.data = false;
			defaults.async = true;
			defaults.success = local.success;
			defaults.onAjax = [];
			defaults.onSuccess = function (){};
			defaults.actionsOnSuccess = [];
			defaults.onError = function (){};
			defaults.beforeExecuteSnippets = function (){};
			defaults.afterExecuteSnippets = function (){};
			defaults.beforeRedraw = function (){};
			defaults.actionsAfterExecuteSnippets = [];
			defaults.inProcess = local.inProcess;
			defaults.error = local.error;

			$.extend(defaults, options);
			if (defaults.url.length !== 0 || defaults.handle.length !== 0) {
				local.state.inProgress = true;
				defaults.inProcess(local.state);

				// ON AJAX ACTIONS
				$.each(defaults.onAjax, function (name, action) {
					action(defaults);
				});

				$.ajax(defaults);
			}

		})(options);

		/**
		 * @return {{}}
		 */
		this.getConfig = function () {
			return the.Config;
		};
	};
})();
