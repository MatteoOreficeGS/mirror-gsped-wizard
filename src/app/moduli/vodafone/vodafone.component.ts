import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { StatusService } from "../../status.service";
import { StoreService } from "../../store.service";

@Component({
  selector: "app-vodafone",
  templateUrl: "./vodafone.component.html",
})
export class VodafoneComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public service: StatusService,
    public store: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.currentModule = store.configuration.modules.filter(
      (module: { moduleName: string }) => module.moduleName === "vodafone"
    )[0].moduleConfig;
    console.log(this.currentModule);
    this.formVodafone = fb.group({
      description: ["", [Validators.nullValidator]],
    });
    this.store.productDestination = this.currentModule.destination;
    this.choices = this.currentModule.choices;
    this.selected = this.choices[0].choice;
    this.choiceText = this.choices[0].text;
    this.products = this.currentModule.productList;
    console.log(this.choices);
  }

  ngOnInit(): void {}

  currentModule: any = {};
  products: any = {};
  selected: any;
  formVodafone: FormGroup;
  choices: any;
  choiceText: string;
  otherProducts: string =
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";
  currentProduct: any =
    "border-[#C7312A] text-[#C7312A] w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm uppercase cursor-pointer flex-nowrap";

  handleSetProduct(type: any, index: number) {
    this.selected = type;
    this.choiceText = this.choices[index].text;
  }

  selectProduct(product: any, index: number) {
    let auxProduct = product;
    if (auxProduct.selected === true) {
      auxProduct.selected = false;
    } else {
      auxProduct.selected = true;
    }
    this.products[index] = auxProduct;
    console.log(this.products);
  }

  nextStep() {
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
    this.router.navigate(
      [this.store.modules[this.store.currentStep++].module],
      {
        queryParamsHandling: "merge",
      }
    );
  }
}
