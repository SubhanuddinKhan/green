import * as axios from "axios";
//import { getCookie } from "./utils";
import { Config } from "../config/config";
import { authHeader } from "../components/helpers";
import { authenticationService } from "./auth.service";

export default class UserApi {
  constructor() {
    this.api_token = null;
    this.client = null;
    this.api_url = Config.apiUrl;
    this.auth_url = Config.authApiUrl;
    this.authService = authenticationService;
  }

  init = () => {
    //this.api_token = getCookie("ACCESS_TOKEN");

    var headers = authHeader();

    this.client = axios.create({
      baseURL: this.api_url,
      timeout: 31000,
      headers: headers,
    });
    return this.client;
    /*if (this.api_token) {
      headers.Authorization = `Bearer ${this.api_token}`;
    }*/
  };

  // Material Entry API

  getCarrierUIDs = (params) => {
    return this.init().get(`/get_carrier_uids`, { params: params });
  };

  getArticleNumbers = (params) => {
    return this.init().get(`/get_article_numbers`, { params: params });
  };

  getDescriptiontexts = (params) => {
    return this.init().get(`/get_descriptions`, { params: params });
  };

  getProviderNames = (params) => {
    return this.init().get(`/get_provider_names`, { params: params });
  };

  getProviderDescriptions = (params) => {
    return this.init().get(`/get_provider_descriptions`, { params: params });
  };

  getManufacturerNames = (params) => {
    return this.init().get(`/get_manufacturer_names`, { params: params });
  };

  getManufacturerDescriptions = (params) => {
    return this.init().get(`/get_manufacturer_descriptions`, {
      params: params,
    });
  };

  getSapNumbers = (params) => {
    return this.init().get(`/get_sap_numbers`, { params: params });
  };

  getLotNumbers = (params) => {
    return this.init().get(`/get_lot_numbers`, { params: params });
  };

  getNewCarriers = (data) => {
    return this.init().post("/importNewCarriers", data);
  };

  getNewArticles = (data) => {
    return this.init().post("/importNewArticles", data);
  };

  getNewFeeders = (data) => {
    return this.init().post("/importNewFeeders", data);
  };

  getCarriers = (params) => {
    return this.init().get("/get_carriers", { params: params });
  };

  sendCarriersFile = (data) => {
    return this.init().post("/handle_carriers_file", data);
  };

  sendArticlesFile = (data) => {
    return this.init().post("/handle_articles_file", data);
  };

  sendFeedersFile = (data) => {
    return this.init().post("/handle_feeders_file", data);
  };

  checkCarrierUIDIsUnique = (params) => {
    return this.init().get("/check_carrier_uid_is_unique", { params: params });
  };

  addSingleCarrier = (data) => {
    return this.init().post("/imprtSingleCarrier", data);
  };

  checkArticleNameIsUnique = (params) => {
    return this.init().get("/check_article_name_is_unique", { params: params });
  };

  checkFeederUIDIsUnique = (params) => {
    return this.init().get("/check_feeder_uid_is_unique", { params: params });
  };

  checkJobNameIsUnique = (params) => {
    return this.init().get("/check_job_name_is_unique", { params: params });
  };

  addSingleArticle = (data) => {
    return this.init().post("/imprtSingleArticle", data);
  };

  addFeeder = (data) => {
    return this.init().post("/importFeeder", data);
  };

  editCarrierRecord = (data) => {
    return this.init().post("/edit_carrier_record", data);
  };

  // Storage center

  getCollectQueue = (params) => {
    return this.init().get("/get_collect_queue", { params: params });
  };

  getStorageDevices = (params) => {
    return this.init().get("/get_storage_devices", { params: params });
  };

  resetStorages = (params) => {
    return this.init().get("/reset_storages", { params: params });
  };

  getStoredCarriers = (params) => {
    return this.init().get("/get_stored_carriers", { params: params });
  };

  turnOffLights = (params) => {
    return this.init().get("/turn_off_lights", { params: params });
  };

  changeActiveStorage = (params) => {
    return this.init().get("/change_active_storage", { params: params });
  };

