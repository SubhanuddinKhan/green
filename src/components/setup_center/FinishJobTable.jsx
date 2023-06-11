import React, { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";

export default function FinishJobTable(props) {
  const [data, setData] = useState(props.data);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    var data = props.data;
    console.log(data);
    data.forEach((element) => {
      element.difference = 5;
    });
    setData(data);
    var finishJobData = {};
    data.forEach((element) => {
      finishJobData[element.carrier] = {
        reserved: element.actualUsed,
        used: element.actualUsed,
      };
    });
    props.handleChangedData(finishJobData);
  }, [props.data]);

  const handleDifferenceChanged = (index, e) => {
    var new_data = [...data];
    var objIndex = new_data.findIndex((obj) => obj.id === index);
    new_data[objIndex].difference = parseInt(e.target.value);
    new_data[objIndex].machineUse
      ? (new_data[objIndex].actualUsed =
          new_data[objIndex].machineUse + parseInt(e.target.value))
      : (new_data[objIndex].actualUsed =
          new_data[objIndex].shouldUse + parseInt(e.target.value));
    setData(new_data);
    var finishJobData = {};
    new_data.forEach((element) => {
      finishJobData[element.carrier] = {
        reserved: element.actualUsed,
        used: element.actualUsed,
      };
      props.handleChangedData(finishJobData);
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t("Carrier UID")}</TableCell>
            <TableCell>{t("article")}</TableCell>
            <TableCell>{t("description")}</TableCell>
            <TableCell>{t("Should use")}</TableCell>
            <TableCell>{t("Used in machine")}</TableCell>
            <TableCell>{t("difference")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((element) => {
            return (
              <TableRow key={element.id}>
                <TableCell>{element.carrier}</TableCell>
                <TableCell>{element.article}</TableCell>
                <TableCell>{element.description}</TableCell>
                <TableCell>{element.shouldUse} </TableCell>
                <TableCell>{element.machineUse}</TableCell>
                <TableCell>
                  <TextField
                    id="difference"
                    value={element.difference}
                    type="number"
                    onChange={(event) =>
                      handleDifferenceChanged(element.id, event)
                    }
                  />{" "}
                </TableCell>
                <TableCell>
                  {element.machineUse
                    ? element.machineUse + element.difference
                    : element.shouldUse + element.difference}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
