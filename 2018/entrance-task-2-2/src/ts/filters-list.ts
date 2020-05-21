export default class FilterList {
	public static instance: FilterList;

	public static initialize(containerClassName: string = '.filters') {
			return new FilterList(containerClassName);
	}

	private OPEN_BUTTON_CLASS: string = 'js-show-list';
	private FILTER_BUTTON_CLASS: string = 'filters__button';
	private CONTAINER_CLASS: string;

	constructor(containerClassName: string = '.filters') {
		this.CONTAINER_CLASS = containerClassName;

		const container = document.querySelector(`${this.CONTAINER_CLASS}`) as HTMLElement;
		const toggleFilterButton = container.querySelector(`.${this.OPEN_BUTTON_CLASS}`) as HTMLElement;
		const filterSelectButtons: NodeListOf<HTMLElement> = container.querySelectorAll(`.${this.FILTER_BUTTON_CLASS}`) ;

		if (toggleFilterButton) {
			toggleFilterButton.addEventListener('click', ({ currentTarget }) => {
				this.toggleClass((currentTarget as HTMLElement), 'is-expanded');
				this.toggleClass(container);
			});
		}

		container.addEventListener('click', ({ target }) => {
			if ((target as HTMLElement).classList.contains(this.FILTER_BUTTON_CLASS)) {
				if (toggleFilterButton) {
					const text = toggleFilterButton.querySelector('.text');
					(text as HTMLElement).textContent = `${(target as HTMLElement).innerText}`
					
					if (toggleFilterButton.classList.contains('is-expanded')) {
						toggleFilterButton.click();
					}
				}

				this.deactivateSiblings(filterSelectButtons);
				this.toggleClass((target as HTMLElement));
			}
		});
	}

	private toggleClass(elem: HTMLElement, className: string = 'is-active') {
		elem.classList[
			elem.classList.contains(className) 
				? 'remove' 
				: 'add'
		](className)
	}

	private deactivateSiblings(elems: NodeListOf<HTMLElement>) {
		Array.prototype.forEach.call(elems, (e: HTMLElement) => e.classList.remove('is-active'));
	}
}