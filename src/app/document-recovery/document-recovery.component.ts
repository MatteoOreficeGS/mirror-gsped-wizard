import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { environment } from "../enviroment";
import { StoreService } from "../store.service";
import { StatusService } from "../status.service";

@Component({
  selector: "app-document-recovery",
  templateUrl: "./document-recovery.component.html",
})
export class DocumentRecoveryComponent {
  constructor(
    public store: StoreService,
    private http: HttpClient,
    public service: StatusService
  ) {
    if (this.service.checkConfiguration()) {
      return;
    }
    this.fields = [
      {
        label: "cerca spedizione",
        type: "nspedizione",
      },
      {
        label: "cerca transazione",
        type: "transazione",
      },
    ];
  }
  fields: any;
  showLink: any = { nspedizione: "", transazione: "" };

  recoverDocument(type: string, value: any) {
    console.log(this.showLink);
    const headers = { "x-api-key": this.store.token };
    const params = { tipo: type, valore: value };
    this.http
      .get(
        // console.log(
        environment.API_URL +
          this.store.decodedToken.instance +
          "/RecuperaEtichetteResoFacile",
        { headers: headers, params: params }
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.showLink[type] = res.link;
        },
        (error: any) => {
          console.log(error);
          this.showLink[type] = "link di recupero";
        }
      );
  }
}
