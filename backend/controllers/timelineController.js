const TimelineEvent = require('../models/TimelineEvent');
const { cloudinary } = require('../config/cloudinary');

const getTimeline = async (req, res) => {
  try {
    const events = await TimelineEvent.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTimelineEvent = async (req, res) => {
  try {
    const { title, description, date, category, isHighlighted } = req.body;
    const event = await TimelineEvent.create({
      title, description, date, category,
      isHighlighted: isHighlighted === 'true',
      image: req.file ? req.file.path : undefined,
      imagePublicId: req.file ? req.file.filename : undefined,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTimelineEvent = async (req, res) => {
  try {
    const event = await TimelineEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { title, description, date, category, isHighlighted } = req.body;
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.category = category || event.category;
    event.isHighlighted = isHighlighted !== undefined ? isHighlighted === 'true' : event.isHighlighted;

    if (req.file) {
      if (event.imagePublicId) await cloudinary.uploader.destroy(event.imagePublicId);
      event.image = req.file.path;
      event.imagePublicId = req.file.filename;
    }

    const updated = await event.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTimelineEvent = async (req, res) => {
  try {
    const event = await TimelineEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.imagePublicId) await cloudinary.uploader.destroy(event.imagePublicId);
    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTimeline, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent };
