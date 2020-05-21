ym.modules.define('shri2017.imageViewer.EventManager', [
    'util.extend'
], function (provide, extend) {
    var EVENTS = {
        mousedown: 'start',
        mousemove: 'move',
        mouseup: 'end',
        mousescroll: 'scroll',
        
        touchstart: 'start',
        touchmove: 'move',
        touchend: 'end',
        touchcancel: 'end',

        pointerdown: 'start',
        pointermove: 'move',
        pointerup: 'end',
        pointercancel: 'end',
    };

    function PointersCollection() {
        this.length = 0;
        this._pointers = {};
    }

    PointersCollection.prototype.add = function(event) {
        this._pointers[event.pointerId] = event;
        event.target.setPointerCapture(event.pointerId);
        this.length++;
    };
    PointersCollection.prototype.remove = function(event) {
        event.target.releasePointerCapture(event.pointerId);
        delete this._pointers[event.pointerId];
        this.length--;
    };
    PointersCollection.prototype.update = function (event) {
        this._pointers[event.pointerId] = event;
    };
    PointersCollection.prototype.destroy = function () {
        for (var key in this._pointers) {
            this._pointers[key].target.releasePointerCapture(this._pointers[key].pointerId);
            delete this._pointers[key];
        }

        this.length = 0;
    };
    PointersCollection.prototype.exist = function (event) {
        return this._pointers.hasOwnProperty(event.pointerId);
    };
    PointersCollection.prototype.getById = function (id) {
        return this._pointers[id];
    };
    PointersCollection.prototype.getByIndex = function (index) {
        let keys = Object.keys(this._pointers);

        return this._pointers[keys[index]];
    };    

    /**
     * EventaManager
     * 
     * @param {HTMLElement} elem 
     * @param {() => void} callback 
     */
    function EventManager(elem, callback) {
        this._elem = elem;
        this._callback = callback;
        this._setupListeners();
    }

   extend(EventManager.prototype, {
        _mouseEventName: '',

        destroy: function () {
            this._teardownListeners();
        },

        _setupListeners: function () {
            this._mouseEventName = this._detectMouseEventName();
            this._pointers = new PointersCollection();

            this._mouseListener = this._mouseEventHandler.bind(this);
            this._scrollListener = this._scrollEventHandler.bind(this);
            this._touchListener = this._touchEventHandler.bind(this);
            this._pointerListener = this._pointerEventHandler.bind(this);

            this._addEventListeners('mousedown', this._elem, this._mouseListener);
            this._addEventListeners(this._mouseEventName, this._elem, this._scrollListener);

            /**
             * Если браузер устройства поддерживает оба API, то события задваиваются
             * Если есть поддержка Pointer Events, то мы слушаем только их, иначе Touch Events
             */
            if (!this._isSupportTouchEvents() && this._isSupportPointerEvents() || this._isSupportTouchEvents() && this._isSupportPointerEvents()) {
                this._addEventListeners('pointerdown', this._elem, this._pointerListener);
            } else if (this._isSupportTouchEvents() && !this._isSupportPointerEvents()) {
                this._addEventListeners('touchstart touchmove touchend touchcancel', this._elem, this._touchListener);
            }
        },
        
        _teardownListeners: function () {
            this._removeEventListeners('mousedown', this._elem, this._mouseListener);
            this._removeEventListeners('mousemove mouseup', document.documentElement, this._mouseListener);
            this._removeEventListeners('touchstart touchmove touchend touchcancel', this._elem, this._touchListener);
            this._removeEventListeners('pointerdown', this._elem, this._pointerListener);
            this._removeEventListeners('pointerup pointermove pointercancel', this._elem, this._pointerListener);
            this._removeEventListeners(this._mouseEventName, this._elem, this._scrollListener);
        },

        _addEventListeners: function (types, elem, callback) {
            types.split(' ').forEach(function (type) {
                elem.addEventListener(type, callback);
            }, this);
        },

        _removeEventListeners: function (types, elem, callback) {
            types.split(' ').forEach(function (type) {
                elem.removeEventListener(type, callback);
            }, this);
        },

        _mouseEventHandler: function (event) {
            event.preventDefault();

            if (event.type === 'mousedown') {
                this._addEventListeners('mousemove mouseup', document.documentElement, this._mouseListener);
            } else if (event.type === 'mouseup') {
                this._removeEventListeners('mousemove mouseup', document.documentElement, this._mouseListener);
            }

            var elemOffset = this._calculateElementOffset(this._elem);

            this._callback({
                type: EVENTS[event.type],
                targetPoint: {
                    x: event.clientX - elemOffset.x,
                    y: event.clientY - elemOffset.y
                },
                distance: 1
            });
        },

        _scrollEventHandler: function (event) {
            event.preventDefault();

            // wheelDelta === 120 (up) || -120 (down)
            var delta = event.deltaY || event.detail || -1 * event.wheelDelta;

            var elemOffset = this._calculateElementOffset(this._elem);

            this._callback({
                type: EVENTS['mousescroll'],
                targetPoint: {
                    x: event.clientX - elemOffset.x,
                    y: event.clientY - elemOffset.y
                },
                distance: 1,
                direction: delta > 0 ? -1 : 1 // Если delta > 0 - скролл вниз, иначе вверх
            })
        },

        _touchEventHandler: function (event) {
            // Отменяем стандартное поведение (последующие события мышки)
            event.preventDefault();

            var touches = event.touches;
            // touchend/touchcancel
            if (touches.length === 0) {
                touches = event.changedTouches;
            }

            var targetPoint;
            var distance = 1;
            var elemOffset = this._calculateElementOffset(this._elem);

            if (touches.length === 1) {
                targetPoint = {
                    x: touches[0].clientX,
                    y: touches[0].clientY
                };
            } else {
                var firstTouch = touches[0];
                var secondTouch = touches[1];
                targetPoint = this._calculateTargetPoint(firstTouch, secondTouch);
                distance = this._calculateDistance(firstTouch, secondTouch);
            }

            targetPoint.x -= elemOffset.x;
            targetPoint.y -= elemOffset.y;

            this._callback({
                type: EVENTS[event.type],
                targetPoint: targetPoint,
                distance: distance,
                environment: 'touch' // Значение pointerType из PointerEvent
            });
        },

        _pointerEventHandler: function(event) {
            event.preventDefault();

            var elemOffset = this._calculateElementOffset(this._elem);
            var distance = 1;
            var targetPoint;

            if (event.type === 'pointerdown') {
                // Сохраняем событие в коллецию Pointer Events
                (this._pointers.length < 2) && !this._pointers.exist(event) && this._pointers.add(event);
 
                this._addEventListeners('pointerup pointermove pointercancel', this._elem, this._pointerListener);

            } else if (event.type === 'pointermove') {
                // Обновляем событие
                this._pointers.exist(event) && this._pointers.update(event);
            } else if (event.type === 'pointerup' || event.type === 'pointercancel') {
                // Очищаем события при переполнении коллекции
                this._pointers.length === 2 && this._pointers.destroy();
                this._removeEventListeners('pointerup pointermove pointercancel', this._elem, this._pointerListener);
            }

            if (this._pointers.length < 2) {
                targetPoint = {
                    x: this._pointers.getByIndex(0).clientX,
                    y: this._pointers.getByIndex(0).clientY
                };
            } else {
                var firstTouch = this._pointers.getByIndex(0);
                var secondTouch = this._pointers.getByIndex(1);

                targetPoint = this._calculateTargetPoint(firstTouch, secondTouch);
                distance = this._calculateDistance(firstTouch, secondTouch);
            }
            
            targetPoint.x -= elemOffset.x;
            targetPoint.y -= elemOffset.y;
            
            this._callback({
                type: EVENTS[event.type],
                targetPoint: targetPoint,
                distance: distance,
                environment: event.pointerType
            });
            
            // Удаляем событие из коллекции после pointerup
            (event.type === 'pointerup' || event.type === 'pointercancel') && (this._pointers.exist(event) && this._pointers.remove(event));
        },

        _calculateTargetPoint: function (firstTouch, secondTouch) {
            return {
                x: (secondTouch.clientX + firstTouch.clientX) / 2,
                y: (secondTouch.clientY + firstTouch.clientY) / 2
            };
        },

        _calculateDistance: function (firstTouch, secondTouch) {
            return Math.sqrt(
                Math.pow(secondTouch.clientX - firstTouch.clientX, 2) +
                Math.pow(secondTouch.clientY - firstTouch.clientY, 2)
            );
        },

        _calculateElementOffset: function (elem) {
            var bounds = elem.getBoundingClientRect();

            return {
                x: bounds.left,
                y: bounds.top
            };
        },

        /**
         * Определяет имя события прокрутки колёсика мышки
         */
        _detectMouseEventName: function () {
            if ('onwheel' in document) {
                // IE9+, FF17+, Ch31+
                return 'wheel';
            } else if ('onmousewheel' in document) {
                // устаревший вариант события
                return 'mousewheel';
            } else {
                // Firefox < 17
                return 'MozMousePixelScroll';
            }
        },
        /**
         * Определяем поддержку Touch Events
         * source: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
         */
        _isSupportTouchEvents: function () {
            if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                return true;
            }

            return false
        },

        /**
         * Определяем поддержку Pointer Events
         * source: https://docs.microsoft.com/en-us/microsoft-edge/dev-guide/dom/pointer-events
         */
        _isSupportPointerEvents: function () {
            return 'PointerEvent' in window;
        }
    });

    provide(EventManager);
});
