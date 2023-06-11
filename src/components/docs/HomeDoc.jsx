import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import MarkdownNavbar from "markdown-navbar";
import "markdown-navbar/dist/navbar.css";
import "./style.css";
import { useTranslation } from "react-i18next";
import engDoc from "./doc.eng.md";
import deDoc from "./doc.de.md";
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    fontSize: "1.1rem",
  },
}));

const Image = (props) => {
  return <img {...props} style={{ maxWidth: "100%" }} />;
};

export default function HomeDoc(props) {
  const [navVisible, setNavVisible] = useState(false);
  const [choseLanguage, setChoseLanguage] = useState("de");
  const [englishDoc, setEnglishDoc] = useState("");
  const [deutchDoc, setDeutchDoc] = useState("");

  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch(engDoc)
      .then((response) => response.text())
      .then((text) => {
        setEnglishDoc(text);
      });
    fetch(deDoc)
      .then((response) => response.text())
      .then((text) => {
        setDeutchDoc(text);
      });
  }, []);

  return (
    <div className="App">
      <div className="article-container">
        <ReactMarkdown
          children={choseLanguage === "de" ? deutchDoc : englishDoc}
          components={{ image: Image }}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        />{" "}
      </div>
      <div className={`nav-container ${navVisible ? "show" : "hide"}`}>
        <div
          className="toggle-btn"
          onClick={() => {
            setNavVisible(!navVisible);
          }}
        >
          {navVisible ? "→" : "←"}
        </div>
        <div
          className="lang-btn"
          onClick={() => {
            setChoseLanguage(choseLanguage === "de" ? "en" : "de");
          }}
        >
          {choseLanguage === "en" ? "de" : "en"}
        </div>
        <span />
        <MarkdownNavbar
          source={choseLanguage === "de" ? deutchDoc : englishDoc}
        />{" "}
      </div>
    </div>
  );
}
