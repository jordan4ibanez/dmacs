// Copyright (c) 2019 Nathan Cahill
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

if (!window) {
	throw new Error("No window.");
}
if (!window.document) {
	throw new Error("No document.");
}

const ssr = false;
const doccy = window.document;

const fff = (v: any) => typeof v === "string" || v instanceof String;

export function testing() {
	console.log(fff(1));
}

type dictionary = { [id: string]: any };

// Save a couple long function names that are used frequently.
// This optimization saves around 400 bytes.
const addEventListener = "addEventListener";
const removeEventListener = "removeEventListener";
const getBoundingClientRect = "getBoundingClientRect";
const gutterStartDragging = "_a";
const aGutterSize = "_b";
const bGutterSize = "_c";
const HORIZONTAL = "horizontal";
const NOOP = () => false;

// Helper function determines which prefixes of CSS calc we need.
// We only need to do this once on startup, when this anonymous function is called.
//
// Tests -webkit, -moz and -o prefixes. Modified from StackOverflow:
// http://stackoverflow.com/questions/16625140/js-feature-detection-to-detect-the-usage-of-webkit-calc-over-calc/16625167#16625167
const calc: string = `${["", "-webkit-", "-moz-", "-o-"]
	.filter((prefix: string) => {
		const el: HTMLElement = doccy.createElement("div");
		el.style.cssText = `width:${prefix}calc(9px)`;
		return !!el.style.length;
	})
	.shift()}calc`;

// Helper function checks if its argument is a string-like type
function isString(v: any): boolean {
	return typeof v === "string" || v instanceof String;
}

// Helper function allows elements and string selectors to be used
// interchangeably. In either case an element is returned. This allows us to
// do `Split([elem1, elem2])` as well as `Split(['#id1', '#id2'])`.
function elementOrSelector(el: any): any | null {
	if (isString(el)) {
		const ele: HTMLElement | null = doccy.querySelector(el);
		if (!ele) {
			throw new Error(`Selector ${el} did not match a DOM element`);
		}
		return ele;
	}
	return el;
}

// Helper function gets a property from the properties object, with a default fallback
function getOption(
	options: SplitOptions,
	propName: string,
	def?: any
): any | null {
	const value: any = (options as dictionary)[propName];
	if (value !== undefined) {
		return value;
	}
	return def;
}

function getGutterSize(
	gutterSize: number,
	isFirst: boolean,
	isLast: boolean,
	gutterAlign: string
): number {
	if (isFirst) {
		if (gutterAlign === "end") {
			return 0;
		}
		if (gutterAlign === "center") {
			return gutterSize / 2;
		}
	} else if (isLast) {
		if (gutterAlign === "start") {
			return 0;
		}
		if (gutterAlign === "center") {
			return gutterSize / 2;
		}
	}
	return gutterSize;
}

// Default options
function defaultGutterFn(i: number, gutterDirection: string): HTMLDivElement {
	const gut: HTMLDivElement = doccy.createElement("div");
	gut.className = `gutter gutter-${gutterDirection}`;
	return gut;
}

function defaultElementStyleFn(
	dim: string,
	size: number,
	gutSize: number
): { [id: string]: string | number } {
	const style: { [id: string]: string | number } = {};

	if (!isString(size)) {
		style[dim] = `${calc}(${size}% - ${gutSize}px)`;
	} else {
		style[dim] = size;
	}

	return style;
}

function defaultGutterStyleFn(
	dim: string,
	gutSize: number
): { [id: string]: string | number } {
	return { [dim]: `${gutSize}px` };
}

export interface SplitOptions {
	sizes?: (number | string)[];
	minSize?: number | number[];
	maxSize?: number | number[];
	expandToMin?: boolean;
	gutterSize?: number;
	gutterAlign?: string;
	snapOffset?: number;
	dragInterval?: number;
	direction?: "horizontal" | "vertical";
	cursor?: string;
	gutter?: () => void;
	elementStyle?: () => void;
	gutterStyle?: () => void;
	onDrag?: () => void;
	onDragStart?: () => void;
	onDragEnd?: () => void;
}

