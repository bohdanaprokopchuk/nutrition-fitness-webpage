const db = require("../database");

module.exports = {
    startWorkout: function(userId, weight, callback) {
        const startTime = new Date().toISOString();
        
        db.run(
            `INSERT INTO workouts (user_id, start_time, weight) 
             VALUES (?, ?, ?)`,
            [userId, startTime, weight],
            function(err) {
                callback(err, this.lastID);
            }
        );
    },
    
    endWorkout: function(workoutId, callback) {
        const endTime = new Date().toISOString();
        
        db.run(
            `UPDATE workouts 
             SET end_time = ? 
             WHERE id = ?`,
            [endTime, workoutId],
            callback
        );
    }
};