export const buildShopFormData = (data) => {
  const formData = new FormData();

  if (data.name) {
    formData.append("name", data.name);
  }

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.locationLat !== undefined) {
    formData.append("locationLat", data.locationLat);
  }

  if (data.locationLn !== undefined) {
    formData.append("locationLn", data.locationLn);
  }

  if (data.logoFile) {
    formData.append("logoFile", data.logoFile);
  }

  if (data.logoId) {
    formData.append("logo", data.logo);
  }

  if (data.logoId) {
    formData.append("images", data.images);
  }

  if (Array.isArray(data.imageFiles)) {
    data.imageFiles.forEach((file) => {
      formData.append("imageFiles", file);
    });
  }

  return formData;
};