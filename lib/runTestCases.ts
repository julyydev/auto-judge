import { TestCase } from './getBaekjoonTestCase';
import { exec } from 'child_process';
import { promisify } from 'util';
import { performance } from 'perf_hooks';
import * as ora from 'ora';

const execAsync = promisify(exec);

const runProgram = async (executeCommand: string, index: number) => {
    try {
        const runCommand = `${executeCommand} < temp/input_${index}.txt`;
        const runResult = await execAsync(runCommand);
        if (runResult.stderr) {
            console.error('Running Error:', runResult.stderr);
            return;
        }

        return runResult.stdout;
    } catch (error) {
        throw error;
    }
};

interface TestResult {
    number: number;
    isSuccess: boolean;
    time: string;
    expected: string;
    received: string;
}

export interface TotalResult {
    isAllSuccess: boolean;
    totalTime: string;
    testResults: TestResult[];
    numberOfTest: {
        total: number;
        passed: number;
        failed: number;
    };
}

const runTestCases = async (
    testCases: TestCase[],
    executeCommand: string,
    specificCase: number | undefined,
) => {
    console.log();
    const spinner = ora('Running Test Case...').start();
    const testResults: TestResult[] = [];

    const start = performance.now();

    if (specificCase === undefined) {
        // run all test cases
        for (const [index, testCase] of testCases.entries()) {
            const start = performance.now();
            const result = await runProgram(executeCommand, index + 1);
            const end = performance.now();

            const testResult: TestResult = {
                number: index + 1,
                isSuccess: result === testCase.output,
                time: (end - start).toFixed(0),
                expected: testCase.output,
                received: result as string,
            };
            testResults.push(testResult);
        }
    } else {
        // run only specific test case
        const start = performance.now();
        const result = await runProgram(executeCommand, specificCase);
        const end = performance.now();

        const testResult: TestResult = {
            number: specificCase,
            isSuccess: result === testCases[specificCase - 1].output,
            time: (end - start).toFixed(0),
            expected: testCases[specificCase - 1].output,
            received: result as string,
        };
        testResults.push(testResult);
    }

    const end = performance.now();
    const totalTime = ((end - start) / 1000).toFixed(3);

    const calculatedResult = calculateTestResults(testResults);

    const totalResult: TotalResult = {
        isAllSuccess: calculatedResult.isAllSuccess,
        totalTime,
        testResults,
        numberOfTest: {
            total: calculatedResult.numberOfTotalTest,
            passed: calculatedResult.numberOfPassedTest,
            failed: calculatedResult.numberOfFailedTest,
        },
    };
    spinner.succeed('Running Test Case Complete');

    return totalResult;
};

export default runTestCases;

const calculateTestResults = (testResults: TestResult[]) => {
    const isAllSuccess = testResults.every(testResult => testResult.isSuccess);
    const counts = testResults.reduce(
        (counts, testResult) => {
            if (testResult.isSuccess) {
                counts.passedCount++;
            } else {
                counts.failedCount++;
            }
            return counts;
        },
        { passedCount: 0, failedCount: 0 },
    );

    return {
        isAllSuccess: isAllSuccess,
        numberOfTotalTest: testResults.length,
        numberOfPassedTest: counts.passedCount,
        numberOfFailedTest: counts.failedCount,
    };
};
