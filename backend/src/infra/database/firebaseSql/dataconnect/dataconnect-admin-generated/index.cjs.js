const { validateAdminArgs } = require("firebase-admin/data-connect");

const connectorConfig = {
  connector: "quasagram",
  serviceId: "quasagram-c6a40-2-service",
  location: "southamerica-east1",
};
exports.connectorConfig = connectorConfig;

function getUserByUid(dcOrVarsOrOptions, varsOrOptions, options) {
  const {
    dc: dcInstance,
    vars: inputVars,
    options: inputOpts,
  } = validateAdminArgs(
    connectorConfig,
    dcOrVarsOrOptions,
    varsOrOptions,
    options,
    true,
    true,
  );
  dcInstance.useGen(true);
  return dcInstance.executeQuery("GetUserByUid", inputVars, inputOpts);
}
exports.getUserByUid = getUserByUid;
