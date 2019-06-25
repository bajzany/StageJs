(function () {
	var Modal = {};
	var the = this;
	var local = {
		data: undefined
	};

	Stage.App.addComponent('Modal', Modal);

	Stage.App.addActionAfterExecuteSnippet('Modal', function (Ajax) {
		the.initializeModal();
	});

	Stage.App.addActionsOnSuccess('Modal', function (data) {
		Modal.onSuccess(data)
	});

	Modal.onSuccess = function (data) {
		local.data = data.modal;
		Modal.render(data);
		setTimeout(function () {
			Modal.synchronize();
		}, 150);
	};

	Modal.init = function (App) {
		the.initializeModal();
	};

	Modal.render = function (data) {
		$.each(data.snippets, function (name, snippetData) {
			var search = name.search('snippet--modal');
			if (search > -1) {
				var source = $(document).find('#' + name);
				var sourceModalContent = source.find('.modal-dialog');
				if (sourceModalContent.length > 0) {

					var snippetElement = $(snippetData);
					var modalSnippetId = snippetElement.attr('id');
					var modalSettings = local.getModalData(modalSnippetId);

					if (modalSettings && modalSettings.close) {
						data.snippets[name] = '';
						return;
					}
					var replaceElement = source.find(".modal#" + modalSnippetId).find(".modal-dialog");
					if (replaceElement.length > 0) {
						replaceElement.html(snippetElement.find(".modal-dialog"));
					} else {
						data.snippets[name] = source.append(snippetElement);
					}
				} else {
					data.snippets[name] = source.html(snippetData);
				}
			}
		});

	};

	local.getModalData = function (id) {
		var selectedModal;
		if (!local.data) {
			return selectedModal;
		}
		$.each(local.data, function (i, modal) {
			if (i === id) {
				selectedModal = modal;
			}
		});

		return selectedModal;
	};

	Modal.synchronize = function () {
		if (!local.data) {
			return;
		}
		$.each(local.data, function (i, modal) {
			if (modal['close']) {
				$('#' + modal['modalId']).modal("hide")
			}
		})
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