// The main function to initialize a split. Split.js thinks about each pair
// of elements as an independant pair. Dragging the gutter between two elements
// only changes the dimensions of elements in that pair. This is key to understanding
// how the following functions operate, since each function is bound to a pair.
//
// A pair object is shaped like this:
//
// {
//     a: DOM element,
//     b: DOM element,
//     aMin: Number,
//     bMin: Number,
//     dragging: Boolean,
//     parent: DOM element,
//     direction: 'horizontal' | 'vertical'
// }
//
// The basic sequence:
//
// 1. Set defaults to something sane. `options` doesn't have to be passed at all.
// 2. Initialize a bunch of strings based on the direction we're splitting.
//    A lot of the behavior in the rest of the library is paramatized down to
//    rely on CSS strings and classes.
// 3. Define the dragging helper functions, and a few helpers to go with them.
// 4. Loop through the elements while pairing them off. Every pair gets an
//    `pair` object and a gutter.
// 5. Actually size the pair elements, insert gutters and attach event listeners.
// export function Split() {
class Split {
	ids: string[];
	dimension: string = "";
	clientAxis: string = "";
	position: string = "";
	positionEnd: string = "";
	clientSize: string = "";
	elements: any[] = [];
	a: any;
	b: any;
	size: number = 0;
	dragging: boolean = false;
	start: number = 0;
	end: number = 0;
	dragOffset: number = 0;
	stop: any;
	move: any;
	pairs: any[] = [];

	// All DOM elements in the split should have a common parent. We can grab
	// the first elements parent and hope users read the docs because the
	// behavior will be whacky otherwise.
	readonly firstElement: any;
	readonly parent: any;
	readonly parentStyle: any;
	readonly parentFlexDirection: any;

	// Set default options.sizes to equal percentages of the parent element.
	sizes: number[];

	// Standardize minSize and maxSize to an array if it isn't already.
	// This allows minSize and maxSize to be passed as a number.
	readonly minSize: number;
	readonly minSizes: number[];
	readonly maxSize: number;
	readonly maxSizes: number[];

	// Get other options
	readonly expandToMin: any;
	readonly gutterSize: number;
	readonly gutterAlign: any;
	readonly snapOffset: any;
	readonly snapOffsets: any;
	readonly dragInterval: any;
	readonly direction: any;
	readonly cursor: any;
	readonly gutter: any;
	readonly elementStyle: any;
	readonly gutterStyle: any;
	readonly options: SplitOptions;

