import { authenticationService } from "../../services/auth.service";

export function handleResponse(response) {
  const data = response.data;
  if (response.status !== 200) {
    if ([401, 403].indexOf(response.status) !== -1) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      authenticationService.logout();
      window.location.reload();
    }

    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }
  return data;
}
