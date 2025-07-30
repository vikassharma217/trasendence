// import net from 'net';
// // export const logToLogstash = (logData:LogData, logstashHost = 'localhost', logstashPort = 5044) => {

// export const logToLogstash = (logData: Record<string, any>, logstashHost = 'localhost', logstashPort = 5044) => {
//     try {
//         const client = net.createConnection({ host: logstashHost, port: logstashPort }, () => {
//             client.write(JSON.stringify(logData) + '\n'); // Send log as JSON
//             client.end(); // Close the connection
//         });

//         client.on('error', (err) => {
//             console.error('Error sending log to Logstash:', err);
//         });
//     } catch (error) {
//         console.error('Error in logToLogstash:', error);
//     }
// };

export   const getLocalTime1 = (timestamp?: number): string => {
                        const date = timestamp ? new Date(timestamp) : new Date(); // Use the provided timestamp or the current date
                        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Automatically use the system's time zone
                        const formatter = new Intl.DateTimeFormat('en-US', {
                            timeZone: timeZone,
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        });

                        const parts = formatter.formatToParts(date);
                        const year = parts.find(part => part.type === 'year')?.value;
                        const month = parts.find(part => part.type === 'month')?.value;
                        const day = parts.find(part => part.type === 'day')?.value;
                        const hour = parts.find(part => part.type === 'hour')?.value;
                        const minute = parts.find(part => part.type === 'minute')?.value;
                        const second = parts.find(part => part.type === 'second')?.value;
                        const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

                        // Return ISO 8601 format
                        return `${year}-${month}-${day}T${hour}:${minute}:${second}.${milliseconds}`;
                    };