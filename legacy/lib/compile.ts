import { exec } from 'child_process';
import { promisify } from 'util';
import { performance } from 'perf_hooks';
import * as ora from 'ora';
import * as chalk from 'chalk';
import AutoJudgeError from './utils/autoJudgeError';

const execAsync = promisify(exec);

interface CompileError extends Error {
    stderr: string;
}

export const compile = async (compileCommand: string) => {
    const start = performance.now();
    const spinner = ora('Compiling...').start();

    try {
        await execAsync(compileCommand);
    } catch (error) {
        spinner.fail('Compile Failed');
        const compileErr = error as CompileError;
        throw new AutoJudgeError('Compile Error', compileErr.stderr);
    }

    const end = performance.now();
    spinner.succeed('Compile Success');
    console.log(
        chalk.dim('- Compile Time: ' + ((end - start) / 1000).toFixed(2), 's'),
    );
};
