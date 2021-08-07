const mongoose = require('mongoose');
const knex = require('./knex');
const { updateStateProfile } = require('./states');

const createAPD = async (apd, { APD = mongoose.model('APD') } = {}) => {
  let newApd = new APD(apd);

  newApd = await newApd.save();
  return newApd._id.toString(); // eslint-disable-line no-underscore-dangle
};

const deleteAPDByID = async (id, { APD = mongoose.model('APD') } = {}) =>
  APD.updateOne({ _id: id }, { status: 'archived' }).exec();

const getAllAPDsByState = async (
  stateId,
  { APD = mongoose.model('APD') } = {}
) =>
  APD.find(
    { stateId, status: 'draft' },
    '_id id createdAt updatedAt stateId status name years'
  ).lean();

const getAPDByID = async (id, { APD = mongoose.model('APD') } = {}) =>
  APD.findById(id).lean();

const getAPDByIDAndState = (
  id,
  stateId,
  { APD = mongoose.model('APD') } = {}
) => APD.findOne({ _id: id, stateId }).lean();

const updateAPDDocument = async (
  id,
  stateID,
  document,
  { db = knex, updateProfile = updateStateProfile } = {}
) => {
  const updateTime = new Date().toISOString();

  const transaction = await db.transaction();
  await transaction('apds')
    .where('id', id)
    .update({ document, updated_at: updateTime });

  if (document.stateProfile) {
    await updateProfile(stateID, document.stateProfile, { transaction });
  }

  await transaction.commit();

  return updateTime;
};

module.exports = {
  createAPD,
  deleteAPDByID,
  getAllAPDsByState,
  getAPDByID,
  getAPDByIDAndState,
  updateAPDDocument
};
