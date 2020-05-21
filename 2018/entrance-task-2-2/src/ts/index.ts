import MobileMenu from './mobile-menu';
import FiltersList from './filters-list';
import ControlsList from './controls';

document.addEventListener('DOMContentLoaded', () => {
	const wrapper = document.body;

	MobileMenu.initialize(wrapper as HTMLElement);
	FiltersList.initialize('.devices .filters');
	FiltersList.initialize('.light-control .filters');
	FiltersList.initialize('.degree-control .filters');
	ControlsList.initialize();
});