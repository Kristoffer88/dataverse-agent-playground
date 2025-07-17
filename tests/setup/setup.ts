import { setupDataverse } from "dataverse-utilities/testing";

await setupDataverse({
    dataverseUrl: import.meta.env.VITE_DATAVERSE_URL!,
});
