import { Moment } from 'moment';
import { IBlog } from 'app/shared/model/blog.model';
import { ITag } from 'app/shared/model/tag.model';

export interface IEntry {
    id?: number;
    title?: string;
    content?: string;
    date?: Moment;
    blog?: IBlog;
    tags?: ITag[];
}

export class Entry implements IEntry {
    constructor(
        public id?: number,
        public title?: string,
        public content?: string,
        public date?: Moment,
        public blog?: IBlog,
        public tags?: ITag[]
    ) {}
}
