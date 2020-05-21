import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { ICardContent } from "./components/cards/card/card.interface";

@Injectable()
export class AppService {
	public static DB_NAME = '__appdb';

	private _storage: ICardContent[] = null;

	constructor(
		private storage: Storage
	) {}

	getStoragedData(): Promise<ICardContent[]> {
		return this.storage.get(AppService.DB_NAME)
			.then(result => {
				this._storage = result ? result : this.storage.set(AppService.DB_NAME, []);

				return this._storage;
			})
			.catch(err => {
				return Promise.reject(err);
			});
	}

	saveDataToStorage(card: ICardContent): Promise<ICardContent[]> {
		this._storage.push(card);
		
		return this.storage.set(AppService.DB_NAME, this._storage);
	}

	updateStorage(data: ICardContent[]) {
		this._storage = data;

		return this.storage.set(AppService.DB_NAME, this._storage);
	}
}