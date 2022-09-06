import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { StatusService } from "../../status.service";
import { StoreService } from "../../store.service";

@Component({
  selector: "app-vodafone",
  templateUrl: "./vodafone.component.html",
})
export class VodafoneComponent {
  constructor(
    public fb: FormBuilder,
    public service: StatusService,
    public store: StoreService,
    private router: Router
  ) {
    if (this.service.checkConfiguration()) { return; };
    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "vodafone"
    )[0].moduleConfig;
    this.formVodafone = fb.group({
      description: ["", [Validators.nullValidator]],
    });
    this.store.productDestination = this.currentModule.destination;
    this.translations = this.store.translations;
    this.choices = this.currentModule.choices;
    this.selected = this.choices[0].choice;
    this.choiceText = this.choices[0].text;
    this.products = this.currentModule.productList;
  }

  currentModule: any = {};
  products: any = {};
  selected: any;
  formVodafone!: FormGroup;
  choices: any;
  choiceText!: string;
  otherProducts: string =
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";
  currentProduct: any =
    "border-[#C7312A] text-[#C7312A] w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";
  translations: any = {};
  selectProductNumber: number = 0;
  showModal: boolean = false;
  errors: any = {};

  handleSetProduct(type: any, index: number) {
    this.selected = type;
    this.choiceText = this.choices[index].text;
  }

  selectProduct(product: any, index: number) {
    let auxProduct = product;
    if (auxProduct.selected === true) {
      auxProduct.selected = false;
      this.selectProductNumber--;
    } else {
      this.selectProductNumber++;
      auxProduct.selected = true;
    }
    this.products[index] = auxProduct;
  }

  setShipmentPayload() {
    const noteSender = this.store.noteSenderOnSender
      ? this.store.senderExtras.note_sender
      : this.store.recipientExtras.note_sender;

    const packageDimension = 20;
    const volume =
      (packageDimension * packageDimension * packageDimension) / 1000000;

    this.store.payloadShipment = {
      note_sender: noteSender,
      creazione_postuma: this.store.hasPayment,
      client_id: this.store.configuration.client_id,
      origine: this.store.sender.sender_country_code,
      documenti: this.store.isDocumentShipment ? 1 : 0,

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

  nextStep() {
    if (this.selectProductNumber <= 0) {
      this.showModal = true;
      this.errors = {};
      this.errors = {
        selectProduct: "required",
      };
      return;
    }
    const selectedProducts = this.products.map((product: any) => {
      {
        return product.selected ? product.name : null;
      }
    });
    if (this.currentModule.output === "concat_string") {
      this.store.selectedProducts = selectedProducts.join(" ");
    } else {
      // Nuove direttive da configurazione
    }
    this.store.isLastModule = true;
    if (this.store.currentStep === this.store.stepForShipment) {
      this.store.outwardCostExposure[0] = {
        courierCode: 104,
        serviceCode: 0,
      };
      this.setShipmentPayload();
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
  setCloseModal(event: boolean) {
    this.showModal = event;
  }
}
