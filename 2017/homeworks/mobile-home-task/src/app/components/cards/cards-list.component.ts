import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'cards',
	templateUrl: './cards-list.component.html'
})
export class CardsListComponent implements OnInit {
	@Input() cardsList;
	@Output() onCardRemove = new EventEmitter();

	constructor() {}

	ngOnInit() {
	}

	emitRemove(id: number) {
		this.onCardRemove.emit(id)
	}
}