# auto-judge

> **There is a critical issue(can't get test cases) with the old version.**
> 
> **Please use it after updating to the latest version (>= v0.0.9).**

<br/>

Automatic compilation, execution, and I/O testing of online judge source code.

For now, only [boj](https://www.acmicpc.net/) is supported.

> This program is a beta version, and errors may occur :(
> 
> If you find a bug, please leave an issue! :)

## Install

```
npm install -g auto-judge
```

## Usage

```
auto-judge [platform] [id] [sourceFile]
```

## Example

```
auto-judge boj 1000 main.cpp
```

![image](https://github.com/piuccio/cowsay/assets/66120479/bdc5243b-30c9-48af-a3e0-fd9eda032b34)

 
If you want to run only one test case, enter the number of the case you want to test after the `-t` option.

```
auto-judge boj 1000 main.cpp -t 1
```
