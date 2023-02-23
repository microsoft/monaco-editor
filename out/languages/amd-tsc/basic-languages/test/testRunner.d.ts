import '../monaco.contribution';
export interface IRelaxedToken {
    startIndex: number;
    type: string;
}
export interface ITestItem {
    line: string;
    tokens: IRelaxedToken[];
}
export declare function testTokenization(_language: string | string[], tests: ITestItem[][]): void;
