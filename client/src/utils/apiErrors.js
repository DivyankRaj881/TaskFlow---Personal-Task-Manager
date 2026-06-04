export function getApiErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (err?.response?.data?.error) {
    return err.response.data.error;
  }

  if (err?.code === "ERR_NETWORK" || !err?.response) {
    return "Cannot reach the server. Make sure the API is running on port 5000.";
  }

  if (err?.response?.status >= 500) {
    return "Server error. Please try again later.";
  }

  if (err?.message) {
    return err.message;
  }

  return fallback;
}