	constructor(idsOption: string[], options: SplitOptions = {}) {
		this.options = options;
		this.ids = idsOption;
		// Allow HTMLCollection to be used as an argument when supported
		if (Array.from) {
			this.ids = Array.from(this.ids);
		}
		this.firstElement = elementOrSelector(this.ids[0]);
		this.parent = this.firstElement.parentNode;
		this.parentStyle = getComputedStyle
			? getComputedStyle(this.parent)
			: null;
		this.parentFlexDirection = this.parentStyle
			? this.parentStyle.flexDirection
			: null;
		this.sizes =
			getOption(options, "sizes") ||
			this.ids.map(() => 100 / this.ids.length);
		this.minSize = getOption(options, "minSize", 100);
		this.minSizes = Array.isArray(this.minSize)
			? this.minSize
			: this.ids.map(() => this.minSize);
		this.maxSize = getOption(options, "maxSize", Infinity);
		this.maxSizes = Array.isArray(this.maxSize)
			? this.maxSize
			: this.ids.map(() => this.maxSize);
		this.expandToMin = getOption(options, "expandToMin", false);
		this.gutterSize = getOption(options, "gutterSize", 10);
		this.gutterAlign = getOption(options, "gutterAlign", "center");
		this.snapOffset = getOption(options, "snapOffset", 30);
		this.snapOffsets = Array.isArray(this.snapOffset)
			? this.snapOffset
			: this.ids.map(() => this.snapOffset);
		this.dragInterval = getOption(options, "dragInterval", 1);
		this.direction = getOption(options, "direction", HORIZONTAL);
		this.cursor = getOption(
			options,
			"cursor",
			this.direction === HORIZONTAL ? "col-resize" : "row-resize"
		);
		this.gutter = getOption(options, "gutter", defaultGutterFn);
		this.elementStyle = getOption(
			options,
			"elementStyle",
			defaultElementStyleFn
		);
		this.gutterStyle = getOption(
			options,
			"gutterStyle",
			defaultGutterStyleFn
		);

		// 2. Initialize a bunch of strings based on the direction we're splitting.
		// A lot of the behavior in the rest of the library is paramatized down to
		// rely on CSS strings and classes.
		if (this.direction === HORIZONTAL) {
			this.dimension = "width";
			this.clientAxis = "clientX";
			this.position = "left";
			this.positionEnd = "right";
			this.clientSize = "clientWidth";
		} else if (this.direction === "vertical") {
			this.dimension = "height";
			this.clientAxis = "clientY";
			this.position = "top";
			this.positionEnd = "bottom";
			this.clientSize = "clientHeight";
		}

		// adjust sizes to ensure percentage is within min size and gutter.
		const x = this.trimToMin(this.sizes);
		if (!x) {
			throw new Error("This is why typelessness is horrible.");
		}
		this.sizes = x;

		// 5. Create pair and element objects. Each pair has an index reference to
		// elements `a` and `b` of the pair (first and second elements).
		// Loop through the elements while pairing them off. Every pair gets a
		// `pair` object and a gutter.
		//
		// Basic logic:
		//
		// - Starting with the second element `i > 0`, create `pair` objects with
		//   `a = i - 1` and `b = i`
		// - Set gutter sizes based on the _pair_ being first/last. The first and last
		//   pair have gutterSize / 2, since they only have one half gutter, and not two.
		// - Create gutter elements and add event listeners.
		// - Set the size of the elements, minus the gutter sizes.
		//
		// -----------------------------------------------------------------------
		// |     i=0     |         i=1         |        i=2       |      i=3     |
		// |             |                     |                  |              |
		// |           pair 0                pair 1             pair 2           |
		// |             |                     |                  |              |
		// -----------------------------------------------------------------------

		this.elements = this.ids.map((id, i) => {
			// Create the element object.
			const element = {
				element: elementOrSelector(id),
				size: this.sizes[i],
				minSize: this.minSizes[i],
				maxSize: this.maxSizes[i],
				snapOffset: this.snapOffsets[i],
				i,
			};

			let pair: dictionary = {};

			if (i > 0) {
				// Create the pair object with its metadata.
				pair = {
					a: i - 1,
					b: i,
					dragging: false,
					direction: this.direction,
					parent,
				};

				pair[aGutterSize] = getGutterSize(
					this.gutterSize,
					i - 1 === 0,
					false,
					this.gutterAlign
				);
				pair[bGutterSize] = getGutterSize(
					this.gutterSize,
					false,
					i === this.ids.length - 1,
					this.gutterAlign
				);

				// if the parent has a reverse flex-direction, switch the pair elements.
				if (
					this.parentFlexDirection === "row-reverse" ||
					this.parentFlexDirection === "column-reverse"
				) {
					const temp = pair.a;
					pair.a = pair.b;
					pair.b = temp;
				}
			}

			// Determine the size of the current element. IE8 is supported by
			// staticly assigning sizes without draggable gutters. Assigns a string
			// to `size`.
			//
			// Create gutter elements for each pair.
			if (i > 0) {
				const gutterElement = this.gutter(
					i,
					this.direction,
					element.element
				);
				this.setGutterSize(gutterElement, this.gutterSize, i);

				// Save bound event listener for removal later
				pair[gutterStartDragging] = this.startDragging.bind(pair);

				// Attach bound event listener
				gutterElement[addEventListener](
					"mousedown",
					pair[gutterStartDragging]
				);
				gutterElement[addEventListener](
					"touchstart",
					pair[gutterStartDragging]
				);

				this.parent.insertBefore(gutterElement, element.element);

				pair.gutter = gutterElement;
			}

			this.setElementSize(
				element.element,
				element.size,
				getGutterSize(
					this.gutterSize,
					i === 0,
					i === this.ids.length - 1,
					this.gutterAlign
				),
				i
			);

			// After the first iteration, and we have a pair object, append it to the
			// list of pairs.
			if (i > 0) {
				this.pairs.push(pair);
			}

			return element;
		});
	}

