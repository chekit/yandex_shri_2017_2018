'use strict';
/**
 * Модель данных для лекций школы
 * 
 * @class LectionModel
 */
class LectionModel {
	constructor(data = {professor: null, title: null}) {
		this.initialize(data);
	}

	/**
	 * Создаёт модель лекции
	 * 
	 * @param {object} data - объект с указанием имени лектора и названием лекции
	 * 
	 * @memberOf LectionModel
	 */
	initialize(data) {
		this.professor = data.professor || `no name`;
		this.title = data.title || `no title`;
		
		console.log(`"${this.title}" -- Lection created`);
	}
	
	/**
	 * Возвращает название лекции
	 * 
	 * @returns {string} LectionModel.title
	 * 
	 * @memberOf LectionModel
	 */
	getTitle() {
		return this.title;
	}

	/**
	 * Возвращает имя лектора
	 * 
	 * @returns {string} LectionModel.professor
	 * 
	 * @memberOf LectionModel
	 */
	getProfessor() {
		return this.professor;
	}

	/**
	 * Меняет название лекции
	 * 
	 * @param {string} newTitle - Название лекции
	 * @returns {object} LectionModel
	 * 
	 * @memberOf LectionModel
	 */
	setTitle(newTitle) {
		this.title = newTitle;

		return this;
	}

	/**
	 * Изменяет имя лектора
	 * 
	 * @param {string} newProf - Имя лектора
	 * @returns {object} LectionModel
	 * 
	 * @memberOf LectionModel
	 */
	setProfessor(newProf) {
		this.professor = newProf;

		return this;
	}

	/**
	 * Возвращает объект леции
	 * 
	 * @returns {object} LectionMode 
	 * 
	 * @memberOf LectionModel
	 */
	getLection() {
		return this;
	}
}

export default LectionModel;