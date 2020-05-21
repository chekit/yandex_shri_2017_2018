import { Component, Input } from "@angular/core";

@Component({
	selector: 'card-image',
	templateUrl: './card-image.component.html'
})
export class CardImageComponent {
	@Input() imgSrc: string = '';
	@Input() imgAlt: string = '';
}