	// 3. Define the dragging helper functions, and a few helpers to go with them.
	// Each helper is bound to a pair object that contains its metadata. This
	// also makes it easy to store references to listeners that that will be
	// added and removed.
	//
	// Even though there are no other functions contained in them, aliasing
	// this to self saves 50 bytes or so since it's used so frequently.
	//
	// The pair object saves metadata like dragging state, position and
	// event listener references.

	setElementSize(
		el: HTMLElement,
		size: number,
		gutSize: number,
		i: number
	): void {
		// Split.js allows setting sizes via numbers (ideally), or if you must,
		// by string, like '300px'. This is less than ideal, because it breaks
		// the fluid layout that `calc(% - px)` provides. You're on your own if you do that,
		// make sure you calculate the gutter size by hand.
		const style = this.elementStyle(this.dimension, size, gutSize, i);

		Object.keys(style).forEach((prop: string) => {
			// eslint-disable-next-line no-param-reassign
			(el.style as dictionary)[prop] = style[prop];
		});
	}

	setGutterSize(
		gutterElement: HTMLElement,
		gutSize: number,
		i: number
	): void {
		const style = this.gutterStyle(this.dimension, gutSize, i);

		Object.keys(style).forEach((prop) => {
			// eslint-disable-next-line no-param-reassign
			(gutterElement.style as dictionary)[prop] = style[prop];
		});
	}

	getSizes(): number[] {
		return this.elements.map((element) => element.size);
	}

	// Supports touch events, but not multitouch, so only the first
	// finger `touches[0]` is counted.
	getMousePosition(e: TouchEvent): any {
		if ("touches" in e)
			return (e.touches[0] as dictionary)[this.clientAxis];
		return e[this.clientAxis];
	}

	// Actually adjust the size of elements `a` and `b` to `offset` while dragging.
	// calc is used to allow calc(percentage + gutterpx) on the whole split instance,
	// which allows the viewport to be resized without additional logic.
	// Element a's size is the same as offset. b's size is total size - a size.
	// Both sizes are calculated from the initial parent percentage,
	// then the gutter size is subtracted.
	adjust(offset: number): void {
		const a = this.elements[this.a];
		const b = this.elements[this.b];
		const percentage = a.size + b.size;

		a.size = (offset / this.size) * percentage;
		b.size = percentage - (offset / this.size) * percentage;

		this.setElementSize(
			a.element,
			a.size,
			(this as dictionary)[aGutterSize],
			a.i
		);
		this.setElementSize(
			b.element,
			b.size,
			(this as dictionary)[bGutterSize],
			b.i
		);
	}

