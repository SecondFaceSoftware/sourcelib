
export class ParserRange {
    private start: number;
    private end: number;

    constructor(start: number, end: number) {
        if (start < 0) {
            throw new RangeError("Start must not be less than zero");
        }
        if (end < 0) {
            throw new RangeError("End must not be less than zero");
        }
        if (end < start) {
            throw new RangeError("End must not be less than start");
        }
        if (!Number.isInteger(start)) {
            throw new RangeError("Start must not be a float");
        }
        if (!Number.isInteger(end)) {
            throw new RangeError("End must not be a float");
        }
        this.start = start;
        this.end = end;
    }

    public copy(): ParserRange {
        return new ParserRange(this.start, this.end);
    }

    public getStart(): number {
        return this.start;
    }

    public getEnd(): number {
        return this.end;
    }

    public moveBy(delta: number): void {
        if (!Number.isInteger(delta)) {
            throw new RangeError("Delta must not be a float");
        }
        const destStart = this.start + delta;
        const destEnd = this.end + delta;

        if (destStart < 0 || destEnd < 0) {
            throw new RangeError("Resulting range is less than 0");
        }
        this.start = destStart;
        this.end = destEnd;
    }

    public moveTo(start: number): void {
        const prevLength = this.getLength();
        this.start = start;
        this.end = start + prevLength;
    }

    public moveStartTo(start: number): void {
        this.start = start;
    }

    public moveEndTo(end: number): void {
        this.end = end;
    }

    public moveStartBy(delta: number): void {
        this.start += delta;
    }

    public moveEndBy(delta: number): void {
        this.end += delta;
    }

    public isValid(): boolean {
        return this.start < this.end;
    }

    public getLength(): number {
        return this.end - this.start;
    }

    public isIntersecting(other: ParserRange): boolean {
        return this.start <= other.end && this.end >= other.start;
    }
}

export class ParserPosition {
    private line: number;
    private range: ParserRange;

    constructor(line: number, range: ParserRange) {
        if (line < 0) {
            throw new RangeError("Line cannot be less than zero");
        }
        this.line = line;
        this.range = range;
    }

    public getLine(): number {
        return this.line;
    }

    public getRange(): ParserRange {
        return this.range;
    }

    public copy(): ParserPosition {
        return new ParserPosition(this.line, this.range);
    }

    /**
     *
     * @param delta Where to move the line to. Must be an unsigned int
     * @returns Returns 'this', mutated
     */
    public moveToLine(line: number): ParserPosition {
        if (!Number.isInteger(line)) {
            throw new RangeError("Line must not be float");
        }
        if (line < 0) {
            throw new RangeError("Line cannot be less than zero");
        }
        this.line = line;
        return this;
    }

    /**
     *
     * @param delta Amount of lines to move forward (down). Must be an int. Clamps at 0
     * @returns Returns 'this', mutated
     */
    public moveLineBy(delta: number): ParserPosition {
        if (!Number.isInteger(delta)) {
            throw new RangeError("Delta must not be float");
        }
        const dest = this.line - delta;
        if (dest < 0) {
            throw new RangeError("The resulting line number cannot be less than zero.");
        }
        return this;
    }
}