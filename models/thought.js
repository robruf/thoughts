const mongoose = require("mongoose");

//Setting thoughts structure (schema)

const thoughtSchema = new mongoose.Schema({
    author: String,
    thought: String,
    created: {type: Date, default: Date.now}
});

const Thought = mongoose.model("Thought", thoughtSchema);

module.exports = Thought;