	// drag, where all the magic happens. The logic is really quite simple:
	//
	// 1. Ignore if the pair is not dragging.
	// 2. Get the offset of the event.
	// 3. Snap offset to min if within snappable range (within min + snapOffset).
	// 4. Actually adjust each element in the pair to offset.
	//
	// ---------------------------------------------------------------------
	// |    | <- a.minSize               ||              b.minSize -> |    |
	// |    |  | <- this.snapOffset      ||     this.snapOffset -> |  |    |
	// |    |  |                         ||                        |  |    |
	// |    |  |                         ||                        |  |    |
	// ---------------------------------------------------------------------
	// | <- this.start                                        this.size -> |
	drag(e: TouchEvent): void {
		let offset;
		const a = this.elements[this.a];
		const b = this.elements[this.b];

		if (!this.dragging) return;

		// Get the offset of the event from the first side of the
		// pair `this.start`. Then offset by the initial position of the
		// mouse compared to the gutter size.
		offset =
			this.getMousePosition(e) -
			this.start +
			((this as dictionary)[aGutterSize] - this.dragOffset);

		if (this.dragInterval > 1) {
			offset = Math.round(offset / this.dragInterval) * this.dragInterval;
		}

		// If within snapOffset of min or max, set offset to min or max.
		// snapOffset buffers a.minSize and b.minSize, so logic is opposite for both.
		// Include the appropriate gutter sizes to prevent overflows.
		if (
			offset <=
			a.minSize + a.snapOffset + (this as dictionary)[aGutterSize]
		) {
			offset = a.minSize + (this as dictionary)[aGutterSize];
		} else if (
			offset >=
			this.size -
				(b.minSize + b.snapOffset + (this as dictionary)[bGutterSize])
		) {
			offset =
				this.size - (b.minSize + (this as dictionary)[bGutterSize]);
		}

		if (
			offset >=
			a.maxSize - a.snapOffset + (this as dictionary)[aGutterSize]
		) {
			offset = a.maxSize + (this as dictionary)[aGutterSize];
		} else if (
			offset <=
			this.size -
				(b.maxSize - b.snapOffset + (this as dictionary)[bGutterSize])
		) {
			offset =
				this.size - (b.maxSize + (this as dictionary)[bGutterSize]);
		}

		// Actually adjust the size.
		this.adjust.call(this, offset);

		// Call the drag callback continously. Don't do anything too intensive
		// in this callback.
		getOption(this.options, "onDrag", NOOP)(this.getSizes());
	}

	// Cache some important sizes when drag starts, so we don't have to do that
	// continously:
	//
	// `size`: The total size of the pair. First + second + first gutter + second gutter.
	// `start`: The leading side of the first element.
	//
	// ------------------------------------------------
	// |      aGutterSize -> |||                      |
	// |                     |||                      |
	// |                     |||                      |
	// |                     ||| <- bGutterSize       |
	// ------------------------------------------------
	// | <- start                             size -> |
	calculateSizes(): void {
		// Figure out the parent size minus padding.
		const a = this.elements[this.a].element;
		const b = this.elements[this.b].element;

		const aBounds = a[getBoundingClientRect]();
		const bBounds = b[getBoundingClientRect]();

		this.size =
			aBounds[this.dimension] +
			bBounds[this.dimension] +
			(this as dictionary)[aGutterSize] +
			(this as dictionary)[bGutterSize];
		this.start = aBounds[this.position];
		this.end = aBounds[this.positionEnd];
	}

	innerSize(element: HTMLElement): number | null {
		// Return nothing if getComputedStyle is not supported (< IE9)
		// Or if parent element has no layout yet
		if (!getComputedStyle) return null;

		const computedStyle = getComputedStyle(element);

		if (!computedStyle) return null;

		let size = (element as dictionary)[this.clientSize];

		if (size === 0) return null;

		if (this.direction === HORIZONTAL) {
			size -=
				parseFloat(computedStyle.paddingLeft) +
				parseFloat(computedStyle.paddingRight);
		} else {
			size -=
				parseFloat(computedStyle.paddingTop) +
				parseFloat(computedStyle.paddingBottom);
		}

		return size;
	}

