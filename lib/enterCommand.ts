import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import runAutoJudge from './runAutoJudge';

const enterCommand = () => {
    yargs(hideBin(process.argv))
        .command({
            command: '$0 [platform] [id] [sourceFile]',
            describe: 'Run Auto-Judge',
            builder: {
                platform: {
                    describe: 'online judge platform name',
                    demandOption: true,
                    type: 'string',
                    alias: 'p',
                    choices: ['boj'],
                },
                id: {
                    describe: 'problem id',
                    demandOption: true,
                    type: 'number',
                    alias: 'i',
                },
                'source-file': {
                    describe: 'your source file name (include extensions)',
                    demandOption: true,
                    type: 'string',
                    alias: 's',
                },
                'test-case': {
                    describe: 'test case you want to run only',
                    demandOption: false,
                    type: 'number',
                    alias: 't',
                },
            },
            handler: argv => {
                runAutoJudge(
                    argv.platform,
                    argv.id,
                    argv.sourceFile,
                    argv.testCase,
                );
            },
        })
        .parse();
};

export default enterCommand;
