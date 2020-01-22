import ISplitOptions from "./models/split-options-model";
import LineByLine from 'n-readlines';
import fs, { WriteStream } from "fs";

export default class ObjectSplitter {
    static async splitObjectFile(options: ISplitOptions) {
        // OBJECT Table 3 Payment Terms
        console.log('Reading ...')
        const headerExpr = /OBJECT (\w*) (\d*) (.*)/;
        let buffer: Buffer | false;
        const liner = new LineByLine(options.sourceFile);
        let stage: 'CLOSED' | 'OPEN' = 'CLOSED';
        let outFile: WriteStream | null = null;
        let destinationFile: string | null = null;

        while (buffer = liner.next()) {
            const line = buffer.toString('utf-8');

            switch (stage) {
                case 'CLOSED':
                    if (line[0] == '\r') {
                        continue;
                    }

                    const match = headerExpr.exec(line);
                    if (!match) {
                        throw `Invalid file header: '${line}'`;
                    }

                    destinationFile = `${options.destinationFolder}/${match[1].toUpperCase()}_${match[2]}.txt`;
                    outFile = fs.createWriteStream(destinationFile);
                    stage = 'OPEN';
                    break;
                case 'OPEN':
                    if (line.substring(0, 1) == '}') {
                        stage = 'CLOSED';
                    }

                    break;
            }

            if (outFile) {
                outFile.write(line, (err) => { });
                if (stage == 'CLOSED') {
                    outFile.close();
                    outFile = null;
                }
            }
        }

        if (outFile) {
            outFile.close();
            outFile = null;
        }
    }
}