'use strict';

let popup = null;
let body = null;

const modal = `
  <div class="modal">
    <button class="modal__close">X</button>
    <div class="modal__body"><img class="modal__image" src="%bio_image%" alt="%bio_name%"/>
      <p class="modal__text">%bio_text%</p>
    </div>
  </div>
`;

module.exports = {
  init() {
    popup = document.querySelector('.popup');
    body = document.body;

    this.setEvents();
  },
  setEvents() {
    popup.addEventListener('click', e => {
      if (e.target.classList.contains('modal__close')) {
        e.stopPropagation();

        this.close();
      }
    });
  },
  close() {
    body.classList.remove('show-popup');
  },
  show(name, bio, img) {
    popup.innerHTML = modal
      .replace(/%bio_name%/, name)
      .replace(/%bio_text%/, bio)
      .replace(/%bio_image%/, img);

    body.classList.add('show-popup');
  }
}