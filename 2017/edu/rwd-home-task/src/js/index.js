import previewModule from './preview.module';

(function (window, document) {
	document.addEventListener('DOMContentLoaded', function () {
		const PREVIEW_CLASS = 'js-preview-link';

		previewModule(document, PREVIEW_CLASS);
	});
})(window, document);