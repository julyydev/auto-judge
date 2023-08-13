interface Language {
    name: string;
    compile: string | null;
    execute: string;
}

// TODO: add languages
const languages: Record<string, Language> = {
    cpp: {
        name: 'c++',
        compile: 'g++ -std=c++17 {filename}.cpp -o auto_judge_temp/out',
        execute: './auto_judge_temp/out',
    },
    cc: {
        name: 'c++',
        compile: 'g++ -std=c++17 {filename}.cc -o auto_judge_temp/out',
        execute: './auto_judge_temp/out',
    },
    js: {
        name: 'javascript',
        compile: null,
        execute: 'node --stack-size=65536 {filename}.js',
    },
    ts: {
        name: 'typescript',
        compile: 'tsc {filename}.ts',
        execute: 'node --stack-size=65536 {filename}.js',
    },
};

const extractFilenameAndExtension = (
    sourceFile: string,
): { filename: string; extension: string } => {
    const parts = sourceFile.split('.');
    const extension = parts.pop() || '';
    const filename = parts.join('.');

    return { filename, extension };
};

const getCommandByLanguage = (sourceFile: string) => {
    const { filename, extension } = extractFilenameAndExtension(sourceFile);

    if (extension === null) {
        throw new Error('올바르지 않은 파일 형식입니다.');
    }

    // console.log(extension);
    if (!languages.hasOwnProperty(extension)) {
        throw new Error(extension + ' : 지원하지 않는 확장자입니다.');
    }

    const language = languages[extension];
    const incompleteCompileCommand = language.compile || '';
    const incompleteExecuteCommand = language.execute || '';

    const compileCommand = incompleteCompileCommand.replace(
        '{filename}',
        filename,
    );
    const executeCommand = incompleteExecuteCommand.replace(
        '{filename}',
        filename,
    );

    // console.log(language.name);
    // console.log(compileCommand);
    // console.log(executeCommand);

    return {
        compileCommand: compileCommand === '' ? null : compileCommand,
        executeCommand,
    };
};

export default getCommandByLanguage;
