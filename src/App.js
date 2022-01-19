import { useEffect, useState } from "react";

//Material Ui
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
//UUID
import { v4 as uuidv4 } from "uuid";

import getAllModules from "./getAllModules";
import getModuleFields from "./getModuleFields";
import SelectModule from "./SelectModule";
import SelectToModuleField from "./SelectToModuleField";
import SelectFromModuleFields from "./SelectFromModuleFields";

function App() {
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [fromModuleName, setFromModuleName] = useState(null);
  const [toModuleName, setToModuleName] = useState(null);
  const [error, setError] = useState("");
  const [mandatoryFields, setMandatoryFields] = useState([]);
  const [fromModuleFields, setFromModuleFields] = useState([]);
  const [toModuleFields, setToModuleFields] = useState([]);
  const [fieldMapping, setFieldMapping] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const ZOHO = await window.ZOHO;
        /*
         * Subscribe to the EmbeddedApp onPageLoad event before initializing
         */
        await ZOHO.embeddedApp.on("PageLoad");
        /*
         * initializing the widget.
         */
        await ZOHO.embeddedApp.init();

        setLoading(true);
        const modules = await getAllModules();
        // const getContactFields = await getModuleFields("Contacts");
        console.log({ modules });
        setModules(modules);
        setLoading(false);
      } catch (err) {
        setError(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (fromModuleName && toModuleName) {
      //Fetch module fields
      (async () => {
        const fromModuleFields = await getModuleFields(fromModuleName);
        const toModuleFields = await getModuleFields(toModuleName);
        console.log({ fromModuleName, toModuleName });

        setFromModuleFields(fromModuleFields);
        setToModuleFields(toModuleFields);

        //Get To Module Field's mandatory fields
        const mandatoryFields = toModuleFields
          .filter((field) => field.system_mandatory)
          .map((field) => ({
            id: field.id,
            to: field.api_name,
            from: null,
            to_display_label: field.display_label,
            mandatory: true,
          }));
        console.log({ mandatoryFields, toModuleFields });
        // setMandatoryFields(mandatoryFields);
        setFieldMapping((prev) => [...mandatoryFields]);

        //fieldMapping
        // [
        //   {
        //    id:"23123213",
        //    from:"deal_name",
        //    to:"account_name",
        //    mandatory:true,
        //    to_display_label:Deal
        //   }
        // ]

        // {
        // From_Module:
        // To_Module:
        // FieldMapping:{
        // to_field_api_name:from_field_api_name
        // }
        // }

        // when user selects a field from TOMODULE then populate respective field's api name to fieldmapping and set it value null
        // Eg {
        //   ...
        //   FieldMapping:{
        //    account:null
        //   }
        // }
      })();
    }
  }, [fromModuleName, toModuleName]);

  //any error found while calling zoho apis then show error
  if (error) {
    return <div>{error}</div>;
  }

  //show loader while modules is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {JSON.stringify(fieldMapping)}
        <div>
          <h2>To</h2>
          <SelectModule
            modules={modules}
            fromModuleName={fromModuleName}
            toModuleName={toModuleName}
            setModuleName={setToModuleName}
            label="Select Module Name"
          />
          {fieldMapping.map((field, index) => (
            <Box mt={2}>
              <SelectToModuleField
                fields={fieldMapping}
                label="Select Field"
                fieldIndex={index}
                fieldData={field}
              />
            </Box>
          ))}
        </div>
        <Box ml={2}>
          <h2>From</h2>
          <SelectModule
            modules={modules}
            fromModuleName={fromModuleName}
            toModuleName={toModuleName}
            setModuleName={setFromModuleName}
            label="Select Module Name"
          />
          {fieldMapping.map((field) => (
            <Box mt={2}>
              <SelectFromModuleFields
                fields={fromModuleFields}
                fieldData={field}
                setFieldMapping={setFieldMapping}
              />
            </Box>
          ))}
        </Box>
      </div>
    </div>
  );
}

export default App;
