export async function getNetworkInfo() {
  // Get connection info
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  // Get rough location using timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [continent, ...locationParts] = timezone.split("/");
  const location = locationParts.join(", ").replace(/_/g, " ");

  // Get connection type
  let connectionType = "unknown";
  if (connection) {
    connectionType = connection.effectiveType || connection.type || "unknown";
  }

  // Estimate speeds based on connection type
  let speeds = {
    averageDownload: 100,
    averageUpload: 50,
    averagePing: 20,
  };

  if (connectionType === "4g") {
    speeds = { averageDownload: 150, averageUpload: 50, averagePing: 15 };
  } else if (connectionType === "3g") {
    speeds = { averageDownload: 50, averageUpload: 20, averagePing: 40 };
  } else if (connectionType === "2g") {
    speeds = { averageDownload: 10, averageUpload: 5, averagePing: 100 };
  }

  // Try to get the provider name from a client-side API if possible
  let provider = "Unknown Provider";
  try {
    // This is just an example - you may want to implement a client-side API
    // to get the actual provider name if possible
    const response = await fetch('https://api.ipify.org?format=json');
    const ipData = await response.json();
    // In a real implementation, you would use this IP to get provider info
    console.log("Client IP:", ipData.ip);
  } catch (error) {
    console.error("Failed to get provider info:", error);
  }

  return {
    ip: await getPublicIP(),
    location: {
      country: continent || "Unknown",
      region: location || "Unknown",
      city: "Unknown",
    },
    provider: provider, // Use the proper provider name from ISP data when possible
    regionalSpeeds: speeds,
    timezone
  };
}

async function getPublicIP(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Failed to fetch IP:", error);
    return "Unknown";
  }
}
