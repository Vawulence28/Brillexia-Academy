const materialService = require('./material.service');

class MaterialController {
  async getMaterials(req, res, next) {
    try {
      const materials = await materialService.getMaterials(req.user.userId);
      res.status(200).json({ success: true, data: materials });
    } catch (err) {
      next(err);
    }
  }

  async uploadMaterial(req, res, next) {
    try {
      const material = await materialService.uploadMaterial(req.user.userId, req.body);
      res.status(201).json({ success: true, message: 'Material uploaded successfully.', data: material });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MaterialController();