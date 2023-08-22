import type { OnlineJudgePlatform } from './types/onlineJudgePlatform';
import type { TestCase } from './getBaekjoonTestCase';
import getCommandByLanguage from './getCommandByLanguage';
import { compile } from './compile';
import runTestCases from './runTestCases';
import * as fs from 'fs';
import deleteFolderRecursive from './utils/deleteFolderRecursive';
import createBaekjoonInputFile from './getBaekjoonTestCase';
import printResult from './printResult';
import { CompileOption } from './types/compileOption';
import { directoryName } from './constants/name';

const runAutoJudge = async (
    platform: OnlineJudgePlatform,
    id: number,
    sourceFile: string,
    testcase: number | undefined,
    compileOption: CompileOption,
) => {
    if (!fs.existsSync(directoryName)) fs.mkdirSync(directoryName);

    try {
        if (platform !== 'boj') return;
        const testCases = (await createBaekjoonInputFile(id)) as TestCase[];

        const { compileCommand, executeCommand } = getCommandByLanguage(
            sourceFile,
            compileOption,
        );
        if (compileCommand !== null) await compile(compileCommand);

        const totalResult = await runTestCases(
            testCases,
            executeCommand,
            testcase,
        );

        printResult(id, sourceFile, totalResult);
    } catch (error) {
        console.error(error);
    } finally {
        await deleteFolderRecursive(directoryName);
    }
};

export default runAutoJudge;
