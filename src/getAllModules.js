const getAllModules = async () => {
  try {
    const ZOHO = await window.ZOHO;
    const { modules } = await ZOHO.CRM.META.getModules();
    return modules;
  } catch (err) {
    return err;
  }
};
export default getAllModules;
