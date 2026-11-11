import Service from "../models/service.model.js";

// Create a new service
export const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      duration,
      image
    } = req.body;

    // Create service
    const service = await Service.create({
      vendorId: req.vendorProfile._id,
      name,
      description,
      category,
      price,
      duration,
      image
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service
    });

  } catch (error) {
    console.error("Create service error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// Get all active services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({
      isActive: true
    }).populate("vendorId", "businessName");

    return res.status(200).json({
      success: true,
      count: services.length,
      services
    });

  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// Get service by id
export const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findOne({
      _id: serviceId,
      isActive: true
    }).populate("vendorId", "businessName");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    return res.status(200).json({
      success: true,
      service
    });

  } catch (error) {
    console.error("Get service error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// Update service
export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const { name, description, category, price, duration, image } = req.body;

    const service = await Service.findOne({
      _id: serviceId,
      vendorId: req.vendorProfile._id
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or you are not the owner"
      });
    }

    // Update only allowed fields
    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (category !== undefined) service.category = category;
    if (price !== undefined) service.price = price;
    if (duration !== undefined) service.duration = duration;
    if (image !== undefined) service.image = image;

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service
    });

  } catch (error) {
    console.error("Update service error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
// Delete service
export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findOne({
      _id: serviceId,
      vendorId: req.vendorProfile._id
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or you are not the owner"
      });
    }

    service.isActive = false;

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service deactivated successfully"
    });

  } catch (error) {
    console.error("Delete service error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

 // Get services created by the logged-in vendor
export const getVendorServices = async (req, res) => {
  try {
    const services = await Service.find({
      vendorId: req.vendorProfile._id
    });

    return res.status(200).json({
      success: true,
      count: services.length,
      services
    });

  } catch (error) {
    console.error("Get vendor services error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
