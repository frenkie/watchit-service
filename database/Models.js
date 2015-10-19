var mongoose = require('mongoose');

var videoSchema = new mongoose.Schema({
    originalUrl: String,
    service: String,
    status: String,
    mediaUri: String,
    creationDate: { type: Date, default: Date.now },
    watcherId: mongoose.Schema.Types.ObjectId,
    pausedAt: Number
});

var watcherSchema = new mongoose.Schema({
    name: String,
    consumerKey: String,
    credentials: String
});

exports.Video = mongoose.model('Video', videoSchema );
exports.Watcher = mongoose.model('Watcher', watcherSchema );