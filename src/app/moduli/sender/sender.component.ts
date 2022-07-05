import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router, Routes } from "@angular/router";
import { Subject } from "rxjs";
import { StatusService } from "src/app/status.service";

@Component({
  selector: "app-sender",
  templateUrl: "./sender.component.html",
})
export class SenderComponent implements OnInit {
  status: any = {};

  constructor(
    public fb: FormBuilder,
    public service: StatusService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.stepSrc = this.service.stepSource;

    // form init and validation
    this.formSender = fb.group({
      sender_name: [
        this.service.session.sender.sender_name,
        Validators.required,
      ],
      sender_city: [
        this.service.session.sender.sender_city,
        Validators.required,
      ],
      sender_contact: [
        this.service.session.sender.sender_contact,
        Validators.required,
      ],
      sender_cap: [this.service.session.sender.sender_cap, Validators.required],
      sender_prov: [
        this.service.session.sender.sender_prov,
        Validators.required,
      ],
      sender_country_code: [
        this.service.session.sender.sender_country_code,
        Validators.required,
        // Validators.maxLength(2)
      ],
      sender_email: [
        this.service.session.sender.sender_email,
        Validators.required,
      ],
      sender_phone: [this.service.session.sender.sender_phone],
      sender_addr: [
        this.service.session.sender.sender_addr,
        Validators.required,
      ],
    });

    //set current module
    this.service.response.subscribe((res: any) => {
      this.currentModule = res.configuration.modules.filter(
        (module: { moduleName: string }) => module.moduleName === "sender"
      )[0].moduleConfig;
    });

    this.autocomplete = this.currentModule.autocomplete;

    this.service.translations.subscribe(
      (res: any) => {
        this.labels = res;
        this.fields = [
          {
            value: "sender_name",
            label: this.labels.sender_name,
            type: "text",
            required: true,
          },
          {
            value: "sender_contact",
            label: this.labels.sender_contact,
            type: "text",
            required: true,
          },
          {
            value: "sender_addr",
            label: this.labels.sender_addr || "sender_addr",
            type: "text",
            required: true,
          },
          {
            value: "sender_city",
            label: this.labels.sender_city,
            type: "text",
            required: true,
          },
          {
            value: "sender_cap",
            label: this.labels.sender_cap,
            type: "number",
            required: true,
          },
          {
            value: "sender_prov",
            label: this.labels.sender_prov,
            type: "text",
            required: true,
          },
          {
            value: "sender_country_code",
            label: this.labels.sender_country_code,
            type: "text",
            required: true,
          },
          {
            value: "sender_email",
            label: this.labels.sender_email,
            type: "email",
            required: true,
          },
          {
            value: "sender_phone",
            label: this.labels.sender_phone,
            type: "number",
            required: false,
          }
        ];
      },
      (err: any) => {
        //console.log(err);
        this.router.navigate(["/"]);
      }
    );

    let langParam = "";

    this.route.queryParams.subscribe((params: any) => {
      langParam = params.lang;
    });

    /* this.service.getLenguage(langParam, "resi").subscribe(
      (res: any) => {
        this.labels = res;
        this.fields = [
          {
            value: "sender_name",
            label: this.labels.sender_name,
            type: "text",
            required: true,
          },
          {
            value: "sender_contact",
            label: this.labels.sender_contact,
            type: "text",
            required: true,
          },
          {
            value: "sender_addr",
            label: this.labels.sender_addr,
            type: "text",
            required: true,
          },
          {
            value: "sender_city",
            label: this.labels.sender_city,
            type: "text",
            required: true,
          },
          {
            value: "sender_cap",
            label: this.labels.sender_cap,
            type: "number",
            required: true,
          },
          {
            value: "sender_state",
            label: this.labels.sender_state,
            type: "text",
            required: true,
          },
          {
            value: "sender_country_code",
            label: this.labels.sender_country_code,
            type: "text",
            required: true,
          },
          {
            value: "sender_email",
            label: this.labels.sender_email,
            type: "email",
            required: true,
          },
          {
            value: "sender_phone",
            label: this.labels.sender_phone,
            type: "number",
            required: false,
          },
          {
            value: "sender_addr",
            label: this.labels.sender_addr,
            type: "text",
            required: true,
          },
        ];
      },
      (err: any) => {
        //console.log(err);
        this.router.navigate(["/"]);
      }
    ); */
  }

  // ngOnInit(): void {
  //   //set current module config
  //   this.service.response.subscribe((res: any) => {
  //     this.currentModule = res.configuration.modules.filter(
  //       (module: { moduleName: string }) => module.moduleName === "sender"
  //     )[0].moduleConfig;
  //   });

