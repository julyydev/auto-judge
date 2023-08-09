import { exec } from 'child_process';
import { promisify } from 'util';
import { performance } from 'perf_hooks';
import * as ora from 'ora';
import * as chalk from 'chalk';

const execAsync = promisify(exec);

interface CompileError extends Error {
    stderr: string;
}

export const compile = async (compileCommand: string) => {
    const start = performance.now();
    const spinner = ora('Compiling...').start();

    try {
        const compileResult = await execAsync(compileCommand);

        if (compileResult.stderr) {
            console.error('Compile Error:', compileResult.stderr);
            return;
        }
    } catch (error) {
        spinner.fail('Compile Failed');
        const compileErr = error as CompileError;
        console.log(compileErr.stderr);
        throw new Error('Compile Error');
    }

    const end = performance.now();
    spinner.succeed('Compile Success');
    console.log(
        chalk.dim('- Compile Time: ' + ((end - start) / 1000).toFixed(2), 's'),
    );
};
