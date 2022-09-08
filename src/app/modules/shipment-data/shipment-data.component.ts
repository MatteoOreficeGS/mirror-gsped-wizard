import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/app/enviroment";
import { StatusService } from "src/app/status.service";
import { StoreService } from "src/app/store.service";
import {
  ValidateInsurance,
  ValidatePackageDimension,
  ValidatePackageWeight,
} from "../../libs/validation";

@Component({
  selector: "app-shipment-data",
  templateUrl: "./shipment-data.component.html",
})
export class ShipmentDataComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public service: StatusService,
    public store: StoreService,
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpClient
  ) {
    if (this.service.checkConfiguration()) {
      return;
    }
    this.currentModule = this.store.configuration.modules.filter(
      (module: any) => module.moduleName === "shipment-data"
    )[0].moduleConfig;
    this.store.hasReturnShipment = this.currentModule.returnLabel.enable;
    this.translations = store.translations;
    if (this.currentModule.documentFlag === "ask") {
      this.isDocumentShipment = false;
      this.store.isDocumentShipment = false;
    } else {
      this.isDocumentShipment = this.currentModule.documentFlag;
      this.store.isDocumentShipment = this.currentModule.documentFlag;
    }
    this.store.outwardCostExposure = [];
    this.store.returnCostExposure = [];
    this.formShipmentData = fb.group({
      dimensions: this.fb.array([]),
      outwardInsurance: [
        this.store.outwardInsurance ? this.store.outwardInsurance : "",
        [ValidateInsurance],
      ],
      codiceSconto: this.store.codiceSconto,
      returnInsurance: [
        this.store.returnInsurance ? this.store.returnInsurance : "",
        [ValidateInsurance],
      ],
      [this.translations.lbl_goods_type]: [
        this.store.goodType,
        Validators.required,
      ],
      ritiro: ["service"],
    });
    if (this.isDocumentShipment) {
      this.currentModule.packagesDetails.enable = false;
      this.showGoods_type = false;
      this.store.isDocumentShipment = true;
      this.formShipmentData.removeControl(this.translations.lbl_goods_type);
    }
  }

  ngOnInit(): void {
    if (this.store.isAskDocument) {
      this.setDocumentShipment();
    }
    if (this.currentModule.packagesDetails.enable) {
      if (this.store.packages.length > 0) {
        this.packageNumber = this.store.packages.length;
        this.addFilledPackages();
      } else {
        this.addPackage();
      }
    } else {
      this.daticolli = {
        colli: 1,
        peso: 0.5,
        volume: 0,
      };
    }

    this.label = this.currentModule.packagesDetails.fieldsLabel;
    this.fieldsLabel = [
      {
        label: "altezza",
        placeholder: "cm",
      },
      {
        label: "lunghezza",
        placeholder: "cm",
      },
      {
        label: "larghezza",
        placeholder: "cm",
      },
      { label: "peso", value: "peso", placeholder: "kg", min: 0.5, max: 10 },
    ];
  }

  get dimensions(): FormArray {
    return this.formShipmentData.get("dimensions") as FormArray;
  }

  newPackage(
    lunghezza = "",
    larghezza = "",
    altezza = "",
    peso = ""
  ): FormGroup {
    return this.fb.group({
      lunghezza: ["" + lunghezza, ValidatePackageDimension],
      larghezza: ["" + larghezza, ValidatePackageDimension],
      altezza: ["" + altezza, ValidatePackageDimension],
      peso: ["" + peso, ValidatePackageWeight],
    });
  }

  addPackage() {
    if (
      this.packageNumber <
      this.currentModule.packagesDetails.fixedPackagesNumber
    ) {
      this.packageNumber++;
      this.dimensions.push(this.newPackage());
    }
  }

  removePackage() {
    if (this.packageNumber > 1 || !this.currentModule.packagesDetails.enable) {
      this.packageNumber--;
      this.dimensions.removeAt(-1);
    }
  }

  addFilledPackages() {
    this.store.packages.forEach((pack: any) => {
      this.dimensions.push(
        this.newPackage(pack.lunghezza, pack.larghezza, pack.altezza, pack.peso)
      );
    });
  }

  setDocumentShipment() {
    this.formShipmentData.controls["outwardInsurance"].setValue("");
    this.formShipmentData.controls["returnInsurance"].setValue("");
    this.currentModule.packagesDetails.enable = false;
    for (let index = this.packageNumber; index > 0; index--) {
      this.removePackage();
    }
    this.showGoods_type = false;
    this.isDocumentShipment = true;
    this.store.isDocumentShipment = true;
    this.formShipmentData.removeControl(this.translations.lbl_goods_type);
    this.daticolli = {
      colli: 1,
      peso: 0.5,
      volume: 0,
    };
    this.store.isAskDocument = true;
  }

  setGoodsShipment() {
    this.formShipmentData.controls["outwardInsurance"].setValue("");
    this.formShipmentData.controls["returnInsurance"].setValue("");
    this.currentModule.packagesDetails.enable = true;
    if (this.packageNumber === 0) {
      this.addPackage();
    }
    this.showGoods_type = true;
    this.isDocumentShipment = false;
    this.store.isDocumentShipment = false;
    this.formShipmentData.addControl(
      this.translations.lbl_goods_type,
      new FormControl(this.store.goodType, Validators.required)
    );
    this.store.isAskDocument = false;
  }

  currentModule: any;
  label: any;
  fieldsLabel: any;
  packageNumber = 0;
  isLoading: boolean = false;
  bodyRateComparativa: any;
  daticolli: any = {};
  translations: any;
  formShipmentData!: FormGroup;
  isDocumentShipment!: boolean;
  chosenCourier: any = {
    outward: { serviceName: "" },
    return: { serviceName: "" },
  };
  canContinue: boolean = false;
  errors: any = {};
  showModal: boolean = false;
  showGoods_type: boolean = true;

  setDatiColli() {
    if (this.currentModule.packagesDetails.enable) {
      const dimensions = this.formShipmentData.value.dimensions.map(
        (dimension: any) => {
          return {
            lunghezza: parseFloat(
              (dimension.lunghezza ? dimension.lunghezza : "1").replaceAll(
                ",",
                "."
              )
            ),
            larghezza: parseFloat(
              (dimension.larghezza ? dimension.larghezza : "1").replaceAll(
                ",",
                "."
              )
            ),
            altezza: parseFloat(
              (dimension.altezza ? dimension.altezza : "1").replaceAll(",", ".")
            ),
            peso: parseFloat(
              (dimension.peso ? dimension.peso : "1").replaceAll(",", ".")
            ),
          };
        }
      );

      const pesoTot = dimensions
        .map((value: { peso: any }) => value.peso)
        .reduce((a: any, b: any) => a + b, 0);
      const volumeTot = dimensions
        .map(
          (value: { altezza: any; larghezza: any; lunghezza: any }) =>
            (value.lunghezza * value.larghezza * value.altezza) / 1000000
        )
        .reduce((a: any, b: any) => a + b, 0);

      this.daticolli = {
        colli: dimensions.length,
        daticolli: dimensions,
        peso: pesoTot,
        volume: volumeTot,
      };
      this.store.packages = dimensions;
    }
  }

  // setting the insurance value at 100 if checkbox is checked at 0 if not
  setInsurances() {
    if (this.formShipmentData.value.outwardInsurance === true) {
      this.formShipmentData.controls["outwardInsurance"].setValue(100);
      this.store.outwardInsurance = 100;
    } else if (
      this.formShipmentData.value.outwardInsurance === false ||
      this.formShipmentData.value.outwardInsurance === ""
    ) {
      this.formShipmentData.controls["outwardInsurance"].setValue(0);
      this.store.outwardInsurance = 0;
    } else {
      this.store.outwardInsurance = parseFloat(
        ("" + this.formShipmentData.value.outwardInsurance).replace(",", ".")
      );
    }
    if (this.store.hasReturnShipment) {
      if (this.formShipmentData.value.returnInsurance === true) {
        this.store.returnInsurance = 100;
      } else if (
        this.formShipmentData.value.returnInsurance === false ||
        this.formShipmentData.value.returnInsurance === ""
      ) {
        this.formShipmentData.controls["returnInsurance"].setValue(0);
        this.store.returnInsurance = 0;
      } else {
        this.store.returnInsurance = parseFloat(
          ("" + this.formShipmentData.value.returnInsurance).replace(",", ".")
        );
      }
    }
  }

  setShipmentPayload() {
    const noteSender = this.store.noteSenderOnSender
      ? this.store.senderExtras.note_sender
      : this.store.recipientExtras.note_sender;
    this.store.payloadShipment = {
      note_sender: noteSender,
      creazione_postuma: this.store.hasPayment,
      client_id: this.store.configuration.client_id,
      origine: this.store.sender.sender_country_code,
      documenti: this.store.isDocumentShipment ? 1 : 0,
      ...this.daticolli,
    };

    !this.isDocumentShipment
      ? (this.store.payloadShipment.merce =
          this.formShipmentData.value[this.translations.lbl_goods_type])
      : null;
  }

  confirmInsurance() {
    let packageErrors: any = {};
    this.fieldsLabel &&
      this.fieldsLabel.forEach((field: any) => {
        this.dimensions.controls.forEach((control: any, index: number) => {
          if (control.get(field.label)?.errors != null) {
            packageErrors[
              this.translations[field.label] + "(" + (index + 1) + ")"
            ] =
              this.translations[
                control.get(field.label)?.errors.packagesDetails
              ];
          }
        });
      });
    if (this.formShipmentData.valid) {
      this.store.goodType =
        this.formShipmentData.value[this.translations.lbl_goods_type];
      this.setInsurances();
      this.setDatiColli();
      this.setShipmentPayload();
      if (
        this.store.modules.filter((module: any) => {
          return module.module === "vodafone";
        }).length === 1
      ) {
        const packageDimension = 20;
        const volume =
          (packageDimension * packageDimension * packageDimension) / 1000000;
        this.daticolli = {
          colli: 1,
          peso: 1,
          volume: volume,
          daticolli: {
            peso: 1,
            altezza: packageDimension,
            larghezza: packageDimension,
            lunghezza: packageDimension,
            volume: volume,
          },
        };
      }
      this.store.codiceSconto = this.formShipmentData.value.codiceSconto;
      this.isLoading = true;
      this.bodyRateComparativa = {
        ...this.daticolli,
        documenti: this.store.isDocumentShipment ? 1 : 0,
        codice_sconto: this.formShipmentData.value.codiceSconto,
        tipo_listino: "passivo",
        client_id: this.store.configuration.client_id,
      };

      // rateComparative di andata
      const outwardBodyRateComparativa = {
        ...this.bodyRateComparativa,
        valore: this.store.outwardInsurance
          ? this.store.outwardInsurance
          : parseFloat(
              ("" + this.formShipmentData.value.outwardInsurance).replace(
                ",",
                "."
              )
            ),
        sender_cap: this.store.sender.sender_cap,
        sender_addr: this.store.sender.sender_addr,
        sender_city: this.store.sender.sender_city,
        sender_country_code: this.store.sender.sender_country_code,
        rcpt_cap: this.store.recipient.rcpt_cap,
        rcpt_addr: this.store.recipient.rcpt_addr,
        rcpt_city: this.store.recipient.rcpt_city,
        rcpt_country_code: this.store.recipient.rcpt_country_code,
      };
      this.handleRateComparative(outwardBodyRateComparativa).subscribe(
        (res: any) => {
          Object.keys(res.passivo).forEach((courier: any) => {
            Object.keys(res.passivo[courier]).forEach((service: any) => {
              this.store.outwardCostExposure.push({
                courier: courier,
                serviceName: service,
                courierCode: parseInt(
                  res.passivo[courier][service].codice_corriere
                ),
                serviceCode: parseInt(
                  res.passivo[courier][service].codice_servizio
                ),
                data: res.passivo[courier][service],
              });
            });
          });

          if (!this.store.hasReturnShipment) {
            this.isLoading = false;
            this.incrementStep();
          } else {
            const returnBodyRateComparativa = {
              ...this.bodyRateComparativa,
              valore: this.store.returnInsurance
                ? this.store.returnInsurance
                : parseFloat(
                    ("" + this.formShipmentData.value.returnInsurance).replace(
                      ",",
                      "."
                    )
                  ),
              //Inverto gli indirizzi di sender e recipient
              sender_cap: this.store.recipient.rcpt_cap,
              sender_addr: this.store.recipient.rcpt_addr,
              sender_city: this.store.recipient.rcpt_city,
              sender_country_code: this.store.recipient.rcpt_country_code,
              rcpt_cap: this.store.sender.sender_cap,
              rcpt_addr: this.store.sender.sender_addr,
              rcpt_city: this.store.sender.sender_city,
              rcpt_country_code: this.store.sender.sender_country_code,
            };
            this.handleRateComparative(returnBodyRateComparativa).subscribe(
              (res: any) => {
                Object.keys(res.passivo).forEach((courier: any) => {
                  Object.keys(res.passivo[courier]).forEach((service: any) => {
                    this.store.returnCostExposure.push({
                      courier: courier,
                      serviceName: service,
                      courierCode: parseInt(
                        res.passivo[courier][service].codice_corriere
                      ),
                      serviceCode: parseInt(
                        res.passivo[courier][service].codice_servizio
                      ),
                      data: res.passivo[courier][service],
                    });
                  });
                });
                this.isLoading = false;

                this.incrementStep();
              },
              (error) => {
                this.showModal = true;
                this.errors = {};
                this.errors = {
                  errore: "errore temporaneo, riprova più tardi",
                };
              }
            );
          }
        },
        (error) => {
          this.showModal = true;
          this.errors = {};
          this.errors = {
            errore: "errore temporaneo, riprova più tardi",
          };
        }
      );

      // rateComparative di ritorno
    } else {
      this.showModal = true;
      this.errors = {
        ...this.service.showModal(this.formShipmentData),
        ...packageErrors,
      };
    }
  }
  setCloseModal(event: boolean) {
    this.showModal = event;
  }

  handleRateComparative(body: any): Observable<any> {
    if (this.currentModule.packagesDetails.enable) {
      body.daticolli = JSON.stringify(body.daticolli);
    }
    const decoded: any = this.store.decodedToken;
    const headers = { "x-api-key": this.store.token };
    return this.http.get(
      environment.API_URL + decoded.instance + "/RateComparativa",
      { headers: headers, params: body }
    );
  }

  incrementStep() {
    if (this.store.currentStep === this.store.stepForShipment) {
      this.service.createShipment();
    } else {
      this.router.navigate(
        [this.store.modules[this.store.currentStep++].module],
        {
          queryParamsHandling: "merge",
        }
      );
    }
  }
}
