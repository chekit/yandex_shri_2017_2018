export interface ICardContent {
	id: number;
	img?: string;
	name: string;
	place?: string;
	contacts?: {
		phone?: number;
		email?: string;
		web?: string;
	};
	position?: string;
	comment?: string;
}