export default class MobileMenu {
	public static initialize(container: HTMLElement = document.body) {
		if (!MobileMenu.instance) {
			MobileMenu.instance = new MobileMenu(container);
		}
	}

	public static instance: MobileMenu;

	private ACTIVE_CLASS: string = 'js-show-menu';
	private ACC_CLASS: string = 'js-open-menu';
	private HEADER_CLASS: string = 'header';
	private MENU_CLASS: string = 'menu-list';

	constructor(
		private container: HTMLElement
	) {
		const header = document.querySelector(`.${this.HEADER_CLASS}`) as HTMLElement;
		const menu = document.querySelector(`.${this.MENU_CLASS}`) as HTMLElement;

		this.container.addEventListener('click', (e: Event) => {
			const { target, currentTarget } = e;

			if ((target as HTMLElement).classList.contains(this.ACC_CLASS)) {
				e.preventDefault();

				if (header && menu) {
					menu.style.top = `${header.offsetTop}px`;

				}

				(currentTarget as HTMLElement)
					.classList[
						(currentTarget as HTMLElement).classList.contains(this.ACTIVE_CLASS)
							? 'remove'
							: 'add'
				](this.ACTIVE_CLASS);
			}

		})
	}
}
