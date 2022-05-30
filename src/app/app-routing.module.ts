import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DatiDestinatarioComponent } from "./moduli/dati-destinatario/dati-destinatario.component";
import { DatiMittenteComponent } from "./moduli/dati-mittente/dati-mittente.component";
import { DatiSpedizioneComponent } from "./moduli/dati-spedizione/dati-spedizione.component";
import { PagamentoComponent } from "./moduli/pagamento/pagamento.component";
import { StampaAwbComponent } from "./moduli/stampa-awb/stampa-awb.component";

const routes: Routes = [
  { path: "sender", component: DatiMittenteComponent },
  { path: "recipient", component: DatiDestinatarioComponent },
  { path: "shipment", component: DatiSpedizioneComponent },
  { path: "payment", component: PagamentoComponent },
  { path: "awbPrinting", component: StampaAwbComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
