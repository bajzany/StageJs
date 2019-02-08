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
			var modal = $('#' + document.modalId)
			modal.modal("show");

			modal.on("hidden.bs.modal", function () {
				$(this).remove();
			});

		}
	};

})();
