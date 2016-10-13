export default class Selection {
	constructor () {
		this.items = [];
	}

	get length () {
		return this.items.length;
	}

	clear () {
		this.items = [];
	}

	has (item) {
		return this.items.indexOf(item) != -1;
	}

	add (item) {
        if (this.has(item)) {
            return;
        }
		this.items.push(item);
	}

	remove (item) {
		this.items.splice(this.items.indexOf(item), 1);
	}

	toggle (item) {
		this.has(item) ? this.remove(item) : this.add(item);
	}
}