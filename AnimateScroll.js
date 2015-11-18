// AnimateScroll.js
// Sunmock Yang Nov. 2015

function animateScroll(element, duration, easing, padding, onFinish) {
	var top = element.getBoundingClientRect().top;
	var targetY = top - ((padding) ? padding : 0);
	targetY = (window.scrollMaxY > targetY) ? targetY : window.scrollMaxY;
	var deltaY = targetY - window.scrollY;

	var obj = {
		targetY: targetY,
		deltaY: deltaY,
		duration: (duration) ? duration : 0,
		easing: (easing in animateScroll.Easing) ? animateScroll.Easing[easing] : animateScroll.Easing.linear,
		onFinish: onFinish,
		startTime: Date.now(),
		lastY: window.scrollY,
		step: animateScroll.step,
	};

	window.requestAnimationFrame(obj.step.bind(obj));
}

// Taken from gre/easing.js
// https://gist.github.com/gre/1650294
animateScroll.Easing = {
	linear: function (t) { return t },
	easeInQuad: function (t) { return t*t },
	easeOutQuad: function (t) { return t*(2-t) },
	easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
	easeInCubic: function (t) { return t*t*t },
	easeOutCubic: function (t) { return (--t)*t*t+1 },
	easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
	easeInQuart: function (t) { return t*t*t*t },
	easeOutQuart: function (t) { return 1-(--t)*t*t*t },
	easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
	easeInQuint: function (t) { return t*t*t*t*t },
	easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
	easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};

animateScroll.step = function () {
	if (this.lastY != window.scrollY && this.onFinish) {
		this.onFinish();
		return;
	}

	// Calculate how much time has passed
	var t = Math.min((Date.now() - this.startTime) / this.duration, 1);

	// Scroll window amount determined by easing
	var y = this.targetY - ((1 - this.easing(t)) * (this.deltaY));
	window.scrollTo(window.scrollX, y);

	// Continue animation as long as duration hasn't surpassed
	if (t != 1) {
		this.lastY = window.scrollY;
		window.requestAnimationFrame(this.step.bind(this));
	} else {
		if (this.onFinish) this.onFinish();
	}
}