import * as https from 'https';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as ora from 'ora';
import * as chalk from 'chalk';
import { performance } from 'perf_hooks';
import AutoJudgeError from './utils/autoJudgeError';

export interface TestCase {
    input: string;
    output: string;
}
const getBaekjoonTestCase = async (id: number) => {
    return new Promise<TestCase[]>((resolve, reject) => {
        const start = performance.now();
        const spinner = ora('Fetching Test Case...').start();

        https
            .get(
                {
                    hostname: 'www.acmicpc.net',
                    path: `/problem/${id}`,
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                    },
                },
                res => {
                    if (res.statusCode === 404) {
                        spinner.fail('Fetching Failed');
                        reject(
                            new AutoJudgeError(
                                'Non-existent Problem ID',
                                id.toString(),
                            ),
                        );
                        return;
                    }

                    let body = '';
                    res.on('data', chunk => {
                        body += chunk;
                    });

                    res.on('end', () => {
                        const $ = cheerio.load(body);
                        const testCases: Array<TestCase> = [];

                        $('[id*=sample-input]').each((i: number, el) => {
                            const input = $(el).text();
                            const output = $(el)
                                .parent()
                                .parent()
                                .next()
                                .find('[id*=sample-output]')
                                .text();
                            testCases[i] = { input, output };
                        });

                        resolve(testCases);
                        spinner.succeed('Fetching Success');
                        const end = performance.now();
                        console.log(
                            chalk.dim(
                                '- Fetched Time: ' +
                                    ((end - start) / 1000).toFixed(2) +
                                    ' s\n',
                            ),
                        );
                    });
                },
            )
            .on('error', (error: Error) => {
                reject(error);
            });
    });
};

const createBaekjoonInputFile = async (id: number) => {
    const testCases = await getBaekjoonTestCase(id);

    if (testCases.length === 0) {
        throw new Error('No Test Case');
    }

    testCases.forEach((testCase, index) => {
        fs.writeFileSync(
            `auto_judge_temp/input_${index + 1}.txt`,
            testCase.input,
            'utf-8',
        );
    });

    return testCases;
};

export default createBaekjoonInputFile;
