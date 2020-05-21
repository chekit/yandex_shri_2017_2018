'use strict';

const popup = require('./popup.cmp');

const views = {
  school(model) {
    /**
     * School
     */
    let schoolContainer = document.createElement('div');
    schoolContainer.className = `${model.prefix ? 'school--' + model.prefix : 'school'}`;

    /**
     * School Name
     */
    let schoolName = document.createElement('div');
    schoolName.className = 'school__name';
    schoolName.textContent = model.name;

    /**
     * Lections
     */
    let fragment = document.createDocumentFragment();

    model.schedule.reduce((init, item) => {
      fragment.appendChild( this.lection(item) )

      return fragment;
    }, fragment);

    /**
     * Concat
     */
    schoolContainer.appendChild(schoolName);
    schoolContainer.appendChild(fragment);

    return schoolContainer;
  },
  lection(model) {
    let fragment = document.createDocumentFragment();

    /**
     * Lection
     */
    let lectionContainer = document.createElement('div');
    lectionContainer.className = 'school__lection lection';

    /**
     * Lection Time
     */
    let lectionTime = document.createElement('div');
    lectionTime.className = 'school__time';
    lectionTime.textContent = model.time;
    
    /**
     * If there is a lection
     */
    if (model.theme) {
      /**
       * Lection Title
       */
      let lectionTitle = model.theme.isdone ? document.createElement('a') : document.createElement('p');
      lectionTitle.className = 'lection__title';

      if (model.theme.isdone) lectionTitle.href = model.theme.isdone;

      lectionTitle.innerHTML = model.theme.title;

      /**
       * Lection Author
       */
      let lectionAuthor = document.createElement('p');
      lectionAuthor.className = 'lection__author';
      model.theme.authors.reduce((init, item) => {
        init.appendChild( this.author(item) );

        return init;
      }, lectionAuthor);

      /**
       * Lection Place
       */
      let lectionPlace = document.createElement('p');
      lectionPlace.className = 'lection__place';
      lectionPlace.innerHTML = `<a href="${model.theme.place.link}">${model.theme.place.name}</a>`;
      
      /**
       * Concat
       */
      lectionContainer.appendChild(lectionTitle);
      lectionContainer.appendChild(lectionAuthor);
      lectionContainer.appendChild(lectionPlace);
      fragment.appendChild(lectionContainer);
    } else {
      lectionContainer.classList.add('is-empty')
      lectionTime.classList.add('is-empty')
    }

    /**
     * Concat
     */
    fragment.appendChild(lectionTime);
    fragment.appendChild(lectionContainer);

    return fragment;
  },
  author(model) {
    let link = document.createElement('a');
    link.href = `#${model.id}`;
    link.textContent = model.name;
    
    link.addEventListener('click', function (e) {
      e.preventDefault();

      popup.show(model.name, model.bio, model.img)
    });

    return link;
  } 
};

module.exports = {
  create(schools) {
    let conatiner = document.createElement('div');
    conatiner.className = 'schools';

    schools.reduce((init, school) => {
      init.appendChild(views.school(school));

      return init;
    }, conatiner);

    return conatiner;
  }
};