import { createLogger, format, transports} from 'winston'

export const Logger = createLogger({
    format: format.combine(
        format.errors({ 'stack': true }),
        format.label({ 'label': 'BOT'}),
        format.timestamp({ 'format': 'YYYY/MM/DD HH:mm:ss'}),
        format.colorize(),
        format.printf((info: any): string => {
            const { timestamp, label, level, message, ...rest } = info
            return `[${timestamp}][${label}][${level}]: ${message}${
                Object.keys(rest).length ? `\n${JSON.stringify(rest, null, 2)}`: ''
            }`
        })
    ),
    levels: {
        'ERROR': 0,
        'WARN': 1,
        'CAUTION': 2,
        'INFO': 3,
    },
    transports: [
        new transports.Console({
            format: format.colorize({ 'level': true, 'colors': {
                'ERROR': 'red',
                'WARN': 'yellow',
                'CAUTION': 'green',
                'INFO': 'gray',
            }}),
            level: 'INFO'
        }),

        new transports.File({ 
            'filename': 'winston-log',
            'level': 'debug', 
        })
    ]
})