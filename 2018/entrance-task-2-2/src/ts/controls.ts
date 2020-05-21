export default class ControlsList {
	private static instance: ControlsList;

	public static initialize() {
		if (!ControlsList.instance) {
			ControlsList.instance = new ControlsList();
		}
	}

	private LIST_CLASS = 'controls-list';
	private ITEM_CLASS = 'control';

	private list: Element[];

	constructor() {
		const devices = document.querySelector(`.devices .${this.LIST_CLASS}`);
		const primary = document.querySelector(`.primary .${this.LIST_CLASS}`);

		this.list = [(devices as Element), (primary as Element)];

		this.list.forEach(item => {
			item.addEventListener('click', ({ target }: Event) => {
				if ((target as HTMLElement).classList.contains(`${this.ITEM_CLASS}`)) {
					const controls = (target as any).parentNode.children;

					[...controls].forEach(c => c.classList.remove(`${this.ITEM_CLASS}--full`));
					(target as HTMLElement).classList.add(`${this.ITEM_CLASS}--full`);
					document.body.classList.add('is-show-control');
					this.initControlListener(target as HTMLElement);
				}
			}, true);
		})
	}

	private initControlListener(control: HTMLElement): void {
		control.addEventListener('click', ({target}) => {
			if ((target as HTMLElement).classList.contains(`${this.ITEM_CLASS}__button`)) {
				if ((target as HTMLElement).classList.contains(`${this.ITEM_CLASS}__button--ok`)) {
					this.approveControlChange(control);
				} else {
					this.cancelControlChange(control);
				}
			}
		}, false)
	}

	private cancelControlChange(control: HTMLElement): void {
		control.classList.remove(`${this.ITEM_CLASS}--full`);
		document.body.classList.remove('is-show-control');
	}

	private approveControlChange(control: HTMLElement): void {
		console.log('Save Control Settings');
		
		control.classList.remove(`${this.ITEM_CLASS}--full`);
		document.body.classList.remove('is-show-control');
	}
}