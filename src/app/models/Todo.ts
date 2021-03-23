export class Todo {
    id: string;
    name: string;
    lists: 
    {
        id: string;
        content: string; 
        completed: boolean;
    }[];
    open: boolean;
    counter:number;
    performed:number;
}