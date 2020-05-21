'use strict';

import moment from 'moment';

/**
 * Модель данных для школ
 * 
 * @class SchoolModel
 */
class SchoolModel {
	/**
	 * Создаёт строку с датой и временем. Необходимо для генерации ключа расписания
	 * 
	 * @static
	 * @param {string} dateTime - строка формата 'YYYY-MM-DD HH:MM'
	 * @returns {string} result - строка формата 'DD-MM-YYY, HH:MM'
	 * 
	 * @memberOf SchoolModel
	 */
	static generateDate(dateTime) {
		let date = new Date(dateTime);

		let result = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}__${date.getHours()}:${date.getMinutes()}`;

		return result;
	}

	constructor(name, total = 0) {
		this.initialize(name, total);
	}

	/**
	 * Создаёт объект школы
	 * 
	 * @param {string} name - имя школы
	 * @param {number} total - количество студентов
	 * 
	 * @memberOf SchoolModel
	 */
	initialize(name, total) {
		console.log(`"${name}" -- School created`);
		this.name = name;
		this.lections = [];
		this.schedule = {};

		if (typeof total !== 'number') {
			console.error('Please specify students Number!');

			total = 0;
		}

		this.totalStudents = total;
	}

	/**
	 * Возвращает имя школы
	 * 
	 * @returns {string} SchoolModel.name
	 * 
	 * @memberOf SchoolModel
	 */
	getName() {
		return this.name;
	}

	/**
	 * Возвращает массив всех лекций школы
	 * 
	 * @returns {array} SchoolModel.lections 
	 * 
	 * @memberOf SchoolModel
	 */
	getLections() {
		return this.lections;
	}

	/**
	 * Возвращает общее количество студентов школы
	 * 
	 * @returns {number} SchoolModel.totalStudents 
	 * 
	 * @memberOf SchoolModel
	 */
	getTotalStudens() {
		return this.totalStudents;
	}

	/**
	 * Увеличивает общее количество студентов школы
	 * 
	 * @param {number} num - на сколько студентов увеличить поток
	 * 
	 * @memberOf SchoolModel
	 */
	increaseStudens(num) {
		if (typeof num !== 'number') {
			return console.error('Please specify students Number!')
		}

		this.totalStudents += num;
	}

	/**
	 * Уменьшает общее количество студентов школы
	 * 
	 * @param {number} num - на сколько студентов уменьшить поток 
	 * 
	 * @memberOf SchoolModel
	 */
	decreaseStudens(num) {
		if (typeof num !== 'number') {
			return console.error('Please specify students Number!')
		}

		if (num > this.totalStudents) {
			this.totalStudents = 0;
		} else {
			this.totalStudents -= num;
		}
	}

	/**
	 * Выводит расписание школы
	 * 
	 * @returns {object} SchoolModel.schedule 
	 * 
	 * @memberOf SchoolModel
	 */
	getSchedule() {
		return this.schedule;
	}

	/**
	 * Добавляет лекцию в указанную дату и время
	 * 
	 * @param {string} dateTime - строка формата 'YYYY-MM-DD HH:MM'
	 * @param {string} lection - объект, необходимый для создания объекта лекции
	 * @returns {object} SchoolModel 
	 * 
	 * @memberOf SchoolModel
	 */
	addLection(dateTime, lection) {
		if (!lection) {
			console.error('Please add lection {name, title}');

			return false;
		}

		let timestamp = SchoolModel.generateDate(dateTime);

		if (this.schedule[timestamp] && this.schedule[timestamp].length > 0) {
			console.error('Time is already reserved');

			return false;
		}

		this.lections.push(lection);
		this.schedule[timestamp] = lection;

		return this;
	}

	/**
	 * Создаёт время в расписании
	 * 
	 * @param {string} dateTime - строка формата 'YYYY-MM-DD HH:MM'
	 * @returns {object} SchoolModel 
	 * 
	 * @memberOf SchoolModel
	 */
	addDate(dateTime) {
		let timestamp = SchoolModel.generateDate(dateTime);

		if (this.schedule[timestamp] && this.schedule[timestamp].length > 0) {
			console.error('This time and date are already reserved!')

			return false;
		} 

		this.schedule[timestamp] = [];

		return this;
	}

	/**
	 * Возвращает лекцию на указанную дату и время
	 * 
	 * @param {string} dateTime - строка формата 'YYYY-MM-DD HH:MM'
	 * @returns {Object} LectionModel
	 * 
	 * @memberOf SchoolModel
	 */
	getLectionByDate(dateTime) {
		let timestamp = SchoolModel.generateDate(dateTime);

		return this.schedule[timestamp];
	}
}

export default SchoolModel;