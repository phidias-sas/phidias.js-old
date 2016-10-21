import Vue from 'vue';
import moment from 'moment';

Vue.filter("bytes", (bytes, precision) => {
	if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
	if (typeof precision === 'undefined') precision = 1;
	var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
	var	number = Math.floor(Math.log(bytes) / Math.log(1024));
	return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
});

Vue.filter("date", value => moment(value * 1000).calendar());
