import { directoryName, executionFileName } from './constants/name';
import { CompileOption } from './types/compileOption';

interface CommandParameter {
    filename: string;
    extension: string;
    compileOption: CompileOption;
}

const compileC = ({ filename, compileOption }: CommandParameter) => {
    const versionMap = {
        c89: 'c89',
        c99: 'c99',
        c11: 'c11',
        c2x: 'c2x',
        'c89-clang': 'c89',
        'c99-clang': 'c99',
        'c11-clang': 'c11',
        'c2x-clang': 'c2x',
    };

    const version = versionMap[compileOption.c];
    const compiler = compileOption.c.includes('clang') ? 'clang' : 'gcc';

    return `${compiler} -std=${version} ${filename}.c -o ${directoryName}/${executionFileName}`;
};

const compileCpp = ({
    filename,
    extension,
    compileOption,
}: CommandParameter) => {
    const versionMap = {
        'c++98': 'c++98',
        'c++11': 'c++11',
        'c++14': 'c++14',
        'c++17': 'c++17',
        'c++20': 'c++20',
        'c++98-clang': 'c++98',
        'c++11-clang': 'c++11',
        'c++14-clang': 'c++14',
        'c++17-clang': 'c++17',
        'c++20-clang': 'c++20',
    };

    const version = versionMap[compileOption.cpp];
    const compiler = compileOption.cpp.includes('clang') ? 'clang++' : 'g++';

    return `${compiler} -std=${version} ${filename}.${extension} -o ${directoryName}/${executionFileName}`;
};

const compilePython = ({}: CommandParameter) => {
    return null;
};

const compileJava = ({ filename, compileOption }: CommandParameter) => {
    const versionMap = {
        java8: '8',
        java11: '11',
        java15: '15',
    };

    const version = versionMap[compileOption.java];

    return `javac --release ${version} -J-Xms1024m -J-Xmx1920m -J-Xss512m -encoding UTF-8 ${filename}.java`;
};

const compileJavaScript = ({}: CommandParameter) => {
    return null;
};

const compileTypeScript = ({ filename }: CommandParameter) => {
    return `tsc ${filename}.ts`;
};

const compileKotlin = ({ filename, compileOption }: CommandParameter) => {
    if (compileOption.kotlin === 'kotlin-jvm')
        return `kotlinc-jvm -J-Xms1024m -J-Xmx1920m -J-Xss512m -include-runtime -d ${directoryName}/${executionFileName}.jar ${filename}.kt`;
    else if (compileOption.kotlin === 'kotlin-native')
        return `kotlinc-native -o ${directoryName}/${executionFileName} -opt ${filename}.kt`;
};

const compileSwift = ({ filename }: CommandParameter) => {
    return `swiftc -O -o ${directoryName}/${executionFileName} ${filename}.swift`;
};

const compileRuby = ({}: CommandParameter) => {
    return null;
};

const compileGo = ({ filename, compileOption }: CommandParameter) => {
    if (compileOption.go === 'go')
        return `go build -o ${directoryName}/${executionFileName} ${filename}.go`;
    else if (compileOption.go === 'gccgo')
        return `gccgo -O2 -o ${directoryName}/${executionFileName} -static ${filename}.go`;
};

const compileRust = ({ filename, compileOption }: CommandParameter) => {
    const versionMap = {
        rust2015: '2015',
        rust2018: '2018',
        rust2021: '2021',
    };

    const version = versionMap[compileOption.rust];

    return `rustc --edition ${version} -O -o ${directoryName}/${executionFileName} ${filename}.rs`;
};

const executeC = ({}: CommandParameter) => {
    return `./${directoryName}/${executionFileName}`;
};

const executeCpp = ({}: CommandParameter) => {
    return `./${directoryName}/${executionFileName}`;
};

const executePython = ({ filename, compileOption }: CommandParameter) => {
    const versionMap = {
        python3: 'python3',
        python2: 'python',
        pypy3: 'pypy3',
        pypy2: 'pypy',
    };

    const version = versionMap[compileOption.python];

    return `${version} -W ignore ${filename}.py`;
};

const executeJava = ({}: CommandParameter) => {
    return `java -Xms1024m -Xmx1920m -Xss512m -Dfile.encoding=UTF-8 -XX:+UseSerialGC ${directoryName}/${executionFileName}`;
};

const executeJavaScript = ({ filename }: CommandParameter) => {
    return `node --stack-size=65536 ${filename}.js`;
};

const executeTypeScript = ({ filename }: CommandParameter) => {
    return `node --stack-size=65536 ${filename}.js`;
};

const executeKotlin = ({ compileOption }: CommandParameter) => {
    if (compileOption.kotlin === 'kotlin-jvm')
        return `java -Xms1024m -Xmx1920m -Xss512m -Dfile.encoding=UTF-8 -XX:+UseSerialGC -jar ${directoryName}/${executionFileName}.jar`;
    else if (compileOption.kotlin === 'kotlin-native')
        return `./${directoryName}/${executionFileName}`;
};

const executeSwift = ({}: CommandParameter) => {
    return `./${directoryName}/${executionFileName}`;
};

const executeRuby = ({ filename }: CommandParameter) => {
    return `ruby ${filename}.rb`;
};

const executeGo = ({}: CommandParameter) => {
    return `./${directoryName}/${executionFileName}`;
};

const executeRust = ({}: CommandParameter) => {
    return `./${directoryName}/${executionFileName}`;
};

type Extension =
    | 'c'
    | 'cc'
    | 'cpp'
    | 'py'
    | 'java'
    | 'js'
    | 'ts'
    | 'kt'
    | 'swift'
    | 'rb'
    | 'go'
    | 'rs';

const compileMap = {
    c: compileC,
    cc: compileCpp,
    cpp: compileCpp,
    py: compilePython,
    java: compileJava,
    js: compileJavaScript,
    ts: compileTypeScript,
    kt: compileKotlin,
    swift: compileSwift,
    rb: compileRuby,
    go: compileGo,
    rs: compileRust,
};

const executeMap = {
    c: executeC,
    cc: executeCpp,
    cpp: executeCpp,
    py: executePython,
    java: executeJava,
    js: executeJavaScript,
    ts: executeTypeScript,
    kt: executeKotlin,
    swift: executeSwift,
    rb: executeRuby,
    go: executeGo,
    rs: executeRust,
};

const extractFilenameAndExtension = (
    sourceFile: string,
): { filename: string; extension: Extension } => {
    const parts = sourceFile.split('.');
    const extension = (parts.pop() || '') as Extension;
    const filename = parts.join('.');

    return { filename, extension };
};

const getCommandByLanguage = (
    sourceFile: string,
    compileOption: CompileOption,
) => {
    const { filename, extension } = extractFilenameAndExtension(sourceFile);

    if (extension === null) {
        throw new Error('올바르지 않은 파일 형식입니다.');
    }

    if (!compileMap.hasOwnProperty(extension)) {
        throw new Error(extension + ' : 지원하지 않는 확장자입니다.');
    }

    const compileCommand = compileMap[extension]({
        filename,
        extension,
        compileOption,
    });
    const executeCommand = executeMap[extension]({
        filename,
        extension,
        compileOption,
    });

    return {
        compileCommand: compileCommand as string | null,
        executeCommand: executeCommand as string,
    };
};

export default getCommandByLanguage;
