export class Logger {
    private static instance: Logger;
    private context: string;

    constructor(context = 'main') {
        this.context = context;
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public info(message: string): void {
        console.log(`%c[${this.context}] %c${message}`, 'color: blue; font-weight: bold;', 'color: black;');
    }

    public warn(message: string): void {
        console.log(`%c[${this.context}] %c${message}`, 'color: orange; font-weight: bold;', 'color: black;');
    }

    public error(message: string): void {
        console.log(`%c[${this.context}] %c${message}`, 'color: red; font-weight: bold;', 'color: black;');
    }

    public debug(message: string, data: any): void {
        console.group(`%c[${this.context}] %c${message}`, 'color: green; font-weight: bold;', 'color: black;');
        console.dir(data);
        console.groupEnd();
    }
}