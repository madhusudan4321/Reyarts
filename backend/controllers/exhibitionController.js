const Exhibition = require('../models/Exhibition');
const { cloudinary } = require('../config/cloudinary');

const getExhibitions = async (req, res) => {
  try {
    const { isPast } = req.query;
    const query = {};
    if (isPast === 'true') query.isPast = true;
    if (isPast === 'false') query.isPast = false;
    const exhibitions = await Exhibition.find(query).sort({ startDate: -1 });
    res.json(exhibitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExhibitionById = async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id).populate('artworksShown', 'title imageUrl');
    if (!exhibition) return res.status(404).json({ message: 'Exhibition not found' });
    res.json(exhibition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExhibition = async (req, res) => {
  try {
    const { title, description, venue, location, startDate, endDate, isPast, isHighlighted, artworksShown } = req.body;
    const images = req.files ? req.files.map((f) => f.path) : [];
    const imagePublicIds = req.files ? req.files.map((f) => f.filename) : [];

    const exhibition = await Exhibition.create({
      title, description, venue, location,
      startDate, endDate,
      isPast: isPast === 'true',
      isHighlighted: isHighlighted === 'true',
      artworksShown: artworksShown ? JSON.parse(artworksShown) : [],
      images, imagePublicIds,
    });
    res.status(201).json(exhibition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateExhibition = async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) return res.status(404).json({ message: 'Exhibition not found' });

    const { title, description, venue, location, startDate, endDate, isPast, isHighlighted } = req.body;
    exhibition.title = title || exhibition.title;
    exhibition.description = description || exhibition.description;
    exhibition.venue = venue || exhibition.venue;
    exhibition.location = location || exhibition.location;
    exhibition.startDate = startDate || exhibition.startDate;
    exhibition.endDate = endDate || exhibition.endDate;
    exhibition.isPast = isPast !== undefined ? isPast === 'true' : exhibition.isPast;
    exhibition.isHighlighted = isHighlighted !== undefined ? isHighlighted === 'true' : exhibition.isHighlighted;

    const updated = await exhibition.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExhibition = async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);
    if (!exhibition) return res.status(404).json({ message: 'Exhibition not found' });

    for (const pid of exhibition.imagePublicIds) {
      await cloudinary.uploader.destroy(pid);
    }
    await exhibition.deleteOne();
    res.json({ message: 'Exhibition deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExhibitions, getExhibitionById, createExhibition, updateExhibition, deleteExhibition };
