export const fetchUserData = async (page = 1, limit = 9) => {
  try {
    
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}v1/apis?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const fetchDealsData = async ({
  page = 1,
  limit = 1,
  dealType = null,
  companyName = null,
}) => {
  try {

    // Construct the query parameters
    const queryParams = new URLSearchParams({
      page: (page || 1).toString(),
      limit: (limit || 10).toString(),
      ...(dealType !== null && { dealType: dealType.toString() }),
      ...(companyName !== null && { companyName: companyName.toString() }),
    }).toString();

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}v1/apis/deals?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching deals data:", error);
    return null;
  }
};
export const fetchSearchAndFilterData = async ({
  searchTerm,
  page = 1,
  limit = 9,
  filterdata = {
    type: "",
    count: "",
    sort: "desc",
    location: "",
    platform: "",
  },
}) => {
  try {
    if (!filterdata) {
      filterdata = {
        type: "",
        count: "",
        sort: "desc",
        location: "",
        platform: "",
      };
    }

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}v1/apis/searchandfilter?page=${page}&limit=${limit}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          search: searchTerm,
          type: filterdata.type || "",
          location: filterdata.location || "",
          platform: filterdata.platform || "",
          count: filterdata.count || "",
          sort: filterdata.sort || "desc",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching search and filter data:", error);
    return null;
  }
};



