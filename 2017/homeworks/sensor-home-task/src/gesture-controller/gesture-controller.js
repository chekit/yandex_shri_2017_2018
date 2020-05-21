ym.modules.define('shri2017.imageViewer.GestureController', [
    'shri2017.imageViewer.EventManager',
    'util.extend'
], function (provide, EventManager, extend) {
    var DBL_TAP_STEP = 0.2;
    var SCROLL_SCALE_STEP = 0.02;

    var Controller = function (view) {
        this._view = view;

        this._eventManager = new EventManager(
            this._view.getElement(),
            this._eventHandler.bind(this)
        );

        this._lastEventTypes = '';
        this._isOneTouchZoom = false;
    };

    extend(Controller.prototype, {
        destroy: function () {
            this._eventManager.destroy();
        },

        /**
         * interface IEvent {
         *      type: string;
         *      targetPoint: {x: number; y: number;};
         *      distance: number;
         *      direction: number;
         * }
         */
        _eventHandler: function (event/*: IEvent*/) {
            var state = this._view.getState();

            // dblclick
            if (!this._lastEventTypes) {
                setTimeout(function () {
                    this._lastEventTypes = '';
                }.bind(this), 500);
            }

            this._lastEventTypes += ' ' + event.type;

            if (this._lastEventTypes.indexOf('start end start end') > -1) {
                this._lastEventTypes = '';
                this._processDbltap(event);
                return;
            }
            
            /**
             * OneTouchZoom
             */
            if (/start end start move+/gi.test(this._lastEventTypes)) {
                this._isOneTouchZoom = true;
            }

            if (event.type === 'move') {
                if (!this._isOneTouchZoom) {
                    // Pinch Zoom
                    if (event.distance > 1 && event.distance !== this._initEvent.distance) {
                        this._processMultitouch(event);
                    // Drag
                    } else {
                        this._processDrag(event);
                    }
                } else {
                    // One touch Zoom
                    this._processOneTouchZoom(event);
                }
            } else if (event.type === 'scroll') {
                this._processScroll(event);
            } else {
                this._initState = this._view.getState();
                this._initEvent = event;
                this._isOneTouchZoom = false;
            }
        },
        
        _processDrag: function (event) {
            this._view.setState({
                positionX: this._initState.positionX + (event.targetPoint.x - this._initEvent.targetPoint.x),
                positionY: this._initState.positionY + (event.targetPoint.y - this._initEvent.targetPoint.y)
            });
        },


        _processMultitouch: function (event) {
            this._scale(
                event.targetPoint,
                this._initState.scale * (event.distance / this._initEvent.distance)
            );
        },

        _processDbltap: function (event) {
            var state = this._view.getState();

            this._scale(
                event.targetPoint,
                state.scale + DBL_TAP_STEP
            );
        },

        _processScroll: function (event) {
            var state = this._view.getState();

            // scroll up === zoom in > 0
            // scroll down === zoom out < 0
            this._scale(
                event.targetPoint,
                state.scale + event.direction * SCROLL_SCALE_STEP
            );
        },
        /**
         * Обработчик события One Touch Zoom
         */
        _processOneTouchZoom: (function() {
            let eventTargetPointYCache = null;
            
            return function (event) {
                if (!event.environment || event.environment !== 'touch' ) {
                    return false;
                }

                eventTargetPointYCache === null && (eventTargetPointYCache = event.targetPoint.y);

                var state = this._view.getState();
                var direction = event.targetPoint.y >= eventTargetPointYCache ? 1 : -1;
                
                this._scale(
                    this._initEvent.targetPoint,
                    state.scale + direction * SCROLL_SCALE_STEP
                );

                eventTargetPointYCache = event.targetPoint.y
            }
        })(),

        _scale: function (targetPoint, newScale) {
            newScale = Math.max(Math.min(newScale, 10), 0.02);
            var imageSize = this._view.getImageSize();
            var state = this._view.getState();

            if (
                (this._checkImageWidth(imageSize, newScale) === 0 && this._checkImageHeight(imageSize, newScale) === 0)
            ) {
                return false;
            }

            // Позиция прикосновения на изображении на текущем уровне масштаба
            var originX = targetPoint.x - state.positionX;
            var originY = targetPoint.y - state.positionY;

            // Размер изображения на текущем уровне масштаба
            var currentImageWidth = imageSize.width * state.scale;
            var currentImageHeight = imageSize.height * state.scale;

            // Относительное положение прикосновения на изображении
            var mx = originX / currentImageWidth;
            var my = originY / currentImageHeight;

            // Размер изображения с учетом нового уровня масштаба
            var newImageWidth = imageSize.width * newScale;
            var newImageHeight = imageSize.height * newScale;

            // Рассчитываем новую позицию с учетом уровня масштаба
            // и относительного положения прикосновения
            state.positionX += originX - (newImageWidth * mx);
            state.positionY += originY - (newImageHeight * my);

            // Устанавливаем текущее положение мышки как "стержневое"
            state.pivotPointX = targetPoint.x;
            state.pivotPointY = targetPoint.y;

            // Устанавливаем масштаб и угол наклона
            state.scale = newScale;
            this._view.setState(state);
        },

        /**
         * Проверяем не увеличиваем / уменьшаем ли мы изображение больше чем надо по ширине
         * 
         * @param {number} originSize 
         * @param {number} scaleSize 
         * @returns 
         */
        _checkImageWidth: function(originSize, scaleSize) {
            let result = originSize.width * scaleSize;

            if (result > originSize.width) {
                return result = originSize.width;
            }

            if (result < 0) {
                return result = 0;
            }

            return result;
        },
        /**
         * Проверяем не увеличиваем / уменьшаем ли мы изображение больше чем надо по высоте
         * 
         * @param {number} originSize 
         * @param {number} scaleSize 
         * @returns 
         */
        _checkImageHeight: function(originSize, scaleSize) {
            let result = originSize.height * scaleSize;

            if (result > originSize.height) {
                return result = originSize.height;
            }

            if (result < 0) {
                return result = 0;
            }

            return result;
        }
    });
    provide(Controller);
});
