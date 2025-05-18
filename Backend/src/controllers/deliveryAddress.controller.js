import DeliveryAddress from "../models/deliverAddress.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { deliveryAddressSchema } from "../schema/deliveryAddress.schema.js";

export const createDeliveryAddress = AsyncHandler(async (req, res) => {
  const user = req.user;
  const data = req.body;

  // check if user is a customer or not -> if not throw error
  if (user.role !== "customer") {
    throw new ApiError(403, "You don't have authority to perform this action");
  }

  // validate delivery address data -> if not valid throw error
  const parsed = deliveryAddressSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid data", parsed.error.flatten().fieldErrors);
  }

  // extract data
  const { phoneNumber, address, addressLine, isDefault } = parsed.data;

  // check if customer already exceed more then limited number of address
  const deliveryAddCount = await DeliveryAddress.countDocuments({
    user: user.id,
  });

  if (!(deliveryAddCount <= 4)) {
    throw new ApiError(
      400,
      "You already reached the number of addresss you can set. Please remove old address and add new one."
    );
  }

  //check if address already exist
  const addressExist = await DeliveryAddress.findOne({
    address,
    addressLine,
    phoneNumber,
  });

  if (addressExist) {
    throw new ApiError(400, "Address already exist");
  }

  // create new address
  const newAddress = await DeliveryAddress.create({
    user: user.id,
    phoneNumber,
    address,
    addressLine,
    isDefault,
  });

  // return success response
  res.status(200).json(
    new ApiResponse(200, "Delivery address created successfully", {
      address: newAddress,
    })
  );
});

export const updateDeliveryAddress = AsyncHandler(async (req, res) => {
  const id = req.params?.id;
  const user = req.user;

  if (!id || !user) {
    throw new ApiError(403, "You donot have permission to perform this action");
  }

  const addressExist = await DeliveryAddress.findOne({
    _id: id,
    user: user.id,
  });

  if (!addressExist) {
    throw new ApiError(404, "Address doesn't exist");
  }

  const parsed = deliveryAddressSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(400, "Invalid data", parsed.error.flatten().fieldErrors);
  }

  // extract data
  const { phoneNumber, address, addressLine, isDefault } = parsed.data;

  addressExist.phoneNumber = phoneNumber || addressExist.phoneNumber;
  addressExist.address = address || addressExist.address;
  addressExist.addressLine = addressLine || addressExist.addressLine;
  addressExist.isDefault = isDefault ?? addressExist.isDefault;

  await addressExist.save();

  res.status(200).json(
    new ApiResponse(400, "Updated successfully", {
      address: addressExist._id,
    })
  );
});

export const deleteDeliveryAddress = AsyncHandler(async (req, res) => {
  const id = req.params?.id;
  const user = req.user;

  if (!id || !user) {
    throw new ApiError(404, "You donot have authority to perform this action");
  }

  const addressExist = await DeliveryAddress.findOne({
    _id: id,
    user: user.id,
  });

  if (!addressExist) {
    throw new ApiError(404, "No such address exist");
  }

  await addressExist.deleteOne();

  res.status(200).json(
    new ApiResponse(200, "Address delted successfully", {
      id: addressExist._id,
    })
  );
});

export const getAllDeliveryAddress = AsyncHandler(async (req, res) => {
  const user = req.user;

  const address = await DeliveryAddress.find({ user: user.id })
    .sort({
      createdAt: -1,
    })
    .select("-createdAt -updatedAt -__v -user");

  if (!address) {
    throw new ApiError(400, "No address found");
  }

  res.status(200).json(new ApiResponse(200, "Address found", { address }));
});

export const getDeliveryAddress = AsyncHandler(async (req, res) => {
  const user = req.user;
  const id = req.params?.id;

  if (!id || !user) {
    throw new ApiError(404, "You donot have authority to perform this action");
  }

  const address = await DeliveryAddress.findOne({
    _id: id,
    user: user.id,
  }).select("-createdAt -updatedAt -__v");

  if (!address) {
    throw new ApiError(400, "No address found");
  }

  res.status(200).json(new ApiResponse(200, "Address found", { address }));
});
