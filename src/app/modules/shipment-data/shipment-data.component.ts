import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
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
    public fb: UntypedFormBuilder,
    public service: StatusService,
    public store: StoreService,
    public router: Router,
    public route: ActivatedRoute,
    public http: HttpClient
  ) {
    if (this.service.checkConfiguration()) {
      return;
    }
    this.isInternationalShipment =
      this.store.sender.sender_country_code !==
      this.store.recipient.rcpt_country_code;
    this.currentModule = this.store.configuration.modules.filter(
      (module: any) => module.moduleName === "shipment-data"
    )[0].moduleConfig;
    this.store.hasReturnShipment = this.currentModule.returnLabel.enable;
    this.messageModalInfo = this.store.translations.lbl_invoiceModalInfo;
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
      codiceSconto: [this.store.codiceSconto, Validators.minLength(3)],
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
      this.showGoods_type = false;
      this.store.isDocumentShipment = true;
      this.formShipmentData.removeControl(this.translations.lbl_goods_type);
    }
  }

  ngOnInit(): void {
    if (this.store.isAskDocument) {
      this.setDocumentShipment();
    }
    if (this.currentModule.packagesDetails.enable && !this.isDocumentShipment) {
      if (this.store.packages.length > 0) {
        this.packageNumber = this.store.packages.length;
        this.addFilledPackages();
      } else {
        this.addPackage();
      }
    } else {
      this.daticolli = {
        colli: this.store.documentsNumber,
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

    if (Object.values(this.store.documentsFilesUploadedData).length > 0) {
      this.documentsFilesUploaded = this.store.documentsFilesUploaded;
    }
  }

  get dimensions(): UntypedFormArray {
    return this.formShipmentData.get("dimensions") as UntypedFormArray;
  }

  newPackage(
    lunghezza = "",
    larghezza = "",
    altezza = "",
    peso = ""
  ): UntypedFormGroup {
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
    if (this.packageNumber > 1 || this.isDocumentShipment) {
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
    this.isDocumentShipment = true;
    this.formShipmentData.controls["outwardInsurance"].setValue("");
    this.formShipmentData.controls["returnInsurance"].setValue("");
    for (let index = this.packageNumber; index > 0; index--) {
      this.removePackage();
    }
    this.showGoods_type = false;
    this.store.isDocumentShipment = true;
    this.formShipmentData.removeControl(this.translations.lbl_goods_type);
    this.daticolli = {
      colli: this.store.documentsNumber,
      peso: 0.5,
      volume: 0,
    };
    this.store.isAskDocument = true;
    this.documentsFilesUploaded = [];
    this.store.documentsFilesUploadedData = [];
  }

  setGoodsShipment() {
    this.formShipmentData.controls["outwardInsurance"].setValue("");
    this.formShipmentData.controls["returnInsurance"].setValue("");
    if (this.packageNumber === 0) {
      this.addPackage();
    }
    this.showGoods_type = true;
    this.isDocumentShipment = false;
    this.store.isDocumentShipment = false;
    this.formShipmentData.addControl(
      this.translations.lbl_goods_type,
      new UntypedFormControl(this.store.goodType, Validators.required)
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
  formShipmentData!: UntypedFormGroup;
  isDocumentShipment!: boolean;
  chosenCourier: any = {
    outward: { serviceName: "" },
    return: { serviceName: "" },
  };
  canContinue: boolean = false;
  errors: any = {};
  showModal: boolean = false;
  showModalInfo: boolean = false;
  messageModalInfo: string = "";
  showGoods_type: boolean = true;
  isInternationalShipment?: boolean;
  riferimentoOrdine: string = [this.store.origin, new Date().getTime()].join(
    "-"
  );
  documentsFilesUploaded: any = [];
  documentsFilesUploadedData: any = [];
  hideInvoiceDiscount: boolean =
    this.store.configuration.hideInvoiceDiscount || false;

  setDatiColli() {
    if (this.currentModule.packagesDetails.enable && !this.isDocumentShipment) {
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

  setDocumentsUploaded() {
    this.store.documentsFilesUploaded = this.documentsFilesUploaded;
  }

  setDocumentNumber(add: number) {
    this.store.documentsNumber = this.store.documentsNumber + add;
    this.daticolli.colli = this.store.documentsNumber;
  }

  setShipmentPayload() {
    const noteSender = this.store.noteSenderOnSender
      ? this.store.senderExtras.note_sender
      : this.store.recipientExtras.note_sender;
    this.store.payloadShipment = {
      ddt_alpha: this.riferimentoOrdine,
      trade_documents: this.documentsFilesUploaded,
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

  addDocumentFilesNumber(i: number) {
    if (this.isInternationalShipment) {
      if (i === 1) {
        this.documentsFilesUploaded.push({ nome: null, contenuto: null });
        this.store.documentsFilesUploadedData.push({
          name: null,
          selected: null,
        });
      } else {
        this.documentsFilesUploaded.pop();
        this.store.documentsFilesUploadedData.pop();
      }
    }
  }

  setFilesError(errorMessage: string, index: number) {
    this.showModal = true;
    this.errors = {
      error: errorMessage,
    };
    this.documentsFilesUploaded[index].contenuto = "";
    return;
  }

  onFileTypeChanged(event: any, i: number) {
    const extension =
      this.documentsFilesUploaded[i]?.nome?.match(/\.[0-9a-z]+$/i);

    this.documentsFilesUploaded[i].nome =
      [event.target.value, this.riferimentoOrdine, i + 1].join("_") +
      (extension ? extension[0] : "");
    this.store.documentsFilesUploadedData[i].selected = event.target.value;
  }

  onFileChanged(event: any, i: number) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];

      const maxFileDimension = 5242880;

      const acceptedExtensions = [
        { mime: "application/pdf", extension: "pdf" },
        { mime: "text/plain", extension: "txt" },
        { mime: "image/png", extension: "png" },
        { mime: "image/jpg", extension: "jpg" },
        { mime: "image/gif", extension: "gif" },
        { mime: "image/bmp", extension: "bmp" },
        { mime: "image/tiff", extension: "tif" },
        { mime: "application/rtf", extension: "rtf" },
        { mime: "application/msword", extension: "doc" },
        { mime: "application/vnd.ms-excel", extension: "xlsx" },
        {
          mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          extension: "docx",
        },
        {
          mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          extension: "xlsx",
        },
      ];

      if (file.size > maxFileDimension) {
        this.setFilesError(
          file.name + ", " + this.store.translations.lbl_file_too_large,
          i
        );
        event.target.value = "";
        return;
      }
      const acceptedExtension = acceptedExtensions.find(
        (element) => element.mime === file.type
      );

      if (!acceptedExtension) {
        this.setFilesError(
          file.name + ", " + this.store.translations.lbl_invalid_extension,
          i
        );
        event.target.value = "";
        return;
      }

      this.store.documentsFilesUploadedData[i].name =
        event.target.value.replace(/C:\\fakepath\\/, "");

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const contentB64 = String(reader.result).replace(/^.*?(;base64,)/, "");
        this.documentsFilesUploaded[i].contenuto = contentB64;
        const extension =
          this.documentsFilesUploaded[i].nome?.match(/\.[0-9a-z]+$/i);
        if (extension) {
          this.documentsFilesUploaded[i].nome = this.documentsFilesUploaded[
            i
          ].nome?.replace(extension[0], "." + acceptedExtension.extension);
        } else {
          this.documentsFilesUploaded[i].nome +=
            "." + acceptedExtension.extension;
        }
      };
    }
  }

  validateDocumentsFile(documentsFiles: any) {
    let result = [true, ""];
    if (!this.isInternationalShipment) {
      this.documentsFilesUploaded = [];
      return result;
    }
    documentsFiles.forEach((documentsFile: any, i: number) => {
      if (
        documentsFile.nome === null ||
        /null\.[0-9a-z]+$/g.test(documentsFile.nome)
      ) {
        result = [
          false,
          `${this.store.translations.lbl_document} ${i + 1}, ${
            this.store.translations.lbl_no_doc_type_selected
          }`,
        ];
      } else if (
        documentsFile.contenuto === null ||
        documentsFile.contenuto === ""
      ) {
        result = [
          false,
          `${this.store.translations.lbl_document} ${i + 1}, ${
            this.store.translations.lbl_no_file_selected
          }`,
        ];
      }
    });
    return result;
  }

  confirmInsurance() {
    const [valid, error] = this.validateDocumentsFile(
      this.documentsFilesUploaded
    );
    if (!valid) {
      this.errors = { error: error };
      this.showModal = true;
      return;
    }
    this.store.documentsFilesUploaded = this.documentsFilesUploaded;
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
                  error:
                    this.store.translations.lbl_generic_error ||
                    "errore temporaneo, riprova più tardi",
                };
                this.isLoading = false;
              }
            );
          }
        },
        (error) => {
          this.showModal = true;
          this.errors = {};
          this.errors = {
            error:
              this.store.translations.lbl_generic_error ||
              "errore temporaneo, riprova più tardi",
          };
          this.isLoading = false;
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

  setCloseModalInfo(event: boolean) {
    this.showModalInfo = event;
  }

  handleRateComparative(body: any): Observable<any> {
    if (this.currentModule.packagesDetails.enable && !this.isDocumentShipment) {
      body.daticolli = JSON.stringify(body.daticolli);
    }
    const decoded: any = this.store.decodedToken;
    const headers = { "x-api-key": this.store.token };
    return this.http.get(
      environment.API_URL + decoded.instance + "/RateComparativa",
      { headers: headers, params: body }
    );
  }

  openModalInvoiceInfo() {
    this.showModalInfo = true;
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