	// When specifying percentage sizes that are less than the computed
	// size of the element minus the gutter, the lesser percentages must be increased
	// (and decreased from the other elements) to make space for the pixels
	// subtracted by the gutters.
	trimToMin(sizesToTrim: number[]): number[] | null {
		// Try to get inner size of parent element.
		// If it's no supported, return original sizes.
		const parentSize = this.innerSize(this.parent);
		if (parentSize === null) {
			return sizesToTrim;
		}

		if (this.minSizes.reduce((a, b) => a + b, 0) > parentSize) {
			return sizesToTrim;
		}

		// Keep track of the excess pixels, the amount of pixels over the desired percentage
		// Also keep track of the elements with pixels to spare, to decrease after if needed
		let excessPixels = 0;
		const toSpare: any[] = [];

		const pixelSizes = sizesToTrim.map((size, i) => {
			// Convert requested percentages to pixel sizes
			const pixelSize = (parentSize * size) / 100;
			const elementGutterSize = getGutterSize(
				this.gutterSize,
				i === 0,
				i === sizesToTrim.length - 1,
				this.gutterAlign
			);
			const elementMinSize = this.minSizes[i] + elementGutterSize;

			// If element is too smal, increase excess pixels by the difference
			// and mark that it has no pixels to spare
			if (pixelSize < elementMinSize) {
				excessPixels += elementMinSize - pixelSize;
				toSpare.push(0);
				return elementMinSize;
			}

			// Otherwise, mark the pixels it has to spare and return it's original size
			toSpare.push(pixelSize - elementMinSize);
			return pixelSize;
		});

		// If nothing was adjusted, return the original sizes
		if (excessPixels === 0) {
			return sizesToTrim;
		}

		return pixelSizes.map((pixelSize, i) => {
			let newPixelSize = pixelSize;

			// While there's still pixels to take, and there's enough pixels to spare,
			// take as many as possible up to the total excess pixels
			if (excessPixels > 0 && toSpare[i] - excessPixels > 0) {
				const takenPixels = Math.min(
					excessPixels,
					toSpare[i] - excessPixels
				);

				// Subtract the amount taken for the next iteration
				excessPixels -= takenPixels;
				newPixelSize = pixelSize - takenPixels;
			}

			// Return the pixel size adjusted as a percentage
			return (newPixelSize / parentSize) * 100;
		});
	}

	// stopDragging is very similar to startDragging in reverse.
	stopDragging(): void {
		const self = this;
		const a = this.elements[self.a].element;
		const b = this.elements[self.b].element;

		if (self.dragging) {
			getOption(this.options, "onDragEnd", NOOP)(this.getSizes());
		}

		self.dragging = false;

		// Remove the stored event listeners. This is why we store them.
		window[removeEventListener]("mouseup", self.stop);
		window[removeEventListener]("touchend", self.stop);
		window[removeEventListener]("touchcancel", self.stop);
		window[removeEventListener]("mousemove", self.move);
		window[removeEventListener]("touchmove", self.move);

		// Clear bound function references
		self.stop = null;
		self.move = null;

		a[removeEventListener]("selectstart", NOOP);
		a[removeEventListener]("dragstart", NOOP);
		b[removeEventListener]("selectstart", NOOP);
		b[removeEventListener]("dragstart", NOOP);

		a.style.userSelect = "";
		a.style.webkitUserSelect = "";
		a.style.MozUserSelect = "";
		a.style.pointerEvents = "";

		b.style.userSelect = "";
		b.style.webkitUserSelect = "";
		b.style.MozUserSelect = "";
		b.style.pointerEvents = "";

		self.gutter.style.cursor = "";
		self.parent.style.cursor = "";
		doccy.body.style.cursor = "";
	}

