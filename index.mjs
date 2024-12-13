import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';
import FAQ from './models/FAQ.mjs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { spawn } from 'child_process';

const execPromise = promisify(exec);  // Преобразуем exec в промис


const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });


const LOG_FILE = './server_log.txt';
const PID_FILE = './server.pid';

// Функция для логирования
const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
};
try {

    // Команда для запуска сервера
    bot.onText(/\/start_server/, (msg) => {
        const chatId = msg.chat.id;

        if (fs.existsSync(PID_FILE)) {
            bot.sendMessage(chatId, 'Сервер уже запущен.');
            return;
        }

        const serverProcess = spawn('node', ['server.mjs'], {
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'], // 'pipe' для захвата stdout и stderr
        });

        // Логируем вывод и ошибки сервера
        serverProcess.stdout.on('data', (data) => {
            const output = data.toString();
            logToFile(output);
        });

        serverProcess.stderr.on('data', (data) => {
            const errorOutput = data.toString();
            logToFile(`ERROR: ${errorOutput}`);
        });

        serverProcess.on('close', (code) => {
            logToFile(`Server process exited with code ${code}`);
        });

        serverProcess.unref();
        fs.writeFileSync(PID_FILE, serverProcess.pid.toString());
        bot.sendMessage(chatId, `Сервер успешно запущен. PID: ${serverProcess.pid}`);
    });

    // Команда для остановки сервера
    bot.onText(/\/stop_server/, async (msg) => {
        const chatId = msg.chat.id;

        if (!fs.existsSync(PID_FILE)) {
            bot.sendMessage(chatId, 'Сервер не запущен.');
            return;
        }

        const pid = fs.readFileSync(PID_FILE, 'utf-8');

        try {
            // Проверяем, существует ли процесс
            await execPromise(`ps -p ${pid}`);
            // Если процесс существует, завершаем его
            process.kill(pid);
            logToFile(`Server with PID ${pid} has been stopped.`);
            bot.sendMessage(chatId, 'Сервер успешно остановлен.');
        } catch (error) {
            if (error.code === 'ESRCH') {
                bot.sendMessage(chatId, 'Процесс уже завершен.');
                logToFile(`Server with PID ${pid} does not exist.`);
            } else {
                bot.sendMessage(chatId, 'Ошибка при остановке сервера.');
                logToFile(`Error stopping server: ${error.message}`);
                console.error('Ошибка остановки сервера:', error);
            }
        } finally {
            // Удаляем файл PID в любом случае
            fs.unlinkSync(PID_FILE);
        }
    });

    // Обработка команды /start
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const welcomeMessage = `Привет, ${msg.from.first_name}! Я бот, который поможет вам с часто задаваемыми вопросами. Вы можете выбрать один из режимов ниже:`;

        bot.sendMessage(chatId, welcomeMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Выбрать модуль', callback_data: 'choose_module' }],
                    [{ text: 'Показать все вопросы', callback_data: 'show_all_questions' }],
                ],
            },
        });
    });

    // Остальные обработчики...
    console.log('Бот запущен и готов к работе');
} catch (e) {
    console.log(e)
}
