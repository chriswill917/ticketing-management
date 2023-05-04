import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
     console.log('nin.......')
     console.log('n,,,,,')
    return axios.create({
      baseURL:
        "http://www.ticketing-test.pro",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};

export default buildClient;
