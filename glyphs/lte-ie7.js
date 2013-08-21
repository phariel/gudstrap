/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'gudstrap\'">' + entity + '</span>' + html;
	}
	var icons = {
			'gsicon-untitled' : '&#xe000;',
			'gsicon-untitled-2' : '&#xe001;',
			'gsicon-untitled-3' : '&#xe002;',
			'gsicon-untitled-4' : '&#xe003;',
			'gsicon-untitled-5' : '&#xe004;',
			'gsicon-untitled-6' : '&#xe005;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/gsicon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};