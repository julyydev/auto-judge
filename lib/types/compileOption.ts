export type CompileOption = {
    c: CompileOptionC;
    cpp: CompileOptionCpp;
    python: CompileOptionPython;
    java: CompileOptionJava;
    kotlin: CompileOptionKotlin;
    go: CompileOptionGo;
    rust: CompileOptionRust;
};

export type CompileOptionC =
    | 'c89'
    | 'c99'
    | 'c11'
    | 'c2x'
    | 'c89-clang'
    | 'c99-clang'
    | 'c11-clang'
    | 'c2x-clang';

export type CompileOptionCpp =
    | 'c++98'
    | 'c++11'
    | 'c++14'
    | 'c++17'
    | 'c++20'
    | 'c++98-clang'
    | 'c++11-clang'
    | 'c++14-clang'
    | 'c++17-clang'
    | 'c++20-clang';

export type CompileOptionPython = 'python3' | 'python2' | 'pypy3' | 'pypy2';

export type CompileOptionJava = 'java8' | 'java11' | 'java15';

export type CompileOptionKotlin = 'kotlin-jvm' | 'kotlin-native';

export type CompileOptionGo = 'go' | 'gccgo';

export type CompileOptionRust = 'rust2015' | 'rust2018' | 'rust2021';
