class AutoJudgeError extends Error {
    name: string;
    body: string;
    constructor(message: string, body: string) {
        super(message);
        this.name = 'AutoJudgeError';
        this.body = body;
    }
}

export default AutoJudgeError;
