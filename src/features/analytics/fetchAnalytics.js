export const fetchAnalytics = async () => {
  const token = localStorage.getItem("token"); // Retrieve the token from local storage

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/analytics-table`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch analytics data");
  }

  const data = await response.json();
  return { data };
};