	// startDragging calls `calculateSizes` to store the inital size in the pair object.
	// It also adds event listeners for mouse/touch events,
	// and prevents selection while dragging so avoid the selecting text.
	startDragging(e: TouchEvent) {
		// Right-clicking can't start dragging.
		if ("button" in e && e.button !== 0) {
			return;
		}

		// Alias frequently used variables to save space. 200 bytes.
		const self = this;
		const a = this.elements[self.a].element;
		const b = this.elements[self.b].element;

		// Call the onDragStart callback.
		if (!self.dragging) {
			getOption(this.options, "onDragStart", NOOP)(this.getSizes());
		}

		// Don't actually drag the element. We emulate that in the drag function.
		e.preventDefault();

		// Set the dragging property of the pair object.
		self.dragging = true;

		// Create two event listeners bound to the same pair object and store
		// them in the pair object.
		self.move = this.drag.bind(self);
		self.stop = this.stopDragging.bind(self);

		// All the binding. `window` gets the stop events in case we drag out of the elements.
		window[addEventListener]("mouseup", self.stop);
		window[addEventListener]("touchend", self.stop);
		window[addEventListener]("touchcancel", self.stop);
		window[addEventListener]("mousemove", self.move);
		window[addEventListener]("touchmove", self.move);

		// Disable selection. Disable!
		a[addEventListener]("selectstart", NOOP);
		a[addEventListener]("dragstart", NOOP);
		b[addEventListener]("selectstart", NOOP);
		b[addEventListener]("dragstart", NOOP);

		a.style.userSelect = "none";
		a.style.webkitUserSelect = "none";
		a.style.MozUserSelect = "none";
		a.style.pointerEvents = "none";

		b.style.userSelect = "none";
		b.style.webkitUserSelect = "none";
		b.style.MozUserSelect = "none";
		b.style.pointerEvents = "none";

		// Set the cursor at multiple levels
		self.gutter.style.cursor = this.cursor;
		self.parent.style.cursor = this.cursor;
		doccy.body.style.cursor = this.cursor;

		// Cache the initial sizes of the pair.
		this.calculateSizes.call(self);

		// Determine the position of the mouse compared to the gutter
		self.dragOffset = this.getMousePosition(e) - self.end;
	}

	// function adjustToMin(element) {
	// 	const isLast = element.i === pairs.length;
	// 	const pair = isLast ? pairs[element.i - 1] : pairs[element.i];

	// 	calculateSizes.call(pair);

	// 	const size = isLast
	// 		? pair.size - element.minSize - pair[bGutterSize]
	// 		: element.minSize + pair[aGutterSize];

	// 	adjust.call(pair, size);
	// }

	// elements.forEach((element) => {
	// 	const computedSize =
	// 		element.element[getBoundingClientRect]()[dimension];

	// 	if (computedSize < element.minSize) {
	// 		if (expandToMin) {
	// 			adjustToMin(element);
	// 		} else {
	// 			// eslint-disable-next-line no-param-reassign
	// 			element.minSize = computedSize;
	// 		}
	// 	}
	// });

	// function setSizes(newSizes) {
	// 	const trimmed = trimToMin(newSizes);
	// 	trimmed.forEach((newSize, i) => {
	// 		if (i > 0) {
	// 			const pair = pairs[i - 1];

	// 			const a = elements[pair.a];
	// 			const b = elements[pair.b];

	// 			a.size = trimmed[i - 1];
	// 			b.size = newSize;

	// 			setElementSize(a.element, a.size, pair[aGutterSize], a.i);
	// 			setElementSize(b.element, b.size, pair[bGutterSize], b.i);
	// 		}
	// 	});
	// }

	// function destroy(preserveStyles, preserveGutter) {
	// 	pairs.forEach((pair) => {
	// 		if (preserveGutter !== true) {
	// 			pair.parent.removeChild(pair.gutter);
	// 		} else {
	// 			pair.gutter[removeEventListener](
	// 				"mousedown",
	// 				pair[gutterStartDragging]
	// 			);
	// 			pair.gutter[removeEventListener](
	// 				"touchstart",
	// 				pair[gutterStartDragging]
	// 			);
	// 		}

	// 		if (preserveStyles !== true) {
	// 			const style = elementStyle(
	// 				dimension,
	// 				pair.a.size,
	// 				pair[aGutterSize]
	// 			);

	// 			Object.keys(style).forEach((prop) => {
	// 				elements[pair.a].element.style[prop] = "";
	// 				elements[pair.b].element.style[prop] = "";
	// 			});
	// 		}
	// 	});
	// }

	// // return {
	// // 	setSizes,
	// // 	getSizes,
	// // 	collapse(i) {
	// // 		adjustToMin(elements[i]);
	// // 	},
	// // 	destroy,
	// // 	parent,
	// // 	pairs,
	// // };
}
