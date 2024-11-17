export const dashboardLoader = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // Retrieve the token from local storage
    const token = localStorage.getItem("token");
    console.log("token", token);

    // Fetch dashboard data with Bearer token
    const response = await fetch(`${apiBaseUrl}/api/v1/users/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Add the Bearer token to the Authorization header
      },
      credentials: "include",
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Handle error as needed, e.g., redirect to an error page or show a toast message
    throw error;
  }
};
