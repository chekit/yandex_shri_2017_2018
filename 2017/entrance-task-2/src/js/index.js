import Models from './model';
/**
 * 
 * 
 * @class ShRI
 */
class ShRI {
	/**
	 * Creates an instance of ShRI.
	 * 
	 * @memberOf ShRI
	 */
	constructor() {
		this.do = new Models();
	}
}

/**
 * Initialization
 */
(function () {
	document.addEventListener('DOMContentLoaded', function () {
		window.shri = new ShRI();
	});
})(document, window);
