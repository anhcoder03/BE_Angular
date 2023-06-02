const { cloudinary } = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  const files = req.files; // Sử dụng req.files thay vì req.file
  console.log(files);
  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "No files were uploaded" });
  }
  try {
    const uploadPromises = files.map((file) => {
      return cloudinary.uploader.upload(file.path);
    });
    console.log("uploadPromises", uploadPromises);
    // Chờ cho tất cả các file đều được upload lên Cloudinary
    const results = await Promise.all(uploadPromises);
    // Trả về kết quả là một mảng các đối tượng chứa thông tin của các file đã upload lên Cloudinary
    const uploadedFiles = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));
    return res.json({ urls: uploadedFiles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  const publicId = req.params.publicId;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return res
      .status(200)
      .json({ success: true, message: "Xóa ảnh thành công", result });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error deleting image" });
  }
};

module.exports = { uploadImage, deleteImage };
