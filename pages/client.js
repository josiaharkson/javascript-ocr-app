import React from "react";
import Head from "next/head";
import Link from "next/link";

import axios from "axios";
import PropTypes from "prop-types";
import { createWorker } from "tesseract.js";

import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

const useStyles = makeStyles((theme) => ({
  mySkeleton: { marginTop: 20, width: 300, height: 300 },
  mySkeleton2: { width: 300, height: 300 },
  btn: {
    fontSize: 12,
  },
  paperResults: {
    width: 380,
    height: 350,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      width: 250,
      height: 250,
    },
  },

  btnBack: {
    marginLeft: 100,
    marginTop: 30,
    [theme.breakpoints.down("md")]: {
      marginLeft: 10,
      marginTop: 10,
    },
  },
}));

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="static" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and static variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

function Index(props) {
  const classes = useStyles();

  const [file, setFile] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [progress, setProgress] = React.useState(0);

  const [imgData, setImgData] = React.useState(null);
  const [contentType, setContentType] = React.useState("");

  const [ocr, setOcr] = React.useState("");
  const [ocrStatus, setOcrStatus] = React.useState("");
  const [ocrProgress, setOcrProgress] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);

  const [loadStatus, setLoadStatus] = React.useState("");

  const onChangeFile = (e) => {
    setProgress(0);
    setImgData(null);
    setContentType("");
    setOcr("");
    setOcrProgress("");
    setOcrStatus("");
    setDisabled(false);
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const uploadHandler = async () => {
    setDisabled(true);

    if (!file || !fileName) {
      setDisabled(false);

      return console.log("Please select an image");
    }
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axios.post("/api/general/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          console.log(222222, progressEvent);
          setProgress((progressEvent.loaded / progressEvent.total) * 100);
          if (progressEvent.loaded === progressEvent.total)
            setLoadStatus("Loading...");
        },
      });
      if (res.data.success) {
        setContentType(res.data.contentType);
        setImgData(res.data.data);
        setLoadStatus("");
        setDisabled(false);
      }
    } catch (e) {
      console.log(222222222222, e);
      console.log("Error 566 occured");
      setDisabled(false);
    }
  };

  const scanOCrImg = async () => {
    setDisabled(true);

    if (!imgData) {
      if (!file || !fileName) {
        setDisabled(false);

        return console.log("Please select an image");
      }
    }
    setOcr("Recognizing... from image: ");
    const worker = createWorker({
      logger: (m) => {
        setOcrStatus(m.status);
        setOcrProgress(parseInt((parseFloat(m.progress) / 1) * 100));
        console.log(m);
      },
    });

    // return console.log("imgData22222222", typeof imgData);
    try {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text },
      } = await worker.recognize(imgData.data);
      setOcr(text);
      setDisabled(false);
    } catch (e) {
      console.log(2222222, e);
      setOcr("Failed to scan image");
      setDisabled(false);
    }
  };

  function ScrollDown(props) {
    const { children, window } = props;
    const classes = useStyles();
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });

    const handleClick = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector(
        "#go-down-anchor"
      );

      if (anchor) {
        anchor.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      scanOCrImg();
    };

    return (
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{ marginLeft: 10 }}
        disabled={!imgData || disabled || ocr}
        role="presentation"
      >
        <span className="btnspan"> scan(OCR) </span>
      </Button>
    );
  }

  return (
    <>
      <Head>
        <title>Client - OCR Wiz JavaScript</title>

        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
      </Head>
      <Link href="/">
        <Button variant="contained" color="primary" className={classes.btnBack}>
          GO BACK
        </Button>
      </Link>
      <div className="root">
        <div className="header"> Welocome to Client - OCR Wiz JavaScript</div>

        <div className="header2">Select a photo you want to OCR below.</div>

        <form>
          <Paper elevation={2} className={classes.paper}>
            <label htmlFor="icon-button-photo">
              <IconButton color="primary" component="span">
                <PhotoCamera style={{ color: "purple" }} />
              </IconButton>
            </label>
            <input
              accept=".png, .jpg, .jpeg"
              id="icon-button-photo"
              type="file"
              onChange={(e) => onChangeFile(e)}
            />{" "}
            <Button>{fileName}</Button>
          </Paper>
          <br />
          <div className="btn">
            <Button
              variant="outlined"
              onClick={() => uploadHandler()}
              disabled={disabled || progress === 100}
              className={classes.btn}
            >
              {loadStatus ? (
                <>
                  {loadStatus} <CircularProgress />
                </>
              ) : (
                <>
                  {progress === 100 ? "Loaded " : "Load Image"}

                  <CircularProgressWithLabel
                    variant="static"
                    value={progress}
                    className={classes.btn}
                  />
                </>
              )}
            </Button>
            <ScrollDown {...props} />
          </div>
        </form>

        <div className="resultsDiv">
          <Paper className={classes.paperResults} elevation={2}>
            {imgData ? (
              <img
                src={`data:${contentType};base64,${Buffer.from(
                  imgData
                ).toString("base64")}`}
                className="resultsDivImg"
              />
            ) : (
              <div style={{ width: "100%", height: "100%", padding: 20 }}>
                <Skeleton />
                <Skeleton animation={false} />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </div>
            )}
          </Paper>{" "}
          <div className="arrorRight">
            <ArrowRightAltIcon style={{ fontSize: 150, color: "purple" }} />
          </div>
          <div className="arrorDown">
            <ArrowDownwardIcon style={{ fontSize: 80, color: "purple" }} />
          </div>
          <Paper className={classes.paperResults} elevation={2}>
            {ocr ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  padding: 20,
                  fontFamily: "monospace",
                  overflow: "scroll",
                  textOverflow: "scroll",
                }}
              >
                <p style={{ color: "green", fontWeight: 600 }}>
                  Status: {ocrStatus} <br />
                  Progress: {ocrProgress}%
                </p>
                {ocr}
              </div>
            ) : (
              <div style={{ width: "100%", height: "100%", padding: 20 }}>
                <Skeleton />
                <Skeleton animation={false} />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </div>
            )}
            <div id="go-down-anchor" />
          </Paper>
        </div>
      </div>

      <style jsx>{`
        #go-down-anchor {
          display: block;
        }
        .resultsDiv {
          flex: 1;
          display: flex;
          margin: 20px;
          width: 80%;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .resultsDivImg {
          height: 60%;
          margin: 0 auto;
        }

        .header {
          font-size: 24px;
          margin-top: 20px;
          text-align: center;
        }

        .header2 {
          color: purple;
          font-size: 15px;
          margin-top: 11px;
        }

        #icon-button-photo {
          display: none;
        }

        .root {
          padding: 20px;
          display: flex;
          flex: 1;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        form {
          display: flex;
          flex: 1;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .btnspan {
          margin-right: 5px;
        }

        .arrorRight {
          padding: 50px;
          display: none;
        }

        .arrorDown {
          padding: 5px;
          display: block;
        }

        @media (min-width: 960px) {
          .header {
            font-size: 30px;
            margin-top: 10px;
          }
          #go-down-anchor {
            display: none;
          }
          .header2 {
            font-size: 18px;
            margin-top: 11px;
          }

          .resultsDiv {
            flex-direction: row;
          }

          .arrorRight {
            display: block;
          }

          .arrorDown {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default Index;
