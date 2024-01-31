const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const axios = require("axios");

exports.home = async (req, res, next) => {
  res.render("index2");
};

exports.upload = upload.fields([
  { name: "kepala", maxCount: 1 },
  { name: "abdomen", maxCount: 1 },
  { name: "siphon", maxCount: 1 },
  { name: "fullbody", maxCount: 1 },
]);

exports.checkUpload = async (req, res, next) => {
  if (req.files) {
    const formData = new FormData();

    for (const field in req.files) {
      const imageDetails = req.files[field][0];
      const bufferData = Buffer.from(imageDetails.buffer, "base64");
      const blob = new Blob([bufferData], { type: imageDetails.mimetype });

      formData.append(field, blob, imageDetails.originalname);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/classification", formData);

      const apiResponse = response.data;
      const resultCounts = {
        aedes: 0,
        culex: 0,
      };

      for (const image in apiResponse) {
        if (apiResponse[image].result === "Not received image") {
          delete apiResponse[image];
        } else {
          const result = apiResponse[image].result;
          resultCounts[result]++;
        }
      }

      let finalResult;
      let mostCommonResult;
      let maxCount;
      let otherSpecies;
      let differOrgan = null;

      let firstSpecies = apiResponse[Object.keys(apiResponse)[0]].result;

      let same = true;
      for (let prop in apiResponse) {
        if (apiResponse[prop].result !== firstSpecies) {
          same = false;
          break;
        }
      }

      if (same) {
        finalResult = firstSpecies;
        otherSpecies = null;
      } else {
        mostCommonResult = Object.keys(resultCounts)[0];
        maxCount = resultCounts[mostCommonResult];

        Object.keys(resultCounts).forEach((result) => {
          if (resultCounts[result] > maxCount) {
            mostCommonResult = result;
            maxCount = resultCounts[result];
          }
        });

        const isTie = Object.values(resultCounts).every((count) => count === maxCount);

        if (isTie) {
          finalResult = "tie";
          otherSpecies = null;
        } else {
          finalResult = mostCommonResult;
          finalResult === "aedes" ? (otherSpecies = "culex") : (otherSpecies = "aedes");
          differOrgan = Object.keys(apiResponse).filter((key) => apiResponse[key].result !== mostCommonResult);
        }
      }

      const results = {
        results: apiResponse,
        species: finalResult,
        otherSpecies: otherSpecies,
        differOrgan: differOrgan,
      };

      return res.status(200).send(results);
    } catch (error) {
      console.error("Error sending images to API:", error);

      return res.status(500).send("Error sending images");
    }
  } else {
    return res.status(400).send("No images found");
  }
};
