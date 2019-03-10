import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'blog',
                loadChildren: './blog/blog.module#JhipsterBlogModule'
            },
            {
                path: 'entry',
                loadChildren: './entry/entry.module#JhipsterEntryModule'
            },
            {
                path: 'tag',
                loadChildren: './tag/tag.module#JhipsterTagModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterEntityModule {}
