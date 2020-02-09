import { Injectable } from "@angular/core";
import * as Msal from "msal";

@Injectable({
  providedIn: "root"
})
export class MsalService {
  B2CTodoAccessTokenKey = "b2c.access.token";

  /**
   * Tenant configuration
   */
  tenantConfig = {
    tenant: "4a345e21-4d63-4c3b-bb16-487ed9806b53",
    clientID: "Q1DL7NcR&762+0+=i>#2J/{%",
    signInPolicy: "B2C_1_signin",
    signUpPolicy: "B2C_1_signup",
    redirectUri: "http://localhost:4200/home",
    b2cScopes: [
      "https://angulardemo.onmicrosoft.com/access-api/user_impersonation"
    ],
    validateAuthority: false
  };

//   msalConfig = {
//     auth: {
//          clientId: "Q1DL7NcR&762+0+=i>#2J/{%", //This is your client ID
//          authority: "https://login.microsoftonline.com/angulardemo.onmicrosoft.com/B2C_1_signin", //This is your tenant info
//          validateAuthority: false
//      },
//     cache: {
//          cacheLocation: "localStorage",
//          storeAuthStateInCookie: true
//      }
//  };

  /**
   * Configure the authority for Azure AD B2C
   */
  authority =
    "https://login.microsoftonline.com/" +
    this.tenantConfig.tenant +
    "/" +
    this.tenantConfig.signInPolicy;

  /*
   * B2C SignIn SignUp Policy Configuration
   */
  clientApplication = new Msal.UserAgentApplication(
    this.tenantConfig.clientID,
    this.authority,
    function(errorDesc: any, token: any, error: any, tokenType: any) {}
  );
  // clientApplication = new Msal.UserAgentApplication(
  //   this.msalConfig.auth.clientId,
  //   this.msalConfig.auth.authority,
  //   function(errorDesc: any, token: any, error: any, tokenType: any) {}
  // );

  public login():void{
    this.clientApplication.authority = "https://login.microsoftonline.com/" + this.tenantConfig.tenant + "/" + this.tenantConfig.signInPolicy;
    this.authenticate();
  }

  public signup():void{
    this.clientApplication.authority = "https://login.microsoftonline.com/" + this.tenantConfig.tenant + "/" + this.tenantConfig.signUpPolicy;
    this.authenticate();
  }

  public authenticate(): void {
    var _this = this;
    this.clientApplication.loginPopup(this.tenantConfig.b2cScopes).then(function (idToken: any) {
        _this.clientApplication.acquireTokenSilent(_this.tenantConfig.b2cScopes).then(
            function (accessToken: any) {
                _this.saveAccessTokenToCache(accessToken);
            }, function (error: any) {
                _this.clientApplication.acquireTokenPopup(_this.tenantConfig.b2cScopes).then(
                    function (accessToken: any) {
                        _this.saveAccessTokenToCache(accessToken);
                    }, function (error: any) {
                        console.log("error: ", error);
                    });
            })
    }, function (error: any) {
        console.log("error: ", error);
    });
}

saveAccessTokenToCache(accessToken: string): void {
  sessionStorage.setItem(this.B2CTodoAccessTokenKey, accessToken);
};

logout(): void {
  this.clientApplication.logout();
};

isLoggedIn(): boolean {
  return this.clientApplication.getUser() != null;
};

getUserEmail(): string{
 return this.getUser().idToken['emails'][0];
}

getUser(){
return this.clientApplication.getUser()
}

  constructor() {}
}
