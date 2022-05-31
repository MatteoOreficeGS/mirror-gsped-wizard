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
import { FooterComponent } from "./footer/footer.component";
import { RicercaSpedizioneComponent } from "./moduli/ricerca-spedizione/ricerca-spedizione.component";
import { DatiMittenteComponent } from "./moduli/dati-mittente/dati-mittente.component";
import { DatiDestinatarioComponent } from "./moduli/dati-destinatario/dati-destinatario.component";
import { RitiroComponent } from "./moduli/ritiro/ritiro.component";
import { DatiSpedizioneComponent } from "./moduli/dati-spedizione/dati-spedizione.component";
import { CustomComponent } from "./moduli/custom/custom.component";
import { SpedizioneRitornoComponent } from "./moduli/spedizione-ritorno/spedizione-ritorno.component";
import { RatingSpedizioneComponent } from "./moduli/rating-spedizione/rating-spedizione.component";
import { PagamentoComponent } from "./moduli/pagamento/pagamento.component";
import { StampaAwbComponent } from "./moduli/stampa-awb/stampa-awb.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    WidzardComponent,
    NavbarComponent,
    FooterComponent,
    RicercaSpedizioneComponent,
    DatiMittenteComponent,
    DatiDestinatarioComponent,
    RitiroComponent,
    DatiSpedizioneComponent,
    CustomComponent,
    SpedizioneRitornoComponent,
    RatingSpedizioneComponent,
    PagamentoComponent,
    StampaAwbComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
