(function() {
	var Modal = {};
	var the = this;

	Stage.App.addComponent('Modal', Modal);

	Stage.App.addActionAfterExecuteSnippet('Modal', function (Ajax) {
		the.initializeModal();
	});

	Modal.init = function(App) {
		the.initializeModal();
	};


	this.initializeModal = function () {
		if (typeof document.modalId !== "undefined") {
			$('#' + document.modalId).modal("show");
		}
	};



})();
