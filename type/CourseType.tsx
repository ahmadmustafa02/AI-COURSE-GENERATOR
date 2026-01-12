export  type Course={
    courseId:string;
    courseName:string;
    createdAt:string;
    userInput:string;
    type:string;
    id:number;
    courseLayout:courseLayout;

}

export type courseLayout = {
    courseName: string;
    courseDescription: string;
    courseId: string;
    level: string,
    totalChapters: number,
    chapters: Chapter[];

};

export type Chapter = {
    chapterId: string;
    chapterTitle: string;
    subContent:[];

};