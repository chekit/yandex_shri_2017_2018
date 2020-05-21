import AuditoryModel from './_auditory.model';
import LectionModel from './_lection.model';
import SchoolModel from './_school.model';



class Models {
	constructor() {
		this.schools = {};
		this.auditories = {};
		
	}

	/**
	 * Создаёт школу с указанным именем
	 * 
	 * @param {string} name - имя школы
	 * @returns {object} Models.school
	 * 
	 * @memberOf Models
	 */
	addSchool (name) {
		if (this.schools[name]) {
			console.warn(`The school ${name} is already created;`);
			
			return false;
		}

		this.schools[name] = new SchoolModel(name);

		return this.schools[name];
	}

	/**
	 * Добавляет лекцию в школу
	 * 
	 * @param {string} schoolName - имя школы
	 * @param {string} time - строка формата 'YYYY-MM-DD HH:MM'. Время в которое должна состояться лекция
	 * @param {object} [data={name: null, title: null}] - объект с указанием имени лектора и названием лекции
	 * 
	 * @memberOf Models
	 */
	addLection (schoolName, time, data = {name: null, title: null}) {
		if (!schoolName) {
			console.error(`Specify school name.`);
			console.info('Use this format: "School Name", "yyyy-mm-dd hh:mm", "{name: lection_name, title: "lection title"}" ')
			
			return false;
		}

		if (this.schools[schoolName]) {
			this.schools[schoolName]
				.addDate(time)
				.addLection(time, new LectionModel(data));
		} else {
			this.schools[schoolName] = this.addSchool(schoolName);

			this.schools[schoolName]
				.addDate(time)
				.addLection(time, new LectionModel(data));
		}
	}

	/**
	 * Добавляет аудиторию в список аудиторий
	 * 
	 * @param {string} [name='noname'] - имя аудитории
	 * 
	 * @memberOf Models
	 */
	addAuditory (name = 'noname') {
		if (this.auditories[name]) {
			console.warn(`The auditory ${name} is already created;`);
			
			return this.auditories[name];
		}

		this.auditories[name] = new AuditoryModel(name);
	}

	/**
	 * Возвращает все созданные школы
	 * 
	 * @returns {object} Models.schools
	 * 
	 * @memberOf Models
	 */
	getSchools() {
		return this.schools;
	}
}

export default Models;