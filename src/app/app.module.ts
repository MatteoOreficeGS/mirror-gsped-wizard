import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSliderModule } from "@angular/material/slider";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { WidzardComponent } from "./widzard/widzard.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { TextInputComponent } from "./widzard/text-input/text-input.component";
import { LabelInputComponent } from "./widzard/label-input/label-input.component";
import { ButtonWidzardComponent } from "./widzard/button-widzard/button-widzard.component";
import { ReadonlyComponent } from "./widzard/readonly/readonly.component";
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    WidzardComponent,
    NavbarComponent,
    TextInputComponent,
    LabelInputComponent,
    ButtonWidzardComponent,
    ReadonlyComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
