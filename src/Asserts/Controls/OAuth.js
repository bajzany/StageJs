/**
 * @param App App
 * @constructor
 */
Stage.App.Controls.OAuth = function (App) {

	this.startup = function () {
		// alert('asdasd')
	};

	this.actionDefault = function () {
		// console.log('ANO');
	};

	this.onAjax = function (ajax) {
		ajax.onError = function (request, ajaxOptions){
			console.log('aaa', ajaxOptions)
		};
	}

};
