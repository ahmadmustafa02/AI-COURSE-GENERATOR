export  type Course={
    courseId:string;
    courseName:string;
    createdAt:string;
    userInput:string;
    type:string;
    id:number;
    courseLayout:courseLayout;
    chapterContentSlide:chapterContentSlide[];

}

export type courseLayout = {
    courseName: string;
    courseDescription: string;
    courseId: string;
    level: string,
    totalChapters: number,
    chapters: chapter[];

};

export type chapter = {
    chapterId: string;
    chapterTitle: string;
    subContent:[];

};

export type chapterContentSlide={
    id:number;
    courseId:string;
    chapterId:string;
    slideId:string;
    slideIndex:number;
    audioFileName:string;
    narration:{fullText:string};
    html:string;
    revelData:string[];
    captions?: {
        chunks: Array<{
            text: string;
            timestamp: [number, number];
        }>;
        fullText?: string;
    };
}