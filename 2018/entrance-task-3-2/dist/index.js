"use strict";

exports.__esModule = true;
var SmartHouse;
(function (SmartHouse) {
    // Карта потребляемой энергии в каждый час
    var powerByHour;
    // Карта работющих устройств в каждый час
    var schedule;
    // Объект с данными о общей стоимости электроэнергии и стоимости работы каждого устройства
    var consumedEnergy;
    var _data;
    /**
     * Заполняет расписание и выполняет запись результата в файл
     *
     * @param {*} data
     */
    function createSchedule(data) {
        // Устройства, работающие весь день
        var allday = [];
        // Устройства, работающие определённую часть дня (утро, ночь)
        var partTime = [];
        // Устройства, работающиепроизвольное количество часов
        var other = [];
        powerByHour = {};
        schedule = {};
        consumedEnergy = {
            value: 0,
            devices: {}
        };
        _data = JSON.parse(data);
        if (_data) {
            fillInTime(schedule, powerByHour);
            // Разделяем все устройства на группы
            _data.devices.forEach(function (d) {
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
            return { schedule: schedule, consumedEnergy: consumedEnergy };
        } else {
            throw "No Data Recieved";
        }
    }
    SmartHouse.createSchedule = createSchedule;
    /**
     * Заполняем объект расписания и распределения энергии временем
     *
     * @private
     */
    function fillInTime(scheduler1, scheduler2) {
        for (var i = 0; i < 24; i++) {
            scheduler1[i] = [];
            scheduler2[i] = 0;
        }
    }
    /**
     * Заполняем объект потребления устройствами
     *
     * @param {IDevice} device - устройство
     */
    function addDeviceToConsumers(device) {
        consumedEnergy.devices[device.id] = 0;
    }
    /**
     * Добавлет устройство в расписание для данного часа
     *
     * @param {IDevice} d - устройство
     * @param {number} h - час
     */
    function addDeviceToSchedule(d, h) {
        var currentRate = getHourRate(h, _data);
        var deviceHourRate = d.power / 1000 * currentRate;
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
    function parceAllDayDevices(list) {
        list.forEach(function (d) {
            return Object.keys(schedule).forEach(function (h) {
                return addDeviceToSchedule(d, +h);
            });
        });
    }
    /**
     * Добавляет устройства работающие часть дня в расписание
     *
     * @param {IDevice[]} list - список устройств
     */
    function parcePartDayDevices(list) {
        list.forEach(function (d) {
            var hours = {};
            var minRate = -1;
            // Рассчитываем в какие часы может работать устройство
            Object.keys(schedule).forEach(function (hour) {
                var h = +hour;
                var isTimeInRange = true;
                var isPowerInRange = d.power + powerByHour[h] <= _data.maxPower;
                if (d.mode) {
                    var from = d.mode === 'day' ? 7 : 21;
                    var to = d.mode === 'day' ? 21 : 7;
                    isTimeInRange = d.mode === 'day' ? h >= from && h < to : h >= from || h < to;
                }
                // Если устройство может работать в этот час
                // и потребляемая мощность устройств часа не превышает максимального значения
                if (isTimeInRange && isPowerInRange) {
                    var rate = getHourRate(h, _data);
                    minRate = minRate === -1 ? rate : minRate > rate ? rate : minRate;
                    hours[h] = rate;
                }
            });
            // Последовательность "рабочих" часов
            var timeline = Object.keys(hours);
            if (timeline.length < d.duration) {
                console.log("Device '" + d.name + "'(#" + d.id + ") couldn't work during " + d.duration + " hours");
            } else {
                // Индекс самого дешёвого часа в полученном временном отрезке
                var startIndex = timeline.map(function (key) {
                    return hours[+key];
                }).indexOf(minRate);
                // Последовательность работы
                var raw = [];
                // startIndex - Индекс часа с которого начинается последовательность недорого времени
                // step - шаг назад, если время работы устройсва выходит за рамки "дешёвого" времени
                for (var i = startIndex, step = 1; i < startIndex + d.duration; i++) {
                    var h = +timeline[i];
                    // Если стоимость часа минимальная - добавляем час в последовательность работы
                    if (hours[h] === minRate) {
                        raw.push(h);
                    } else {
                        var hBefore = +timeline[startIndex - step];
                        // Проверяем когда устройству выгоднее работать - до дешёвого часа или после
                        if (hours[hBefore] < hours[h] || !h) {
                            raw.push(hBefore);
                            step++;
                        } else {
                            raw.push(h);
                        }
                    }
                }
                raw.map(function (h) {
                    return addDeviceToSchedule(d, +h);
                });
            }
        });
    }
    /**
     * Возвращает стоимость данного часа
     *
     * @param {number} h - час
     * @returns {number} - стоимость часа
     */
    function getHourRate(h, _a) {
        var rates = _a.rates;
        var currentRate = rates.filter(function (r) {
            return r.to < r.from ? h >= r.from || h < r.to : h >= r.from && h < r.to;
        })[0];
        return currentRate.value;
    }
    SmartHouse.getHourRate = getHourRate;
    /**
     * Приводит значение с плавающей точкой к указанному количеству знаков после запятой
     *
     * @param {number} value - число с плавающей точкой
     * @param {number} digits - количество знаков после запятой
     * @returns {number}
     */
    function toFixed(value, digits) {
        if (digits === void 0) {
            digits = 2;
        }
        return +value.toFixed(digits);
    }
    SmartHouse.toFixed = toFixed;
})(SmartHouse = exports.SmartHouse || (exports.SmartHouse = {}));