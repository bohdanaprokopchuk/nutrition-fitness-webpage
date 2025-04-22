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
    },

    getUserWorkoutHistory: function(userId, period, callback) {
        let dateFilter = "";
        const now = new Date();
        let startDate = new Date(now);
        
        switch(period) {
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                dateFilter = `AND start_time >= '${startDate.toISOString()}'`;
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                dateFilter = `AND start_time >= '${startDate.toISOString()}'`;
                break;
        }

        db.all(
            `SELECT 
                id,
                user_id,
                start_time,
                end_time,
                weight,
                (strftime('%s', end_time) - strftime('%s', start_time)) as duration_seconds
             FROM workouts
             WHERE user_id = ? 
             AND end_time IS NOT NULL
             ${dateFilter}
             ORDER BY start_time ASC`,
            [userId],
            (err, rows) => {
                if (err) return callback(err);
                
                const result = rows.map(row => {
                    const startDate = new Date(row.start_time);
                    const endDate = new Date(row.end_time);
                    
                    return {
                        ...row,
                        duration_minutes: Math.round(row.duration_seconds / 60),
                        date: startDate.toLocaleDateString('uk-UA'),
                        start_time_formatted: startDate.toLocaleTimeString('uk-UA'),
                        end_time_formatted: endDate.toLocaleTimeString('uk-UA')
                    };
                });
                
                callback(null, result);
            }
        );
    },

    getUserWorkoutStats: function(userId, callback) {
        db.get(
            `SELECT 
                COUNT(*) as total_workouts,
                SUM(strftime('%s', end_time) - strftime('%s', start_time)) as total_duration_seconds,
                AVG(weight) as avg_weight
             FROM workouts
             WHERE user_id = ? 
             AND end_time IS NOT NULL`,
            [userId],
            (err, row) => {
                if (err) return callback(err);
                
                const result = {
                    total_workouts: row.total_workouts || 0,
                    total_duration_hours: (row.total_duration_seconds || 0) / 3600,
                    avg_weight: row.avg_weight || 0
                };
                
                callback(null, result);
            }
        );
    }
};