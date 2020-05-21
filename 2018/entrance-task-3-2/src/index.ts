/**
 * Интерфейс устройства "Умного дома"
 *
 * @interface IDevice
 */
interface IDevice {
	id: string;
	name: string;
	power: number;
	duration: number;
	mode?: string;
}

/**
 * Интерфейс тарифа
 *
 * @interface IRates
 */
interface IRates {
	from: number;
	to: number;
	value: number;
}

/**
 * Интерфейс входных данных для расчёта расписания
 *
 * @interface IInputData
 */
interface IInputData {
	devices: IDevice[];
	rates: IRates[];
	maxPower: number;
}

/**
 * Стоимость потребляемой энергии
 *
 * @interface IConsumedEnergy
 */
interface IConsumedEnergy {
	value: number;
	devices: { [key: string]: number };
}

/**
 * Интерфейс результирующих данных
 *
 * @interface IResult
 */
interface IResult {
	schedule: { [key: number]: string[] };
	consumedEnergy: IConsumedEnergy
}

export namespace SmartHouse {
	// Карта потребляемой энергии в каждый час
	let powerByHour: { [key: number]: number };
	// Карта работющих устройств в каждый час
	let schedule: { [key: number]: string[] };
	// Объект с данными о общей стоимости электроэнергии и стоимости работы каждого устройства
	let consumedEnergy: IConsumedEnergy;

	let _data: IInputData;

	/**
	 * Заполняет расписание и выполняет запись результата в файл
	 *
	 * @param {*} data
	 */
	export function createSchedule(data: any): IResult {
		// Устройства, работающие весь день
		const allday: IDevice[] = [];
		// Устройства, работающие определённую часть дня (утро, ночь)
		const partTime: IDevice[] = [];
		// Устройства, работающиепроизвольное количество часов
		const other: IDevice[] = [];

		powerByHour = {};
		schedule = {};
		consumedEnergy = {
			value: 0,
			devices: {}
		}

		_data = JSON.parse(data);

		if (_data) {
			fillInTime(schedule, powerByHour);

			// Разделяем все устройства на группы
			_data.devices.forEach((d: IDevice) => {
				addDeviceToConsumers(d);
				if (d.duration === 24) {
					allday.push(d);
				} else if (d.mode && (d.mode === 'day' || d.mode === 'night')) {
					partTime.push(d);
				} else {
					other.push(d);
				}
			});

			parceAllDayDevices(allday);
			parcePartDayDevices(partTime);
			parcePartDayDevices(other);

			return { schedule, consumedEnergy };
		} else {
			throw (`No Data Recieved`);
		}
	}

	/**
	 * Заполняем объект расписания и распределения энергии временем
	 *
	 * @private
	 */
	function fillInTime(scheduler1: { [key: number]: string[] }, scheduler2: { [key: number]: number }): void {
		for (let i = 0; i < 24; i++) {
			scheduler1[i] = [];
			scheduler2[i] = 0;
		}
	}

	/**
	 * Заполняем объект потребления устройствами
	 *
	 * @param {IDevice} device - устройство
	 */
	function addDeviceToConsumers(device: IDevice) {
		consumedEnergy.devices[device.id] = 0;
	}

	/**
	 * Добавлет устройство в расписание для данного часа
	 *
	 * @param {IDevice} d - устройство
	 * @param {number} h - час
	 */
	function addDeviceToSchedule(d: IDevice, h: number) {
		const currentRate: number = getHourRate(h, _data);
		const deviceHourRate: number = (d.power / 1000) * currentRate;

		schedule[h].push(d.id);
		powerByHour[h] += d.power;
		consumedEnergy.devices[d.id] = toFixed(consumedEnergy.devices[d.id] + deviceHourRate, 4);
		consumedEnergy.value = toFixed(consumedEnergy.value + deviceHourRate, 4);
	}

	/**
	 * Добавляет устройства работающте весь день в расписание
	 *
	 * @param {IDevice[]} list - список устройств
	 */
	function parceAllDayDevices(list: IDevice[]): void {
		list.forEach(d => Object.keys(schedule).forEach(h => addDeviceToSchedule(d, +h)));
	}

	/**
	 * Добавляет устройства работающие часть дня в расписание
	 *
	 * @param {IDevice[]} list - список устройств
	 */
	function parcePartDayDevices(list: IDevice[]): void {
		list.forEach(d => {
			const hours: { [key: number]: number } = {};
			let minRate: number = -1;

			// Рассчитываем в какие часы может работать устройство
			Object.keys(schedule).forEach(hour => {
				const h = +hour;

				let isTimeInRange: boolean = true;
				let isPowerInRange: boolean = d.power + powerByHour[h] <= _data.maxPower;

				if (d.mode) {
					const from: number = d.mode === 'day' ? 7 : 21;
					const to: number = d.mode === 'day' ? 21 : 7;

					isTimeInRange = d.mode === 'day'
						? h >= from && h < to
						: h >= from || h < to;
				}

				// Если устройство может работать в этот час
				// и потребляемая мощность устройств часа не превышает максимального значения
				if (isTimeInRange && isPowerInRange) {
					const rate = getHourRate(h, _data);

					minRate = minRate === -1
						? rate
						: minRate > rate
							? rate
							: minRate;

					hours[h] = rate;
				}
			});

			// Последовательность "рабочих" часов
			const timeline = Object.keys(hours);

			if (timeline.length < d.duration) {
				console.log(`Device '${d.name}'(#${d.id}) couldn't work during ${d.duration} hours`);
			} else {
				// Индекс самого дешёвого часа в полученном временном отрезке
				const startIndex = timeline.map((key: string) => hours[+key]).indexOf(minRate);
				// Последовательность работы
				const raw = [];

				// startIndex - Индекс часа с которого начинается последовательность недорого времени
				// step - шаг назад, если время работы устройсва выходит за рамки "дешёвого" времени
				for (let i = startIndex, step = 1; i < startIndex + d.duration; i++) {
					const h = +timeline[i];
					// Если стоимость часа минимальная - добавляем час в последовательность работы
					if (hours[h] === minRate) {
						raw.push(h);
					} else {
						const hBefore = +timeline[startIndex - step];
						// Проверяем когда устройству выгоднее работать - до дешёвого часа или после
						if (hours[hBefore] < hours[h] || !h) {
							raw.push(hBefore);
							step++;
						} else {
							raw.push(h);
						}
					}
				}

				raw.map(h => addDeviceToSchedule(d, +h));
			}
		});
	}

	/**
	 * Возвращает стоимость данного часа
	 *
	 * @param {number} h - час
	 * @returns {number} - стоимость часа
	 */
	export function getHourRate(h: number, { rates }: IInputData): number {
		const [currentRate] = rates
			.filter(r => r.to < r.from
				? h >= r.from || h < r.to
				: h >= r.from && h < r.to
			);

		return currentRate.value;
	}

	/**
	 * Приводит значение с плавающей точкой к указанному количеству знаков после запятой 
	 *
	 * @param {number} value - число с плавающей точкой
	 * @param {number} digits - количество знаков после запятой
	 * @returns {number}
	 */
	export function toFixed(value: number, digits: number = 2): number {
		return +value.toFixed(digits);
	}
}