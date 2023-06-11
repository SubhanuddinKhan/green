import { authenticationService } from "../../services/auth.service";

export function authHeader() {
  // return authorization header with jwt token
  const currentUser = authenticationService.currentUserValue;
  if (currentUser && currentUser.access) {
    return {
      Authorization: `Bearer ${currentUser.access}`,
      "Accept-Language": localStorage.getItem("lang"),
    };
  } else {
    return {};
  }
}
