import fs from "fs";
import path from "path";
import multer from "multer";

const uploadOne = async (req, res, next) => {
  const imageDir = () => path.join(__dirname, `../../static/images`);
  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = req.body.folder
        ? `${imageDir()}/${req.body.folder}`
        : `${imageDir()}/undefined-folder`;

      !fs.existsSync(dest) && fs.mkdirSync(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage }).single("file");
  upload(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.json({
          message: "Somethign went wrong from multer",
          error: err,
        });
      } else if (err) {
        return res.json({ message: "Somethign went wrong", error: err });
      }
      // /use/app comes from docker
      const url = req.file.path.replace("/usr/app", "/api");
      return res.json({ url });
    } catch (error) {
      console.log("Error", error.message);
      return res.json({ error: error.message });
    }
  });
};

export { uploadOne };
