export default class StringBuffer {
    private buffer: string[] = [];

    append(line: string) {
        this.buffer.push(line);
    }

    toString() {
        return this.buffer.join('\n');
    }
}