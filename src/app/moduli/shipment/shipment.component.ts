import { Component, OnInit, SimpleChanges } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-shipment",
  templateUrl: "./shipment.component.html",
})
export class ShipmentComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public status: StatusService,
    public router: Router
  ) {
    this.formShipment = fb.group({
      dimensions: this.fb.array([]),
      couriers: ["", Validators.required],
      service: ["", Validators.required],
    });
    this.stepSrc = this.status.stepSource;
  }

  get dimensions(): FormArray {
    return this.formShipment.get("dimensions") as FormArray;
  }

  ngOnInit(): void {
    this.status.response.subscribe((res: any) => {
      this.response = res;
      this.currentModule = this.response.configuration?.modules.filter(
        (module: any) => module.moduleName === "shipment"
      )[0].moduleConfig;

      this.currentModule.selectCourier.couriers.selectionMode = "AUTOMATIC";
      // this.currentModule.selectCourier.couriers.selectionMode = "DYNAMIC";
      // this.currentModule.selectCourier.couriers.selectionMode = "FIXED";

      // this.currentModule.selectCourier.couriers.list[0].services.list.push({gspedServiceCode: 1, name: "prova123"})

      // this.currentModule.enable = true;

      if (this.currentModule.enable) {
        this.addPackage();
      }

      this.couriers = this.currentModule.selectCourier.couriers.list;
      this.label = this.currentModule.packagesDetails.label;
      // this.fieldsLabel = this.currentModule.packagesDetails.fieldsLabel;
      this.fieldsLabel = [
        { label: "altezza", placeholder: "cm", step: 1 },
        { label: "lunghezza", placeholder: "cm", step: 1 },
        { label: "larghezza", placeholder: "cm", step: 1 },
        { label: "volume", placeholder: "m³", step: 0.01 },
        { label: "peso", placeholder: "kg", step: 0.1 },
      ];
    });
  }

  response: any = {};

  formShipment: FormGroup;

  send() {
    console.log(this.formShipment.value);
    this.incrementStep();
  }
  selectCourier(courier: any) {
    this.courierSelected.name = courier.value;
    this.courierSelectedLogoUrl =
      this.currentModule.selectCourier.couriers.list.filter(
        (element: { name: string }) => element.name === courier.value
      )[0].logoUrl;

    this.services = this.currentModule.selectCourier.couriers.list.filter(
      (el: { name: string }) => el.name === this.courierSelected.name
    )[0].services.list;
    this.isLoading = true;

    this.checkPickUpAviability();
    /* this.services.forEach((service: { name: string }) => {
      this.addService(service.name);
    }); */
    /* this.courierServices.push(
      this.fb.group({ service: ["", Validators.required] })
    ); */
  }
  showCourierSelection: boolean = false;
  courierSelected = { name: "", gspedCourierCode: 104 };
  courierSelectedLogoUrl = null;
  currentModule: any;
  couriers?: Array<any>;
  label: any;
  fieldsLabel: any;
  services: any;
  pickupAvailability: string = "";
  costExposure: any;
  payloadShipment: any = {};
  packageNumber = 1;
  varie_dettaglio?: any = {};
  rateComparativeServices?: Array<string>;
  isLoading!: boolean;

  newPackage(): FormGroup {
    return this.fb.group({
      lunghezza: ["", Validators.required],
      larghezza: ["", Validators.required],
      altezza: ["", Validators.required],
      peso: ["", Validators.required],
      volume: ["", Validators.required],
    });
  }

  addPackage() {
    if (this.packageNumber < 5) {
      this.packageNumber++;
      this.dimensions.push(this.newPackage());
    }
  }

  removePackage() {
    if (this.packageNumber > 1) {
      this.packageNumber--;
      this.dimensions.removeAt(-1);
    }
  }

  confirmInsurance() {
    switch (this.currentModule.selectCourier.couriers.selectionMode) {
      case "AUTOMATIC":
      case "automatic":
        console.log("seleziono da solo");
        this.showCourierLowestPrice();
        this.checkPickUpAviability();
        break;
      case "DYNAMIC":
      case "dynamic":
        console.log("mostro direttamente i prezzi");
        this.showCouriersPices();
        this.checkPickUpAviability();
        break;
      case "FIXED":
      case "fixed":
        console.log("seleziona l'utente");
        this.showCourierSelection = true;
        this.setShipmentPayload();
        this.checkPaymentModule();
        break;
    }
  }

  checkPickUpAviability() {
    this.status.pickupAvailability().subscribe(
      (res) => {
        console.log(res);
        if (res.hasOwnProperty("result")) {
          this.pickupAvailability = res.result;
        }
      },
      (error) => {
        this.pickupAvailability = error.error.error;
        this.pickupAvailability = "KO";
      }
    );
    this.isLoading = false;
  }

  handleSetService() {
    console.log(this.formShipment.value.service);
  }

  setShipmentPayload() {
    console.log("creo il payload per la spedizione");
    this.payloadShipment = {
      client_id: this.response.configuration.client_id,
      colli: this.packageNumber,
      contrassegno: 0, // come imposto questo campo
      corriere: this.courierSelected.gspedCourierCode,
      ddt_alpha: "TEST_GSPED",
      // ddt_num: 12346,
      origine: "IT",
      dropshipping: 0,
      peso: 2.4,
      rcpt_addr: "115 E Endfield Rd",
      rcpt_cap: "19053",
      rcpt_city: "Feasterville Trevose",
      rcpt_contact: "Tester",
      rcpt_country_code: "US",
      rcpt_email: "test@test.it",
      rcpt_name: "TEST DESTINATARIO",
      rcpt_phone: "2159005458",
      rcpt_prov: "PA",
      servizio: 9,
      valore: 0,
      valore_doganale: 37.5,
      valuta: "EUR",
      volume: 0.0972,
      daticolli: [
        {
          altezza: 39,
          larghezza: 29,
          lunghezza: 43,
          volume: 0.048633,
          peso: 1.2,
        },
      ],
      dettagli_ordine: [
        {
          sku: "PBK1",
          description: "Cosa blu",
          qty: "1",
          barcode_riga: "12345464",
          hs_code: "123456454",
          prezzo_singolo: "12.50",
          peso_riga: "1",
        },
        {
          sku: "PBK12",
          description: "Cosa blu e rossa",
          qty: "1",
          barcode_riga: "12345465",
          hs_code: "123456454",
          prezzo_singolo: "25.00",
          peso_riga: "1",
        },
      ],
    };
  }

  checkPaymentModule() {
    if (
      this.response.configuration.modules.filter(
        (module: { moduleName: string }) => module.moduleName === "payment"
      )[0]
    ) {
      this.status.handleRateComparative().subscribe((res) => {
        console.log(res);
        this.costExposure = res.passivo[this.courierSelected.name];
        this.rateComparativeServices = Object.keys(this.costExposure);
        this.rateComparativeServices.forEach((element) => {
          console.log(element);
          this.varie_dettaglio[element] = Object.keys(
            this.costExposure[element].varie_dettaglio
          );
        });
        console.log(this.varie_dettaglio);
      });
    } else {
      console.log("passo direttamente alla etichetta");
    }
  }

  showCourierLowestPrice() {
    let totale = 9999;
    let selectedService = 0;
    this.services = [{}];
    this.status.handleRateComparative().subscribe((res) => {
      Object.keys(res.passivo).forEach((courier) => {
        Object.keys(res.passivo[courier]).forEach((service) => {
          if (totale > res.passivo[courier][service].totale) {
            totale = res.passivo[courier][service].totale;
            selectedService = res.passivo[courier][service];
            this.services[0].name = service;
            this.services[0].code =
              res.passivo[courier][service].codice_servizio;
          }
        });
      });

      this.costExposure = {};

      this.costExposure[this.services[0].name] = selectedService;
      console.log(this.costExposure);

      this.rateComparativeServices = Object.keys(this.costExposure);
      this.rateComparativeServices.forEach((element) => {
        console.log(element);
        this.varie_dettaglio[element] = Object.keys(
          this.costExposure[element].varie_dettaglio
        );
      });
      /* this.varie_dettaglio[this.services[0]] = Object.keys(
        this.costExposure[this.services[0]].varie_dettaglio
      ); */

      console.log(this.varie_dettaglio);
    });
  }

  showCouriersPices() {
    this.services = [];
    this.status.handleRateComparative().subscribe((res) => {
      this.costExposure = {};
      let couriers = Object.keys(res.passivo);
      couriers.forEach((courier) => {
        Object.keys(res.passivo[courier]).forEach((element) => {
          this.services.push({
            name: element,
            code: res.passivo[courier][element].codice_servizio,
          });
          this.costExposure[element] = res.passivo[courier][element];
          this.rateComparativeServices = Object.keys(this.costExposure);
          this.rateComparativeServices.forEach((el) => {
            this.varie_dettaglio[el] = Object.keys(
              this.costExposure[el].varie_dettaglio
            );
          });
        });
      });
    });
  }

  setCourierService(service: string) {
    console.log(service);
    this.checkPickUpAviability();
  }

  incrementStep() {
    console.log(
      "Faccio la chiamata all'endpoint con il payload",
      this.payloadShipment
    );
    this.status
      .handleShipment(this.payloadShipment)
      .subscribe((res) => console.log(res));
    this.status.incrementStep();
    // this.next();
  }

  next() {
    console.log(this.formShipment.value);

    if (this.formShipment.valid) {
      this.status.setStatus(this.formShipment.value, "shipment");
      this.status.incrementStep();
      this.router.navigate(["payment"]);
      this.status.changestep(this.step++);
    }
  }

  stepSrc?: Subject<number>;
  step: number = 3;
}
