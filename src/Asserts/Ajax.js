(function() {
	Stage.Ajax = function (options, _call_el) {

		this.Config = {
			ajax_class: 'ajax',
			ajax_load_timeout: 300,
		};

		var the = this;
		var local = {};
		local.state = {
			inProgress: false
		};

		var defaults = {};

		/**
		 * @param state
		 */
		local.inProcess = function(state) {

			var body = $("body");
			var loader = body.find('#loader');

			if (loader.length === 0) {
				loader = document.createElement('div');
				loader.setAttribute('id','loader');
				loader.setAttribute('class','hidden');
				loader = $(loader);
				body.prepend(loader);
			}

			if (state.inProgress) {
				loader.removeClass('hidden');
			} else {
				loader.addClass('hidden');
			}

		};

		/**
		 * @param data
		 * @param message
		 * @param request
		 */
		local.success = function(data, message, request) {
			var ajax = this;
			defaults.onSuccess(data, ajax);

			if (data.snippets)
			{
				defaults.beforeRedraw(data.snippets);

				$.each(data.snippets, function(name, data){
					var result = $(document).find('#' + name).html(data);
				});

				defaults.afterRedraw(data.snippets);
			}

			local.state.inProgress = false;
			defaults.inProcess(local.state);

		};


		/**
		 * @param request
		 * @param ajaxOptions
		 * @param thrownError
		 */
		local.error = function(request, ajaxOptions, thrownError){
			defaults.onError(request, ajaxOptions, thrownError);
			console.error('AJAX - Element ', _call_el, ' has: ', ajaxOptions)
			local.state.inProgress = false;
			defaults.inProcess(local.state);
		};

		(function(options) {
			defaults.type = 'GET';
			defaults.dataType = 'json';
			defaults.handle = '';
			defaults.url = '';
			defaults.data = false;
			defaults.async = true;
			defaults.success = local.success;
			defaults.onAjax = function(){};
			defaults.onSuccess = function(){};
			defaults.onError = function(){};
			defaults.beforeRedraw = function (){};
			defaults.afterRedraw = function(){};
			defaults.inProcess = local.inProcess;
			defaults.error = local.error;

			$.extend(defaults, options);

			if (defaults.url.length !== 0 || defaults.handle.length !== 0) {
				local.state.inProgress = true;
				defaults.inProcess(local.state);
				defaults.onAjax(defaults);
				$.ajax(defaults);
			}


		})(options);

		/**
		 * @return {{}}
		 */
		this.getConfig = function () {
			return the.Config;
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
	};

})();
