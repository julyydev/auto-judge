import { OnlineJudgePlatform } from './types/onlineJudgePlatform';

const runAutoJudge = (
    platform: OnlineJudgePlatform,
    id: number,
    sourceFile: string,
    testcase: number | undefined,
) => {
    // TODO: get test case by id
    // TODO: if testcase is defined, run only this
    // TODO: compile and run by source file and test(by jest)

    console.log('platform: ' + platform);
    console.log('id: ' + id);
    console.log('sourceFile: ' + sourceFile);
    console.log('testcase: ' + testcase);
};

export default runAutoJudge;
