# Задание 2

- Для написания библиотеки использовался чистый JavaScript (синтаксис ES2015). Транспиляция и сборка: babel + browserify.
- Соответствующие методы библиотеки можно проверить в консоли открывшейся страницы из `./build`.
- При подключении результирующего скрипта к странице в глобальной области (объект window) появляется класс `shri`. Работа с методами происзводится через `shri.do.<Имя метода>`

> Для работы с проектом сначала необходимо установить соотвентствующие npm пакеты: `npm i`

> Для запуска сборки и автоматического открытия в браузере `gulp dev`

## Пример

### ввод и редактирование данных о школах;:

```

>  shri.do.addSchool('yandex');
< "yandex" -- School created
< {name: "yandex", lections: Array[0], schedule: Object, totalStudents: 0}

> shri.do.schools.yandex.increaseStudens(10)
> shri.do.schools.yandex
< {name: "yandex", lections: Array[0], schedule: Object, totalStudents: 10}


```

### Посмотреть все школы:

```

> shri.do.getSchools()
< Object {yandex: e}

```

### Ввод и редактирование данных о лекциях

```
> shri.do.addLection('yandex', '2017-10-14 19:00', {name: 'ls_1', title: 'Introduction: 101'})
< "yandex" -- School created
< "Introduction: 101" -- Lection created

> shri.do.schools.yandex.getLections();
< [{
	professor: "no name",
	title: "Introduction: 101"
}]

> let lection101 = shri.do.schools.yandex.getLectionByDate('2017-10-14 19:00');
> lection101.setProfessor('John Smith')
< {professor: "John Smith", title: "Introduction: 101"}

```

## ввод и редактирование данных об аудиториях

```
> shri.do.addAuditory('green room')
> shri.do.auditories
< Object {green room: e}

> let aud1 = shri.do.auditories['green room']
> aud1.setCapacity(100)
< {name: "green room", capacity: 100, location: ""}

> aud1.setLocation('Moscow, Park Kulturi')
< {name: "green room", capacity: 100, location: "Moscow, Park Kulturi"}
```

## Результат

Исходный код: https://github.com/chekit/shri/tree/master/task2

Описание библиотеки: https://chekit.github.io/shri/task2/docs/gen/