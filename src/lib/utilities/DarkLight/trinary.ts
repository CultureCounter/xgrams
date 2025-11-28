export enum TrinaryValue {
	false = 0,
	true,
	neither,
}

export class Trinary {
	value = TrinaryValue.false;

	constructor(value: number) {
		this.value = Math.abs(value % 3);
	}
}