  //   this.autocomplete = this.currentModule.autocomplete;

  //   this.service.translations.subscribe(
  //     (res: any) => {
  //       this.labels = res;
  //       this.fields = [
  //         {
  //           value: "sender_name",
  //           label: this.labels.sender_name,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_contact",
  //           label: this.labels.sender_contact,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_addr",
  //           label: this.labels.sender_addr,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_city",
  //           label: this.labels.sender_city,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_cap",
  //           label: this.labels.sender_cap,
  //           type: "number",
  //           required: true,
  //         },
  //         {
  //           value: "sender_state",
  //           label: this.labels.sender_state,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_country_code",
  //           label: this.labels.sender_country_code,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_email",
  //           label: this.labels.sender_email,
  //           type: "email",
  //           required: true,
  //         },
  //         {
  //           value: "sender_phone",
  //           label: this.labels.sender_phone,
  //           type: "number",
  //           required: false,
  //         },
  //         {
  //           value: "sender_addr",
  //           label: this.labels.sender_addr,
  //           type: "text",
  //           required: true,
  //         },
  //       ];
  //     },
  //     (err: any) => {
  //       //console.log(err);
  //       this.router.navigate(["/"]);
  //     }
  //   );

  //   let langParam = "";

  //   this.route.queryParams.subscribe((params: any) => {
  //     langParam = params.lang;
  //   });

  //   /* this.service.getLenguage(langParam, "resi").subscribe(
  //     (res: any) => {
  //       this.labels = res;
  //       this.fields = [
  //         {
  //           value: "sender_name",
  //           label: this.labels.sender_name,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_contact",
  //           label: this.labels.sender_contact,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_addr",
  //           label: this.labels.sender_addr,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_city",
  //           label: this.labels.sender_city,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_cap",
  //           label: this.labels.sender_cap,
  //           type: "number",
  //           required: true,
  //         },
  //         {
  //           value: "sender_state",
  //           label: this.labels.sender_state,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_country_code",
  //           label: this.labels.sender_country_code,
  //           type: "text",
  //           required: true,
  //         },
  //         {
  //           value: "sender_email",
  //           label: this.labels.sender_email,
  //           type: "email",
  //           required: true,
  //         },
  //         {
  //           value: "sender_phone",
  //           label: this.labels.sender_phone,
  //           type: "number",
  //           required: false,
  //         },
  //         {
  //           value: "sender_addr",
  //           label: this.labels.sender_addr,
  //           type: "text",
  //           required: true,
  //         },
  //       ];
  //     },
  //     (err: any) => {
  //       //console.log(err);
  //       this.router.navigate(["/"]);
  //     }
  //   ); */
  // }

  ngOnInit() {
    /* this.service.translations.subscribe((message: any) => {
      //console.log(message);
      if (message !== "this.myVar") {
        //console.log("123");
      } else {
        //console.log(321);
      }
    }); */
  }

  googlePlace(address: HTMLInputElement) {
    if (address.value.length > 3) {
      this.showPredictions === false &&
        (this.showPredictions = true) /* : null */;
      this.service
        .getGooglePlace(address.value, "it")
        .subscribe((response: any) => {
          this.predictionsAddress = [];
          response.predictions.map((prediction: any) =>
            this.predictionsAddress.push({terms: prediction.terms, description: prediction.description})
          );
          //console.log(this.predictionsAddress);

          // //console.log((JSON.parse(response[0].replaceAll("\n", ""))))
        });
      // //console.log(address.value);
    }
  }

  labels: any = {};
  showPredictions: boolean = false;
  autocomplete: boolean = false;
  currentModule: any = {};
  predictionsAddress: Array<any> = [];
  fields: Array<any> = [];

  formSender: FormGroup;

  //Local Variable defined
  formattedaddress = " ";
  options: any = {
    types: ["address"],
    componentRestrictions: { country: ["it"] },
  };

  setAddress(prediction: any) {
    //console.log(prediction);
    this.formSender.controls["sender_addr"].setValue(prediction);
    this.showPredictions = false;
  }

  nextStep() {
    if (this.formSender.valid) {
      sessionStorage.setItem("sender", JSON.stringify(this.formSender.value));
      this.service.setStatus(this.formSender.value, "sender");
      this.service.incrementStep();
      this.route.queryParams.subscribe((params: any) => {
        if (params.lang) {
          this.router.navigate(["recipient"], {
            queryParams: { lang: params.lang },
          });
        }
      });
      this.service.changestep(this.step++);
    }
  }

  stepSrc?: Subject<number>;
  step: number = 1;
}