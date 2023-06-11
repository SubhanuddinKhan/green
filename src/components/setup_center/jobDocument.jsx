import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import { PDFViewer } from "@react-pdf/renderer";

import QRCode from "qrcode.react";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: "5px",
    width: "100%",
    height: "100%",
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    lineHeight: 1.5,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    height: "auto",
  },
  qrCodeSection: {
    width: 35,
    height: 35,
  },
  jobqrCodeSection: {
    marginTop: 15,
    width: 50,
    height: 50,
  },
  articlesSection: {
    width: "90%",
    flexDirection: "column",
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  rowSection: {
    alignSelf: "center",
    margin: 10,
    paddingLeft: 10,
    width: "100%",
    flexDirection: "row",
    height: "auto",
  },
});

// Create Document Component
const JobDocument = (props) => {
  const { t, i18n } = useTranslation();

  const [jobData, setJobData] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setJobData(props.data);
  }, [props.data]);

  useEffect(() => {
    setTimeout(() => {
      setImageLoaded(true);
    }, 1000);
  }, []);

  const downloadQR = (id) => {
    const canvas = document.getElementById(id);
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      return pngUrl;
    }
  };

  return (
    <div>
      <div style={{ display: "none" }}>
        {jobData && jobData.jobarticles
          ? jobData.jobarticles.map((article) => (
              <div>
                <QRCode
                  id={article.article.name}
                  value={article.article.name}
                  size={128}
                  level={"H"}
                  includeMargin={true}
                />
                {article.carrier ? (
                  <QRCode
                    id={article.carrier.uid}
                    value={article.carrier.uid}
                    size={128}
                    level={"H"}
                    includeMargin={true}
                  />
                ) : null}
              </div>
            ))
          : null}
      </div>
      {imageLoaded ? (
        <PDFViewer style={{ width: "100%", height: 1000 }}>
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={{ border: "1px solid black" }}>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View style={styles.section}>
                    <Text>{`${t("jobName")}:\n ${
                      jobData ? jobData.name : ""
                    }`}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text>{`${t("customer")}:\n ${
                      jobData && jobData.customer ? jobData.customer.name : ""
                    }`}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text>{`${t("project")}:\n ${
                      jobData && jobData.project ? jobData.project.name : ""
                    }`}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text>{`${t("department")}:\n ${
                      jobData && jobData.project && jobData.project.department
                        ? jobData.project.department.name
                        : ""
                    }`}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View style={styles.section}>
                    <Text>{`${t("description")}:\n ${
                      jobData ? jobData.description : ""
                    }`}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text>{`${t("machine")}:\n ${
                      jobData && jobData.machine ? jobData.machine.name : ""
                    }`}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text>{`${t("board")}:\n ${
                      jobData && jobData.board ? jobData.board.name : ""
                    }`}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text>{`${t("count")}:\n ${
                      jobData ? jobData.count : ""
                    }`}</Text>
                  </View>
                </View>
              </View>
              {jobData && jobData.jobarticles ? (
                <View
                  style={{
                    border: "1px solid black",
                    marginTop: 10,
                    marginBottom: 10,
                    padding: 5,
                    width: "100%",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      textAlign: "center",
                      borderBottomWidth: 1,
                      alignItems: "center",
                      height: 24,
                      fontStyle: "bold",
                      flexGrow: 1,
                    }}
                  >
                    <View style={{ width: "30%" }}>
                      <Text>{`${t("article")}`}</Text>
                    </View>
                    <View style={{ width: "5%" }}></View>
                    <View style={{ width: "20%" }}>
                      <Text>{`${t("carrier")}`}</Text>
                    </View>
                    <View style={{ width: "5%" }}></View>
                    <View style={{ width: "15%" }}>
                      <Text>{`${t("bank")}`}</Text>
                    </View>
                    <View style={{ width: "15%" }}>
                      <Text>{`${t("slot")}`}</Text>
                    </View>
                    <View style={{ width: "10%" }}>
                      <Text>{`${t("quantity")}`}</Text>
                    </View>
                  </View>
                  {jobData.jobarticles.map((article) => (
                    <View style={styles.rowSection}>
                      <View style={{ width: "30%" }}>
                        <Text
                          style={{ paddingTop: 10, fontSize: 12 }}
                        >{` ${article.article.name}`}</Text>
                      </View>
                      <View style={{ width: "5%" }}>
                        <View style={styles.qrCodeSection}>
                          <Image
                            source={{ uri: downloadQR(article.article.name) }}
                          />
                        </View>
                      </View>

                      <View style={{ width: "25%" }}>
                        {article.carrier ? (
                          <View>
                            <Text
                              style={{ paddingTop: 10, fontSize: 12 }}
                            >{` ${article.carrier.uid}`}</Text>
                          </View>
                        ) : null}
                      </View>
                      <View style={{ width: "5%" }}>
                        {article.carrier ? (
                          <View style={styles.qrCodeSection}>
                            <Image
                              source={{
                                uri: downloadQR(article.carrier.uid),
                              }}
                            />
                          </View>
                        ) : null}
                      </View>
                      <View style={{ width: "15%" }}>
                        <Text
                          style={{ paddingTop: 10, fontSize: 12 }}
                        >{` ${article.bank}`}</Text>
                      </View>
                      <View style={{ width: "15%" }}>
                        <Text
                          style={{ paddingTop: 10, fontSize: 12 }}
                        >{` ${article.slot}`}</Text>
                      </View>

                      <View style={{ width: "10%" }}>
                        <Text
                          style={{ paddingTop: 10, fontSize: 12 }}
                        >{` ${article.count}`}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.section}>
                  <Text>{`${t("noArticles")}`}</Text>
                </View>
              )}
            </Page>
          </Document>
        </PDFViewer>
      ) : (
        <div style={{ width: "100%", height: 1000 }}>loading</div>
      )}
    </div>
  );
};

export default JobDocument;
