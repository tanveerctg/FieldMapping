const getModuleFields = async (moduleName) => {
  console.log(moduleName);
  //if there is no moduleName found in the argument then throw error
  if (!moduleName) {
    return new Error("Module Name is required.");
  }
  try {
    const ZOHO = await window.ZOHO;
    const { fields } = await ZOHO.CRM.META.getFields({
      Entity: moduleName,
    });
    return fields;
  } catch (err) {
    return err;
  }
};
export default getModuleFields;
