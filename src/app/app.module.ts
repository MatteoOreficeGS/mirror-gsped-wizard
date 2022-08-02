import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { WidzardComponent } from "./widzard/widzard.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SenderComponent } from "./moduli/sender/sender.component";
import { RecipientComponent } from "./moduli/recipient/recipient.component";
import { ShipmentComponent } from "./moduli/shipment/shipment.component";
import { PaymentComponent } from "./moduli/payment/payment.component";
import { StampaAwbComponent } from "./moduli/stampa-awb/stampa-awb.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { StartComponent } from "./start/start.component";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ErrorPaymentComponent } from './error-payment/error-payment.component';
import { FatturaDHLComponent } from './moduli/fattura-dhl/fattura-dhl.component';
import { VodafoneComponent } from './moduli/vodafone/vodafone.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    WidzardComponent,
    FooterComponent,
    SenderComponent,
    RecipientComponent,
    ShipmentComponent,
    PaymentComponent,
    StampaAwbComponent,
    NavbarComponent,
    ErrorPageComponent,
    StartComponent,
    ErrorPaymentComponent,
    FatturaDHLComponent,
    VodafoneComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
