export const fetchQuizAnalytics = async ({ params }) => {
  // Extract quizId from params
  const { quizAnalyticsId } = params;

  // Construct the API URL using the environment variable and the quizId
  const apiUrl = `${
    import.meta.env.VITE_API_BASE_URL
  }/api/v1/quizzes/quiz-analytics/${quizAnalyticsId}`;

  // Retrieve the token from local storage
  const token = localStorage.getItem("token");

  // Check if the token exists
  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    // Make the API call with the Authorization header
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send the token as a Bearer token
      },
    });

    // Handle response errors
    if (!response.ok) {
      throw new Error("Failed to fetch quiz analytics data");
    }

    // Parse the response as JSON
    const data = await response.json();

    // Return the data to be used by the component
    return data;
  } catch (error) {
    console.error("Error fetching quiz analytics:", error);
    throw error; // Propagate the error to be handled by React Router
  }
};
