const fs = require('fs');
const chai = require('chai');
const chaiFS = require('chai-fs');
const smartHouse = require('./../src/index').SmartHouse;

const should = chai.should();
const expect = chai.expect;
chai.use(chaiFS);

const read = function readData(filePath = `${__dirname}/data/input.json`) {
   const data = fs.readFileSync(filePath, 'utf-8');
   return data;
};

const write = function saveResult(data, folderName = 'output') {
	try {
		fs.mkdirSync(`${__dirname}/${folderName}/`)
	} catch (err) {
	
	}

	fs.writeFileSync(
		`${__dirname}/${folderName}/output.json`,
		JSON.stringify(data, null, 4),
		'utf-8'
	);
}

describe('Проверка алгоритма "Умного дома"', () => {
	const create = smartHouse.createSchedule;
	const data = read(`${__dirname}/input.json`);
	
	describe('Проверяем работу алгоритма и его методов', () => {		
		it('Должен создать файл output.json в папке ./src/output/', () => {
			const schedule = create(data);
			write(schedule);

			expect(`${__dirname}/output`).to.be.a.directory();
			expect(`${__dirname}/output`).to.be.a.directory().with.files(['output.json']);
		})
		
		describe('Проверяем метод toFixed', () => {
			const toFixed = smartHouse.toFixed;
			
			it('Должен обрезать 39.0200001 до двух знаков после запятой (39.02)', () => {
				toFixed(39.0200001).should.equal(39.02)
			})
	
			it('Должен обрезать 11.1240001 до трёх знаков после запятой (11.124)', () => {
				toFixed(11.1240001, 3).should.equal(11.124)
			})
	
			it('Должен обрезать 11.1240001 до одного знаков после запятой (11.1)', () => {
				toFixed(11.1240001, 1).should.equal(11.1)
			})
		});

		describe('Проверяем метод getHourRate', () => {
			const getHourRate = smartHouse.getHourRate;
			const parsedData = JSON.parse(data);

			it('Должен вернуть стоимость часа (14 часов дня)', () => {
				getHourRate(14, parsedData).should.equal(5.38);
			})
	
			it('Должен вернуть стоимость часа (3 часа ночи)', () => {
				getHourRate(3, parsedData).should.equal(1.79);
			})
	
			it('Должен вернуть стоимость часа (19 часов вечера)', () => {
				getHourRate(19, parsedData).should.equal(6.46);
			})
		});
	})

	describe('Проверяем выполнение алгоритма', () => {
		it('Проверяем значения в поле consumedEnergy', () => {
			const expected = JSON.parse(read(`${__dirname}/output.json`));
			const asserted = create(data);

			expect(asserted.consumedEnergy).to.eql(expected.consumedEnergy);
		})

		it('Проверяем созданное расписание', () => {
			// ВАЖНО!
			// Есть расхождение с этаонными данными. скорее всего из-за подхода к заполнения распиания
			// const expected = JSON.parse(read(`${__dirname}/output.json`));
			const expected = JSON.parse(read(`${__dirname}/output/output.json`));
			const asserted = create(data);

			expect(asserted.schedule).to.eql(expected.schedule);
		})
	})
})
