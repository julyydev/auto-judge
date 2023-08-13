import * as chalk from 'chalk';
import { TotalResult } from './runTestCases';

const printResult = (
    id: number,
    sourceFile: string,
    totalResult: TotalResult,
) => {
    if (totalResult.isAllSuccess)
        console.log(chalk.bold.black.bgGreen(' PASS ') + ` ${sourceFile}`);
    else console.log(chalk.bold.black.bgRed(' FAIL ') + ` ${sourceFile}`);

    console.log(`  BOJ ${id}` + ` https://www.acmicpc.net/problem/${id}`);

    for (const result of totalResult.testResults) {
        if (result.isSuccess)
            console.log(
                chalk.green('    ✓ ') +
                    chalk.dim(`example ${result.number} (${result.time} ms)`),
            );
        else
            console.log(
                chalk.red('    ✕ ') +
                    chalk.dim(`example ${result.number} (${result.time} ms)`),
            );
    }

    console.log();
    for (const result of totalResult.testResults) {
        if (result.isSuccess) continue;

        console.log(chalk.bold.red(`  ● BOJ ${id} › example ${result.number}`));
        console.log();
        console.log(
            '    Expected: ' +
                chalk.green(formatStringByNewLineCharacter(result.expected)),
        );
        console.log(
            '    Received: ' +
                chalk.red(formatStringByNewLineCharacter(result.received)),
        );
        console.log();
    }

    console.log(
        chalk.bold('Tests: ') +
            (totalResult.numberOfTest.failed
                ? chalk.bold.red(`${totalResult.numberOfTest.failed} failed`) +
                  ', '
                : '') +
            (totalResult.numberOfTest.passed
                ? chalk.bold.green(
                      `${totalResult.numberOfTest.passed} passed`,
                  ) + ', '
                : '') +
            `${totalResult.numberOfTest.total} total`,
    );
    console.log(chalk.bold('Time: ') + `${totalResult.totalTime} s`);
    console.log(chalk.dim('Ran all test suited.'));
};

export default printResult;

const formatStringByNewLineCharacter = (string: string): string => {
    const lines = string.split('\n');

    const modifiedLines = lines.map((line, index) =>
        index === 0 ? line : '              ' + line,
    );

    return modifiedLines.join('\n');
};
