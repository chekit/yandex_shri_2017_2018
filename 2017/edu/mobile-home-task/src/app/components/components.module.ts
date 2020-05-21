import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { CardsListComponent } from "./cards/cards-list.component";
import { CardComponent } from "./cards/card/card.component";
import { IonicModule } from "ionic-angular";
import { CardImageComponent } from "./card-image/card-image.component";
import { CardImageDirective } from "./card-image/card-image.directive";


@NgModule({
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		CardsListComponent,
		CardComponent
	],
	declarations: [
		CardsListComponent,
		CardComponent,
		CardImageComponent,
		CardImageDirective
	],
	providers: [],
})
export class ComponentsModule { }
