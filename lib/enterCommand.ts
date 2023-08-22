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
                'c-option': {
                    describe: 'C compile option',
                    demandOption: false,
                    type: 'string',
                    alias: 'co',
                    choices: [
                        'c89',
                        'c99',
                        'c11',
                        'c2x',
                        'c89-clang',
                        'c99-clang',
                        'c11-clang',
                        'c2x-clang',
                    ],
                    default: 'c99',
                },
                'cpp-option': {
                    describe: 'Cpp compile option',
                    demandOption: false,
                    type: 'string',
                    alias: 'cppo',
                    choices: [
                        'c++98',
                        'c++11',
                        'c++14',
                        'c++17',
                        'c++20',
                        'c++98-clang',
                        'c++11-clang',
                        'c++14-clang',
                        'c++17-clang',
                        'c++20-clang',
                    ],
                    default: 'c++17',
                },
                'python-option': {
                    describe: 'Python compile option',
                    demandOption: false,
                    type: 'string',
                    alias: 'pyo',
                    choices: ['python3', 'python2', 'pypy3', 'pypy2'],
                    default: 'python3',
                },
                'java-option': {
                    describe: 'Java compile option',
                    demandOption: false,
                    type: 'string',
                    alias: 'javao',
                    choices: ['java8', 'java11', 'java15'],
                    default: 'java11',
                },
                'kotlin-option': {
                    describe: 'Kotlin compile option',
                    demandOption: false,
                    type: 'string',
                    alias: 'kto',
                    choices: ['kotlin-jvm', 'kotlin-native'],
                    default: 'kotlin-jvm',
                },
                'go-option': {
                    describe: 'Go compile option',
                    demandOption: false,
                    type: 'string',
                    alias: 'goo',
                    choices: ['go', 'gccgo'],
                    default: 'go',
                },
                'rust-option': {
                    describe: 'Rust compile option',
                    demandOption: false,
                    type: 'string',
                    alias: 'rso',
                    choices: ['rust2015', 'rust2018', 'rust2021'],
                    default: 'rust2018',
                },
            },
            handler: async argv => {
                await runAutoJudge(
                    argv.platform,
                    argv.id,
                    argv.sourceFile,
                    argv.testCase,
                    {
                        c: argv.cOption,
                        cpp: argv.cppOption,
                        python: argv.pythonOption,
                        java: argv.javaOption,
                        kotlin: argv.kotlinOption,
                        go: argv.goOption,
                        rust: argv.rustOption,
                    },
                );
            },
        })
        .parse();
};

export default enterCommand;
