module.exports = class CommonService {
    // task 1
    async retryFailures(fn, retries) {
        let lastError;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
            return await fn(); 
            } catch (error) {
            lastError = error;
            }
        }

        throw lastError;
    }

    createTargetFunction(succeedsOnAttempt) {
        let attempt = 0;

        return async () => {
            if (++attempt === succeedsOnAttempt) {
            return attempt;
            }

            throw Object.assign(new Error('failure'), { attempt });
        };
    }

    // task 2
    defaultArguments(func, defaults) {

            return (...args) => {  
                let finalDefaults = {}; 

                Object.assign(finalDefaults, defaults);
                
                for (let i = 0; i < args.length; i++) {
                    finalDefaults[i] = args[i]; 
                }
                
                let argNames = func.toString().match(/function\s.*?\(([^)]*)\)/) ?? [];
                if(argNames && argNames[1]){
                    argNames = argNames[1].split(", ")

                       for(let j = 0; j < Object.keys(finalDefaults).length; j++){
                        if(isNaN(Object.keys(finalDefaults)[j]) && !argNames.includes(Object.keys(finalDefaults)[j])){
                            delete finalDefaults[Object.keys(finalDefaults)[j]]
                        
                        }
                    }
                    return func(...Object.values(finalDefaults));
                }

                
                return func(...Object.values(finalDefaults));
            
            };

    }

    // task 3
    findEarliestMeeting(schedules, duration) {
        const meetingTimes = [];
        
        // Generate all possible meeting start times 
        for (let hour = 9; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
            let time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            meetingTimes.push(time);
            }
        }
        
        // Convert duration to minutes
        duration = Math.floor(duration / 60);
        
        for (let startTime of meetingTimes) {
            let endTime = this.getEndTime(startTime, duration);
            
            if (this.isAvailable(schedules, startTime, endTime)) {
            return startTime; 
            }
        }
        
        return null;
    }

    getEndTime(startTime, duration) {
        let [hours, minutes] = startTime.split(':').map(Number);
        minutes += duration;
        
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    isAvailable(schedules, startTime, endTime) {
        return schedules.every(person => {
            return !this.hasConflict(person, startTime, endTime);
        });
    }

    hasConflict(schedule, startTime, endTime) {
        return schedule.some(meeting => {
            const [meetingStart, meetingEnd] = meeting;
            const meetingStartTime = this.timeToMinutes(meetingStart);
            const meetingEndTime = this.timeToMinutes(meetingEnd);
            
            const startMinutes = this.timeToMinutes(startTime);
            const endMinutes = this.timeToMinutes(endTime);
            
            return (startMinutes >= meetingStartTime && startMinutes < meetingEndTime) ||
                (endMinutes > meetingStartTime && endMinutes <= meetingEndTime);
        });
    }

    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
}