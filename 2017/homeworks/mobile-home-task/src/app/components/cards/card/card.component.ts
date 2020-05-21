import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ICardContent } from "./card.interface";
import { AlertController, ToastController } from 'ionic-angular';

@Component({
	selector: 'card	',
	templateUrl: './card.component.html'
})
export class CardComponent {
	@Input() content: ICardContent;
	@Output() onCardRemove = new EventEmitter();

	public static TOAST_DURATION: number = 3000;

	constructor(
		private socialSharing: SocialSharing,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController
	) { }

	private showAlert(title: string, subTitle: string = '', ) {
		let alert = this.alertCtrl.create({
			title,
			subTitle,
			buttons: ['OK']
		})

		alert.present();
	}

	private showMessage(message: string) {
		let toast = this.toastCtrl.create({
			message,
			duration: CardComponent.TOAST_DURATION,
			position: 'top'
		})

		toast.present();		
	}

	shareCard() {
		let options = {
			subject: this.content.name,
			message: `I've met ${this.content.name} ${this.content.place ? `at ${this.content.place}.` : '.'}`
		}

		this.socialSharing.shareWithOptions(options)
			.then(response => {
				this.showMessage('Shared successfully!');
			})
			.catch(error => {
				this.showAlert('Error!', error);
			});
	}

	removeCard() {
		this.onCardRemove.emit(this.content.id);
	}
}