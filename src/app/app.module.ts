import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { WizardComponent } from "./wizard/wizard.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SenderComponent } from "./modules/sender/sender.component";
import { RecipientComponent } from "./modules/recipient/recipient.component";
import { ShipmentDataComponent } from "./modules/shipment-data/shipment-data.component";
import { PaymentComponent } from "./modules/payment/payment.component";
import { StampaAwbComponent } from "./modules/stampa-awb/stampa-awb.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { StartComponent } from "./start/start.component";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ErrorPaymentComponent } from './error-payment/error-payment.component';
import { FatturaDHLComponent } from './modules/fattura-dhl/fattura-dhl.component';
import { VodafoneComponent } from './modules/vodafone/vodafone.component';
import { ModalComponent } from './components/modal/modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SummaryComponent } from './components/summary/summary.component';
import { SelectCourierComponent } from "./modules/select-courier/select-courier.component";
import { CourierCardComponent } from './components/courier-card/courier-card.component';
import { DocumentRecoveryComponent } from './document-recovery/document-recovery.component';

@NgModule({
  declarations: [
    AppComponent,
    WizardComponent,
    FooterComponent,
    SenderComponent,
    RecipientComponent,
    ShipmentDataComponent,
    PaymentComponent,
    StampaAwbComponent,
    NavbarComponent,
    ErrorPageComponent,
    StartComponent,
    ErrorPaymentComponent,
    FatturaDHLComponent,
    VodafoneComponent,
    ModalComponent,
    LoaderComponent,
    SummaryComponent,
    SelectCourierComponent,
    CourierCardComponent,
    DocumentRecoveryComponent
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
