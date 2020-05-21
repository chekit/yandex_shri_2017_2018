import { Directive, ElementRef } from "@angular/core";

@Directive({
	selector: '[no-default]'
})
export class CardImageDirective {
	constructor(el: ElementRef) {
		el.nativeElement.classList.add('no-default');
	}
}