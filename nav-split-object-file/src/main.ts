#!/usr/bin/env node
import ObjectSplitterOptions from './object-splitter-options';
import ObjectSplitter from './object-splitter';
import figlet from 'figlet';

export class Main {
    static async Run() {
        figlet.text('NAV OBJECT SPLITTER', async (e, d) => {
            console.log(d);
            const args = process.argv;
            const options = await ObjectSplitterOptions.getOptions(args);
            await ObjectSplitter.splitObjectFile(options);
        });
    }
}

Main.Run();