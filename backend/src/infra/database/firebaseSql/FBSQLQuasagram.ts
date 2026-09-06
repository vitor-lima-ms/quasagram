import { singleton } from "tsyringe";
import { DataConnect, getDataConnect } from "firebase-admin/data-connect";

import AppError from "../../../app/errors/AppError.ts";
import firebaseAdmin from "../../configs/FirebaseAdminConfig.ts";

@singleton()
class FBSQLQuasagram {
    getConn(): DataConnect {
        const location = process.env["FBSQL_LOCATION"];
        if (!location) {
            throw new AppError({
                errorCode: "FBSQL_LOCATION_ENVVAR_NOT_DEFINED",
                message: "FBSQL_LOCATION_ENVVAR not defined",
            });
        }

        const serviceId = process.env["FBSQL_SERVICE_ID"];
        if (!serviceId) {
            throw new AppError({
                errorCode: "FBSQL_SERVICE_ID_ENVVAR_NOT_DEFINED",
                message: "FBSQL_SERVICE_ID_ENVVAR not defined",
            });
        }

        return getDataConnect(
            {
                location,
                serviceId,
                connector: "quasagram",
            },
            firebaseAdmin,
        );
    }
}

export default FBSQLQuasagram;
