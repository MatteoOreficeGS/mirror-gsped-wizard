import { Component, OnInit } from "@angular/core";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
})
export class PaymentComponent implements OnInit {
  payload: string = "";

  constructor(public status: StatusService) {
    //console.log(this.selectedProvider);
    
  }

  ngOnInit(): void {
    this.status.getConfiguration().subscribe((res) => {
      this.response = res
      //console.log(this.response);
      this.currentModule = this.response.configuration.modules.filter((el: { moduleName: string; }) => el.moduleName === "payment")[0].moduleConfig;
      //console.log(this.currentModule);
      this.providers = this.currentModule.provider;
    });
  }

  response: any = {};
  currentModule: any;
  providers:Array<string> = []
  selectedProvider:string = "";

  setProvider(provider: HTMLSelectElement) {
    this.selectedProvider = provider.value.toString();
    this.selectedProvider = this.selectedProvider.toString();
    //console.log(this.selectedProvider);
    
  }

  redirectPayment() {
    this.status = this.status.getSession();
    this.payload = btoa(JSON.stringify(this.status));
    //console.log(this.payload);
    //console.log(this.status);
    alert("payload della sessione: " + this.payload)
  }
}
