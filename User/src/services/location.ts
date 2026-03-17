export interface LocationInfo {
  name: string;
  pincode?: string;
  district: string;
  state: string;
}

export async function resolveLocation(query: string): Promise<LocationInfo | null> {
  if (!query) return null;
  try {
    const formattedQuery = query.replace(/-/g, ' ');
    const response = await fetch(`https://api.postalpincode.in/postoffice/${encodeURIComponent(formattedQuery)}`);
    const data = await response.json();

    if (data[0].Status === "Success") {
      const topMatch = data[0].PostOffice[0];
      return {
        name: topMatch.Name,
        pincode: topMatch.Pincode,
        district: topMatch.District,
        state: topMatch.State
      };
    }
  } catch (error) {
    console.error("Location Resolution Error:", error);
  }
  return null;
}