  // Setup center
  getJobsList = (params) => {
    //console.trace();
    return this.init().get("/get_jobs", { params: params });
  };

  getManufacturers = (params) => {
    return this.init().get("/get_manufacturers", { params: params });
  };

  getSuppliers = (params) => {
    return this.init().get("/get_suppliers", { params: params });
  };

  getJobFromMachine = (params) => {
    //console.trace();
    return this.init().get("/get_job_from_machine", { params: params });
  };

  getFeederexFromMachine = (params) => {
    //console.trace();
    return this.init().get("/get_feederex_from_machine", { params: params });
  };

  getMachinesList = (params) => {
    return this.init().get("/get_machines", { params: params });
  };

  clearMachine = (params) => {
    return this.init().get("/clear_machine", { params: params });
  };

  getMachinePlansList = (params) => {
    return this.init().get("/get_machine_plans", { params: params });
  };

  getBanksList = (params) => {
    return this.init().get("/get_banks", { params: params });
  };

  getProjectsList = (params) => {
    return this.init().get("/get_projects", { params: params });
  };

  createProject = (data) => {
    return this.init().post("/create_project", data);
  };

  getDepartmentsList = (params) => {
    return this.init().get("/get_departments", { params: params });
  };

  createDepartment = (data) => {
    return this.init().post("/create_department", data);
  };

  getJobsNames = (params) => {
    return this.init().get("/get_jobs_names", { params: params });
  };

  getJob = (name) => {
    return this.init().get(`get_job/${name}`);
  };

  setFeederToJobArticle = (params) => {
    return this.init().get(`/set_feeder_carrier`, { params: params });
  };

  getReservedJobsFor = (name) => {
    return this.init().get(`get_reserved_jobs_for/${name}`);
  };

  unmount = (data) => {
    return this.init().post(`unmount`, data);
  };

  getFeedersCartList = (params) => {
    return this.init().get("/get_feeder_carts", { params: params });
  };

  getArticlesList = (params) => {
    return this.init().get("/get_articles", { params: params });
  };

  sendJobProgramFile = (data) => {
    return this.init().post("/handle_job_program_file", data);
  };

  sendNewJob = (data) => {
    return this.init().post("/send_job", data);
  };

  sendJobReservations = (data) => {
    return this.init().post("/send_reservations", data);
  };

  sendConfirmSetup = (data) => {
    return this.init().post("/send_confirm_setup", data);
  };

  sendJobFinishData = (data) => {
    return this.init().post("/send_job_finished", data);
  };
  getUserList = (params) => {
    return this.init().get("/users", { params: params });
  };

  getDashboardData = (params) => {
    return this.init().get("/get_dashboard_data", { params: params });
  };

  addNewUser = (data) => {
    return this.init().post("/users", data);
  };

  sendNewUser = (data) => {
    return this.init().post("/handle_new_user", data);
  };

  sendNewDevice = (data) => {
    return this.init().post("/handle_new_device", data);
  };

  sendNewStorageDevice = (data) => {
    return this.init().post("/handle_new_storage_device", data);
  };

  printLabel = (params) => {
    return this.init().get("/handle_print_label", { params: params });
  };

  handleAutomaticReservation = (data) => {
    return this.init().post("/handle_automatic_reservation", data);
  };

  clearCarriersQueue = (params) => {
    return this.init().get("/clear_carriers_queue", { params: params });
  };

  displayCarrier = (data) => {
    return this.init().post("/display_carrier", data);
  };

  addCarrierToStorage = (data) => {
    return this.init().post("/add_carrier_to_storage", data);
  };

  collectCarrierFromStorage = (data) => {
    return this.init().post("/collect_carrier_from_storage", data);
  };

  handle_carrier_delivered = (data) => {
    return this.init().post("/handle_carrier_delivered", data);
  };

  deleteCarrier = (data) => {
    return this.init().post("/delete_carrier", data);
  };

  collectJobFromStorage = (data) => {
    return this.init().post("/collect_job_from_storage", data);
  };
}
