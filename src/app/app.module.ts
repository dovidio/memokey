import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddComponent } from './add/add.component';
import { LearnComponent } from './learn/learn.component';
import { DtMenuModule } from "@dynatrace/barista-components/menu";
import { DtCardModule } from "@dynatrace/barista-components/card";
import { DtFormFieldModule } from "@dynatrace/barista-components/form-field";
import { DtInputModule } from "@dynatrace/barista-components/input";
import { DtDrawerModule } from "@dynatrace/barista-components/drawer";
import {DtButtonModule} from "@dynatrace/barista-components/button";
import {DtTableModule} from "@dynatrace/barista-components/table";
import { CurrentlyPressedKeysComponent } from './currently-pressed-keys/currently-pressed-keys.component';
import {ShortcutDisplayerComponent} from "./shortcut-displayer/shortcut-displayer.component";
import {DtExpandableSectionModule} from "@dynatrace/barista-components/expandable-section";
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent, AddComponent, LearnComponent, CurrentlyPressedKeysComponent, ShortcutDisplayerComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    DtMenuModule,
    DtCardModule,
    DtFormFieldModule,
    DtInputModule,
    DtDrawerModule,
    BrowserAnimationsModule,
    DtIconModule.forRoot({svgIconLocation: '/assets/icons/{{name}}.svg'}),
    DtButtonModule,
    DtTableModule,
    DtExpandableSectionModule
  ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
