import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";

@Component({
  selector: "app-shipment",
  templateUrl: "./shipment.component.html",
})
export class ShipmentComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public status: StatusService,
    public store: StoreService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.formShipment = fb.group({
      dimensions: this.fb.array([]),
      outwardInsurance: "",
      coupon: "",
      returnInsurance: "",
    });
  }

  get dimensions(): FormArray {
    return this.formShipment.get("dimensions") as FormArray;
  }

  ngOnInit(): void {
    this.currentModule = this.store.configuration.modules.filter(
      (module: any) => module.moduleName === "shipment"
    )[0].moduleConfig;
    // this.store.c.subscribe((res: any) => {
    this.hasPayment =
      this.store.configuration.modules.filter(
        (module: { moduleName: string }) => module.moduleName === "payment"
      ).length === 1;

    // this.currentModule.selectCourier.couriers.selectionMode = "AUTOMATIC";
    this.currentModule.selectCourier.couriers.selectionMode = "DYNAMIC";
    // this.currentModule.selectCourier.couriers.selectionMode = "FIXED";

    // this.currentModule.selectCourier.couriers.list[0].services.list.push({gspedServiceCode: 1, name: "prova123"})

    // this.currentModule.enable = true;

    if (this.currentModule.packagesDetails.enable) {
      this.addPackage();
      // this.addPackage();
    } else {
      this.datacolli = {
        colli: 1,
        daticolli: JSON.stringify([
          { altezza: 1, larghezza: 1, lunghezza: 1, volume: 1, peso: 1 },
        ]),
        peso: 1,
        volume: 1,
      };
    }

    this.couriers = this.currentModule.selectCourier.couriers.list;
    this.label = this.currentModule.packagesDetails.label;
    // this.fieldsLabel = this.currentModule.packagesDetails.fieldsLabel;
    this.fieldsLabel = [
      { label: "altezza", placeholder: "cm", step: 1, min: 1, max: 100 },
      { label: "lunghezza", placeholder: "cm", step: 1, min: 1, max: 100 },
      { label: "larghezza", placeholder: "cm", step: 1, min: 1, max: 100 },
      { label: "peso", placeholder: "kg", step: 0.1, min: 0.5, max: 10 },
      // { label: "volume", placeholder: "m³", step: 0.01 },
    ];

    this.bodyRateComparativa = {
      tipo_listino: "passivo",
      client_id: this.store.configuration.client_id,
      ...this.store.sender,
      ...this.store.recipient,
    };
    // });
  }

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

    this.checkPaymentModule();
    // this.checkPickUpAviability();
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
  isLoading: boolean = false;
  showInput: boolean = true;
  bodyRateComparativa: any;
  datacolli: any = {};
  dataRateComparative: any = {};
  hasPayment?: boolean;

  newPackage(): FormGroup {
    return this.fb.group({
      lunghezza: ["", Validators.required],
      larghezza: ["", Validators.required],
      altezza: ["", Validators.required],
      peso: ["", Validators.required],
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

  setDataColli() {
    const pesoTot = this.formShipment.value.dimensions
      .map((value: { peso: any }) => value.peso)
      .reduce((a: any, b: any) => a + b, 0);
    const volumeTot = this.formShipment.value.dimensions
      .map(
        (value: { altezza: any; larghezza: any; lunghezza: any }) =>
          (value.lunghezza * value.larghezza * value.altezza) / 1000000
      )
      .reduce((a: any, b: any) => a + b, 0);

    console.log(volumeTot);

    this.datacolli = {
      colli: this.formShipment.value.dimensions.length,
      daticolli: JSON.stringify(this.formShipment.value.dimensions),
      peso: pesoTot,
      volume: volumeTot,
    };
  }

  confirmInsurance() {
    if (this.formShipment.valid) {
      if (this.currentModule.packagesDetails.enable) {
        this.setDataColli();
      }
      this.store.coupon = this.formShipment.value.coupon;
      this.isLoading = true;

      // let formattedDatacolli: any = { ...this.datacolli };

      // let x: any = [];
      // formattedDatacolli.daticolli.forEach((element: any) => {
      //   x.push(Object.values(element));
      // });

      // formattedDatacolli.daticolli = x;

      // console.log("formattedDatacolli", formattedDatacolli);

      this.bodyRateComparativa = {
        ...this.bodyRateComparativa,
        ...this.datacolli,
      };

      console.log("bodyRateComparativa", this.bodyRateComparativa);
      this.setShipmentPayload();

      this.showInput = false;
      switch (this.currentModule.selectCourier.couriers.selectionMode) {
        case "AUTOMATIC":
        case "automatic":
          console.log("seleziono da solo");
          this.showCourierLowestPrice();
          // this.checkPickUpAviability();
          break;
        case "DYNAMIC":
        case "dynamic":
          console.log("mostro direttamente i prezzi");
          this.showCouriersPrices();
          // this.checkPickUpAviability();
          break;
        case "FIXED":
        case "fixed":
          console.log("seleziona l'utente");
          this.showCourierConfigPrice();
          break;
      }
    }
  }

  /* checkPickUpAviability() {
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
    //this.isLoading = false;
    this.setShipmentPayload();
  } */

  handleSetService() {
    console.log(this.formShipment.value.service);
  }

  setShipmentPayload() {
    console.log("creo il payload per la spedizione");
    this.payloadShipment = {
      creazione_postuma: this.hasPayment,
      corriere: this.courierSelected.gspedCourierCode,
      client_id: this.store.configuration.client_id,
      // contrassegno: 0, // come imposto questo campo
      origine: "IT",
    };

    this.payloadShipment = {
      ...this.payloadShipment,
      ...this.datacolli,
      ...this.store.sender,
      ...this.store.recipient,
    };

    console.log("payloadShipment: ", this.payloadShipment);
  }

  checkPaymentModule() {
    if (this.hasPayment) {
      this.status.handleRateComparative(this.bodyRateComparativa).subscribe(
        (res) => {
          if (res.hasOwnProperty("Error")) {
            alert(res.Error);
          }
          this.dataRateComparative = res;
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
        },
        (error) => {
          alert(error.error);
        }
      );
    } else {
      console.log("passo direttamente alla etichetta");
    }
  }
  // automatic
  showCourierLowestPrice() {
    let totale = 9999;
    let selectedService = 0;
    this.services = [{}];
    this.status
      .handleRateComparative(this.bodyRateComparativa)
      .subscribe((res) => {
        if (res.hasOwnProperty("Error")) {
          alert(res.Error);
          return;
        }
        this.dataRateComparative = res;
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
        this.isLoading = false;
        console.log(this.varie_dettaglio);
      });
    //this.isLoading = false;
  }

  //fixed
  showCourierConfigPrice() {
    this.services = [];
    this.status
      .handleRateComparative(this.bodyRateComparativa)
      .subscribe((res) => {
        if (res.hasOwnProperty("Error")) {
          alert(res.Error);
        }

        const couriersInfo: any = [];
        this.currentModule.selectCourier.couriers.list.forEach(
          (courier: any) => {
            const services: any = [];
            courier.services.list.forEach((service: any) => {
              services.push({ name: service.name });
            });
            couriersInfo.push({ courier: courier.name, services: services });
          }
        );
        const result: any = [];
        couriersInfo.forEach((courierInfo: any) => {
          const services: any = [];
          const details: any = [];
          Object.keys(res.passivo).forEach((key) => {
            courierInfo.services.forEach((service: any) => {
              if (res.passivo[`${key}`][`${service.name}`]) {
                Object.keys(res.passivo[`${key}`][`${service.name}`]).forEach(
                  (detail) => {
                    const varieDettaglio: any = [];
                    if (detail == "varie_dettaglio") {
                      Object.keys(
                        res.passivo[`${key}`][`${service.name}`][`${detail}`]
                      ).forEach((varie_dettaglio) => {
                        varieDettaglio.push({
                          name: varie_dettaglio,
                          value:
                            res.passivo[`${key}`][`${service.name}`][
                              `${detail}`
                            ][`${varie_dettaglio}`],
                        });
                      });
                      details.push({
                        name: detail,
                        value: varieDettaglio,
                      });
                    } else {
                      details.push({
                        name: detail,
                        value:
                          res.passivo[`${key}`][`${service.name}`][`${detail}`],
                      });
                    }
                  }
                );
                services.push({
                  name: service.name,
                  details: details,
                });
              }
            });
          });
          result.push({
            courier: courierInfo.courier,
            services: services,
          });
        });
        console.log(result);
        this.isLoading = false;
      });
  }
  // dynamic
  showCouriersPrices() {
    this.services = [];
    this.status
      .handleRateComparative(this.bodyRateComparativa)
      .subscribe((res) => {
        if (res.hasOwnProperty("Error")) {
          alert(res.Error);
        }
        this.dataRateComparative = res;
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
        console.log(this.costExposure);
        this.isLoading = false;
      });
  }

  setCourierService(serviceName: string, serviceCode: number, totale: any) {
    let courierCode: number = -1;
    this.store.totale = totale;

    Object.keys(this.dataRateComparative.passivo).forEach((courier: any) => {
      console.log(courier);
      console.log(this.dataRateComparative.passivo);

      if (
        this.dataRateComparative.passivo[courier].hasOwnProperty(serviceName)
      ) {
        courierCode =
          this.dataRateComparative.passivo[courier][serviceName]
            .codice_corriere;
      }
    });

    this.payloadShipment.corriere = courierCode;
    this.payloadShipment.servizio = serviceCode;
    console.log("payloadShipment", this.payloadShipment);
    // alert(JSON.stringify(this.payloadShipment, null, 4));
    this.incrementStep();
    // this.checkPickUpAviability();
  }

  incrementStep() {
    console.log(
      "Faccio la chiamata all'endpoint con il payload",
      this.payloadShipment
    );
    this.status.handleShipment(this.payloadShipment).subscribe((res) => {
      console.log(res);
      this.store.shipment = res;
    });
    this.next();
  }

  next() {
    if (this.formShipment.valid) {
      this.store.shipment = this.formShipment.value;
      this.router.navigate([this.store.modules[this.store.currentStep++]], {
        queryParamsHandling: "merge",
      });
    }
  }
}
