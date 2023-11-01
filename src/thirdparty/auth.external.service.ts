import axios from 'axios';
import { AxiosInstance, AxiosRequestHeaders } from 'axios';

export type BodyOAuthClientOnly = {
  "client_id": string,
  "client_secret": string,
  "grant_type": string
}

class AuthExternalService {

  PH_API_HOST = process.env.PH_API_HOST || "api.producthunt.com";
  PH_API_URL = process.env.PH_API_URL || "https://api.producthunt.com/";
  PH_API_OAUTH = `${this.PH_API_URL + (this.PH_API_URL.slice(-1) === "/" ? "" : "/")}v2/oauth/token/`;
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: this.PH_API_OAUTH
    });
    this.api.interceptors.request.use(config => {

      let customConfig =  { 
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Host": this.PH_API_HOST
      }

      type TypeCustomConfig = AxiosRequestHeaders & typeof customConfig
      config.headers = customConfig as TypeCustomConfig;

      return config
    });
  }

  getToken = () => {
    const requestBody = {
      "client_id": process.env.PH_APP_API_KEY,
      "client_secret": process.env.PH_APP_API_SECRET,
      "grant_type": "client_credentials"
    } as BodyOAuthClientOnly
    return this.api.post('/', requestBody);
  };

}

const authExternalService = new AuthExternalService();

export default authExternalService;