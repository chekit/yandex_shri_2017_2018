import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ICardContent } from './../../components/cards/card/card.interface' 
import { AddCardPage } from './../add-card/add-card';
import { AppService } from "../../app.service";

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage implements OnInit {
	public cards: ICardContent[] = null;

	constructor(
		public navCtrl: NavController,
		private AppService: AppService
	) {

	}

	ngOnInit() {
		this.AppService.getStoragedData()
			.then((result: ICardContent[]) => this.cards = result)
			.catch(err => alert('Application Error!'));
	}

	onCardRemove(id: number) {
		this.cards = this.cards.filter(card => card.id !== id);

		this.AppService.updateStorage(this.cards);
	}

	onCardAdd(card: ICardContent) {
		this.cards.unshift(card);

		this.AppService.updateStorage(this.cards);
	}

	addCard() {
		this.navCtrl.push(AddCardPage, {
			update: this.onCardAdd.bind(this)
		});
	}
}
