export async function get(url, options = {}) {
  const response = await fetch(url, { ...options, method: "GET" });
  return handleResponse(response);
}

export async function post(url, data, options = {}) {
  const response = await fetch(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function put(url, data, options = {}) {
  const response = await fetch(url, {
    ...options,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function del(url, options = {}) {
  const response = await fetch(url, { ...options, method: "DELETE" });
  return handleResponse(response);
}

async function handleResponse(response) {
  const contentType = response.headers.get("content-type");
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`
    );
  }
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else if (contentType && contentType.includes("text/plain")) {
    return response.text();
  } else {
    return response.blob(); // Fallback for other content types
  }
}
