'use strict';
/**
 * Модель данных для аудиторий проведения лекций
 * 
 * @class AuditoryModel
 */
class AuditoryModel {
	constructor(name) {
		this.initialize(name);
	}

	/**
	 * Создаёт аудиторию с указанным именем
	 * Инициализируется с 0 вместительностью и пустой локацией
	 * 
	 * @param {string} name - Название аудитории
	 * 
	 * @memberOf AuditoryModel
	 */
	initialize(name) {
		this.name = name;
		this.capacity = 0;
		this.location = '';
	}

	/**
	 * Возвращает имя аудитории
	 * 
	 * @returns {string} AuditoryModel.name
	 * 
	 * @memberOf AuditoryModel
	 */
	getName() {
		return this.name;
	}

	/**
	 * Возвращает вместительность аудитории
	 * 
	 * @returns {number} AuditoryModel.capacity
	 * 
	 * @memberOf AuditoryModel
	 */
	getCapacity() {
		return this.capacity;
	}

	/**
	 * Возвращает местоположение аудитории
	 * 
	 * @returns {string} AuditoryModel.location
	 * 
	 * @memberOf AuditoryModel
	 */
	getLocation() {
		return this.location;
	}

	/**
	 * Меняет имя аудитории
	 * 
	 * @param {string} newName - новое название аудитории
	 * @returns {object} AuditoryModel 
	 * 
	 * @memberOf AuditoryModel
	 */
	setName(newName) {
		this.name = newName;

		return this;
	}

	/**
	 * Изменяет вместительность аудитории
	 * 
	 * @param {number} newCapacity - вместительность аудитории
	 * @returns {object} AuditoryModel 
	 * 
	 * @memberOf AuditoryModel
	 */
	setCapacity(newCapacity) {
		this.capacity = newCapacity;

		return this;
	}

	/**
	 * Меняет метсоположение аудитории
	 * 
	 * @param {string} newLocation - местоположение аудитории
	 * @returns {object} AuditoryModel
	 * 
	 * @memberOf AuditoryModel
	 */
	setLocation(newLocation) {
		this.location = newLocation;

		return this;
	}
}

export default AuditoryModel;