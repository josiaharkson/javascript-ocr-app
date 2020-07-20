import React from "react";
import Link from "next/link";
import Head from "next/head";

import PropTypes from "prop-types";
import { createWorker } from "tesseract.js";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  paper: {
    padding: 15,
    margin: 20,
    background: "#352977d1",
    color: "white",
  },
  btn: {
    color: "white",
  },
});

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
function Index() {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>OCR Wiz JavaScript</title>

        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
      </Head>
      <div className="root">
        <div className="header"> Welocome to OCR WizApp JavaScript</div>
        <div className="bodyr">
          <Link href="/client">
            <Paper elevation={3} className={classes.paper}>
              <Button className={classes.btn}>client side ocr</Button>
            </Paper>
          </Link>
          <Link href="/server">
            <Paper elevation={3} className={classes.paper}>
              <Button className={classes.btn}>server side ocr</Button>
            </Paper>
          </Link>
        </div>
      </div>

      <style jsx>{`
        body {
          background-color: red;
        }
        .root {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          flex: 1;
          width: 80%;
          height: 80vh;

          margin: 20px auto;
          background: url("/svg/image.svg");
          background-repeat: no-repeat;
          background-size: cover;
        }

        .header {
          text-align: center;
          font-size: 25px;
          background: radial-gradient(#176714, transparent);
          padding: 10px 50px;
          color: white;
        }

        .bodyr {
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
        }

        @media (min-width: 960px) {
          .root {
            margin: 50px auto;
          }

          .header {
            font-size: 30px;
          }

          .bodyr {
            flex-direction: row;
          }
        }
      `}</style>
    </>
  );
}

export default Index;
