const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the folder based on the field name
    let folder = "";
    switch (file.fieldname) {
      case "image-kepala":
        folder = "kepala";
        break;
      case "image-abdomen":
        folder = "abdomen";
        break;
      case "image-siphon":
        folder = "siphon";
        break;
      case "image-fullbody":
        folder = "fullbody";
        break;
      default:
        folder = "other";
    }

    const dest = path.join("uploads", folder);

    // Create the folder if it doesn't exist (optional)
    // fs.mkdirSync(dest, { recursive: true });

    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
