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
import { SenderComponent } from "./moduli/sender/sender.component";
import { RecipientComponent } from "./moduli/recipient/recipient.component";
import { RitiroComponent } from "./moduli/ritiro/ritiro.component";
import { ShipmentComponent } from "./moduli/shipment/shipment.component";
import { CustomComponent } from "./moduli/custom/custom.component";
import { SpedizioneRitornoComponent } from "./moduli/spedizione-ritorno/spedizione-ritorno.component";
import { RatingSpedizioneComponent } from "./moduli/rating-spedizione/rating-spedizione.component";
import { PagamentoComponent } from "./moduli/pagamento/pagamento.component";
import { StampaAwbComponent } from "./moduli/stampa-awb/stampa-awb.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    WidzardComponent,
    NavbarComponent,
    FooterComponent,
    RicercaSpedizioneComponent,
    SenderComponent,
    RecipientComponent,
    RitiroComponent,
    ShipmentComponent,
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
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
