let container = null;
let img = null;

export default function previewModule (context, itemClass) {
	const CONTAINER_CLASS = 'preview';
	const CONTAINER_CLOSE_BTN = 'preview__close-btn';
	const CONTAINER_IMAGE = 'preview__image';
	const CONTAINER_IMAGE_CONTAINER = 'preview__image-container';
	const ACTIVE_CLASS = 'is-active';

	!container && (container = context.querySelector(`.${CONTAINER_CLASS}`));

	if (!container) {
		return false;
	}

	context.addEventListener('click', function (e) {
		if (e.target.classList.contains(itemClass)) {
			e.preventDefault();
			
			img = new Image();
			img.src = e.target.href;
			img.alt = e.target.dataset.title;
			img.className = `${CONTAINER_IMAGE}`;

			container.querySelector(`.${CONTAINER_IMAGE_CONTAINER}`).prepend(img);

			container.classList.add(ACTIVE_CLASS);			
		}

		if (e.target.classList.contains(`${CONTAINER_CLOSE_BTN}`) || e.target.classList.contains(`${CONTAINER_CLASS}`)) {
			e.preventDefault();

			container.querySelector(`.${CONTAINER_IMAGE_CONTAINER}`).removeChild(img);

			container.classList.remove(ACTIVE_CLASS);
		}
	}, false);			
}