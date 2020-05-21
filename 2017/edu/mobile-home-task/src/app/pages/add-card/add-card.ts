import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { ICardContent } from "../../components/cards/card/card.interface";
import { AppService } from "../../app.service";

@Component({
	selector: 'add-card',
	templateUrl: './add-card.html'
})
export class AddCardPage {
	public model: ICardContent = {
		id: 0,
		name: '',
		contacts: {

		}
	};

	constructor(
		public navCtrl: NavController,
		public NavParams: NavParams,
		private AppService: AppService,
		private alertCtrl: AlertController,
		private camera: Camera,
		private geolocation: Geolocation,
		private nativeGeocoder: NativeGeocoder
	) {

	}

	private showAlert(title: string, subTitle: string = '', ) {
		let alert = this.alertCtrl.create({
			title,
			subTitle,
			buttons: ['OK']
		})

		alert.present();
	}

	cancelAddCard() {
		this.navCtrl.pop();
	}

	takePhoto() {
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options)
			.then((imageData) => {
				this.model.img = `data:image/jpeg;base64,${imageData}`;
			})
			.catch((error) => {
				// Handle error
				if (error.match(/cancelled/gi).length > 0) {
					return;					
				}

				return this.showAlert('Error!', error);
			});
	}

	addPhoto() {
		const options: CameraOptions = {
			destinationType: this.camera.DestinationType.DATA_URL,
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
		};

		this.camera.getPicture(options)
			.then((imageData) => {
				this.model.img = `data:image/jpeg;base64,${imageData}`;
			})
			.catch((error) => {
				// Handle error
				if (error.match(/cancelled/gi).length > 0) {
					return;					
				}

				return this.showAlert('Error!', error);
			});
	}

	removePhoto() {
		this.model.img = '';
	}

	setMeetingLocation() {
		this.geolocation.getCurrentPosition({
			enableHighAccuracy: true
		})
			.then((resp) => {
				return this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
			})
			.then((result: NativeGeocoderReverseResult) => {
				this.model.place = `${result.countryName}, ${result.city}, ${result.street}`;
			})
			.catch((error) => {
				this.showAlert('Error!', error);
			});
	}

	saveCard() {
		if (!this.model.name.trim()) {
			let message = `Please fill-in the ${!this.model.name && 'Name'}`

			this.showAlert('Error!', message);

			return false;
		}

		this.AppService.getStoragedData()
			.then(result => {
				this.model.id = result.length;

				return this.AppService.saveDataToStorage(this.model);
			})
			.then(() => {
				this.NavParams.get('update')(this.model);
				this.navCtrl.pop();
			});
	}
}