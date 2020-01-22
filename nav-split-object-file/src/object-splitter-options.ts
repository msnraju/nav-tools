import arg from 'arg';
import inquirer from 'inquirer';
import ISplitOptions from './models/split-options-model';
import fs from 'fs';

export default class ObjectSplitterOptions {
    static async getOptions(args: string[]): Promise<ISplitOptions> {
        let options = this.parseArgumentsIntoOptions(args);
        options = await this.promptForMissingOptions(options);
        this.checkObjectFileExist(options);

        return options;
    }

    private static checkObjectFileExist(options: ISplitOptions) {
        if (!fs.existsSync(options.sourceFile)) {
            console.log(`Source file '${options.sourceFile}' not found.`);
            process.exit(1);
        }
        if (!fs.existsSync(options.destinationFolder)) {
            console.log(`Destination folder '${options.destinationFolder}' not found.`);
            process.exit(1);
        }
    }

    private static parseArgumentsIntoOptions(rawArgs: any): ISplitOptions {
        const args = arg(
            {
                '--source-file': String,
                '--destination-folder': String,
                '--create-folders': Boolean,
                '--help': Boolean,
                '-s': '--source-file',
                '-d': '--destination-folder',
            },
            {
                argv: rawArgs.slice(2),
            }
        );
        return {
            sourceFile: args['--source-file'] || '',
            destinationFolder: args['--destination-folder'] || '',
            objectTypeWiseFolders: args['--create-folders'] || false,
            help: args['--help'] || false,
        };
    }

    private static async promptForMissingOptions(options: ISplitOptions): Promise<ISplitOptions> {
        const questions = [];
        if (options.help) {
            console.log(`            
Usage: nav-split-object-file --source-file <<object file>> --destination-folder <<destination folder>> --create-folder

Options:
-s, --source-file               Object File Path
-d, --destination-folder        Destination Folder
--create-folders                Create object type wise folders
--help                          Help
        `);
            process.exit(0);
        }

        if (!options.sourceFile) {
            questions.push({
                type: 'input',
                name: 'sourceFile',
                message: 'Source File: ',
                validate: (input: string) => {
                    return input ? true : false;
                }
            });
        }
        if (!options.destinationFolder) {
            questions.push({
                type: 'input',
                name: 'destinationFolder',
                message: 'Destination Folder: '
            });
        }

        const answers = await inquirer.prompt(questions);
        return {
            ...options,
            sourceFile: options.sourceFile || answers.sourceFile as string,
            destinationFolder: options.destinationFolder || answers.destinationFolder as string
        };
    }
}