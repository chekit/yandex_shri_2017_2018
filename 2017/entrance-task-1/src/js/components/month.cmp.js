'use strict';

const schools = require('./schools.cmp');

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const views = {
  month(model) {
    /**
     * Month Container
     */
    let monthContainer = document.createElement('div');
    monthContainer.className = model.prefix ? `month--${model.prefix}` : 'month';
    
    /**
     * Month name
     */
    let title = document.createElement('div');
    title.className = 'month__name';
    title.textContent = model.name;

    /**
     * Parse Days
     */
    let fragment = document.createDocumentFragment();

    model.days
      .reduce((init, dayModel) => fragment.appendChild(this.day(dayModel)), fragment);
    
    /**
     * Concat
     */
    monthContainer.appendChild(title);
    monthContainer.appendChild(fragment)

    return monthContainer;
  },
  day(model) {
    /**
     * Day Container
     */
    let dayContainer = document.createElement('div');
    dayContainer.className = 'month__day day';

    /**
     * Day Date
     */
    let dayDate = document.createElement('div');
    dayDate.className = 'day__date';
    dayDate.textContent = model.date.value;

    /**
     * Day Name
     */
    let dayName = document.createElement('div');
    dayName.className = 'day__name';
    dayName.textContent = days[model.date.id];

    let daySchools = schools.create(model.schools);

    /**
     * Concat
     */
    dayContainer.appendChild(dayDate);
    dayContainer.appendChild(dayName);
    dayContainer.appendChild(daySchools);

    return dayContainer;
  }
};

module.exports = {
  create(months, container) {
    let fragment = document.createDocumentFragment();

     months.forEach(month => {
      fragment.appendChild(views.month(month));
    });

    document.addEventListener('DOMContentLoaded', function () {
      container.appendChild(fragment);
    });
  }
}