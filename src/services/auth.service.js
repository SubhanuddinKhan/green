import { BehaviorSubject } from "rxjs";
import { handleResponse } from "../components/helpers";
import axios from "axios";
import { Config } from "../config/config";

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser"))
);

const API_URL = Config.apiUrl;

export const authenticationService = {
  login,
  logout,
  refresh,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
};

async function login(username, password) {
  var config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  var data = JSON.stringify({ username, password });

  const response = await axios.post(`${API_URL}/token/obtain/`, data, config);
  const user = await handleResponse(response);
  // store user details and jwt token in local storage to keep user logged in between page refreshes
  localStorage.setItem("currentUser", JSON.stringify(user));
  currentUserSubject.next(user);
  return user;
}

async function refresh() {
  var config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  var currentUser = currentUserSubject.value;
  var data = { refresh: currentUserSubject.value.refresh };
  return axios.post(`${API_URL}/token/refresh/`, data, config).then((res) => {
    currentUser.access = res.data.access;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("currentUser");
  currentUserSubject.next(null);
}
